import { useEffect, useRef, useState } from "react";
import {
  Camera,
  QrCode,
  Barcode,
  Flashlight,
  FlashlightOff,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { getEvidenceById } from "../services/evidenceService";

export default function ScanEvidence() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [mode, setMode] = useState("qr");
  const [flashOn, setFlashOn] = useState(false);
  const [lastScan, setLastScan] = useState("");
  const [detectedCode, setDetectedCode] = useState("");
  const [verification, setVerification] = useState("idle");
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const playSuccess = () => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAA////AAAAAAAA"
    );
    audio.play().catch(() => {});
  };

  const startScanner = async () => {
    if (cameraOn) return;

    try {
      setCameraOn(true);

      await new Promise((resolve) => requestAnimationFrame(resolve));

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      const cameras = await Html5Qrcode.getCameras();

      if (!cameras.length) throw new Error("No camera found");

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      await scanner.start(
        isMobile ? { facingMode: "environment" } : cameras[0].id,
        {
          fps: 12,
          aspectRatio: 16 / 9,
          qrbox:
            mode === "qr"
              ? { width: 280, height: 280 }
              : { width: 340, height: 120 },
        },
        async (decodedText) => {
          if (decodedText === lastScan) return;

          setLastScan(decodedText);
          setDetectedCode(decodedText);
          setVerification("success");
          setConfidence(99);

          playSuccess();

          try {
            await getEvidenceById(decodedText);

            setTimeout(() => {
              stopScanner();
              navigate(`/evidence/${encodeURIComponent(decodedText)}`);
            }, 1200);
          } catch {
            setVerification("error");
          }
        },
        () => {}
      );

      setTimeout(() => {
        const video = document.querySelector("#reader video");
        if (video) {
          video.style.width = "100%";
          video.style.height = "100%";
          video.style.objectFit = "cover";
        }
      }, 300);
    } catch (err) {
      console.error(err);

      if (scannerRef.current) {
        try {
          await scannerRef.current.clear();
        } catch {}
        scannerRef.current = null;
      }

      setCameraOn(false);
      alert("Unable to access camera.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}

      try {
        await scannerRef.current.clear();
      } catch {}

      scannerRef.current = null;
    }

    setCameraOn(false);
  };

  const changeMode = async (newMode) => {
    if (mode === newMode) return;

    const running = cameraOn;

    if (running) await stopScanner();

    setMode(newMode);

    if (running) {
      setTimeout(() => startScanner(), 200);
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
    alert(
      "Torch support depends on your device and browser. It works on supported mobile devices."
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Evidence Scanner</h1>
        <p className="text-cyan-300">
          Scan QR Codes & Barcodes for Chain of Custody
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-[#071929] min-h-[520px]">
        <div
          id="reader"
          className={`absolute inset-0 ${cameraOn ? "block" : "hidden"}`}
        />

        {!cameraOn && (
          <>
           <img
  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
  alt="Scanner"
  className="w-full h-[520px] object-cover"
/>

            <div className="absolute inset-0 bg-black/40" />

            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0px, transparent 4px, rgba(34,211,238,.18) 5px)",
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              {mode === "qr" ? (
                <div className="relative w-64 h-64 border-2 border-cyan-400 rounded-3xl shadow-[0_0_35px_rgba(34,211,238,.35)]">
                  <div className="absolute left-0 right-0 top-1/2 h-1 bg-cyan-400 animate-pulse" />
                  <QrCode className="absolute inset-0 m-auto w-16 h-16 text-cyan-400" />
                </div>
              ) : (
                <div className="relative w-80 h-36 border-2 border-cyan-400 rounded-xl shadow-[0_0_35px_rgba(34,211,238,.35)]">
                  <div className="absolute left-0 right-0 top-1/2 h-1 bg-cyan-400 animate-pulse" />
                  <Barcode className="absolute inset-0 m-auto w-16 h-16 text-cyan-400" />
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-4 text-cyan-300 text-xs">
              SCN-2048
            </div>

            <div className="absolute bottom-4 right-4 text-cyan-300 text-xs">
              Target: {mode === "qr" ? "QR Code" : "Barcode"}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={cameraOn ? stopScanner : startScanner}
          className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-[#071929] py-3 hover:border-cyan-400 transition"
        >
          <Camera size={18} />
          {cameraOn ? "Stop Camera" : "Start Camera"}
        </button>

        <button
          onClick={() => changeMode("qr")}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 border transition ${
            mode === "qr"
              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
              : "border-white/10 bg-[#071929]"
          }`}
        >
          <QrCode size={18} />
          QR Mode
        </button>

        <button
          onClick={() => changeMode("barcode")}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 border transition ${
            mode === "barcode"
              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
              : "border-white/10 bg-[#071929]"
          }`}
        >
          <Barcode size={18} />
          Barcode
        </button>

        <button
          onClick={toggleFlash}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#071929] py-3 hover:border-yellow-400 transition"
        >
          {flashOn ? <FlashlightOff size={18} /> : <Flashlight size={18} />}
          {flashOn ? "Flash Off" : "Flash"}
        </button>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-[#071929] p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Scanner Status</p>
            <p className="text-lg font-semibold text-white">
              {cameraOn ? `Scanning ${mode.toUpperCase()}` : "Awaiting Evidence"}
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              verification === "success"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                : verification === "error"
                ? "bg-red-500/20 text-red-300 border border-red-400/30"
                : "bg-cyan-500/10 text-cyan-300 border border-cyan-400/20"
            }`}
          >
            {verification === "success"
              ? "Verified"
              : verification === "error"
              ? "Not Found"
              : "Ready"}
          </div>
        </div>

        {detectedCode && (
          <div className="mt-5 grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#081B2A] border border-cyan-500/10 p-4">
              <p className="text-xs text-gray-400 uppercase">Evidence ID</p>
              <p className="text-xl font-mono text-cyan-300 mt-2 break-all">
                {detectedCode}
              </p>
            </div>

            <div className="rounded-xl bg-[#081B2A] border border-cyan-500/10 p-4">
              <p className="text-xs text-gray-400 uppercase">Confidence</p>
              <p className="text-xl font-bold text-emerald-300 mt-2">
                {confidence}%
              </p>
            </div>
          </div>
        )}

        {lastScan && (
          <div className="mt-4 text-sm text-emerald-400">
            Last Scan: {lastScan}
          </div>
        )}
      </div>
    </div>
  );
}
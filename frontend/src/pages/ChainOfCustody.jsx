
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Clock,
  MapPin,
  Package,
  RefreshCw,
  ShieldCheck,
  UserRound,
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  ArrowDown,
} from "lucide-react";

import { getEvidence } from "../services/evidenceService";
import { getUsers } from "../services/userService";
import {
  getCustodyTimeline,
  createCustody,
} from "../services/custodyService";
import { getCurrentUser } from "../services/authService";

const ROLES = {
  ADMIN: "ADMIN",
  SENIOR_OFFICER: "SENIOR_OFFICER",
};

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#171916] text-[#e8e1d2] px-4 py-3 outline-none transition focus:border-[#858b68] focus:ring-1 focus:ring-[#858b68]/30";

const labelClass =
  "block text-sm font-medium text-[#b8b4a8] mb-2";

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChainOfCustody() {
  const currentUser = getCurrentUser();

  const role = String(currentUser?.role || "")
    .replaceAll(" ", "_")
    .toUpperCase();

  const canTransfer =
    role === ROLES.ADMIN ||
    role === ROLES.SENIOR_OFFICER;

  const timelineRequestRef = useRef(0);

  const [evidence, setEvidence] = useState([]);
  const [users, setUsers] = useState([]);
  const [timeline, setTimeline] = useState([]);

  const [selectedEvidence, setSelectedEvidence] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [action, setAction] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedRecord = evidence.find(
    (item) => String(item.id) === String(selectedEvidence)
  );

  const sortedTimeline = [...timeline].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();

    return (
      (Number.isFinite(dateB) ? dateB : 0) -
      (Number.isFinite(dateA) ? dateA : 0)
    );
  });

  // LOAD EVIDENCE AND OFFICERS
  const loadInitialData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccess("");

      const evidenceData = await getEvidence();

      const evidenceList = Array.isArray(evidenceData)
        ? evidenceData
        : [];

      setEvidence(evidenceList);

      // Preserve the current selection if it still exists.
      setSelectedEvidence((previous) => {
        const stillExists = evidenceList.some(
          (item) => String(item.id) === String(previous)
        );

        return stillExists ? previous : "";
      });

      if (canTransfer) {
        const usersData = await getUsers();

        setUsers(
          Array.isArray(usersData) ? usersData : []
        );
      }
    } catch (err) {
      console.error("Failed to load custody data:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load evidence or officer records. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [canTransfer]);

  // LOAD TIMELINE
  const loadTimeline = useCallback(async (evidenceId) => {
    const requestId = ++timelineRequestRef.current;

    if (!evidenceId) {
      setTimeline([]);
      setTimelineLoading(false);
      return;
    }

    try {
      setTimelineLoading(true);
      setError("");

      const data = await getCustodyTimeline(evidenceId);

      // Ignore an old response if another evidence was selected.
      if (requestId !== timelineRequestRef.current) {
        return;
      }

      setTimeline(Array.isArray(data) ? data : []);
    } catch (err) {
      if (requestId !== timelineRequestRef.current) {
        return;
      }

      console.error("Failed to load custody timeline:", err);

      setTimeline([]);

      setError(
        err.response?.data?.message ||
        "Unable to load custody timeline."
      );
    } finally {
      if (requestId === timelineRequestRef.current) {
        setTimelineLoading(false);
      }
    }
  }, []);

  // INITIAL DATA
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // RELOAD WHEN EVIDENCE CHANGES
  useEffect(() => {
    setTimeline([]);

    if (selectedEvidence) {
      loadTimeline(selectedEvidence);
    } else {
      timelineRequestRef.current += 1;
      setTimelineLoading(false);
    }
  }, [selectedEvidence, loadTimeline]);

  // HANDLE EVIDENCE SELECTION
  function handleEvidenceChange(event) {
    setSelectedEvidence(event.target.value);
    setError("");
    setSuccess("");
  }

  // HANDLE TRANSFER
  async function handleTransfer(event) {
    event.preventDefault();

    if (!selectedEvidence || !toUserId || !action.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (Number(toUserId) === Number(currentUser?.id)) {
      setError("You cannot transfer evidence to yourself.");
      return;
    }

    if (action.trim().length > 50 || notes.length > 500) {
      setError("Please check the maximum allowed field lengths.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        evidenceId: Number(selectedEvidence),
        toUserId: Number(toUserId),
        action: action.trim(),
        location: location.trim(),
        notes: notes.trim(),
      };

      await createCustody(payload);

      setSuccess(
        "Evidence transfer has been recorded successfully."
      );

      setToUserId("");
      setAction("");
      setLocation("");
      setNotes("");

      // Refresh timeline after successful transfer.
      await loadTimeline(selectedEvidence);

      // Refresh evidence details to reflect updated storage location.
      const updatedEvidence = await getEvidence();

      setEvidence(
        Array.isArray(updatedEvidence) ? updatedEvidence : []
      );
    } catch (err) {
      console.error("Transfer failed:", err);

      setError(
        err.response?.data?.message ||
        "Failed to record evidence transfer. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const availableUsers = users.filter(
    (user) =>
      String(user.id) !== String(currentUser?.id)
  );

  // INITIAL LOADING
  if (loading) {
    return (
      <div className="min-h-[350px] flex flex-col items-center justify-center gap-4 text-[#a09e91]">
        <RefreshCw
          size={30}
          className="animate-spin text-[#aab28d]"
        />
        <p className="text-sm">
          Loading evidence custody records...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-[#858b68]/15 flex items-center justify-center">
            <ShieldCheck
              className="text-[#aab28d]"
              size={25}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#e8e1d2]">
              Chain of Custody
            </h1>

            <p className="text-sm text-[#a09e91] mt-1">
              Secure evidence transfer and custody tracking.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() => loadInitialData(true)}
          disabled={refreshing || submitting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-[#d6d0c2] hover:bg-white/5 disabled:opacity-50 transition"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh Records"}
        </button>

      </div>

      {/* ERROR ALERT */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          <AlertCircle
            size={19}
            className="shrink-0 mt-0.5"
          />

          <div className="flex-1">
            <p className="font-semibold mb-1">
              Operation Failed
            </p>

            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-300 hover:text-white"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* SUCCESS ALERT */}
      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300"
        >
          <CheckCircle2
            size={19}
            className="shrink-0 mt-0.5"
          />

          <div>
            <p className="font-semibold mb-1">
              Success
            </p>

            <p>{success}</p>
          </div>
        </div>
      )}

      {/* EVIDENCE SELECTION */}
      <section className="rounded-xl border border-white/10 bg-[#20221f] p-5">

        <div className="flex items-center gap-2 mb-5">
          <Package
            size={19}
            className="text-[#c58b43]"
          />

          <h2 className="font-semibold text-[#e8e1d2]">
            Evidence Selection
          </h2>
        </div>

        <label className={labelClass}>
          Select Evidence Record
        </label>

        <select
          value={selectedEvidence}
          onChange={handleEvidenceChange}
          className={inputClass}
        >
          <option value="">
            Choose an evidence record
          </option>

          {evidence.map((item) => (
            <option key={item.id} value={item.id}>
              {item.evidenceNumber} - {item.name}
            </option>
          ))}
        </select>

        {evidence.length === 0 && (
          <p className="text-sm text-[#a09e91] mt-3">
            No evidence records are currently available.
          </p>
        )}

        {/* SELECTED EVIDENCE DETAILS */}
        {selectedRecord && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

            <div className="rounded-lg border border-white/5 bg-[#171916] p-4">
              <p className="text-xs text-[#858477]">
                Evidence Number
              </p>

              <p className="text-sm font-semibold text-[#e8e1d2] mt-2">
                {selectedRecord.evidenceNumber}
              </p>
            </div>

            <div className="rounded-lg border border-white/5 bg-[#171916] p-4">
              <p className="text-xs text-[#858477]">
                Evidence Name
              </p>

              <p className="text-sm font-semibold text-[#e8e1d2] mt-2">
                {selectedRecord.name}
              </p>
            </div>

            <div className="rounded-lg border border-white/5 bg-[#171916] p-4">
              <p className="text-xs text-[#858477]">
                Current Storage
              </p>

              <p className="text-sm font-semibold text-[#e8e1d2] mt-2">
                {selectedRecord.storageLocation || "Not specified"}
              </p>
            </div>

          </div>
        )}

      </section>

      {/* TRANSFER FORM */}
      {canTransfer && selectedEvidence && (
        <section className="rounded-xl border border-white/10 bg-[#20221f] p-5">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-lg bg-[#c58b43]/10 flex items-center justify-center">
              <ArrowLeftRight
                size={20}
                className="text-[#c58b43]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#e8e1d2]">
                Transfer Evidence
              </h2>

              <p className="text-xs text-[#a09e91] mt-1">
                Record an authorized transfer to another officer.
              </p>
            </div>

          </div>

          <form
            onSubmit={handleTransfer}
            className="space-y-5"
          >

            {/* RECIPIENT */}
            <div>

              <label className={labelClass}>
                Recipient Officer *
              </label>

              <select
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                required
                disabled={submitting}
                className={inputClass}
              >
                <option value="">
                  Select recipient officer
                </option>

                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.role}
                  </option>
                ))}

              </select>

              {availableUsers.length === 0 && (
                <p className="text-xs text-amber-400 mt-2">
                  No other eligible officers are available.
                </p>
              )}

            </div>

            {/* ACTION */}
            <div>

              <label className={labelClass}>
                Transfer Action *
              </label>

              <input
                type="text"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                maxLength={50}
                required
                disabled={submitting}
                placeholder="e.g. Transferred for forensic examination"
                className={inputClass}
              />

              <p className="text-xs text-[#858477] mt-1 text-right">
                {action.length}/50 characters
              </p>

            </div>

            {/* LOCATION */}
            <div>

              <label className={labelClass}>
                New Storage Location
              </label>

              <div className="relative">

                <MapPin
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#858477]"
                />

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={200}
                  disabled={submitting}
                  placeholder="e.g. Forensic Laboratory"
                  className={`${inputClass} pl-11`}
                />

              </div>

            </div>

            {/* NOTES */}
            <div>

              <label className={labelClass}>
                Transfer Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                rows={4}
                disabled={submitting}
                placeholder="Enter transfer remarks and relevant details..."
                className={`${inputClass} resize-y`}
              />

              <p className="text-xs text-[#858477] mt-1 text-right">
                {notes.length}/500 characters
              </p>

            </div>

            {/* SUBMIT */}
            <div className="pt-2">

              <button
                type="submit"
                disabled={
                  submitting ||
                  !selectedEvidence ||
                  !toUserId ||
                  !action.trim() ||
                  availableUsers.length === 0
                }
                className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-lg bg-[#858b68] text-[#171916] font-semibold hover:bg-[#a0a982] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >

                {submitting ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                    Recording Transfer...
                  </>
                ) : (
                  <>
                    <ArrowLeftRight size={17} />
                    Record Transfer
                  </>
                )}

              </button>

              <p className="text-xs text-[#858477] mt-3">
                Transfers are recorded with the authenticated sender identity.
              </p>

            </div>

          </form>

        </section>
      )}

      {/* READ-ONLY ROLE MESSAGE */}
      {!canTransfer && selectedEvidence && (
        <div className="rounded-lg border border-[#858b68]/25 bg-[#858b68]/10 p-4 flex items-start gap-3">
          <ShieldCheck
            size={19}
            className="text-[#aab28d] shrink-0"
          />

          <div>
            <p className="text-sm font-semibold text-[#e8e1d2]">
              Read-only custody access
            </p>

            <p className="text-xs text-[#a09e91] mt-1">
              Your account can view custody history. Only Admin and Senior Officers can create evidence transfers.
            </p>
          </div>
        </div>
      )}

      {/* CUSTODY TIMELINE */}
      <section className="rounded-xl border border-white/10 bg-[#20221f] p-5">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-[#858b68]/15 flex items-center justify-center">
              <Clock
                size={20}
                className="text-[#aab28d]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#e8e1d2]">
                Custody Timeline
              </h2>

              <p className="text-xs text-[#a09e91] mt-1">
                Complete transfer history for selected evidence.
              </p>
            </div>

          </div>

          {selectedEvidence && !timelineLoading && (
            <span className="text-xs rounded-full border border-white/10 px-3 py-1.5 text-[#c7c3b7]">
              {timeline.length} Record{timeline.length !== 1 ? "s" : ""}
            </span>
          )}

        </div>

        {/* NO SELECTION */}
        {!selectedEvidence && (
          <div className="text-center py-12">

            <ClipboardList
              size={36}
              className="mx-auto text-[#858477] mb-3"
            />

            <p className="text-sm font-medium text-[#c7c3b7]">
              No Evidence Selected
            </p>

            <p className="text-xs text-[#858477] mt-2">
              Select an evidence record above to view its custody history.
            </p>

          </div>
        )}

        {/* LOADING */}
        {selectedEvidence && timelineLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">

            <RefreshCw
              size={26}
              className="animate-spin text-[#aab28d]"
            />

            <p className="text-sm text-[#a09e91]">
              Loading custody timeline...
            </p>

          </div>
        )}

        {/* EMPTY TIMELINE */}
        {selectedEvidence &&
          !timelineLoading &&
          timeline.length === 0 &&
          !error && (
            <div className="text-center py-12">

              <Clock
                size={36}
                className="mx-auto text-[#858477] mb-3"
              />

              <p className="text-sm font-medium text-[#c7c3b7]">
                No Transfers Recorded
              </p>

              <p className="text-xs text-[#858477] mt-2">
                No custody transfers have been recorded for this evidence yet.
              </p>

            </div>
          )}

        {/* TIMELINE RECORDS */}
        {selectedEvidence &&
          !timelineLoading &&
          sortedTimeline.length > 0 && (
            <div className="space-y-5">

              {sortedTimeline.map((record, index) => (
                <div
                  key={record.id}
                  className="relative pl-8"
                >

                  {/* TIMELINE CONNECTOR */}
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#858b68] border-4 border-[#20221f]" />

                  {index !== sortedTimeline.length - 1 && (
                    <div className="absolute left-[7px] top-5 bottom-[-24px] w-px bg-[#858b68]/40" />
                  )}

                  <div className="rounded-xl border border-white/5 bg-[#171916] p-4 md:p-5 space-y-4">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                      <div>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#e8e1d2]">
                          <ArrowLeftRight
                            size={15}
                            className="text-[#c58b43]"
                          />
                          {record.action}
                        </span>

                        {index === 0 && (
                          <span className="ml-2 inline-flex text-[10px] uppercase tracking-wide rounded-full bg-[#858b68]/15 text-[#aab28d] px-2 py-1">
                            Latest
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-[#a09e91]">
                        {formatDate(record.timestamp)}
                      </span>

                    </div>

                    {/* FROM / TO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                      <div className="rounded-lg bg-[#20221f] p-3">

                        <p className="text-[10px] uppercase tracking-wider text-[#858477] mb-2">
                          Transferred From
                        </p>

                        <div className="flex items-center gap-2 text-sm text-[#e8e1d2]">
                          <UserRound
                            size={16}
                            className="text-[#aab28d]"
                          />

                          {record.fromUserName ||
                            `User ${record.fromUserId}`}
                        </div>

                      </div>

                      <div className="rounded-lg bg-[#20221f] p-3">

                        <p className="text-[10px] uppercase tracking-wider text-[#858477] mb-2">
                          Transferred To
                        </p>

                        <div className="flex items-center gap-2 text-sm text-[#e8e1d2]">
                          <UserRound
                            size={16}
                            className="text-[#aab28d]"
                          />

                          {record.toUserName ||
                            `User ${record.toUserId}`}
                        </div>

                      </div>

                    </div>

                    {/* LOCATION */}
                    {record.location && (
                      <div className="flex items-start gap-2 text-sm text-[#a09e91]">

                        <MapPin
                          size={16}
                          className="shrink-0 mt-0.5 text-[#c58b43]"
                        />

                        <div>
                          <span className="text-xs text-[#858477]">
                            Location
                          </span>

                          <p className="text-[#c7c3b7] mt-1">
                            {record.location}
                          </p>
                        </div>

                      </div>
                    )}

                    {/* NOTES */}
                    {record.notes && (
                      <div className="border-t border-white/5 pt-3">

                        <p className="text-[10px] uppercase tracking-wider text-[#858477] mb-2">
                          Transfer Notes
                        </p>

                        <p className="text-sm text-[#c7c3b7] leading-relaxed">
                          {record.notes}
                        </p>

                      </div>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

      </section>

      {/* FOOTER */}
      <div className="flex items-center gap-2 text-xs text-[#858477]">
        <ShieldCheck size={15} />
        <span>
          Custody records are maintained through the secured backend API.
        </span>
      </div>

    </div>
  );
}

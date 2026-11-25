
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import NewCase from "./pages/NewCase";
import Evidence from "./pages/Evidence";
import EvidenceDetails from "./pages/EvidenceDetails";
import UploadEvidence from "./pages/UploadEvidence";
import ScanEvidence from "./pages/ScanEvidence";
import Forensics from "./pages/Forensics";
import Users from "./pages/Users";
import ChainOfCustody from "./pages/ChainOfCustody";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="cases" element={<Cases />} />
        <Route path="cases/new" element={<NewCase />} />
        <Route path="evidence" element={<Evidence />} />
        <Route path="evidence/upload" element={<UploadEvidence />} />
        <Route path="evidence/scan" element={<ScanEvidence />} />
        <Route path="evidence/:id" element={<EvidenceDetails />} />
        <Route path="custody" element={<ChainOfCustody />} />
        <Route path="forensics" element={<Forensics />} />
        <Route path="users" element={<Users />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

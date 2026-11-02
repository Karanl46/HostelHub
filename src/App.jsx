
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ApplicationsAdmin from "./pages/ApplicationsAdmin";
import Bookings from "./pages/Bookings";
import Rooms from "./pages/Rooms";
import Application from "./pages/Application";
import Complaints from "./pages/Complaints";

import { HostelProvider } from "./context/HostelContext";

function App() {
  return (
    <HostelProvider>
      <BrowserRouter>
        <Routes>
          {/* Student Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/rooms" element={<Rooms role="student" />} />
          <Route path="/application" element={<Application />} />
          <Route path="/complaints" element={<Complaints role="student" />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/applications" element={<ApplicationsAdmin />} />
          <Route path="/admin/rooms" element={<Rooms role="admin" />} />
          <Route path="/admin/complaints" element={<Complaints role="admin" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HostelProvider>
  );
}

export default App;

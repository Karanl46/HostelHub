
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useHostel } from "../context/HostelContext";

function AdminDashboard() {
  const { rooms, requests, applications, complaints } = useHostel();

  const availableBeds = rooms.reduce(
    (total, room) => total + room.beds, 0
  );

  const totalBeds = rooms.reduce(
    (total, room) => total + room.capacity, 0
  );

  const occupiedBeds = totalBeds - availableBeds;

  const occupancy = totalBeds > 0
    ? Math.round((occupiedBeds / totalBeds) * 100)
    : 0;

  const pendingBookings = requests.filter(
    (r) => r.status === "Pending"
  ).length;

  const approvedBookings = requests.filter(
    (r) => r.status === "Approved"
  ).length;

  const rejectedBookings = requests.filter(
    (r) => r.status === "Rejected"
  ).length;

  const pendingApplications = applications.filter(
    (a) => a.status === "Pending"
  ).length;

  const approvedApplications = applications.filter(
    (a) => a.status === "Approved"
  ).length;

  const rejectedApplications = applications.filter(
    (a) => a.status === "Rejected"
  ).length;

  const openComplaints = complaints.filter(
    (c) => c.status !== "Resolved"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const recentApplications = [...applications]
    .reverse()
    .slice(0, 5);

  const recentComplaints = [...complaints]
    .reverse()
    .slice(0, 5);

  const stats = [
    { icon: "🛏️", label: "Available Beds", value: availableBeds, color: "blue" },
    { icon: "📋", label: "Pending Bookings", value: pendingBookings, color: "orange" },
    { icon: "✅", label: "Approved Bookings", value: approvedBookings, color: "green" },
    { icon: "📝", label: "Pending Applications", value: pendingApplications, color: "purple" },
    { icon: "📄", label: "Approved Applications", value: approvedApplications, color: "green" },
    { icon: "🚫", label: "Rejected Applications", value: rejectedApplications, color: "red" },
    { icon: "🛠️", label: "Open Complaints", value: openComplaints, color: "orange" },
    { icon: "✓", label: "Resolved Complaints", value: resolvedComplaints, color: "green" },
  ];

  return (
    <div className="dashboard">
      <Sidebar role="admin" />

      <div className="main-with-sidebar">

        <header className="topbar">
          <div>
            <h2>Admin Overview</h2>
            <p>HostelHub / Dashboard</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Hostel Management</small>
            </div>
          </div>
        </header>

        <main className="admin-home">

          {/* Welcome Banner */}
          <section className="admin-welcome">
            <div>
              <span className="admin-welcome-tag">
                HOSTEL MANAGEMENT SYSTEM
              </span>

              <h1>Welcome back, Admin! 👋</h1>

              <p>
                Here's an overview of your hostel operations and activities.
              </p>

              <div className="admin-welcome-actions">
                <Link to="/admin/applications">Review Applications →</Link>
                <Link to="/admin/bookings">Manage Bookings →</Link>
              </div>
            </div>

            <div className="admin-welcome-icon">🏢</div>
          </section>

          {/* KPI Cards */}
          <section className="admin-kpi-grid">
            {stats.map((stat) => (
              <div className="admin-kpi-card" key={stat.label}>
                <div className={`admin-kpi-icon ${stat.color}`}>
                  {stat.icon}
                </div>

                <div>
                  <p>{stat.label}</p>
                  <h2>{stat.value}</h2>
                </div>
              </div>
            ))}
          </section>

          {/* Occupancy and Overview */}
          <section className="admin-overview-grid">

            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-eyebrow">ROOM ANALYTICS</span>
                  <h2>Hostel Occupancy</h2>
                </div>
                <span className="admin-panel-icon">🏠</span>
              </div>

              <div className="occupancy-number">
                {occupancy}%
                <span> occupied</span>
              </div>

              <div className="occupancy-track">
                <div
                  className="occupancy-fill"
                  style={{ width: `${occupancy}%` }}
                />
              </div>

              <div className="occupancy-details">
                <div>
                  <span className="occupancy-dot occupied-dot" />
                  Occupied Beds
                  <strong>{occupiedBeds}</strong>
                </div>

                <div>
                  <span className="occupancy-dot available-dot" />
                  Available Beds
                  <strong>{availableBeds}</strong>
                </div>
              </div>

              <p className="admin-panel-note">
                Based on the current room capacity.
              </p>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-eyebrow">QUICK SUMMARY</span>
                  <h2>Hostel Overview</h2>
                </div>
                <span className="admin-panel-icon">📊</span>
              </div>

              <div className="overview-list">
                <div>
                  <span>Total Rooms</span>
                  <strong>{rooms.length}</strong>
                </div>

                <div>
                  <span>Total Bed Capacity</span>
                  <strong>{totalBeds}</strong>
                </div>

                <div>
                  <span>Total Booking Requests</span>
                  <strong>{requests.length}</strong>
                </div>

                <div>
                  <span>Total Applications</span>
                  <strong>{applications.length}</strong>
                </div>

                <div>
                  <span>Total Complaints</span>
                  <strong>{complaints.length}</strong>
                </div>
              </div>
            </div>

          </section>

          {/* Recent Activity */}
          <section className="admin-recent-grid">

            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-eyebrow">LATEST SUBMISSIONS</span>
                  <h2>Recent Applications</h2>
                </div>

                <Link to="/admin/applications" className="admin-view-all">
                  View all →
                </Link>
              </div>

              {recentApplications.length === 0 ? (
                <div className="admin-empty">
                  <span>📭</span>
                  <p>No applications received yet.</p>
                </div>
              ) : (
                <div className="admin-record-list">
                  {recentApplications.map((app) => (
                    <div className="admin-record" key={app.id}>
                      <div className="record-avatar">
                        {app.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="record-info">
                        <strong>{app.name}</strong>
                        <small>{app.usn} • {app.block}</small>
                      </div>

                      <span className={`admin-status ${
                        app.status === "Approved"
                          ? "status-approved"
                          : app.status === "Rejected"
                          ? "status-rejected"
                          : "status-pending"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-eyebrow">MAINTENANCE UPDATES</span>
                  <h2>Recent Complaints</h2>
                </div>

                <Link to="/admin/complaints" className="admin-view-all">
                  View all →
                </Link>
              </div>

              {recentComplaints.length === 0 ? (
                <div className="admin-empty">
                  <span>🎉</span>
                  <p>No complaints received yet.</p>
                </div>
              ) : (
                <div className="admin-record-list">
                  {recentComplaints.map((complaint) => (
                    <div className="admin-record" key={complaint.id}>
                      <div className="record-avatar complaint-avatar">
                        🛠️
                      </div>

                      <div className="record-info">
                        <strong>{complaint.title}</strong>
                        <small>
                          {complaint.category} • Room {complaint.room}
                        </small>
                      </div>

                      <span className={`admin-status ${
                        complaint.status === "Resolved"
                          ? "status-approved"
                          : complaint.status === "In Progress"
                          ? "status-progress"
                          : "status-pending"
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </section>

          {/* Quick Management */}
          <section className="admin-panel admin-management">
            <div className="admin-panel-heading">
              <div>
                <span className="admin-eyebrow">MANAGE YOUR HOSTEL</span>
                <h2>Quick Management</h2>
              </div>
            </div>

            <div className="admin-management-grid">
              <Link to="/admin/rooms">
                <span>🛏️</span>
                <div>
                  <strong>Manage Rooms</strong>
                  <small>Room capacity and availability</small>
                </div>
                <b>→</b>
              </Link>

              <Link to="/admin/bookings">
                <span>📋</span>
                <div>
                  <strong>Manage Bookings</strong>
                  <small>Review student booking requests</small>
                </div>
                <b>→</b>
              </Link>

              <Link to="/admin/applications">
                <span>📝</span>
                <div>
                  <strong>Manage Applications</strong>
                  <small>Review hostel applications</small>
                </div>
                <b>→</b>
              </Link>

              <Link to="/admin/complaints">
                <span>🔧</span>
                <div>
                  <strong>Manage Complaints</strong>
                  <small>Track maintenance requests</small>
                </div>
                <b>→</b>
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

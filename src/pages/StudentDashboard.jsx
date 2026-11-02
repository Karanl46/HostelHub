
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useHostel } from "../context/HostelContext";

function StudentDashboard() {
  const { rooms, requests, applications, complaints } = useHostel();

  const studentName = "Karan";
  const studentUSN = "1JB24CS093";

  const myApplications = applications.filter(
    (app) =>
      app.name.toLowerCase() === studentName.toLowerCase() ||
      app.usn.toLowerCase() === studentUSN.toLowerCase()
  );

  const myBookings = requests.filter(
    (request) =>
      request.student?.toLowerCase() === studentName.toLowerCase()
  );

  const myComplaints = complaints.filter(
    (complaint) =>
      complaint.student?.toLowerCase() === studentName.toLowerCase()
  );

  const latestApplication = myApplications.at(-1);
  const latestBooking = myBookings.at(-1);

  const allocatedRoom =
    latestBooking?.status === "Approved"
      ? rooms.find((room) => room.number === latestBooking.room)
      : null;

  const activeComplaints = myComplaints.filter(
    (c) => c.status !== "Resolved"
  ).length;

  const resolvedComplaints = myComplaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const recentActivity = [
    ...myApplications.map((a) => ({
      id: `app-${a.id}`,
      title: "Hostel application submitted",
      detail: `${a.block} • ${a.roomType}`,
      status: a.status,
      date: a.id,
    })),
    ...myBookings.map((b) => ({
      id: `booking-${b.id}`,
      title: "Room booking request",
      detail: `Room ${b.room} • Block ${b.block}`,
      status: b.status,
      date: b.id,
    })),
    ...myComplaints.map((c) => ({
      id: `complaint-${c.id}`,
      title: c.title,
      detail: `Room ${c.room} • Complaint`,
      status: c.status,
      date: c.id,
    })),
  ].sort((a, b) => b.date - a.date).slice(0, 5);

  return (
    <div className="dashboard">
      <Sidebar role="student" />

      <div className="main-with-sidebar">
        <header className="topbar">
          <div>
            <h2>Student Portal</h2>
            <p>HostelHub / Dashboard</p>
          </div>
          <div className="student-profile">
            <span className="profile-avatar">K</span>
            <div>
              <strong>{studentName}</strong>
              <small>{studentUSN}</small>
            </div>
          </div>
        </header>

        <main className="student-home">

          {/* Welcome Banner */}
          <section className="student-welcome">
            <div>
              <span className="welcome-label">STUDENT OVERVIEW</span>
              <h1>Welcome back, {studentName}!</h1>
              <p>
                Here's what's happening with your hostel accommodation.
              </p>
            </div>
            <div className="welcome-icon">🏠</div>
          </section>

          {/* Statistics */}
          <section className="student-stat-grid">

            <div className="student-stat">
              <div className="student-stat-icon blue-icon">🛏️</div>
              <div>
                <span>Room Allocation</span>
                <h3>{allocatedRoom ? allocatedRoom.number : "Pending"}</h3>
                <small>
                  {allocatedRoom
                    ? `Block ${allocatedRoom.block}`
                    : "No room allocated yet"}
                </small>
              </div>
            </div>

            <div className="student-stat">
              <div className="student-stat-icon purple-icon">📋</div>
              <div>
                <span>Application</span>
                <h3>{latestApplication?.status || "Not Applied"}</h3>
                <small>Latest application status</small>
              </div>
            </div>

            <div className="student-stat">
              <div className="student-stat-icon orange-icon">🛠️</div>
              <div>
                <span>Active Complaints</span>
                <h3>{activeComplaints}</h3>
                <small>Awaiting resolution</small>
              </div>
            </div>

            <div className="student-stat">
              <div className="student-stat-icon green-icon">✓</div>
              <div>
                <span>Resolved Issues</span>
                <h3>{resolvedComplaints}</h3>
                <small>Successfully resolved</small>
              </div>
            </div>

          </section>

          {/* Main Content */}
          <section className="student-content-grid">

            {/* Room Allocation */}
            <div className="student-panel room-overview">
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">ACCOMMODATION</span>
                  <h2>Your Room</h2>
                </div>
                <span className="panel-icon">🏡</span>
              </div>

              {allocatedRoom ? (
                <>
                  <div className="allocated-room-number">
                    Room {allocatedRoom.number}
                  </div>
                  <p>Block {allocatedRoom.block}</p>
                  <span className="student-status approved-status">
                    Room Allocated
                  </span>
                </>
              ) : (
                <div className="student-empty">
                  <span>🛏️</span>
                  <h3>No room allocated yet</h3>
                  <p>
                    Submit a booking request to get started.
                  </p>
                  <Link to="/rooms" className="student-primary-link">
                    Explore Rooms →
                  </Link>
                </div>
              )}
            </div>

            {/* Application Status */}
            <div className="student-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">APPLICATION</span>
                  <h2>Application Status</h2>
                </div>
                <span className="panel-icon">📄</span>
              </div>

              {latestApplication ? (
                <>
                  <h3 className="application-status-title">
                    {latestApplication.status}
                  </h3>
                  <p className="student-muted">
                    {latestApplication.block} • {latestApplication.roomType}
                  </p>
                  <span className={`student-status ${
                    latestApplication.status === "Approved"
                      ? "approved-status"
                      : latestApplication.status === "Rejected"
                      ? "rejected-status"
                      : "pending-status"
                  }`}>
                    {latestApplication.status}
                  </span>
                </>
              ) : (
                <div className="student-empty">
                  <span>📝</span>
                  <h3>No application submitted</h3>
                  <p>Apply for hostel accommodation.</p>
                  <Link to="/application" className="student-primary-link">
                    Apply Now →
                  </Link>
                </div>
              )}
            </div>

          </section>

          {/* Quick Actions */}
          <section className="student-quick-section">
            <div className="student-section-heading">
              <div>
                <span className="panel-eyebrow">GET THINGS DONE</span>
                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="student-quick-grid">

              <Link to="/rooms" className="student-action">
                <span className="action-icon">🛏️</span>
                <div>
                  <h3>Explore Rooms</h3>
                  <p>View available rooms and beds</p>
                </div>
                <span className="action-arrow">→</span>
              </Link>

              <Link to="/application" className="student-action">
                <span className="action-icon">📋</span>
                <div>
                  <h3>Hostel Application</h3>
                  <p>Submit and track applications</p>
                </div>
                <span className="action-arrow">→</span>
              </Link>

              <Link to="/complaints" className="student-action">
                <span className="action-icon">🔧</span>
                <div>
                  <h3>Report an Issue</h3>
                  <p>Submit and track complaints</p>
                </div>
                <span className="action-arrow">→</span>
              </Link>

            </div>
          </section>

          {/* Recent Activity */}
          <section className="student-panel student-activity">
            <div className="student-section-heading">
              <div>
                <span className="panel-eyebrow">YOUR UPDATES</span>
                <h2>Recent Activity</h2>
              </div>
              <span className="activity-count">
                {recentActivity.length} updates
              </span>
            </div>

            {recentActivity.length === 0 ? (
              <div className="student-empty">
                <span>📭</span>
                <h3>No recent activity</h3>
                <p>Your hostel activities will appear here.</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div className="activity-row" key={activity.id}>
                    <div className="activity-dot"></div>
                    <div className="activity-info">
                      <h3>{activity.title}</h3>
                      <p>{activity.detail}</p>
                    </div>
                    <span className="activity-status">
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;

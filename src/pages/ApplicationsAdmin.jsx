
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useHostel } from "../context/HostelContext";

function ApplicationsAdmin() {
  const { applications, updateApplication } = useHostel();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const pending = applications.filter(
    (app) => app.status === "Pending"
  ).length;

  const approved = applications.filter(
    (app) => app.status === "Approved"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.usn.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || app.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleUpdate = (id, status) => {
    const message = status === "Approved"
      ? "Approve this hostel application?"
      : "Reject this hostel application?";

    if (window.confirm(message)) {
      updateApplication(id, status);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar role="admin" />

      <div className="main-with-sidebar">

        <header className="topbar">
          <div>
            <h2>Application Management</h2>
            <p>HostelHub / Admin Portal</p>
          </div>

          <Link to="/admin" className="logout-btn">
            ← Dashboard
          </Link>
        </header>

        <main className="admin-applications-home">

          {/* Welcome Header */}
          <section className="admin-app-welcome">
            <div>
              <span>ADMISSIONS CONTROL CENTER</span>
              <h1>Hostel Applications</h1>
              <p>
                Review student applications, verify preferences
                and manage hostel admissions.
              </p>
            </div>

            <div className="admin-app-hero-icon">📋</div>
          </section>

          {/* Statistics */}
          <section className="admin-app-stats">

            <div className="admin-app-stat">
              <div className="admin-app-stat-icon blue">📄</div>
              <div>
                <p>Total Applications</p>
                <h2>{applications.length}</h2>
                <small>All received applications</small>
              </div>
            </div>

            <div className="admin-app-stat">
              <div className="admin-app-stat-icon orange">⏳</div>
              <div>
                <p>Pending Review</p>
                <h2>{pending}</h2>
                <small>Awaiting admin action</small>
              </div>
            </div>

            <div className="admin-app-stat">
              <div className="admin-app-stat-icon green">✓</div>
              <div>
                <p>Approved</p>
                <h2>{approved}</h2>
                <small>Accepted applications</small>
              </div>
            </div>

            <div className="admin-app-stat">
              <div className="admin-app-stat-icon red">✕</div>
              <div>
                <p>Rejected</p>
                <h2>{rejected}</h2>
                <small>Declined applications</small>
              </div>
            </div>

          </section>

          {/* Application List */}
          <section className="admin-app-list-section">

            <div className="admin-app-list-heading">
              <div>
                <span>STUDENT ADMISSIONS</span>
                <h2>All Applications</h2>
                <p>Review and manage submitted applications.</p>
              </div>

              <div className="admin-app-count">
                {filteredApplications.length} Records
              </div>
            </div>

            {/* Search */}
            <div className="admin-app-toolbar">
              <div className="admin-app-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student name or USN..."
                />
              </div>

              <div className="admin-app-filters">
                {["All", "Pending", "Approved", "Rejected"].map((item) => (
                  <button
                    key={item}
                    className={filter === item ? "admin-app-filter-active" : ""}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                    {item === "Pending" && pending > 0 && (
                      <span>{pending}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications */}
            {filteredApplications.length === 0 ? (
              <div className="admin-app-empty">
                <span>📭</span>
                <h3>No applications found</h3>
                <p>
                  {applications.length === 0
                    ? "Student applications will appear here once submitted."
                    : "Try changing your search or status filter."}
                </p>
                {(search || filter !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilter("All");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="admin-app-cards">
                {filteredApplications.map((app) => (
                  <article className="admin-app-card" key={app.id}>

                    <div className="admin-app-card-top">
                      <div className="admin-app-student">
                        <div className="admin-app-avatar">
                          {app.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h3>{app.name}</h3>
                          <p>{app.usn}</p>
                        </div>
                      </div>

                      <span className={`admin-app-status ${
                        app.status === "Approved"
                          ? "app-approved"
                          : app.status === "Rejected"
                          ? "app-rejected"
                          : "app-pending"
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="admin-app-details">
                      <div>
                        <span>Preferred Block</span>
                        <strong>{app.block}</strong>
                      </div>

                      <div>
                        <span>Room Preference</span>
                        <strong>{app.roomType}</strong>
                      </div>

                      <div>
                        <span>Application ID</span>
                        <strong>HH-{String(app.id).slice(-6)}</strong>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="admin-app-notes">
                        <strong>Additional Notes</strong>
                        <p>{app.notes}</p>
                      </div>
                    )}

                    {app.status === "Pending" ? (
                      <div className="admin-app-actions">
                        <button
                          className="admin-app-approve"
                          onClick={() => handleUpdate(app.id, "Approved")}
                        >
                          ✓ Approve Application
                        </button>

                        <button
                          className="admin-app-reject"
                          onClick={() => handleUpdate(app.id, "Rejected")}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    ) : (
                      <div className="admin-app-processed">
                        {app.status === "Approved"
                          ? "✓ This application has been approved."
                          : "✕ This application has been rejected."}
                      </div>
                    )}

                  </article>
                ))}
              </div>
            )}

          </section>

        </main>
      </div>
    </div>
  );
}

export default ApplicationsAdmin;

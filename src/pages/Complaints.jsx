
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useHostel } from "../context/HostelContext";

function Complaints({ role = "student" }) {
  const isAdmin = role === "admin";

  const {
    complaints,
    addComplaint,
    updateComplaint,
  } = useHostel();

  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Demo student identity. Replace with authenticated user data later.
  const currentStudent = "Karan";

  const studentComplaints = complaints.filter(
    (complaint) => complaint.student === currentStudent
  );

  const visibleComplaints = isAdmin ? complaints : studentComplaints;

  const getPriority = (category, title) => {
    const text = `${category} ${title}`.toLowerCase();

    if (
      text.includes("fire") ||
      text.includes("shock") ||
      text.includes("electrical")
    ) return "Critical";

    if (
      text.includes("water") ||
      text.includes("leak") ||
      text.includes("plumbing")
    ) return "High";

    if (
      text.includes("fan") ||
      text.includes("cleaning")
    ) return "Medium";

    return "Low";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const title = form.title.value.trim();
    const category = form.category.value;
    const room = form.room.value.trim();
    const description = form.description.value.trim();

    addComplaint({
      student: currentStudent,
      title,
      category,
      room,
      description,
      priority: getPriority(category, title),
    });

    form.reset();
    setSubmitted(true);
  };

  const filteredComplaints = visibleComplaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      complaint.title.toLowerCase().includes(searchText) ||
      complaint.room.toLowerCase().includes(searchText) ||
      complaint.category.toLowerCase().includes(searchText) ||
      (isAdmin && complaint.student.toLowerCase().includes(searchText));

    const matchesStatus =
      statusFilter === "All" || complaint.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || complaint.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openComplaints = visibleComplaints.filter(
    (complaint) => complaint.status !== "Resolved"
  ).length;

  const resolvedComplaints = visibleComplaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const criticalComplaints = visibleComplaints.filter(
    (complaint) => complaint.priority === "Critical" &&
      complaint.status !== "Resolved"
  ).length;

  const handleStatusChange = (id, status) => {
    updateComplaint(id, status);
  };

  return (
    <div className="dashboard">
      <Sidebar role={role} />

      <div className="main-with-sidebar">

        <header className="topbar">
          <div>
            <h2>{isAdmin ? "Manage Complaints" : "Complaint Management"}</h2>
            <p>HostelHub / {isAdmin ? "Admin" : "Student"} Portal</p>
          </div>

          <Link
            to={isAdmin ? "/admin" : "/student"}
            className="logout-btn"
          >
            ← Dashboard
          </Link>
        </header>

        <main className="complaints-home">

          {/* HERO */}
          <section className="complaints-welcome">
            <div>
              <span>
                {isAdmin ? "HOSTEL MAINTENANCE CONTROL" : "STUDENT SUPPORT CENTER"}
              </span>

              <h1>
                {isAdmin
                  ? "Complaint & Maintenance Center"
                  : "We're here to help."}
              </h1>

              <p>
                {isAdmin
                  ? "Monitor hostel issues, prioritize complaints and track resolutions."
                  : "Report maintenance issues and stay updated on their progress."}
              </p>
            </div>

            <div className="complaints-hero-icon">🛠️</div>
          </section>

          {/* STATISTICS */}
          <section className="complaints-stat-grid">

            <div className="complaints-stat-card">
              <div className="complaints-stat-icon blue">📋</div>
              <div>
                <p>Total Complaints</p>
                <h2>{visibleComplaints.length}</h2>
              </div>
            </div>

            <div className="complaints-stat-card">
              <div className="complaints-stat-icon orange">⏳</div>
              <div>
                <p>Open Issues</p>
                <h2>{openComplaints}</h2>
              </div>
            </div>

            <div className="complaints-stat-card">
              <div className="complaints-stat-icon green">✓</div>
              <div>
                <p>Resolved</p>
                <h2>{resolvedComplaints}</h2>
              </div>
            </div>

            <div className="complaints-stat-card">
              <div className="complaints-stat-icon red">⚠️</div>
              <div>
                <p>Critical Priority</p>
                <h2>{criticalComplaints}</h2>
              </div>
            </div>

          </section>

          {/* STUDENT COMPLAINT FORM */}
          {!isAdmin && (
            <section className="complaint-submit-card">

              <div className="complaints-section-heading">
                <div>
                  <span>RAISE A SUPPORT TICKET</span>
                  <h2>Submit a Complaint</h2>
                  <p>Tell us what needs attention in your hostel.</p>
                </div>

                <div className="complaints-form-icon">📝</div>
              </div>

              {submitted && (
                <div className="complaints-success-message">
                  <span>✓</span>
                  Complaint submitted successfully. You can track it below.
                  <button onClick={() => setSubmitted(false)}>✕</button>
                </div>
              )}

              <form className="complaints-modern-form" onSubmit={handleSubmit}>

                <div className="complaints-form-grid">

                  <div>
                    <label>Complaint Title *</label>
                    <input
                      name="title"
                      placeholder="Example: Water leakage in bathroom"
                      required
                    />
                  </div>

                  <div>
                    <label>Room Number *</label>
                    <input
                      name="room"
                      placeholder="Enter your room number"
                      required
                    />
                  </div>

                  <div>
                    <label>Issue Category *</label>
                    <select name="category" required defaultValue="">
                      <option value="" disabled>Select category</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Wi-Fi">Wi-Fi / Internet</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="complaints-full-width">
                    <label>Describe the Issue *</label>
                    <textarea
                      name="description"
                      rows="4"
                      placeholder="Provide details so the maintenance team can understand the issue..."
                      required
                    />
                  </div>

                </div>

                <div className="complaints-form-footer">
                  <p>💡 Please provide accurate details for faster resolution.</p>
                  <button type="submit">
                    Submit Complaint →
                  </button>
                </div>

              </form>
            </section>
          )}

          {/* ADMIN PRIORITY NOTICE */}
          {isAdmin && criticalComplaints > 0 && (
            <div className="complaints-critical-notice">
              <span>⚠️</span>
              <div>
                <strong>Critical issues require attention</strong>
                <p>
                  There are {criticalComplaints} unresolved critical-priority
                  complaint(s).
                </p>
              </div>
            </div>
          )}

          {/* COMPLAINT RECORDS */}
          <section className="complaints-records">

            <div className="complaints-section-heading">
              <div>
                <span>{isAdmin ? "MAINTENANCE OVERVIEW" : "YOUR SUPPORT HISTORY"}</span>
                <h2>{isAdmin ? "All Complaint Records" : "Your Complaints"}</h2>
                <p>
                  {isAdmin
                    ? "Review reported issues and update their status."
                    : "Track the status of your submitted complaints."}
                </p>
              </div>

              <div className="complaints-record-count">
                {filteredComplaints.length} Records
              </div>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="complaints-toolbar">

              <div className="complaints-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    isAdmin
                      ? "Search title, student, room..."
                      : "Search complaint or room..."
                  }
                />
              </div>

              <div className="complaints-filter-group">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

            </div>

            {/* COMPLAINT CARDS */}
            {filteredComplaints.length === 0 ? (
              <div className="complaints-empty">
                <span>📭</span>
                <h3>No complaints found</h3>
                <p>
                  {visibleComplaints.length === 0
                    ? "Submitted complaints will appear here."
                    : "Try changing your search or filters."}
                </p>

                {(search || statusFilter !== "All" || priorityFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("All");
                      setPriorityFilter("All");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="complaints-modern-grid">
                {filteredComplaints.map((complaint) => (
                  <article className="complaint-modern-card" key={complaint.id}>

                    <div className="complaint-modern-top">
                      <div className="complaint-modern-title">
                        <div className="complaint-card-icon">🔧</div>
                        <div>
                          <h3>{complaint.title}</h3>
                          <p>
                            {complaint.category} · Room {complaint.room}
                          </p>
                        </div>
                      </div>

                      <span className={`complaint-priority-badge ${
                        complaint.priority.toLowerCase()
                      }`}>
                        {complaint.priority}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="complaint-student-label">
                        Reported by: <strong>{complaint.student}</strong>
                      </div>
                    )}

                    <div className="complaint-description">
                      {complaint.description}
                    </div>

                    <div className="complaint-card-footer">
                      <div>
                        <span className="complaint-status-label">CURRENT STATUS</span>
                        <strong className={`complaint-status-text ${
                          complaint.status.toLowerCase().replace(" ", "-")
                        }`}>
                          {complaint.status}
                        </strong>
                      </div>

                      {isAdmin ? (
                        <select
                          className="complaint-status-select"
                          value={complaint.status}
                          onChange={(e) =>
                            handleStatusChange(complaint.id, e.target.value)
                          }
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      ) : (
                        <span className="complaint-tracking-label">
                          {complaint.status === "Resolved"
                            ? "Issue closed ✓"
                            : "Being tracked"}
                        </span>
                      )}
                    </div>

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

export default Complaints;

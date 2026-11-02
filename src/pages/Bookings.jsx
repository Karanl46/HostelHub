
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useHostel } from "../context/HostelContext";

function Bookings() {
  const { requests, updateRequest, rooms } = useHostel();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const pending = requests.filter((r) => r.status === "Pending").length;
  const approved = requests.filter((r) => r.status === "Approved").length;
  const rejected = requests.filter((r) => r.status === "Rejected").length;

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.student.toLowerCase().includes(search.toLowerCase()) ||
      request.room.toLowerCase().includes(search.toLowerCase()) ||
      request.block.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || request.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleUpdate = (id, status) => {
    const message = status === "Approved"
      ? "Approve this booking request and allocate a bed?"
      : "Reject this booking request?";

    if (window.confirm(message)) {
      updateRequest(id, status);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar role="admin" />

      <div className="main-with-sidebar">

        <header className="topbar">
          <div>
            <h2>Booking Management</h2>
            <p>HostelHub / Admin Portal</p>
          </div>

          <Link to="/admin" className="logout-btn">
            ← Dashboard
          </Link>
        </header>

        <main className="admin-bookings-home">

          {/* HERO */}
          <section className="booking-welcome">
            <div>
              <span>HOSTEL RESERVATION CENTER</span>
              <h1>Room Booking Management</h1>
              <p>
                Review student booking requests, allocate available beds
                and manage reservation approvals.
              </p>
            </div>

            <div className="booking-hero-icon">🛏️</div>
          </section>

          {/* STATISTICS */}
          <section className="booking-stat-grid">

            <div className="booking-stat-card">
              <div className="booking-stat-icon blue">📋</div>
              <div>
                <p>Total Requests</p>
                <h2>{requests.length}</h2>
                <small>All booking requests</small>
              </div>
            </div>

            <div className="booking-stat-card">
              <div className="booking-stat-icon orange">⏳</div>
              <div>
                <p>Pending</p>
                <h2>{pending}</h2>
                <small>Awaiting approval</small>
              </div>
            </div>

            <div className="booking-stat-card">
              <div className="booking-stat-icon green">✓</div>
              <div>
                <p>Approved</p>
                <h2>{approved}</h2>
                <small>Confirmed bookings</small>
              </div>
            </div>

            <div className="booking-stat-card">
              <div className="booking-stat-icon red">✕</div>
              <div>
                <p>Rejected</p>
                <h2>{rejected}</h2>
                <small>Declined requests</small>
              </div>
            </div>

          </section>

          {/* ROOM AVAILABILITY SUMMARY */}
          <section className="booking-availability-panel">
            <div>
              <span>ROOM INVENTORY</span>
              <h2>Current Bed Availability</h2>
              <p>Live availability based on room records.</p>
            </div>

            <div className="booking-availability-numbers">
              <div>
                <strong>
                  {rooms.reduce((total, room) => total + room.beds, 0)}
                </strong>
                <span>Available Beds</span>
              </div>

              <div>
                <strong>{rooms.length}</strong>
                <span>Total Rooms</span>
              </div>
            </div>
          </section>

          {/* REQUEST LIST */}
          <section className="booking-list-section">

            <div className="booking-list-heading">
              <div>
                <span>RESERVATION RECORDS</span>
                <h2>All Booking Requests</h2>
                <p>Review and manage student room reservations.</p>
              </div>

              <div className="booking-record-count">
                {filteredRequests.length} Records
              </div>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="booking-toolbar">

              <div className="booking-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student, room or block..."
                />
              </div>

              <div className="booking-filters">
                {["All", "Pending", "Approved", "Rejected"].map((item) => (
                  <button
                    key={item}
                    className={filter === item ? "booking-filter-active" : ""}
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

            {/* BOOKING CARDS */}
            {filteredRequests.length === 0 ? (
              <div className="booking-empty">
                <span>📭</span>
                <h3>No booking requests found</h3>
                <p>
                  {requests.length === 0
                    ? "Student booking requests will appear here."
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
              <div className="booking-modern-grid">
                {filteredRequests.map((request) => {
                  const room = rooms.find(
                    (item) => item.number === request.room
                  );

                  return (
                    <article className="booking-modern-card" key={request.id}>

                      <div className="booking-card-top">
                        <div className="booking-student">
                          <div className="booking-avatar">
                            {request.student.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <h3>{request.student}</h3>
                            <p>Room reservation request</p>
                          </div>
                        </div>

                        <span className={`booking-status ${
                          request.status === "Approved"
                            ? "booking-approved"
                            : request.status === "Rejected"
                            ? "booking-rejected"
                            : "booking-pending"
                        }`}>
                          {request.status}
                        </span>
                      </div>

                      <div className="booking-room-details">
                        <div>
                          <span>Room Number</span>
                          <strong>{request.room}</strong>
                        </div>

                        <div>
                          <span>Hostel Block</span>
                          <strong>{request.block}</strong>
                        </div>

                        <div>
                          <span>Room Availability</span>
                          <strong>
                            {room
                              ? `${room.beds} beds available`
                              : "Room not found"}
                          </strong>
                        </div>
                      </div>

                      {request.status === "Pending" ? (
                        <div className="booking-card-actions">
                          <button
                            className="booking-approve-btn"
                            onClick={() => handleUpdate(request.id, "Approved")}
                          >
                            ✓ Approve & Allocate
                          </button>

                          <button
                            className="booking-reject-btn"
                            onClick={() => handleUpdate(request.id, "Rejected")}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <div className="booking-processed">
                          {request.status === "Approved"
                            ? "✓ Booking approved and bed allocated."
                            : "✕ Booking request rejected."}
                        </div>
                      )}

                    </article>
                  );
                })}
              </div>
            )}

          </section>

        </main>
      </div>
    </div>
  );
}

export default Bookings;

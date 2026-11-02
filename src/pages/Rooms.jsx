
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useHostel } from "../context/HostelContext";

function Rooms({ role = "student" }) {
  const isAdmin = role === "admin";

  const { rooms, setRooms, requests, addRequest } = useHostel();

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("All");

  const [form, setForm] = useState({
    number: "",
    block: "A",
    capacity: "",
    beds: "",
  });

  const [studentName, setStudentName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const totalBeds = rooms.reduce(
    (total, room) => total + room.capacity, 0
  );

  const availableBeds = rooms.reduce(
    (total, room) => total + room.beds, 0
  );

  const occupiedBeds = totalBeds - availableBeds;

  const occupancy = totalBeds > 0
    ? Math.round((occupiedBeds / totalBeds) * 100)
    : 0;

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesBlock =
      selectedBlock === "All" || room.block === selectedBlock;

    return matchesSearch && matchesBlock;
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingRoom(null);
    setForm({ number: "", block: "A", capacity: "", beds: "" });
    setShowForm(true);
  };

  const openEditForm = (room) => {
    setEditingRoom(room.number);
    setForm({ ...room });
    setShowForm(true);
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();

    const capacity = Number(form.capacity);
    const beds = Number(form.beds);

    if (
      !form.number.trim() ||
      capacity < 1 ||
      beds < 0 ||
      beds > capacity
    ) {
      alert("Enter valid room details and bed availability.");
      return;
    }

    if (
      !editingRoom &&
      rooms.some(
        (room) => room.number === form.number.trim()
      )
    ) {
      alert("Room number already exists.");
      return;
    }

    const roomData = {
      number: form.number.trim(),
      block: form.block,
      capacity,
      beds,
    };

    if (editingRoom) {
      setRooms((previous) =>
        previous.map((room) =>
          room.number === editingRoom ? roomData : room
        )
      );
    } else {
      setRooms((previous) => [...previous, roomData]);
    }

    setShowForm(false);
    setEditingRoom(null);
  };

  const deleteRoom = (number) => {
    if (window.confirm(`Delete room ${number}?`)) {
      setRooms((previous) =>
        previous.filter((room) => room.number !== number)
      );
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();

    const room = rooms.find(
      (item) => item.number === selectedRoom
    );

    if (!room || room.beds < 1) {
      alert("This room is no longer available.");
      return;
    }

    addRequest({
      student: studentName.trim(),
      room: selectedRoom,
      block: room.block,
    });

    setStudentName("");
    setSelectedRoom("");
    alert("Room booking request submitted successfully!");
  };

  return (
    <div className="dashboard">
      <Sidebar role={role} />

      <div className="main-with-sidebar">

        <header className="topbar">
          <div>
            <h2>{isAdmin ? "Room Management" : "Room Explorer"}</h2>
            <p>HostelHub / {isAdmin ? "Admin" : "Student"} Portal</p>
          </div>

          <Link
            to={isAdmin ? "/admin" : "/student"}
            className="logout-btn"
          >
            ← Dashboard
          </Link>
        </header>

        <main className="rooms-home">

          {/* Page Heading */}
          <section className="rooms-welcome">
            <div>
              <span className="rooms-eyebrow">
                {isAdmin ? "HOSTEL INVENTORY" : "FIND YOUR SPACE"}
              </span>

              <h1>
                {isAdmin ? "Manage Hostel Rooms" : "Find Your Perfect Room"}
              </h1>

              <p>
                {isAdmin
                  ? "Monitor room capacity, occupancy and availability."
                  : "Explore hostel rooms and find an available bed."}
              </p>
            </div>

            {isAdmin && (
              <button className="add-room-btn" onClick={openAddForm}>
                + Add New Room
              </button>
            )}
          </section>

          {/* Statistics */}
          <section className="rooms-stat-grid">

            <div className="rooms-stat-card">
              <span className="rooms-stat-icon blue">🏢</span>
              <div>
                <p>Total Rooms</p>
                <h2>{rooms.length}</h2>
              </div>
            </div>

            <div className="rooms-stat-card">
              <span className="rooms-stat-icon green">🛏️</span>
              <div>
                <p>Available Beds</p>
                <h2>{availableBeds}</h2>
              </div>
            </div>

            <div className="rooms-stat-card">
              <span className="rooms-stat-icon purple">👥</span>
              <div>
                <p>Occupied Beds</p>
                <h2>{occupiedBeds}</h2>
              </div>
            </div>

            <div className="rooms-stat-card">
              <span className="rooms-stat-icon orange">📊</span>
              <div>
                <p>Occupancy Rate</p>
                <h2>{occupancy}%</h2>
              </div>
            </div>

          </section>

          {/* Room Form */}
          {isAdmin && showForm && (
            <form className="rooms-form-card" onSubmit={handleRoomSubmit}>
              <div className="rooms-form-heading">
                <div>
                  <span className="rooms-eyebrow">ROOM CONFIGURATION</span>
                  <h2>{editingRoom ? "Edit Room Details" : "Add New Room"}</h2>
                </div>
                <button
                  type="button"
                  className="rooms-close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
              </div>

              <div className="rooms-form-grid">
                <div>
                  <label>Room Number</label>
                  <input
                    name="number"
                    value={form.number}
                    onChange={handleChange}
                    placeholder="Example: 401"
                    required
                    disabled={!!editingRoom}
                  />
                </div>

                <div>
                  <label>Hostel Block</label>
                  <select
                    name="block"
                    value={form.block}
                    onChange={handleChange}
                  >
                    <option value="A">Block A</option>
                    <option value="B">Block B</option>
                    <option value="C">Block C</option>
                    <option value="D">Block D</option>
                  </select>
                </div>

                <div>
                  <label>Total Beds</label>
                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Available Beds</label>
                  <input
                    type="number"
                    name="beds"
                    min="0"
                    value={form.beds}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="rooms-form-actions">
                <button type="submit" className="add-room-btn">
                  {editingRoom ? "Save Changes" : "Create Room"}
                </button>

                <button
                  type="button"
                  className="rooms-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Student Booking Form */}
          {!isAdmin && (
            <form className="rooms-booking-card" onSubmit={handleBooking}>
              <div className="rooms-form-heading">
                <div>
                  <span className="rooms-eyebrow">ROOM RESERVATION</span>
                  <h2>Request Your Room</h2>
                  <p>Choose an available room to submit a booking request.</p>
                </div>
                <span className="booking-heading-icon">🛏️</span>
              </div>

              <div className="rooms-booking-fields">
                <div>
                  <label>Student Name</label>
                  <input
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label>Select Available Room</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    required
                  >
                    <option value="">Choose a room</option>
                    {rooms
                      .filter((room) => room.beds > 0)
                      .map((room) => (
                        <option key={room.number} value={room.number}>
                          Room {room.number} - Block {room.block} ({room.beds} beds)
                        </option>
                      ))}
                  </select>
                </div>

                <button type="submit" className="add-room-btn">
                  Submit Booking Request →
                </button>
              </div>
            </form>
          )}

          {/* Room Search and Filters */}
          <section className="rooms-list-section">

            <div className="rooms-list-heading">
              <div>
                <span className="rooms-eyebrow">ROOM DIRECTORY</span>
                <h2>{isAdmin ? "All Hostel Rooms" : "Explore Available Rooms"}</h2>
                <p>{filteredRooms.length} rooms found</p>
              </div>
            </div>

            <div className="rooms-toolbar">
              <div className="rooms-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search room number..."
                />
              </div>

              <div className="rooms-filters">
                {["All", "A", "B", "C", "D"].map((block) => (
                  <button
                    key={block}
                    type="button"
                    className={selectedBlock === block ? "room-filter-active" : ""}
                    onClick={() => setSelectedBlock(block)}
                  >
                    {block === "All" ? "All Blocks" : `Block ${block}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Cards */}
            <div className="rooms-modern-grid">
              {filteredRooms.map((room) => {
                const occupied = room.capacity - room.beds;
                const roomOccupancy = room.capacity > 0
                  ? Math.round((occupied / room.capacity) * 100)
                  : 0;

                return (
                  <article className="modern-room-card" key={room.number}>

                    <div className="modern-room-top">
                      <div className="room-number-icon">🛏️</div>

                      <span className={`room-availability ${
                        room.beds > 0 ? "room-open" : "room-full"
                      }`}>
                        {room.beds > 0 ? "Available" : "Fully Occupied"}
                      </span>
                    </div>

                    <div className="modern-room-title">
                      <h3>Room {room.number}</h3>
                      <p>Hostel Block {room.block}</p>
                    </div>

                    <div className="room-bed-details">
                      <div>
                        <span>Total Beds</span>
                        <strong>{room.capacity}</strong>
                      </div>
                      <div>
                        <span>Available</span>
                        <strong>{room.beds}</strong>
                      </div>
                      <div>
                        <span>Occupied</span>
                        <strong>{occupied}</strong>
                      </div>
                    </div>

                    <div className="room-progress-heading">
                      <span>Room Occupancy</span>
                      <strong>{roomOccupancy}%</strong>
                    </div>

                    <div className="room-progress-track">
                      <div
                        className="room-progress-fill"
                        style={{ width: `${roomOccupancy}%` }}
                      />
                    </div>

                    {isAdmin && (
                      <div className="modern-room-actions">
                        <button onClick={() => openEditForm(room)}>
                          ✎ Edit Room
                        </button>
                        <button
                          className="room-delete-action"
                          onClick={() => deleteRoom(room.number)}
                        >
                          Delete
                        </button>
                      </div>
                    )}

                  </article>
                );
              })}
            </div>

            {filteredRooms.length === 0 && (
              <div className="rooms-empty">
                <span>🔍</span>
                <h3>No rooms found</h3>
                <p>Try changing your search or block filter.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedBlock("All");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}

          </section>

          {/* Student Booking Requests */}
          {!isAdmin && (
            <section className="rooms-booking-history">
              <div className="rooms-list-heading">
                <div>
                  <span className="rooms-eyebrow">RESERVATION HISTORY</span>
                  <h2>Your Booking Requests</h2>
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="rooms-empty">
                  <span>📭</span>
                  <h3>No booking requests yet</h3>
                  <p>Your room booking history will appear here.</p>
                </div>
              ) : (
                requests.map((request) => (
                  <div className="room-request-row" key={request.id}>
                    <div className="request-room-icon">🏠</div>
                    <div className="request-room-info">
                      <strong>Room {request.room}</strong>
                      <small>
                        {request.student} • Block {request.block}
                      </small>
                    </div>
                    <span className={`admin-status ${
                      request.status === "Approved"
                        ? "status-approved"
                        : request.status === "Rejected"
                        ? "status-rejected"
                        : "status-pending"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))
              )}
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default Rooms;

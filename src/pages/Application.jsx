
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useHostel } from "../context/HostelContext";

function Application() {
  const { addApplication, applications } = useHostel();

  const [submittedApplication, setSubmittedApplication] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const application = {
      name: form.name.value.trim(),
      usn: form.usn.value.trim().toUpperCase(),
      block: form.block.value,
      roomType: form.roomType.value,
      notes: form.notes.value.trim(),
    };

    if (!application.name || !application.usn) {
      alert("Please fill in all required details.");
      return;
    }

    addApplication(application);

    setSubmittedApplication({
      ...application,
      id: Date.now(),
      status: "Pending",
    });
  };

  return (
    <div className="dashboard">
      <Sidebar role="student" />

      <div className="main-with-sidebar">
        <header className="topbar">
          <div>
            <h2>Hostel Application</h2>
            <p>HostelHub / Student Portal</p>
          </div>

          <Link to="/student" className="logout-btn">
            ← Dashboard
          </Link>
        </header>

        <main className="application-home">

          {!submittedApplication ? (
            <>
              <section className="application-welcome">
                <div>
                  <span className="application-eyebrow">
                    ADMISSIONS & ACCOMMODATION
                  </span>
                  <h1>Your hostel journey starts here.</h1>
                  <p>
                    Submit your accommodation preferences and track
                    your application status from one place.
                  </p>
                </div>

                <div className="application-hero-icon">📋</div>
              </section>

              <section className="application-steps">
                <div className="application-step active">
                  <span>1</span>
                  <div>
                    <strong>Fill Details</strong>
                    <small>Enter your information</small>
                  </div>
                </div>

                <div className="application-step-line" />

                <div className="application-step">
                  <span>2</span>
                  <div>
                    <strong>Admin Review</strong>
                    <small>Application verification</small>
                  </div>
                </div>

                <div className="application-step-line" />

                <div className="application-step">
                  <span>3</span>
                  <div>
                    <strong>Confirmation</strong>
                    <small>Allocation update</small>
                  </div>
                </div>
              </section>

              <section className="application-layout">

                <form
                  className="application-modern-form"
                  onSubmit={handleSubmit}
                >
                  <div className="application-form-heading">
                    <div>
                      <span className="application-eyebrow">
                        APPLICATION FORM
                      </span>
                      <h2>Student Information</h2>
                      <p>Fields marked with * are required.</p>
                    </div>
                    <span className="application-form-icon">📝</span>
                  </div>

                  <div className="application-fields-grid">

                    <div className="application-field">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="application-field">
                      <label>USN / Student ID *</label>
                      <input
                        type="text"
                        name="usn"
                        placeholder="Example: 1JB24CS093"
                        required
                      />
                    </div>

                    <div className="application-field">
                      <label>Preferred Hostel Block *</label>
                      <select name="block" required defaultValue="">
                        <option value="" disabled>Select a block</option>
                        <option value="Block A">Block A</option>
                        <option value="Block B">Block B</option>
                        <option value="Block C">Block C</option>
                        <option value="Block D">Block D</option>
                      </select>
                    </div>

                    <div className="application-field">
                      <label>Room Preference *</label>
                      <select name="roomType" required defaultValue="">
                        <option value="" disabled>Select room type</option>
                        <option value="Single Sharing">Single Sharing</option>
                        <option value="Double Sharing">Double Sharing</option>
                        <option value="Triple Sharing">Triple Sharing</option>
                      </select>
                    </div>

                    <div className="application-field full-width">
                      <label>Additional Notes</label>
                      <textarea
                        name="notes"
                        rows="4"
                        placeholder="Mention any additional preferences or requests..."
                      />
                    </div>

                  </div>

                  <div className="application-submit-area">
                    <p>🔒 Your information will be used for hostel admission purposes.</p>
                    <button type="submit">
                      Submit Application <span>→</span>
                    </button>
                  </div>
                </form>

                <aside className="application-info-panel">
                  <div className="application-info-icon">💡</div>
                  <h3>Before You Apply</h3>
                  <p>Keep these points in mind before submitting your application.</p>

                  <div className="application-info-item">
                    <span>✓</span>
                    <div>
                      <strong>Correct Information</strong>
                      <small>Enter your name and USN accurately.</small>
                    </div>
                  </div>

                  <div className="application-info-item">
                    <span>✓</span>
                    <div>
                      <strong>Choose Preferences</strong>
                      <small>Select your preferred block and room type.</small>
                    </div>
                  </div>

                  <div className="application-info-item">
                    <span>✓</span>
                    <div>
                      <strong>Wait for Approval</strong>
                      <small>Your application will be reviewed by the admin.</small>
                    </div>
                  </div>

                  <div className="application-help">
                    <strong>Need assistance?</strong>
                    <p>Contact your hostel administrator for application-related queries.</p>
                  </div>
                </aside>

              </section>
            </>
          ) : (
            <section className="application-success">
              <div className="application-success-icon">✓</div>

              <span className="application-eyebrow">
                APPLICATION RECEIVED
              </span>

              <h1>You're one step closer!</h1>

              <p>
                Your hostel application has been submitted successfully.
                The administrator will review your details.
              </p>

              <div className="application-reference">
                <span>APPLICATION REFERENCE</span>
                <strong>HH-{String(submittedApplication.id).slice(-6)}</strong>
              </div>

              <div className="application-summary">
                <h3>Application Summary</h3>

                <div><span>Student Name</span><strong>{submittedApplication.name}</strong></div>
                <div><span>USN</span><strong>{submittedApplication.usn}</strong></div>
                <div><span>Preferred Block</span><strong>{submittedApplication.block}</strong></div>
                <div><span>Room Type</span><strong>{submittedApplication.roomType}</strong></div>
                <div>
                  <span>Application Status</span>
                  <strong className="application-pending">Pending Review</strong>
                </div>
              </div>

              <div className="application-success-actions">
                <Link to="/student" className="application-primary-link">
                  Go to Dashboard →
                </Link>

                <button
                  onClick={() => setSubmittedApplication(null)}
                  className="application-secondary-btn"
                >
                  Submit Another Application
                </button>
              </div>
            </section>
          )}

          {/* Previous Applications */}
          {!submittedApplication && applications.length > 0 && (
            <section className="application-history">
              <div>
                <span className="application-eyebrow">YOUR RECORDS</span>
                <h2>Application History</h2>
                <p>Previously submitted hostel applications.</p>
              </div>

              {applications.map((application) => (
                <div className="application-history-row" key={application.id}>
                  <div className="application-history-icon">📄</div>

                  <div className="application-history-info">
                    <strong>{application.name}</strong>
                    <small>
                      {application.usn} · {application.block} · {application.roomType}
                    </small>
                  </div>

                  <span className={`application-history-status ${
                    application.status === "Approved"
                      ? "history-approved"
                      : application.status === "Rejected"
                      ? "history-rejected"
                      : "history-pending"
                  }`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default Application;

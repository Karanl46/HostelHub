
import { Link, useLocation } from "react-router-dom";

function Sidebar({ role = "student" }) {
  const location = useLocation();
  const isAdmin = role === "admin";

  const studentLinks = [
    { path: "/student", icon: "▦", label: "Dashboard" },
    { path: "/rooms", icon: "▤", label: "Explore Rooms" },
    { path: "/application", icon: "▧", label: "My Application" },
    { path: "/complaints", icon: "⚒", label: "Complaints" },
  ];

  const adminLinks = [
    { path: "/admin", icon: "▦", label: "Dashboard" },
    { path: "/admin/rooms", icon: "▤", label: "Manage Rooms" },
    { path: "/admin/bookings", icon: "▧", label: "Bookings" },
    { path: "/admin/applications", icon: "▣", label: "Applications" },
    { path: "/admin/complaints", icon: "⚒", label: "Complaints" },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="sidebar hh-sidebar">
      <div className="sidebar-logo hh-brand">
        <div className="hh-brand-icon">H</div>
        <div className="hh-brand-text">
          <h2>HostelHub</h2>
          <span>SMART HOSTEL SYSTEM</span>
        </div>
      </div>

      <div className="hh-portal">
        <span className="hh-portal-dot"></span>
        {isAdmin ? "ADMIN PORTAL" : "STUDENT PORTAL"}
      </div>

      <nav className="sidebar-nav hh-navigation">
        <p className="hh-nav-heading">WORKSPACE</p>

        {links.map((link) => {
          const active = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`hh-nav-link ${active ? "hh-nav-active" : ""}`}
            >
              <span className="hh-nav-icon">{link.icon}</span>
              <span>{link.label}</span>
              {active && <span className="hh-active-indicator"></span>}
            </Link>
          );
        })}
      </nav>

      <div className="hh-sidebar-bottom">
        <div className="hh-sidebar-help">
          <span>✦</span>
          <div>
            <strong>HostelHub</strong>
            <small>Making hostel life easier.</small>
          </div>
        </div>

        <Link to="/" className="sidebar-logout hh-logout">
          <span>↪</span>
          <span>Sign Out</span>
        </Link>

        <div className="hh-sidebar-version">HOSTELHUB · 2026</div>
      </div>
    </aside>
  );
}

export default Sidebar;

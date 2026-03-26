"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../components/ThemeToggle";
import RegisterPatient from "../../components/RegisterPatient";
import NewAppointment from "../../components/NewAppointment";
import GenerateReport from "../../components/GenerateReport";
import PatientList from "../../components/PatientList";
import DoctorList from "../../components/DoctorList";

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      setUserEmail(decodedPayload.sub || "User");
    } catch(e) {
      console.error("Invalid token format");
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "patients", label: "Patients", icon: "👤" },
    { id: "doctors", label: "Doctors", icon: "👨‍⚕️" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "billing", label: "Billing", icon: "💳" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const stats = [
    { label: "Total Patients", value: "1,284", change: "+12%", up: true, icon: "👥", color: "#4F46E5" },
    { label: "Appointments", value: "42", change: "+5%", up: true, icon: "📅", color: "#06B6D4" },
    { label: "Doctors On-Duty", value: "18", change: "-2", up: false, icon: "👨‍⚕️", color: "#8B5CF6" },
    { label: "Revenue Today", value: "$4,250", change: "+18%", up: true, icon: "💰", color: "#10B981" },
  ];

  const appointments = [
    { id: 1, patient: "John Cooper", doctor: "Dr. Sarah Smith", time: "09:30 AM", status: "Scheduled" },
    { id: 2, patient: "Maria Garcia", doctor: "Dr. Robert Jones", time: "10:45 AM", status: "Completed" },
    { id: 3, patient: "David Miller", doctor: "Dr. Sarah Smith", time: "01:15 PM", status: "Scheduled" },
    { id: 4, patient: "Emma Wilson", doctor: "Dr. Jane Doe", time: "02:30 PM", status: "Cancelled" },
    { id: 5, patient: "Michael Brown", doctor: "Dr. Robert Jones", time: "04:00 PM", status: "Scheduled" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          🏥 Supreme Health
        </div>
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item" onClick={handleLogout} style={{ color: '#EF4444' }}>
            <span>🚪</span> Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-dashboard">
        <header className="dashboard-header">
          <div className="header-title">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Overview</span>
            <h2>Hospital Dashboard</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <ThemeToggle />
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search..." 
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: '12px',
                  padding: '0.6rem 1rem 0.6rem 2.5rem',
                  color: 'var(--text-primary)',
                  width: '240px'
                }}
              />
              <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{userEmail}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Administrator</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                👤
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className={`stat-change ${stat.up ? 'change-up' : 'change-down'}`}>
                  {stat.up ? '↑' : '↓'} {stat.change}
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Dashboard Content Grid */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content-grid animate-in fade-in duration-500">
            {/* Recent Appointments */}
            <div className="content-card">
              <div className="card-header">
                <h3>Recent Appointments</h3>
                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>View All</button>
              </div>
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id}>
                      <td style={{ fontWeight: '500' }}>{apt.patient}</td>
                      <td>{apt.doctor}</td>
                      <td>{apt.time}</td>
                      <td>
                        <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Actions / Activity Feed */}
            <div className="content-card">
              <div className="card-header">
                <h3>Quick Actions</h3>
              </div>
              
              {notification.message && (
                <div style={{ 
                  padding: '0.75rem', 
                  background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: notification.type === 'success' ? '#10B981' : '#EF4444',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {notification.message}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  className="submit-btn" 
                  onClick={() => setShowAppointmentModal(true)}
                  style={{ margin: 0, padding: '0.75rem' }}
                >
                  + New Appointment
                </button>
                <button 
                  className="submit-btn" 
                  onClick={() => setShowRegisterModal(true)}
                  style={{ margin: 0, padding: '0.75rem', background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--surface-border)' }}
                >
                  Register Patient
                </button>
                <button 
                  className="submit-btn" 
                  onClick={() => setShowReportModal(true)}
                  style={{ margin: 0, padding: '0.75rem', background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--surface-border)' }}
                >
                  Generate Report
                </button>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>System Health</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                  Database Online
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                  API Services Active
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && <PatientList />}

        {activeTab === 'doctors' && <DoctorList />}

        {activeTab === 'appointments' && (
          <div className="content-card p-12 text-center animate-in fade-in duration-500">
            <h3 className="text-xl font-bold">Appointment Calendar</h3>
            <p className="text-muted-foreground mt-2">View and manage the full hospital schedule.</p>
            <div className="mt-8 p-12 bg-muted/20 border border-dashed border-border rounded-2xl">
              Coming soon! Feature currently in development.
            </div>
          </div>
        )}
      </main>

      {showRegisterModal && (
        <RegisterPatient 
          onClose={() => setShowRegisterModal(false)} 
          onSuccess={(msg) => {
            setNotification({ message: msg, type: 'success' });
            setTimeout(() => setNotification({ message: '', type: '' }), 5000);
          }}
        />
      )}

      {showAppointmentModal && (
        <NewAppointment 
          onClose={() => setShowAppointmentModal(false)} 
          onSuccess={(msg) => {
            setNotification({ message: msg, type: 'success' });
            setTimeout(() => setNotification({ message: '', type: '' }), 5000);
          }}
        />
      )}

      {showReportModal && (
        <GenerateReport 
          isOpen={showReportModal} 
          onClose={() => setShowReportModal(false)} 
        />
      )}
    </div>
  );
}

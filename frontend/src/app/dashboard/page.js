"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../components/ThemeToggle";
import RegisterPatient from "../../components/RegisterPatient";
import NewAppointment from "../../components/NewAppointment";
import GenerateReport from "../../components/GenerateReport";
import PatientList from "../../components/PatientList";
import DoctorList from "../../components/DoctorList";
import AppointmentList from "../../components/AppointmentList";
import BillingList from "../../components/BillingList";
import SettingsView from "../../components/SettingsView";

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  const [dashboardStats, setDashboardStats] = useState({
    patients: 1284,
    appointments: 42,
    doctors: 18,
    revenue: 4250,
  });
  
  const [recentAppointments, setRecentAppointments] = useState([]);

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/reports/summary`);
      if (response.ok) {
        const data = await response.json();
        setDashboardStats({
          patients: data.total_patients,
          appointments: data.scheduled_appointments,
          doctors: data.total_doctors,
          revenue: data.total_revenue,
        });
      }
      
      const aptResponse = await fetch(`${apiUrl}/appointments`);
      if (aptResponse.ok) {
        const aptData = await aptResponse.json();
        setRecentAppointments(aptData.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

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
      fetchStats();
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
  ];

  const stats = [
    { id: "patients", label: "Total Patients", value: dashboardStats.patients.toLocaleString(), change: "+12%", up: true, icon: "👥", color: "#4F46E5" },
    { id: "appointments", label: "Appointments", value: dashboardStats.appointments.toLocaleString(), change: "+5%", up: true, icon: "📅", color: "#06B6D4" },
    { id: "doctors", label: "Doctors On-Duty", value: dashboardStats.doctors.toLocaleString(), change: "-2", up: false, icon: "👨‍⚕️", color: "#8B5CF6" },
    { id: "billing", label: "Revenue Today", value: `₹${parseFloat(dashboardStats.revenue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, change: "+18%", up: true, icon: "💰", color: "#10B981" },
  ];

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    let [hours, minutes] = timeString.split(':');
    let ampm = 'AM';
    let h = parseInt(hours, 10);
    if (h >= 12) {
      ampm = 'PM';
      if (h > 12) h -= 12;
    }
    if (h === 0) h = 12;
    return `${h}:${minutes} ${ampm}`;
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar flex flex-col justify-between h-screen sticky top-0">
        <div>
          <div className="sidebar-logo">
            🏥 Supreme Health
          </div>
          <nav className="nav-menu">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                className={`nav-item w-full text-left bg-transparent border-0 font-inherit ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto pt-6 border-t border-surface-border">
          <button 
            className={`nav-item w-full text-left bg-transparent border-0 font-inherit mb-2 ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>⚙️</span> Settings
          </button>
          <button 
            className="nav-item w-full text-left bg-transparent border-0 font-inherit" 
            onClick={handleLogout} 
            style={{ color: '#EF4444' }}
          >
            <span>🚪</span> Logout
          </button>
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
            <div 
              key={i} 
              className="stat-card cursor-pointer"
              onClick={() => setActiveTab(stat.id)}
            >
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
                <button className="hover:scale-105 hover:opacity-80 transition-all origin-right" style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>View All</button>
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
                  {recentAppointments.length > 0 ? (
                    recentAppointments.map((apt) => (
                      <tr key={apt.id}>
                        <td style={{ fontWeight: '500' }}>{apt.patient_name}</td>
                        <td>{apt.doctor_name}</td>
                        <td>{formatTime(apt.appointment_time)}</td>
                        <td>
                          <span className={`status-badge status-${(apt.status || 'Scheduled').toLowerCase()}`}>
                            {apt.status || 'Scheduled'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No recent appointments found.</td>
                    </tr>
                  )}
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

        {activeTab === 'appointments' && <AppointmentList />}

        {activeTab === 'billing' && <BillingList />}

        {activeTab === 'settings' && <SettingsView />}
      </main>

      {showRegisterModal && (
        <RegisterPatient 
          onClose={() => setShowRegisterModal(false)} 
          onSuccess={(msg) => {
            setNotification({ message: msg, type: 'success' });
            setTimeout(() => setNotification({ message: '', type: '' }), 5000);
            fetchStats();
          }}
        />
      )}

      {showAppointmentModal && (
        <NewAppointment 
          onClose={() => setShowAppointmentModal(false)} 
          onSuccess={(msg) => {
            setNotification({ message: msg, type: 'success' });
            setTimeout(() => setNotification({ message: '', type: '' }), 5000);
            fetchStats();
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

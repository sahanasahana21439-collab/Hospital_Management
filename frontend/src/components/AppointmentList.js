"use client";
import React, { useState, useEffect } from "react";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = "https://hospital-management-api-7tat.onrender.com";

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/appointments`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((a) =>
    a.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="section-container animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointment Schedule</h2>
          <p className="text-muted-foreground mt-1">Manage and track all patient-doctor consultations</p>
        </div>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by patient or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-destructive bg-destructive/5 border-b border-border">
            <p className="font-semibold">{error}</p>
            <button onClick={fetchAppointments} className="mt-4 text-sm underline hover:text-destructive/80">Try again</button>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-24 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold">No appointments found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search terms or schedule a new appointment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-center">Date & Time</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-right">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-border hover:bg-muted/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {apt.patient_name?.[0].toUpperCase()}
                        </div>
                        <p className="font-bold text-foreground">{apt.patient_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{apt.doctor_name}</span>
                        <span className="text-xs text-muted-foreground opacity-70">Medical Consultant</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-sm">{apt.appointment_date}</span>
                        <span className="text-xs text-primary font-semibold">{apt.appointment_time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(apt.status)} shadow-sm`}>
                        {apt.status || 'Scheduled'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">{apt.contact_number || "N/A"}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{apt.email_id || "N/A"}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

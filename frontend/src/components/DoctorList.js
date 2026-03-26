"use client";
import React, { useState, useEffect } from "react";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = "https://hospital-management-api-7tat.onrender.com";

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/doctors`);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (availability) => {
    switch (availability) {
      case 'Available': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'On Call': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'On Leave': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="section-container animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Medical Staff Directory</h2>
          <p className="text-muted-foreground mt-1">View and manage hospital doctor details and availability</p>
        </div>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search doctors or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">👨‍⚕️</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Fetching medical directory...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-destructive bg-destructive/5 border-b border-border">
            <p className="font-semibold">{error}</p>
            <button onClick={fetchDoctors} className="mt-4 text-sm underline hover:text-destructive/80">Try again</button>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="p-24 text-center">
            <div className="text-6xl mb-4">⚕️</div>
            <h3 className="text-xl font-bold">No doctors found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider">Specialty</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-center">Joining Date</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-center">Availability</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b border-border hover:bg-muted/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl shadow-inner group-hover:scale-110 transition-transform">
                          {doctor.name?.includes('Michael') ? '👨‍⚕️' : doctor.name?.includes('Sarah') ? '👩‍⚕️' : '👨‍⚕️'}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-lg">{doctor.name}</p>
                          <p className="text-xs text-muted-foreground">{doctor.email || "staff@supremehealth.com"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-primary/5 text-primary px-3 py-1 rounded-lg text-sm font-semibold border border-primary/10">
                        {doctor.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-muted-foreground font-mono text-sm">
                      {doctor.date_of_joining || "2023-01-01"}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(doctor.availability)} shadow-sm inline-flex items-center gap-1.5`}>
                        <span className={`w-2 h-2 rounded-full ${doctor.availability === 'Available' ? 'bg-green-500 animate-pulse' : doctor.availability === 'On Call' ? 'bg-blue-500 animate-bounce' : 'bg-destructive'}`}></span>
                        {doctor.availability || 'Available'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="bg-surface border border-border text-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                        Schedule
                      </button>
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

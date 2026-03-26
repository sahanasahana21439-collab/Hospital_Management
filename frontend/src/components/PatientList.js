"use client";
import React, { useState, useEffect } from "react";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = "https://hospital-management-api-7tat.onrender.com";

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/patients`);
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact_number?.includes(searchTerm)
  );

  return (
    <div className="section-container animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patient Directory</h2>
          <p className="text-muted-foreground mt-1">Manage and view registered patient information</p>
        </div>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading patient records...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-destructive bg-destructive/5 border-b border-border">
            <p className="font-semibold">{error}</p>
            <button onClick={fetchPatients} className="mt-4 text-sm underline hover:text-destructive/80">Try again</button>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-24 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-bold">No patients found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or register a new patient.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 font-semibold text-sm">Patient Name</th>
                  <th className="px-6 py-4 font-semibold text-sm text-center">D.O.B</th>
                  <th className="px-6 py-4 font-semibold text-sm text-center">Gender</th>
                  <th className="px-6 py-4 font-semibold text-sm">Contact</th>
                  <th className="px-6 py-4 font-semibold text-sm">Medical History Summary</th>
                  <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {patient.full_name?.charAt(0)}
                        </div>
                        <span className="font-semibold text-foreground">{patient.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground text-sm">{patient.date_of_birth}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.gender === 'Male' ? 'bg-blue-500/10 text-blue-500' : 
                        patient.gender === 'Female' ? 'bg-pink-500/10 text-pink-500' : 
                        'bg-gray-500/10 text-gray-500'
                      }`}>
                        {patient.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{patient.contact_number}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]" title={patient.medical_history}>
                        {patient.medical_history || "No records"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
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

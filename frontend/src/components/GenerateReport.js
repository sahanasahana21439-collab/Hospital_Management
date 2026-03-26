"use client";
import React, { useState, useEffect } from "react";

export default function GenerateReport({ isOpen, onClose }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = "https://hospital-management-api-7tat.onrender.com";

  useEffect(() => {
    if (isOpen) {
      const fetchReport = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${apiUrl}/reports/summary`);
          if (!response.ok) throw new Error("Failed to fetch report summary");
          const data = await response.json();
          setReportData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card text-card-foreground w-full max-w-2xl rounded-2xl shadow-2xl border border-border p-8 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Hospital Activity Report</h2>
            <p className="text-muted-foreground mt-1">Real-time system overview and metrics</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Generating live report...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-center">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/50 p-6 rounded-2xl border border-border/50 text-center hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Patients</p>
                <p className="text-4xl font-bold mt-2 text-primary">{reportData.total_patients}</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-2xl border border-border/50 text-center hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Doctors</p>
                <p className="text-4xl font-bold mt-2 text-primary">{reportData.total_doctors}</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-2xl border border-border/50 text-center hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appointments</p>
                <p className="text-4xl font-bold mt-2 text-primary">{reportData.scheduled_appointments}</p>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Database Sync</span>
                  <span className="text-green-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last Generated</span>
                  <span className="font-mono text-xs">{new Date(reportData.generated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Report
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-muted text-foreground py-3 rounded-xl font-semibold hover:bg-muted/80 transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

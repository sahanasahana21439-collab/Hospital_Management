"use client";
import React, { useState, useEffect } from "react";

export default function BillingList() {
  const [billingRecords, setBillingRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = "https://hospital-management-api-7tat.onrender.com";

  useEffect(() => {
    fetchBilling();
  }, []);

  const fetchBilling = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/billing`);
      if (!response.ok) throw new Error("Failed to fetch billing records");
      const data = await response.json();
      setBillingRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = billingRecords.filter((r) =>
    r.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-inner';
      case 'Overdue': return 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="section-container animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Records</h2>
          <p className="text-muted-foreground mt-1">Track and manage hospital payments and invoices</p>
        </div>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by patient or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">💸</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500 opacity-20"></div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Retrieving financial data...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-destructive bg-destructive/5 border-b border-border">
            <p className="font-semibold text-lg mb-2">Service Temporarily Unavailable</p>
            <p className="opacity-70">{error}</p>
            <button onClick={fetchBilling} className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-md">Retry Fetch</button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-24 text-center">
            <div className="text-6xl mb-4 grayscale opacity-20">🪙</div>
            <h3 className="text-xl font-bold">No billing records found</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Either all invoices are cleared or no records match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider">Description</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-center">Amount</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-center">Method</th>
                  <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold border border-primary/10">
                          {record.patient_name?.[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground">{record.patient_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]" title={record.description}>
                        {record.description || "Medical Services"}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="font-mono font-bold text-foreground">
                        ${record.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusBadgeClass(record.status)} shadow-sm`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-semibold px-2 py-1 bg-muted rounded border border-border">
                        {record.method}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-xs opacity-70">
                      {record.billing_date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-2xl border border-border shadow-md">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Revenue</p>
          <p className="text-3xl font-black text-foreground">$45,280.00</p>
          <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[78%]"></div>
          </div>
        </div>
        <div className="p-6 bg-card rounded-2xl border border-border shadow-md">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Pending Invoices</p>
          <p className="text-3xl font-black text-foreground">12</p>
          <p className="text-xs text-yellow-500 mt-2">↑ 4 from last week</p>
        </div>
        <div className="p-6 bg-card rounded-2xl border border-border shadow-md">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Collection Rate</p>
          <p className="text-3xl font-black text-foreground">94.2%</p>
          <p className="text-xs text-primary mt-2">Highly Efficient</p>
        </div>
      </div>
    </div>
  );
}

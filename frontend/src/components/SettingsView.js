"use client";
import React, { useState } from "react";

export default function SettingsView() {
  const [activeSegment, setActiveSegment] = useState("profile");

  // Mock State for Settings Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  // Mock Profile Data
  const [profile, setProfile] = useState({
    name: "System Administrator",
    email: "shara@gmail.com",
    role: "Admin",
    phone: "+1 (555) 123-4567"
  });

  const handleSave = () => {
    // Mock save action
    alert("Settings saved successfully!");
  };

  return (
    <div className="section-container animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground mt-1">Manage your account preferences and application configuration</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 hover:scale-105 hover:shadow-md transition-all font-medium border border-border shadow-sm transform">
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 hover:scale-105 hover:shadow-lg transition-all font-medium shadow-md flex items-center gap-2 transform"
          >
            <span>💾</span> Save Configuration
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-card rounded-2xl border border-border p-3 shadow-sm sticky top-6">
            <nav className="flex flex-col gap-2">
              {[
                { id: "profile", label: "Profile Information", icon: "👤" },
                { id: "preferences", label: "App Preferences", icon: "🎨" },
                { id: "notifications", label: "Notifications", icon: "🔔" },
                { id: "security", label: "Security & Access", icon: "🛡️" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSegment(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group w-full text-left ${
                    activeSegment === item.id 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-inner translate-x-1" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:translate-x-1 hover:shadow-sm"
                  }`}
                >
                  <span className={`transition-transform duration-300 ${activeSegment === item.id ? "opacity-100 scale-110" : "opacity-70 group-hover:scale-110 group-hover:opacity-100"}`}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {activeSegment === "profile" && (
            <div className="p-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-card outline outline-2 outline-primary/20">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.role} Account</p>
                  <button className="mt-3 px-4 py-1.5 bg-muted text-xs font-medium rounded-lg hover:bg-muted/80 transition-colors border border-border">
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="bg-muted/10 border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-border hook-hover transition-colors">
                  <div className="flex-1 md:pr-4">
                    <label className="text-sm font-bold text-foreground block mb-1">Full Name</label>
                    <p className="text-xs text-muted-foreground">The name displayed on your dashboard.</p>
                  </div>
                  <div className="flex-1 w-full mt-3 md:mt-0">
                    <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-border hook-hover transition-colors">
                  <div className="flex-1 md:pr-4">
                    <label className="text-sm font-bold text-foreground block mb-1">Email Address</label>
                    <p className="text-xs text-muted-foreground">Used to log in and receive notifications.</p>
                  </div>
                  <div className="flex-1 w-full mt-3 md:mt-0">
                    <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-border bg-muted/20">
                  <div className="flex-1 md:pr-4">
                    <label className="text-sm font-bold text-foreground block mb-1">Role / Department</label>
                    <p className="text-xs text-muted-foreground">Your assigned system permissions.</p>
                  </div>
                  <div className="flex-1 w-full mt-3 md:mt-0">
                    <input type="text" value={profile.role} disabled className="w-full max-w-md bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground font-medium cursor-not-allowed" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 hook-hover transition-colors">
                  <div className="flex-1 md:pr-4">
                    <label className="text-sm font-bold text-foreground block mb-1">Contact Number</label>
                    <p className="text-xs text-muted-foreground">For critical SMS alerts.</p>
                  </div>
                  <div className="flex-1 w-full mt-3 md:mt-0">
                    <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSegment === "preferences" && (
            <div className="p-8 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-xl font-bold mb-6">Application Preferences</h3>
              
              <div className="bg-muted/10 border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-border hook-hover transition-colors">
                  <div className="flex-1 md:pr-4">
                    <label className="text-sm font-bold text-foreground block mb-1">System Language</label>
                    <p className="text-xs text-muted-foreground">Select the primary language for the dashboard interface.</p>
                  </div>
                  <div className="flex-1 w-full mt-3 md:mt-0">
                    <select className="w-full max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none">
                      <option>English (United States)</option>
                      <option>Spanish (Español)</option>
                      <option>French (Français)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-border hook-hover transition-colors">
                  <div className="flex-1 md:pr-4">
                    <label className="text-sm font-bold text-foreground block mb-1">Timezone</label>
                    <p className="text-xs text-muted-foreground">Ensure all appointments and records match your local time.</p>
                  </div>
                  <div className="flex-1 w-full mt-3 md:mt-0">
                    <select className="w-full max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none">
                      <option>Eastern Time (EST/EDT)</option>
                      <option>Central Time (CST/CDT)</option>
                      <option>Pacific Time (PST/PDT)</option>
                      <option>India Standard Time (IST)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 hook-hover transition-colors">
                  <div className="flex-1 md:pr-4">
                    <label className="text-sm font-bold text-foreground block mb-1">Automated Data Backup</label>
                    <p className="text-xs text-muted-foreground">Regularly backup patient and billing databases.</p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setAutoBackup(!autoBackup)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ${autoBackup ? 'bg-primary' : 'bg-muted border border-border'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${autoBackup ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSegment === "notifications" && (
            <div className="p-8 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-xl font-bold mb-6">Notification Settings</h3>
              
              <div className="bg-muted/10 border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-6 border-b border-border hook-hover transition-colors">
                  <div className="flex-1 md:pr-4">
                    <h4 className="font-bold text-sm text-foreground">Email Alerts</h4>
                    <p className="text-xs text-muted-foreground mt-1">Receive daily summaries and critical system alerts via email.</p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ${emailAlerts ? 'bg-primary' : 'bg-muted border border-border'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${emailAlerts ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 hook-hover transition-colors">
                  <div className="flex-1 md:pr-4">
                    <h4 className="font-bold text-sm text-foreground">SMS Notifications</h4>
                    <p className="text-xs text-muted-foreground mt-1">Get instant text messages for urgent appointment cancellations.</p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setSmsAlerts(!smsAlerts)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ${smsAlerts ? 'bg-primary' : 'bg-muted border border-border'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${smsAlerts ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSegment === "security" && (
            <div className="p-8 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-xl font-bold mb-6">Security & Access</h3>
              
              <div className="bg-muted/10 border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-6 border-b border-border bg-blue-500/5 transition-colors">
                  <div className="flex flex-col gap-1 flex-1 md:pr-4">
                    <h4 className="font-bold text-sm text-blue-500 flex items-center gap-2">
                      <span className="text-lg">🛡️</span> Two-Factor Authentication (2FA)
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your admin account.</p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`relative inline-flex h-7 w-14 flex-shrink-0 items-center rounded-full transition-colors ${twoFactor ? 'bg-blue-500' : 'bg-muted border border-border'}`}
                    >
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${twoFactor ? 'translate-x-7' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 border-b border-border transition-colors">
                  <div className="flex-1 md:pr-4 mb-4 lg:mb-0">
                    <h4 className="font-bold text-sm text-foreground block mb-1">Change Password</h4>
                    <p className="text-xs text-muted-foreground">Keep your account secure by updating your password regularly.</p>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <input type="password" placeholder="Current Password" className="w-full max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                    <input type="password" placeholder="New Password" className="w-full max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                    <input type="password" placeholder="Confirm New Password" className="w-full max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                    <button className="px-5 py-2 mt-2 bg-foreground text-background font-medium rounded-xl hover:opacity-90 transition-opacity text-sm">Update Password</button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-destructive/5 transition-colors">
                  <div className="flex-1 md:pr-4 mb-4 md:mb-0">
                    <h4 className="font-bold text-sm text-destructive block mb-1">Danger Zone</h4>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and remove all personal configurations.</p>
                  </div>
                  <div>
                    <button className="px-5 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 font-bold rounded-xl hover:bg-destructive hover:text-white transition-colors text-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

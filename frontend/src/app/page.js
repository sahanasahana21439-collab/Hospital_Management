"use client";

import { useState } from "react";

export default function Home() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setStatusMessage("Signing in...");
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hospital-management-api-7tat.onrender.com";
      const res = await fetch(`${apiUrl}/signin?email=${encodeURIComponent(email)}`, {
        method: "POST"
      });
      const data = await res.json();
      setStatusMessage(data.message || "Signed in!");
    } catch (err) {
      setStatusMessage("Failed to connect to backend");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setStatusMessage("Creating account...");
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hospital-management-api-7tat.onrender.com";
      const res = await fetch(`${apiUrl}/signup?email=${encodeURIComponent(email)}`, {
        method: "POST"
      });
      const data = await res.json();
      setStatusMessage(data.message || "Account created!");
    } catch (err) {
      setStatusMessage("Failed to connect to backend");
    }
  };

  return (
    <>
      {/* Decorative background blur elements */}
      <div className="decoration decoration-1"></div>
      <div className="decoration decoration-2"></div>

      <div className="auth-container">
        
        {/* Left Side: Information */}
        <div className="auth-info">
          <h1>Hospital Management</h1>
          <p>
            Experience the next generation of hospital management. Secure, fast, 
            and beautifully designed to keep patients and providers connected seamlessly.
          </p>
        </div>

        {/* Right Side: Forms */}
        <div className="auth-forms">
          <div className="form-toggle">
            <button 
              className={isSignIn ? "active" : ""}
              onClick={() => { setIsSignIn(true); setStatusMessage(""); }}
            >
              Sign In
            </button>
            <button 
              className={!isSignIn ? "active" : ""}
              onClick={() => { setIsSignIn(false); setStatusMessage(""); }}
            >
              Sign Up
            </button>
          </div>

          {statusMessage && (
            <div style={{ color: "#10B981", marginBottom: "1rem", fontWeight: "bold" }}>
              {statusMessage}
            </div>
          )}

          {isSignIn ? (
            <form onSubmit={handleSignIn}>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <button type="submit" className="submit-btn submit-btn-green">
                Sign In to Portal
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp}>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="Create a strong password" required />
              </div>
              <button type="submit" className="submit-btn">
                Create Account
              </button>
            </form>
          )}
        </div>

      </div>
    </>
  );
}

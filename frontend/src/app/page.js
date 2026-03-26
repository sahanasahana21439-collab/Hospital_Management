"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setStatusMessage("Signing in...");
    setIsError(false);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hospital-management-api-7tat.onrender.com";
      const res = await fetch(`${apiUrl}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatusMessage(data.message || "Signed in!");
        setIsError(false);
        localStorage.setItem("token", data.access_token);
        // Redirect to a dashboard
        router.push("/dashboard");
      } else {
        setStatusMessage(data.detail || "Sign in failed");
        setIsError(true);
      }
    } catch (err) {
      setStatusMessage("Failed to connect to backend");
      setIsError(true);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setStatusMessage("Creating account...");
    setIsError(false);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hospital-management-api-7tat.onrender.com";
      const res = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatusMessage(data.message || "Account created! Please sign in.");
        setIsError(false);
        setIsSignIn(true);
        setPassword("");
      } else {
        setStatusMessage(data.detail || "Sign up failed");
        setIsError(true);
      }
    } catch (err) {
      setStatusMessage("Failed to connect to backend");
      setIsError(true);
    }
  };

  return (
    <>
    <main className="centered-page">
      <div style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 100 }}>
        <ThemeToggle />
      </div>

      {/* Decorative background blur elements */}
      <div className="decoration decoration-1"></div>
      <div className="decoration decoration-2"></div>

      <div className="auth-container">
        
        {/* Left Side: Information */}
        <div className="auth-info">
          <h1>Supreme Hospital Management</h1>
          <p>
            Experience the next generation of supreme hospital management. Secure, fast, 
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
            <div style={{ color: isError ? "#EF4444" : "#10B981", marginBottom: "1rem", fontWeight: "bold" }}>
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
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
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
                <input 
                  type="password" 
                  placeholder="Create a strong password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="submit-btn">
                Create Account
              </button>
            </form>
          )}
        </div>

      </div>
    </main>
    </>
  );
}

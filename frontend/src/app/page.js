"use client";

import { useState } from "react";

export default function Home() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <>
      {/* Decorative background blur elements */}
      <div className="decoration decoration-1"></div>
      <div className="decoration decoration-2"></div>

      <div className="auth-container">
        
        {/* Left Side: Information */}
        <div className="auth-info">
          <h1>Nexus Health</h1>
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
              onClick={() => setIsSignIn(true)}
            >
              Sign In
            </button>
            <button 
              className={!isSignIn ? "active" : ""}
              onClick={() => setIsSignIn(false)}
            >
              Sign Up
            </button>
          </div>

          {isSignIn ? (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" required />
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
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" required />
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

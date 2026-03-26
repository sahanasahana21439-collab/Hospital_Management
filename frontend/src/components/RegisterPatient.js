'use client';

import React, { useState } from 'react';

const RegisterPatient = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: 'Male',
    contact_number: '',
    address: '',
    medical_history: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hospital-management-api-7tat.onrender.com";
      const res = await fetch(`${apiUrl}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: Add Authorization header if needed once auth is fully locked down
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess(data.message);
        onClose();
      } else {
        setError(data.detail || 'Failed to register patient');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content content-card">
        <div className="card-header">
          <h3>Register New Patient</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Full Name</label>
              <input 
                name="full_name" 
                value={formData.full_name} 
                onChange={handleChange} 
                placeholder="John Doe" 
                required 
              />
            </div>
            <div className="input-group">
              <label>Date of Birth</label>
              <input 
                type="date" 
                name="date_of_birth" 
                value={formData.date_of_birth} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label>Contact Number</label>
              <input 
                name="contact_number" 
                value={formData.contact_number} 
                onChange={handleChange} 
                placeholder="+1 234 567 890" 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Address</label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="123 Hospital St, Medical City"
              rows="2"
            />
          </div>

          <div className="input-group">
            <label>Medical History / Notes</label>
            <textarea 
              name="medical_history" 
              value={formData.medical_history} 
              onChange={handleChange} 
              placeholder="Allergies, chronic conditions..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-content {
          width: 600px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .patient-form textarea, .patient-form select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--surface);
          border: 1px solid var(--surface-border);
          border-radius: 8px;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 1rem;
          outline: none;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
        .cancel-btn {
          padding: 0.75rem 1.5rem;
          background: none;
          border: 1px solid var(--surface-border);
          color: var(--text-secondary);
          border-radius: 8px;
          cursor: pointer;
        }
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default RegisterPatient;

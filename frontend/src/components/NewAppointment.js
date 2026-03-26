'use client';

import React, { useState, useEffect } from 'react';

const NewAppointment = ({ onClose, onSuccess }) => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient_name: '',
    doctor_name: '',
    appointment_date: '',
    appointment_time: '',
    contact_number: '',
    email_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hospital-management-api-7tat.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          fetch(`${apiUrl}/patients`),
          fetch(`${apiUrl}/doctors`)
        ]);
        
        if (patientsRes.ok && doctorsRes.ok) {
          const pData = await patientsRes.json();
          const dData = await doctorsRes.json();
          setPatients(pData);
          setDoctors(dData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load patients or doctors. Please check connection.");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-fill contact/email if patient is selected from list
      if (name === 'patient_name') {
        const selectedPatient = patients.find(p => p.full_name === value);
        if (selectedPatient) {
          newData.contact_number = selectedPatient.contact_number || '';
          // email might not be in patients table if not added there, 
          // but we can assume it for now or leave as is
        }
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${apiUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess(data.message);
        onClose();
      } else {
        setError(data.detail || 'Failed to book appointment');
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
          <h3>Schedule New Appointment</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Patient Name</label>
              <input 
                name="patient_name" 
                list="patient-list"
                value={formData.patient_name} 
                onChange={handleChange} 
                placeholder="Select or type patient name" 
                required 
              />
              <datalist id="patient-list">
                {patients.map((p, i) => (
                  <option key={i} value={p.full_name} />
                ))}
              </datalist>
            </div>
            
            <div className="input-group">
              <label>Doctor Name</label>
              <select 
                name="doctor_name" 
                value={formData.doctor_name} 
                onChange={handleChange} 
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((d, i) => (
                  <option key={i} value={d.name}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Appointment Date</label>
              <input 
                type="date" 
                name="appointment_date" 
                value={formData.appointment_date} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Appointment Time</label>
              <input 
                type="time" 
                name="appointment_time" 
                value={formData.appointment_time} 
                onChange={handleChange} 
                required 
              />
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
            
            <div className="input-group">
              <label>Email ID</label>
              <input 
                type="email"
                name="email_id" 
                value={formData.email_id} 
                onChange={handleChange} 
                placeholder="patient@example.com" 
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="button" onClick={() => setFormData({
              patient_name: '',
              doctor_name: '',
              appointment_date: '',
              appointment_time: '',
              contact_number: '',
              email_id: ''
            })} className="cancel-btn">Reset</button>
            <button type="submit" className="submit-btn" disabled={loading || fetching}>
              {loading ? 'Booking...' : 'Book Appointment'}
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
        .modal-content {
          width: 650px;
          max-width: 95%;
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
        .patient-form select {
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
          margin-top: 1rem;
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

export default NewAppointment;

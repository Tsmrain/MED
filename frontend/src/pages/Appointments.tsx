import { useState } from 'react';

export default function Appointments() {
  const [appointments, setAppointments] = useState<string[]>([]);
  const [newAppointment, setNewAppointment] = useState('');

  const handleAddAppointment = () => {
    setAppointments([...appointments, newAppointment]);
    setNewAppointment('');
  };

  return (
    <div>
      <h2>Appointments</h2>
      <input
        type="text"
        placeholder="New Appointment"
        value={newAppointment}
        onChange={(e) => setNewAppointment(e.target.value)}
      />
      <button onClick={handleAddAppointment}>Add Appointment</button>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>{appointment}</li>
        ))}
      </ul>
    </div>
  );
}
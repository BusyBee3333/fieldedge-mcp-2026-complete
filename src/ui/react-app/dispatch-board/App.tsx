import React, { useState, useEffect } from 'react';
import './styles.css';

interface Appointment {
  id: string;
  jobNumber: string;
  customerName: string;
  address: string;
  type: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Technician {
  id: string;
  name: string;
  status: 'available' | 'on-job' | 'off-duty';
  appointments: Appointment[];
}

export default function App() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [unassigned, setUnassigned] = useState<Appointment[]>([]);

  useEffect(() => {
    loadDispatchData();
  }, [date]);

  const loadDispatchData = () => {
    const mockTechs: Technician[] = [
      {
        id: 'T001',
        name: 'Mike Johnson',
        status: 'on-job',
        appointments: [
          { id: 'A1', jobNumber: 'JOB-001', customerName: 'John Smith', address: '123 Main St', type: 'HVAC Repair', startTime: '09:00', endTime: '11:00', status: 'in-progress' },
          { id: 'A2', jobNumber: 'JOB-005', customerName: 'Bob Wilson', address: '456 Oak Ave', type: 'Maintenance', startTime: '13:00', endTime: '15:00', status: 'scheduled' },
        ],
      },
      {
        id: 'T002',
        name: 'Sarah Connor',
        status: 'available',
        appointments: [
          { id: 'A3', jobNumber: 'JOB-012', customerName: 'Jane Doe', address: '789 Pine Rd', type: 'Installation', startTime: '10:00', endTime: '14:00', status: 'scheduled' },
        ],
      },
      {
        id: 'T003',
        name: 'Tom Riddle',
        status: 'on-job',
        appointments: [
          { id: 'A4', jobNumber: 'JOB-008', customerName: 'Alice Johnson', address: '321 Elm St', type: 'Inspection', startTime: '08:00', endTime: '09:30', status: 'completed' },
          { id: 'A5', jobNumber: 'JOB-015', customerName: 'Charlie Brown', address: '654 Maple Dr', type: 'Repair', startTime: '11:00', endTime: '13:00', status: 'in-progress' },
        ],
      },
    ];

    const mockUnassigned: Appointment[] = [
      { id: 'U1', jobNumber: 'JOB-020', customerName: 'Diana Prince', address: '111 Hero Ln', type: 'Emergency Repair', startTime: '14:00', endTime: '16:00', status: 'unassigned' },
      { id: 'U2', jobNumber: 'JOB-021', customerName: 'Bruce Wayne', address: '222 Manor Rd', type: 'Consultation', startTime: '15:00', endTime: '16:00', status: 'unassigned' },
    ];

    setTechnicians(mockTechs);
    setUnassigned(mockUnassigned);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      case 'unassigned': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTechStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-400/10 text-green-400';
      case 'on-job': return 'bg-yellow-400/10 text-yellow-400';
      case 'off-duty': return 'bg-gray-400/10 text-gray-400';
      default: return 'bg-gray-400/10 text-gray-400';
    }
  };

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dispatch Board</h1>
              <p className="text-slate-400">Manage technician schedules and assignments</p>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Total Technicians</div>
            <div className="text-2xl font-bold">{technicians.length}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Available</div>
            <div className="text-2xl font-bold text-green-400">
              {technicians.filter(t => t.status === 'available').length}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">On Job</div>
            <div className="text-2xl font-bold text-yellow-400">
              {technicians.filter(t => t.status === 'on-job').length}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Unassigned Jobs</div>
            <div className="text-2xl font-bold text-red-400">{unassigned.length}</div>
          </div>
        </div>

        {/* Unassigned Jobs */}
        {unassigned.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
            <h3 className="text-lg font-semibold mb-4">Unassigned Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unassigned.map(job => (
                <div key={job.id} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-red-400">{job.jobNumber}</div>
                    <div className="text-sm text-slate-400">{job.startTime} - {job.endTime}</div>
                  </div>
                  <div className="text-slate-300">{job.customerName}</div>
                  <div className="text-sm text-slate-400">{job.address}</div>
                  <div className="text-sm text-slate-500 mt-2">{job.type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dispatch Grid */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-[200px_1fr] border-b border-slate-700">
              <div className="p-4 bg-slate-700 font-semibold">Technician</div>
              <div className="grid grid-cols-10 bg-slate-700">
                {timeSlots.map(time => (
                  <div key={time} className="p-2 text-center text-sm border-l border-slate-600">
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Technician Rows */}
            {technicians.map(tech => (
              <div key={tech.id} className="grid grid-cols-[200px_1fr] border-b border-slate-700">
                {/* Technician Info */}
                <div className="p-4 border-r border-slate-700">
                  <div className="font-medium mb-1">{tech.name}</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTechStatusColor(tech.status)}`}>
                    {tech.status}
                  </span>
                </div>

                {/* Timeline */}
                <div className="relative h-24 grid grid-cols-10">
                  {tech.appointments.map((apt, idx) => {
                    const startHour = parseInt(apt.startTime.split(':')[0]);
                    const endHour = parseInt(apt.endTime.split(':')[0]);
                    const startCol = startHour - 8;
                    const duration = endHour - startHour;
                    
                    return (
                      <div
                        key={apt.id}
                        className={`absolute top-2 bottom-2 rounded px-2 py-1 text-xs border-l-2 ${getStatusColor(apt.status)} bg-opacity-20`}
                        style={{
                          left: `${(startCol / 10) * 100}%`,
                          width: `${(duration / 10) * 100}%`,
                        }}
                      >
                        <div className="font-medium">{apt.jobNumber}</div>
                        <div className="truncate">{apt.customerName}</div>
                      </div>
                    );
                  })}
                  {timeSlots.map((_, i) => (
                    <div key={i} className="border-l border-slate-700"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

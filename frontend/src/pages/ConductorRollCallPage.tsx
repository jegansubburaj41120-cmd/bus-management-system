import React, { useState } from 'react';
import { Check, X, Search, ShieldCheck, UserCheck } from 'lucide-react';

interface ManifestStudent {
  id: number;
  name: string;
  regNo: string;
  dept: string;
  stopName: string;
  status: 'boarded' | 'pending' | 'absent';
}

export const ConductorRollCallPage: React.FC = () => {
  const [students, setStudents] = useState<ManifestStudent[]>([
    { id: 1, name: 'Sabari Nathan', regNo: '24MCA108', dept: 'MCA', stopName: 'Peelamedu / Hope College', status: 'boarded' },
    { id: 2, name: 'Divya R.', regNo: '24CSE042', dept: 'CSE', stopName: 'Lakshmi Mills Junction', status: 'boarded' },
    { id: 3, name: 'Karthik K.', regNo: '24ECE019', dept: 'ECE', stopName: 'Peelamedu / Hope College', status: 'pending' },
    { id: 4, name: 'Ananya S.', regNo: '24IT088', dept: 'IT', stopName: 'KMCH / Sitra Roundabout', status: 'pending' },
    { id: 5, name: 'Rahul V.', regNo: '24MECH015', dept: 'MECH', stopName: 'Gandhipuram Bus Stand', status: 'absent' },
  ]);

  const [search, setSearch] = useState('');

  const toggleStatus = (id: number, newStatus: 'boarded' | 'absent' | 'pending') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.regNo.toLowerCase().includes(search.toLowerCase()) ||
      s.stopName.toLowerCase().includes(search.toLowerCase())
  );

  const boardedCount = students.filter((s) => s.status === 'boarded').length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Boarding Manifest & Conductor Roll Call</h1>
          <p className="text-sm text-slate-500">Stop-by-stop passenger verification and digital attendance roster.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl">
            <span className="text-xs font-bold text-indigo-700">
              Boarded: <span className="font-extrabold text-indigo-900 text-sm">{boardedCount} / {students.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Roster Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, reg #, stop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Assignment: <span className="text-slate-900 font-bold">BUS-01 (Route 01 Gandhipuram)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Student</th>
                <th className="p-3">Department</th>
                <th className="p-3">Assigned Bus Stop</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-xl text-right">Quick Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.regNo}</div>
                  </td>
                  <td className="p-3 text-slate-600 font-semibold">{s.dept}</td>
                  <td className="p-3 text-slate-700 font-medium">{s.stopName}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        s.status === 'boarded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'absent'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleStatus(s.id, 'boarded')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          s.status === 'boarded'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                        title="Mark Boarded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(s.id, 'absent')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          s.status === 'absent'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                        }`}
                        title="Mark Absent"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

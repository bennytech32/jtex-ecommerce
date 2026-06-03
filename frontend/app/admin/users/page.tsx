'use client';

import React, { useState, useEffect } from 'react';
import { FiUsers, FiBriefcase, FiShield, FiStar } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') return 'bg-red-100 text-red-700';
    if (role === 'VENDOR') return 'bg-purple-100 text-purple-700';
    return 'bg-blue-100 text-blue-700'; // CUSTOMER
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Wateja & Wauzaji (CRM)</h1>
          <p className="text-sm text-gray-500">Dhibiti wateja wako, madeni, pointi za uaminifu, na wauzaji wa Marketplace.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg font-bold text-sm text-gray-700">
            <FiUsers className="text-blue-500" /> Wote ({users.length})
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg font-bold text-sm text-gray-700">
            <FiBriefcase className="text-purple-500" /> Wauzaji (Vendors)
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse font-bold">Inavuta Taarifa...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold">
                <tr>
                  <th className="px-6 py-3">Jina & Mawasiliano</th>
                  <th className="px-6 py-3">Aina ya Akaunti</th>
                  <th className="px-6 py-3">Pointi (Loyalty)</th>
                  <th className="px-6 py-3">Deni Linalodaiwa</th>
                  <th className="px-6 py-3">Tarehe ya Kujiunga</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email} • {user.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${getRoleBadge(user.role)} flex items-center w-max gap-1`}>
                        {user.role === 'ADMIN' ? <FiShield /> : null}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-[#F2A900] font-bold">
                        <FiStar /> {user.loyaltyPoints}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.debtAmount > 0 ? (
                        <span className="text-red-600 font-bold">TZS {user.debtAmount.toLocaleString()}</span>
                      ) : (
                        <span className="text-green-600 text-xs">Hakuna Deni</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
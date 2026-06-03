'use client';

import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingDown, FiTrendingUp, FiPlus, FiCheckCircle } from 'react-icons/fi';

export default function AdminFinance() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form States
  const [type, setType] = useState('EXPENSE');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const fetchFinance = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/finance');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, category, amount, description }),
      });
      if (res.ok) {
        setMessage('Muamala umerekodiwa!');
        setCategory(''); setAmount(''); setDescription('');
        fetchFinance(); // Refresh
      }
    } catch (error) {
      console.error('Error adding transaction', error);
    }
  };

  // Piga hesabu za haraka
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Usimamizi wa Fedha</h1>
          <p className="text-sm text-gray-500">Fuatilia Mapato, Matumizi, na Faida yako.</p>
        </div>
      </div>

      {/* Kadi za Hesabu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><FiTrendingUp className="text-green-500" /> Jumla ya Mapato</p>
          <h3 className="text-2xl font-black text-green-600 mt-2">TZS {totalIncome.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
          <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><FiTrendingDown className="text-red-500" /> Jumla ya Matumizi</p>
          <h3 className="text-2xl font-black text-red-600 mt-2">TZS {totalExpense.toLocaleString()}</h3>
        </div>
        <div className="bg-[#0F172A] p-6 rounded-2xl shadow-sm text-white">
          <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><FiDollarSign className="text-[#F2A900]" /> Faida / Hasara</p>
          <h3 className="text-2xl font-black text-[#F2A900] mt-2">TZS {netProfit.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FOMU YA KUWEKA MATUMIZI/MAPATO */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold mb-4 flex items-center gap-2 border-b pb-3">
            <FiPlus className="text-[#F2A900]" /> Rekodi Muamala Mpya
          </h2>
          {message && <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2"><FiCheckCircle /> {message}</div>}

          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Aina ya Muamala</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="type" value="EXPENSE" checked={type === 'EXPENSE'} onChange={() => setType('EXPENSE')} /> Matumizi
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="type" value="INCOME" checked={type === 'INCOME'} onChange={() => setType('INCOME')} /> Mapato
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Kategoria</label>
              <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder={type === 'EXPENSE' ? 'Mf: Mshahara, Umeme, Kodi' : 'Mf: Mauzo Nje, Ruzuku'} />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Kiasi (TZS)</label>
              <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder="50000" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Maelezo Ziada</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder="Maelezo ya muamala..."></textarea>
            </div>

            <button type="submit" className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-3 rounded-xl text-sm transition mt-2">
              Hifadhi Muamala
            </button>
          </form>
        </div>

        {/* JEDWALI LA MIAMALA */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Historia ya Miamala</h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 animate-pulse font-bold">Inavuta miamala...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold">
                  <tr>
                    <th className="px-6 py-3">Tarehe</th>
                    <th className="px-6 py-3">Aina</th>
                    <th className="px-6 py-3">Kategoria</th>
                    <th className="px-6 py-3">Kiasi (Tsh)</th>
                    <th className="px-6 py-3">Maelezo</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-6 py-4 text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {t.type === 'INCOME' ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold">MAPATO</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold">MATUMIZI</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold">{t.category}</td>
                      <td className={`px-6 py-4 font-black ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'INCOME' ? '+' : '-'} {t.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{t.description || '-'}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">Hakuna muamala uliorekodiwa.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
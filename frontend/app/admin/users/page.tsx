'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiBriefcase, FiShield, FiStar, FiEdit2, 
  FiUserX, FiUserCheck, FiGlobe, FiX, FiCheckCircle, FiAlertCircle 
} from 'react-icons/fi';

const translations = {
  en: {
    title: "Customers & Vendors (CRM)",
    subtitle: "Manage your customers, outstanding debts, loyalty points, and marketplace vendors.",
    tabAll: "All Users",
    tabVendors: "Vendors Only",
    thContact: "Name & Contact",
    thRole: "Account Type",
    thLoyalty: "Loyalty Points",
    thDebt: "Outstanding Debt",
    thJoined: "Join Date",
    thActions: "Actions",
    noDebt: "No Debt",
    loading: "Fetching users from live server...",
    noUsers: "No users found.",
    btnBlock: "Block",
    btnUnblock: "Unblock",
    btnEdit: "Edit",
    editTitle: "Edit User Profile",
    labelName: "Full Name",
    labelPhone: "Phone Number",
    labelLoyalty: "Loyalty Points",
    labelDebt: "Debt Amount (TZS)",
    labelRole: "Account Role",
    btnSave: "Save Changes",
    alertSuccess: "Operation completed successfully! 🔥",
    alertError: "Something went wrong updating user database."
  },
  sw: {
    title: "Wateja & Wauzaji (CRM)",
    subtitle: "Dhibiti wateja wako, madeni, pointi za uaminifu, na wauzaji wa Marketplace.",
    tabAll: "Wote",
    tabVendors: "Wauzaji pekee",
    thContact: "Jina & Mawasiliano",
    thRole: "Aina ya Akaunti",
    thLoyalty: "Pointi (Loyalty)",
    thDebt: "Deni Linalodaiwa",
    thJoined: "Tarehe ya Kujiunga",
    thActions: "Kitendo",
    noDebt: "Hakuna Deni",
    loading: "Inavuta wateja kutoka server ya live...",
    noUsers: "Hakuna watumiaji waliopatikana.",
    btnBlock: "Zuia (Block)",
    btnUnblock: "Ruhusu",
    btnEdit: "Badili",
    editTitle: "Rekebisha Wasifu wa Mteja",
    labelName: "Jina Kamili",
    labelPhone: "Namba ya Simu",
    labelLoyalty: "Pointi za Uaminifu",
    labelDebt: "Kiasi cha Deni (TZS)",
    labelRole: "Mamlaka ya Akaunti",
    btnSave: "Hifadhi Marekebisho",
    alertSuccess: "Mabadiliko yamekamilika kikamilifu! 🔥",
    alertError: "Kuna hitilafu imetokea kusave taarifa."
  }
};

export default function AdminUsers() {
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'ALL' | 'VENDOR'>('ALL'); // Fixed: Changed from 'all' to 'ALL'
  
  // Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedOrderUser] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLoyalty, setEditLoyalty] = useState(0);
  const [editDebt, setEditDebt] = useState(0);
  const [editRole, setEditRole] = useState('CUSTOMER');

  const t = translations[lang];

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
  };

  const fetchUsers = async () => {
    try {
      const url = getApiUrl();
      const res = await fetch(`${url}/api/users`, { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId: string, currentBlockStatus: boolean) => {
    try {
      const url = getApiUrl();
      const res = await fetch(`${url}/api/users/${userId}/block`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: !currentBlockStatus }),
      });
      
      if (res.ok) {
        alert(t.alertSuccess);
        fetchUsers(); 
      } else {
        alert(t.alertError);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (user: any) => {
    setSelectedOrderUser(user);
    setEditName(user.name);
    setEditPhone(user.phone || '');
    setEditLoyalty(user.loyaltyPoints || 0);
    setEditDebt(user.debtAmount || 0);
    setEditRole(user.role || 'CUSTOMER');
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = getApiUrl();
      const res = await fetch(`${url}/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          loyaltyPoints: Number(editLoyalty),
          debtAmount: Number(editDebt),
          role: editRole
        }),
      });

      if (res.ok) {
        alert(t.alertSuccess);
        setIsEditOpen(false);
        fetchUsers();
      } else {
        alert(t.alertError);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') return 'bg-red-50 text-red-700 border border-red-200';
    if (role === 'VENDOR') return 'bg-purple-50 text-purple-700 border border-purple-200';
    return 'bg-blue-50 text-blue-700 border border-blue-200'; 
  };

  const displayedUsers = users.filter(u => {
    if (filterTab === 'VENDOR') return u.role === 'VENDOR';
    return true;
  });

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{t.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
        </div>
        <button 
          onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-[#0F172A] w-max shadow-sm hover:bg-gray-50 transition"
        >
          <FiGlobe /> {t.switchLang}
        </button>
      </div>

      {/* TABS FILTER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-3 border-b border-gray-100 flex gap-2 bg-gray-50/30">
          <button 
            onClick={() => setFilterTab('ALL')} // Fixed: Changed from 'all' to 'ALL'
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${filterTab === 'ALL' ? 'bg-[#0F172A] text-[#F2A900] shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FiUsers /> {t.tabAll} ({users.length})
          </button>
          <button 
            onClick={() => setFilterTab('VENDOR')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${filterTab === 'VENDOR' ? 'bg-[#0F172A] text-[#F2A900] shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FiBriefcase /> {t.tabVendors} ({users.filter(u => u.role === 'VENDOR').length})
          </button>
        </div>

        {isLoading ? (
          <div className="p-16 text-center text-gray-500 animate-pulse font-bold tracking-wider">{t.loading}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-black tracking-wider border-b">
                <tr>
                  <th className="px-6 py-4">{t.thContact}</th>
                  <th className="px-6 py-4">{t.thRole}</th>
                  <th className="px-6 py-4 text-center">{t.thLoyalty}</th>
                  <th className="px-6 py-4">{t.thDebt}</th>
                  <th className="px-6 py-4">{t.thJoined}</th>
                  <th className="px-6 py-4 text-right">{t.thActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedUsers.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50/50 transition ${user.isBlocked ? 'bg-red-50/30 opacity-70' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 text-base">{user.name}</p>
                        {user.isBlocked && <span className="bg-red-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">BLOCKED</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{user.email} • <span className="text-gray-700 font-bold">{user.phone || 'N/A'}</span></p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${getRoleBadge(user.role)} flex items-center w-max gap-1`}>
                        {user.role === 'ADMIN' ? <FiShield className="text-red-500" /> : null}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[#F2A900] bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200 text-xs font-black">
                        <FiStar className="fill-[#F2A900] text-[10px]" /> {user.loyaltyPoints || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black">
                      {user.debtAmount > 0 ? (
                        <span className="text-red-600 text-base">TZS {user.debtAmount.toLocaleString()}</span>
                      ) : (
                        <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded font-bold border border-green-100">{t.noDebt}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 border border-blue-200 bg-blue-50 px-2.5 py-1.5 rounded-lg text-xs font-black hover:bg-blue-600 hover:text-white transition flex items-center gap-1 shadow-sm"
                        >
                          <FiEdit2 size={12} /> {t.btnEdit}
                        </button>
                        <button 
                          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 shadow-sm border ${
                            user.isBlocked 
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-600 hover:text-white' 
                              : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white'
                          }`}
                        >
                          {user.isBlocked ? <FiUserCheck size={12} /> : <FiUserX size={12} />}
                          {user.isBlocked ? t.btnUnblock : t.btnBlock}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {displayedUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-gray-400 font-bold">
                      {t.noUsers}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT USER PROFILE MODAL */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-fade-in border-t-8 border-[#0F172A]">
            <button 
              onClick={() => setIsEditOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition"
            >
              <FiX size={16} />
            </button>
            
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <h3 className="text-xl font-black text-gray-900 pb-2 border-b">{t.editTitle}</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.labelName}</label>
                <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F2A900]/50" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.labelPhone}</label>
                <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F2A900]/50" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.labelLoyalty}</label>
                  <input type="number" value={editLoyalty} onChange={e => setEditLoyalty(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F2A900]/50 font-bold text-gray-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.labelDebt}</label>
                  <input type="number" value={editDebt} onChange={e => setEditDebt(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F2A900]/50 font-bold text-red-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.labelRole}</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#F2A900]/50 cursor-pointer">
                  <option value="CUSTOMER">CUSTOMER (Mteja wa Kawaida)</option>
                  <option value="VENDOR">VENDOR (Muuzaji Marketplace)</option>
                  <option value="ADMIN">ADMIN (Msimamizi Mkuu)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-black py-3.5 rounded-xl text-sm transition mt-2 shadow-md">
                {t.btnSave}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
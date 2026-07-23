'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiGrid, FiPlus, FiFolder, FiBox, FiTrash2, 
  FiEdit2, FiMoreVertical, FiAlertCircle, FiCheckCircle, FiSearch, FiLayers 
} from 'react-icons/fi';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch(`${API_URL}/api/categories`).catch(() => ({ ok: false, json: () => [] })),
        fetch(`${API_URL}/api/products`).catch(() => ({ ok: false, json: () => [] }))
      ]);

      if (catRes.ok) setCategories(await catRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [API_URL]);

  // --- HESABU ZA KATEGORIA (REAL DATA) ---
  const enrichedCategories = categories.map(cat => {
    const productCount = products.filter(p => p.category === cat.name || p.category === cat.id).length;
    return { ...cat, productCount };
  });

  const filteredCategories = enrichedCategories.filter(cat => 
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCategories = categories.length;
  const activeCategories = enrichedCategories.filter(c => c.productCount > 0).length;
  const emptyCategories = totalCategories - activeCategories;

  // --- ACTIONS ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim() })
      });
      
      if (res.ok) {
        setMessage('Category created successfully!');
        setNewCatName('');
        setIsModalOpen(false);
        fetchData(); // Refresh data
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errData = await res.json();
        alert(`Kosa: ${errData.error || 'Imeshindwa kuhifadhi'}`);
      }
    } catch (err) {
      alert("Kosa la mtandao. Jaribu tena.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Category deleted successfully!');
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert("Server haijatengenezwa route ya Kufuta (DELETE /api/categories/:id) bado.");
      }
    } catch (error) {
      alert("Kosa la mtandao.");
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500 tracking-wider">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">Store Structure</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Categories Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Organize your store layout and track product distribution across categories.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0A101D] hover:bg-gray-800 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
        >
          <FiPlus size={16} /> Create Category
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-2xl flex items-center gap-2 font-bold shadow-sm border border-emerald-100 animate-fade-in">
          <FiCheckCircle size={18} /> {message}
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Total Categories</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{totalCategories}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <FiGrid size={20} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Active Categories</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{activeCategories}</h3>
            <span className="text-[10px] font-bold text-emerald-600 mt-1 block">Contains products</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <FiLayers size={20} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Empty Categories</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{emptyCategories}</h3>
            <span className="text-[10px] font-bold text-amber-600 mt-1 block">Needs inventory</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <FiAlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* CATEGORIES TABLE AREA */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <h3 className="font-black text-base text-gray-900">All Categories</h3>
          
          <div className="relative max-w-sm w-full">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#F2A900] shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6">Products Listed</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat, idx) => (
                  <tr key={cat.id || idx} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <FiFolder size={18} />
                        </div>
                        <span className="text-sm font-black text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <FiBox className="text-gray-400" /> {cat.productCount} Items
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {cat.productCount > 0 ? (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">Empty</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-xs text-gray-400 font-medium">
                    <FiFolder size={40} className="mx-auto text-gray-200 mb-3" />
                    No categories found. Click 'Create Category' to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE CATEGORY MODAL (POP-UP) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0A101D]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2"><FiPlus className="text-blue-500"/> New Category</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition"
              >
                <FiX size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCategory} className="p-6 space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2">Category Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={newCatName} 
                  onChange={e => setNewCatName(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-bold text-gray-900 focus:border-blue-500 transition shadow-sm" 
                  placeholder="e.g. Laptops, Solar Panels..." 
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving || !newCatName.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl text-sm transition shadow-md disabled:bg-blue-300 flex justify-center items-center gap-2"
                >
                  {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
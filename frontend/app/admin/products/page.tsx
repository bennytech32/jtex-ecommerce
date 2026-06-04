'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiBox, FiDatabase, FiAlertTriangle, FiCheckCircle, FiImage, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Form States (Kwa ajili ya kuweka bidhaa mpya)
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Elektroniki');
  const [brand, setBrand] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Edit States
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);

  const API_URL = 'https://jtex-ecommerce-production.up.railway.app';

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- KAZI ZA PICHA ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      
      if (isEdit) {
        setEditImageFiles(prev => [...prev, ...filesArray]);
        setEditImagePreviews(prev => [...prev, ...newPreviews]);
      } else {
        setImageFiles(prev => [...prev, ...filesArray]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
      }
    }
  };

  const removeImage = (indexToRemove: number, isEdit: boolean = false) => {
    if (isEdit) {
      setEditImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
      setEditImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    } else {
      setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
      setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    }
  };

  // --- KUWEKA BIDHAA MPYA (ADD) ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');

    const formData = new FormData();
    formData.append('sku', sku); formData.append('name', name);
    formData.append('category', category); formData.append('brand', brand);
    formData.append('buyingPrice', buyingPrice); formData.append('price', price);
    formData.append('stockQuantity', stockQuantity); formData.append('specifications', specifications);
    
    imageFiles.forEach((file) => formData.append('images', file));

    try {
      const res = await fetch(`${API_URL}/api/products`, { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setMessage('Bidhaa imeongezwa kikamilifu!');
        setSku(''); setName(''); setBrand(''); setBuyingPrice(''); setPrice(''); setStockQuantity(''); setSpecifications('');
        setImageFiles([]); setImagePreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchProducts();
      } else {
        setError(data.error || 'Imeshindwa kuweka bidhaa.');
      }
    } catch (err) {
      setError('Tatizo la mtandao au server imekataa mawasiliano.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- KUFUTA BIDHAA (DELETE) ---
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Una uhakika unataka kufuta bidhaa hii? Kitendo hiki hakirudishwi nyuma!")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Bidhaa imefutwa kikamilifu!');
        fetchProducts();
      } else {
        setError('Imeshindwa kufuta bidhaa.');
      }
    } catch (err) {
      setError('Tatizo la mtandao wakati wa kufuta.');
    }
  };

  // --- KUFUNGUA MODAL YA KUEDIT ---
  const openEditModal = (product: any) => {
    setEditingProduct({ ...product });
    setEditImageFiles([]);
    // Weka picha ya zamani kama preview (Kama ipo)
    setEditImagePreviews(product.imageUrl ? [`${API_URL}${product.imageUrl}`] : []);
  };

  // --- KUHIFADHI MABADILIKO YA EDIT (UPDATE) ---
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');

    const formData = new FormData();
    formData.append('sku', editingProduct.sku); formData.append('name', editingProduct.name);
    formData.append('category', editingProduct.category); formData.append('brand', editingProduct.brand);
    formData.append('buyingPrice', editingProduct.buyingPrice); formData.append('price', editingProduct.price);
    formData.append('stockQuantity', editingProduct.stockQuantity); formData.append('specifications', editingProduct.specifications);
    
    // Tuma picha mpya tu kama zipo
    editImageFiles.forEach((file) => formData.append('images', file));

    try {
      const res = await fetch(`${API_URL}/api/products/${editingProduct.id}`, { method: 'PUT', body: formData });
      if (res.ok) {
        setMessage('Bidhaa imesasishwa (Updated) kikamilifu!');
        setEditingProduct(null);
        fetchProducts();
      } else {
        const data = await res.json();
        setError(data.error || 'Imeshindwa kusasisha bidhaa.');
      }
    } catch (err) {
      setError('Tatizo la mtandao au server imekataa mawasiliano.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Bidhaa & Inventory</h1>
          <p className="text-sm text-gray-500">Dhibiti stock, SKU, picha na bei za bidhaa zako.</p>
        </div>
      </div>

      {message && <div className="mb-4 p-4 bg-green-50 text-green-600 text-sm rounded-xl flex items-center gap-2 font-bold shadow-sm"><FiCheckCircle className="text-lg" /> {message}</div>}
      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 font-bold shadow-sm"><FiAlertTriangle className="text-lg" /> {error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FOMU YA KUONGEZA BIDHAA (ADD NEW) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-max">
          <h2 className="font-bold mb-4 flex items-center gap-2 border-b pb-3">
            <FiPlus className="text-[#F2A900]" /> Weka Bidhaa Mpya
          </h2>

          <form onSubmit={handleAddProduct} className="space-y-4">
            {/* Picha Upload */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Picha za Bidhaa</label>
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"><FiX className="text-xs" /></button>
                    </div>
                  ))}
                </div>
              )}
              <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, false)} ref={fileInputRef} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F2A900]/10 file:text-[#0F172A] hover:file:bg-[#F2A900]/20 transition cursor-pointer" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">SKU</label>
                <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2"><FiDatabase className="text-gray-400 mr-2" /><input type="text" required value={sku} onChange={e => setSku(e.target.value)} className="w-full bg-transparent outline-none text-sm" placeholder="SKU-001" /></div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Stock</label>
                <input type="number" required value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder="50" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Jina la Bidhaa</label>
              <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2"><FiBox className="text-gray-400 mr-2" /><input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm" placeholder="Mf: iPhone 15 Pro" /></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Kategoria</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-medium">
                  <option value="Elektroniki">Elektroniki</option><option value="Nguo">Nguo</option><option value="Viatu">Viatu</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Brand</label>
                <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder="Apple" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Bei ya Kununua</label>
                <input type="number" value={buyingPrice} onChange={e => setBuyingPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-black" placeholder="2000000" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Bei ya Kuuza</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-black text-[#0F172A]" placeholder="2500000" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Sifa Ziada (JSON)</label>
              <textarea value={specifications} onChange={e => setSpecifications(e.target.value)} rows={2} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-mono" placeholder='{"RAM": "8GB"}'></textarea>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-sm transition mt-4 shadow-md">
              {isLoading ? 'Inasindika...' : 'Hifadhi Bidhaa'}
            </button>
          </form>
        </div>

        {/* ORODHA YA BIDHAA NA STOCK (TABLE) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold">Orodha ya Inventory</h2>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">Jumla: {products.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-4">Picha & SKU</th>
                  <th className="px-4 py-4">Bidhaa</th>
                  <th className="px-4 py-4">Bei (Tsh)</th>
                  <th className="px-4 py-4">Stock</th>
                  <th className="px-4 py-4 text-center">Vitendo</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 flex items-center gap-3">
                      {p.imageUrl ? ( <img src={`${API_URL}${p.imageUrl}`} className="w-10 h-10 object-cover rounded border border-gray-200 bg-white" /> ) : ( <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl">{p.imageEmoji || '📦'}</div> )}
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{p.sku}</span>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-800">{p.name} <br/><span className="text-[10px] uppercase text-gray-400 font-bold">{p.category}</span></td>
                    <td className="px-4 py-4 text-[#0F172A] font-black">{p.price.toLocaleString()}</td>
                    <td className="px-4 py-4 font-bold">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider ${p.stockQuantity > 5 ? 'bg-green-100 text-green-700' : p.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stockQuantity} Pcs
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {/* VIBONYEZO VYA EDIT NA DELETE */}
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(p)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition" title="Edit">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition" title="Delete">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium">Hakuna bidhaa kwenye Database.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL YA KUEDIT BIDHAA */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-black flex items-center gap-2"><FiEdit2 className="text-blue-500" /> Hariri Bidhaa</h2>
              <button onClick={() => setEditingProduct(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"><FiX size={20} /></button>
            </div>
            
            <form onSubmit={handleUpdateProduct} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Badili au Ongeza Picha</label>
                {editImagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img src={preview} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <button type="button" onClick={() => removeImage(index, true)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><FiX className="text-xs" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, true)} ref={editFileInputRef} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition cursor-pointer" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-500 mb-1">SKU</label><input type="text" value={editingProduct.sku} onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Stock</label><input type="number" value={editingProduct.stockQuantity} onChange={e => setEditingProduct({...editingProduct, stockQuantity: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              </div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Jina</label><input type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Bei Kununua</label><input type="number" value={editingProduct.buyingPrice} onChange={e => setEditingProduct({...editingProduct, buyingPrice: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Bei Kuuza</label><input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              </div>

              <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200">Ghairi</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-md">
                  {isLoading ? 'Inasasisha...' : 'Hifadhi Mabadiliko'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
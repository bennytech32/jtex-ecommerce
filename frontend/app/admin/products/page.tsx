'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiBox, FiDatabase, FiAlertTriangle, FiCheckCircle, FiImage } from 'react-icons/fi';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Nguo');
  const [brand, setBrand] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [specifications, setSpecifications] = useState('');
  
  // State kwa ajili ya faili la Picha Moja
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // LINK YA MTANDAONI
  const API_URL = 'https://jtex-ecommerce-production.up.railway.app';

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('sku', sku);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('buyingPrice', buyingPrice);
    formData.append('price', price);
    formData.append('stockQuantity', stockQuantity);
    formData.append('specifications', specifications);
    
    // TUNAITUMA KAMA 'image' ILI BACKEND IKUBALI
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Bidhaa imeongezwa kikamilifu!');
        setSku(''); setName(''); setBrand(''); setBuyingPrice(''); setPrice(''); setStockQuantity(''); setSpecifications('');
        setImageFile(null); setImagePreview(null);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Bidhaa & Inventory</h1>
          <p className="text-sm text-gray-500">Dhibiti stock, SKU, picha na bei za bidhaa zako.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FOMU YA KUONGEZA BIDHAA */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold mb-4 flex items-center gap-2 border-b pb-3">
            <FiPlus className="text-[#F2A900]" /> Weka Bidhaa Mpya
          </h2>

          {message && <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2"><FiCheckCircle /> {message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2"><FiAlertTriangle /> {error}</div>}

          <form onSubmit={handleAddProduct} className="space-y-4">
            
            {/* SEHEMU YA KUWEKA PICHA */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Picha ya Bidhaa</label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <FiImage className="text-gray-400 text-2xl" />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F2A900]/10 file:text-[#0F172A] hover:file:bg-[#F2A900]/20 transition cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Namba ya SKU</label>
                <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2">
                  <FiDatabase className="text-gray-400 mr-2" />
                  <input type="text" required value={sku} onChange={e => setSku(e.target.value)} className="w-full bg-transparent outline-none text-sm" placeholder="SKU-001" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Idadi (Stock)</label>
                <input type="number" required value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder="50" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Jina la Bidhaa</label>
              <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2">
                <FiBox className="text-gray-400 mr-2" />
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm" placeholder="Mf: iPhone 15 Pro" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Kategoria</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm">
                  <option value="Elektroniki">Elektroniki</option>
                  <option value="Nguo">Nguo</option>
                  <option value="Viatu">Viatu</option>
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
                <input type="number" value={buyingPrice} onChange={e => setBuyingPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder="2000000" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Bei ya Kuuza</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder="2500000" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Sifa Ziada (JSON)</label>
              <textarea 
                value={specifications} 
                onChange={e => setSpecifications(e.target.value)} 
                rows={2} 
                className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" 
                placeholder='{"RAM": "8GB", "Storage": "256GB"}'
              ></textarea>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-3 rounded-xl text-sm transition mt-4">
              {isLoading ? 'Inaweka...' : 'Hifadhi Bidhaa'}
            </button>
          </form>
        </div>

        {/* ORODHA YA BIDHAA NA STOCK */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold">Orodha ya Inventory</h2>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">Jumla: {products.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold">
                <tr>
                  <th className="px-6 py-3">Picha & SKU</th>
                  <th className="px-6 py-3">Bidhaa</th>
                  <th className="px-6 py-3">Bei (Tsh)</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Hali</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {p.imageUrl ? (
                        <img src={`${API_URL}${p.imageUrl}`} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">{p.imageEmoji}</div>
                      )}
                      <span className="font-mono text-xs text-gray-500">{p.sku}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">{p.name} <br/><span className="text-xs text-gray-400 font-normal">{p.category}</span></td>
                    <td className="px-6 py-4 text-green-600 font-bold">{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold">{p.stockQuantity}</td>
                    <td className="px-6 py-4">
                      {p.stockQuantity > (p.lowStockAlert || 5) ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold">In Stock</span>
                      ) : p.stockQuantity > 0 ? (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold">Low Stock</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold">Out of Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">Hakuna bidhaa zilizowekwa bado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
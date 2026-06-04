'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiBox, FiDatabase, FiAlertTriangle, FiCheckCircle, FiImage, FiX } from 'react-icons/fi';

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
  
  // State kwa ajili ya faili za Picha Nyingi (Multiple Photos)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // LINK YA MTANDAONI (HARDCODED KUONDOA LOCALHOST)
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

  // Kazi ya kupokea picha nyingi
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      
      // Hifadhi faili zenyewe
      setImageFiles(prev => [...prev, ...filesArray]);
      
      // Tengeneza link za muda ili kuzitazama (Previews)
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Kazi ya kufuta picha uliyokosea kuweka
  const removeImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
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
    
    // Tuma picha zote kwenye FormData chini ya jina 'images'
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file); 
      });
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
        setImageFiles([]); setImagePreviews([]); // Safisha picha
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchProducts(); // Vuta upya orodha ya bidhaa
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

          {message && <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2 font-bold"><FiCheckCircle /> {message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 font-bold"><FiAlertTriangle /> {error}</div>}

          <form onSubmit={handleAddProduct} className="space-y-4">
            
            {/* SEHEMU YA KUWEKA PICHA NYINGI */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Picha za Bidhaa (Zinazoruhusiwa ni nyingi)</label>
              
              {/* Orodha ya Picha Zilizochaguliwa */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} alt={`Preview ${index}`} className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <FiX className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*"
                  multiple // HII INARUHUSU KUCHAGUA PICHA NYINGI
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
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-medium">
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
                <input type="number" value={buyingPrice} onChange={e => setBuyingPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-black" placeholder="2000000" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Bei ya Kuuza</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-black text-[#0F172A]" placeholder="2500000" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Sifa Ziada (JSON)</label>
              <textarea 
                value={specifications} 
                onChange={e => setSpecifications(e.target.value)} 
                rows={2} 
                className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-mono" 
                placeholder='{"RAM": "8GB", "Storage": "256GB"}'
              ></textarea>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-sm transition mt-4 shadow-md">
              {isLoading ? 'Inaweka Bidhaa...' : 'Hifadhi Bidhaa'}
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
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Picha & SKU</th>
                  <th className="px-6 py-4">Bidhaa</th>
                  <th className="px-6 py-4">Bei (Tsh)</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Hali</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {p.imageUrl ? (
                        <img src={`${API_URL}${p.imageUrl}`} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-white" />
                      ) : p.imageUrls && p.imageUrls.length > 0 ? (
                        <img src={`${API_URL}${p.imageUrls[0]}`} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-white" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl border border-gray-200">{p.imageEmoji || '📦'}</div>
                      )}
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{p.sku}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">{p.name} <br/><span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">{p.category}</span></td>
                    <td className="px-6 py-4 text-[#0F172A] font-black">{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-600">{p.stockQuantity}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        p.stockQuantity > (p.lowStockAlert || 5) ? 'bg-green-100 text-green-700' : 
                        p.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {p.stockQuantity > (p.lowStockAlert || 5) ? 'In Stock' : p.stockQuantity > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">Hakuna bidhaa zilizowekwa bado kwenye Database mpya.</td>
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
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiBox, FiDatabase, FiAlertTriangle, FiCheckCircle, FiImage, FiX, FiEdit2, FiTrash2, FiSettings, FiTag } from 'react-icons/fi';

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
  const [category, setCategory] = useState('Electronics'); // Default English
  const [brand, setBrand] = useState('');
  const [badge, setBadge] = useState(''); 
  const [condition, setCondition] = useState('Brand New');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [specData, setSpecData] = useState<any>({}); 
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Edit States
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editSpecData, setEditSpecData] = useState<any>({});
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);

  const API_URL = 'https://jtex-ecommerce-production.up.railway.app';

  // Orodha rasmi ya kategoria za sasa
  const STANDARD_CATEGORIES = [
    "Electronics", "Computers", "Monitors", "Printers", "Accessories", 
    "Phones", "Smartwatches", "Headphones", "Clothing", "Shoes", 
    "Home & Kitchen", "Beauty", "Other"
  ];

  // --- AUTO SKU GENERATOR ---
  useEffect(() => {
    if (name && category && !editingProduct) {
      const prefix = category.substring(0, 3).toUpperCase();
      const namePart = name.substring(0, 3).toUpperCase();
      const randomId = Math.floor(1000 + Math.random() * 9000);
      setSku(`${prefix}-${namePart}-${randomId}`);
    }
  }, [name, category, editingProduct]);

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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>, isEdit: boolean = false) => {
    const val = e.target.value;
    if (isEdit) {
      setEditingProduct({ ...editingProduct, category: val });
      setEditSpecData({});
    } else {
      setCategory(val);
      setSpecData({});
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (files) {
      let filesArray = Array.from(files);
      
      if (isEdit) {
        const spaceLeft = 5 - editImageFiles.length;
        if (filesArray.length > spaceLeft) {
          alert(`Mwisho ni picha 5. Unaweza kuongeza picha ${spaceLeft} tu.`);
          filesArray = filesArray.slice(0, spaceLeft);
        }
        const newPreviews = filesArray.map(file => URL.createObjectURL(file));
        setEditImageFiles(prev => [...prev, ...filesArray]);
        setEditImagePreviews(prev => [...prev, ...newPreviews]);
      } else {
        const spaceLeft = 5 - imageFiles.length;
        if (filesArray.length > spaceLeft) {
          alert(`Mwisho ni picha 5. Unaweza kuongeza picha ${spaceLeft} tu.`);
          filesArray = filesArray.slice(0, spaceLeft);
        }
        const newPreviews = filesArray.map(file => URL.createObjectURL(file));
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');

    const formData = new FormData();
    formData.append('sku', sku); 
    formData.append('name', name);
    formData.append('category', category); 
    formData.append('brand', brand);
    formData.append('badge', badge); 
    formData.append('condition', condition);
    formData.append('buyingPrice', buyingPrice); 
    formData.append('price', price);
    formData.append('stockQuantity', stockQuantity); 
    formData.append('specifications', JSON.stringify(specData));
    
    imageFiles.forEach((file) => formData.append('images', file));

    try {
      const res = await fetch(`${API_URL}/api/products`, { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setMessage('Bidhaa imeongezwa kikamilifu!');
        setSku(''); setName(''); setBrand(''); setBadge(''); setCondition('Brand New'); setBuyingPrice(''); setPrice(''); setStockQuantity(''); setSpecData({});
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

  // --- KIPENGELE KILICHOBORESHWA KWA AJILI YA KUFUTA BIDHAA ---
  const handleDeleteProduct = async (id: string | number) => {
    if (!window.confirm("Una uhakika unataka kufuta bidhaa hii? Kitendo hiki hakirudishwi nyuma!")) return;
    
    setError('');
    setMessage('');
    
    try {
      const cleanId = String(id);
      
      // Tumeondoa headers zisizo za lazima ambazo wakati mwingine zinasababisha CORS kufeli kwenye DELETE
      const res = await fetch(`${API_URL}/api/products/${cleanId}`, { 
        method: 'DELETE'
      });
      
      if (res.ok) {
        setMessage('Bidhaa imefutwa kikamilifu!');
        fetchProducts(); 
      } else {
        // Tunasoma error kama 'text' ya kawaida kwanza badala ya kulazimisha iwe JSON
        const errorText = await res.text();
        console.error("Delete Error Raw Response:", errorText);
        
        let errorMsg = res.statusText || 'Server imekataa (Huenda bidhaa hii ipo kwenye rekodi za mauzo au kikapu).';
        try {
          // Tunajaribu kuibadili iwe JSON kama inawezekana
          const parsed = JSON.parse(errorText);
          if (parsed.error) errorMsg = parsed.error;
        } catch(e) {
          // Kama sio JSON, na ni ujumbe mfupi, tunautumia
          if (errorText && errorText.length < 150) errorMsg = errorText;
        }

        setError(`Imeshindwa kufuta: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error("Delete Catch Error:", err);
      setError(`Tatizo la mtandao: ${err.message}`);
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct({ ...product });
    setEditImageFiles([]);
    setEditImagePreviews(product.imageUrl ? [`${API_URL}${product.imageUrl}`] : []);
    
    if (product.specifications) {
      try {
        setEditSpecData(JSON.parse(product.specifications));
      } catch (e) {
        setEditSpecData({});
      }
    } else {
      setEditSpecData({});
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');

    const formData = new FormData();
    formData.append('sku', editingProduct.sku); 
    formData.append('name', editingProduct.name);
    formData.append('category', editingProduct.category); 
    formData.append('brand', editingProduct.brand);
    formData.append('badge', editingProduct.badge || ''); 
    formData.append('condition', editingProduct.condition || 'Brand New');
    formData.append('buyingPrice', editingProduct.buyingPrice); 
    formData.append('price', editingProduct.price);
    formData.append('stockQuantity', editingProduct.stockQuantity); 
    formData.append('specifications', JSON.stringify(editSpecData));
    
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

  // --- DYNAMIC SPECIFICATIONS UI RENDERER ---
  const renderDynamicSpecs = (cat: string, currentState: any, setState: any) => {
    let fields: string[] = [];
    const normalizedCat = cat ? cat.toLowerCase() : '';

    if (normalizedCat.includes('computer') || normalizedCat.includes('laptop') || normalizedCat.includes('pc')) {
      fields = ['RAM', 'Storage', 'Processor', 'Generation', 'Graphics', 'Display Size', 'Resolution', 'OS', 'Color'];
    } else if (normalizedCat.includes('monitor')) {
      fields = ['Display Size', 'Resolution', 'Refresh Rate (Hz)', 'Panel Type', 'Ports'];
    } else if (normalizedCat.includes('printer')) {
      fields = ['Printer Type', 'Print Speed', 'Color Output', 'Connectivity', 'Paper Size'];
    } else if (normalizedCat.includes('accessor')) {
      fields = ['Connection Type', 'Compatibility', 'Color', 'Features'];
    } else if (normalizedCat.includes('smartwatch') || normalizedCat.includes('watch')) {
      fields = ['Screen Size', 'Battery Life', 'Water Resistance', 'OS Compatibility', 'Color'];
    } else if (normalizedCat.includes('phone') || normalizedCat.includes('mobile') || normalizedCat.includes('tablet')) {
      fields = ['RAM', 'Storage', 'Processor', 'Display Size', 'Battery', 'Camera', 'OS', 'Color'];
    } else if (normalizedCat.includes('headphone') || normalizedCat.includes('audio') || normalizedCat.includes('speaker')) {
      fields = ['Color', 'Battery Life', 'Bluetooth Version', 'Noise Cancellation'];
    } else if (normalizedCat.includes('electronic') || normalizedCat.includes('elektroniki')) { 
      fields = ['Power (Watts)', 'Voltage', 'Color', 'Warranty', 'Weight'];
    } else if (normalizedCat.includes('cloth') || normalizedCat.includes('fashion') || normalizedCat.includes('clothing')) {
      fields = ['Size', 'Color', 'Material', 'Gender'];
    } else if (normalizedCat.includes('shoe')) {
      fields = ['Shoe Size', 'Color', 'Material', 'Brand Fit'];
    } else if (normalizedCat.includes('kitchen') || normalizedCat.includes('home')) {
      fields = ['Material', 'Power (Watts)', 'Color', 'Dimensions'];
    } else {
      fields = ['Feature 1', 'Feature 2', 'Color', 'Weight'];
    }

    return (
      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 mt-2">
        <h3 className="text-xs font-black text-gray-700 mb-3 flex items-center gap-2"><FiSettings/> {cat} Specifications</h3>
        <div className="grid grid-cols-2 gap-3">
          {fields.map(field => (
            <div key={field}>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{field}</label>
              <input 
                type="text" 
                value={currentState[field] || ''} 
                onChange={e => setState({...currentState, [field]: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F2A900] transition" 
                placeholder={`Weka ${field}`} 
              />
            </div>
          ))}
        </div>
      </div>
    );
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
            
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Picha za Bidhaa (Mwisho 5)</label>
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
              {imageFiles.length < 5 && (
                <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, false)} ref={fileInputRef} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F2A900]/10 file:text-[#0F172A] hover:file:bg-[#F2A900]/20 transition cursor-pointer" />
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Jina la Bidhaa</label>
              <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2"><FiBox className="text-gray-400 mr-2" /><input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm" placeholder="Mf: HP LaserJet Pro / iPhone 15" /></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Kategoria</label>
                <select value={category} onChange={(e) => handleCategoryChange(e, false)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-medium">
                  {STANDARD_CATEGORIES.map(catOpt => (
                    <option key={catOpt} value={catOpt}>{catOpt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Brand</label>
                <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder="Apple / HP / Dell" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">SKU (Auto-Generated)</label>
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg px-3 py-2"><FiDatabase className="text-gray-400 mr-2" /><input type="text" required value={sku} onChange={e => setSku(e.target.value)} className="w-full bg-transparent outline-none text-sm text-gray-600" placeholder="SKU-001" /></div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Stock</label>
                <input type="number" required value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder="50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><FiTag className="text-[#F2A900]"/> Badge</label>
                <select value={badge} onChange={e => setBadge(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-medium">
                  <option value="">Hakuna</option>
                  <option value="Hot">🔥 Hot</option>
                  <option value="Sale">🏷️ Sale</option>
                  <option value="New">✨ New Arrival</option>
                  <option value="Clearance">📦 Clearance</option>
                  <option value="Top Rated">⭐ Top Rated</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Condition</label>
                <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-medium">
                  <option value="Brand New">Brand New</option>
                  <option value="Refurbished">Refurbished</option>
                  <option value="Used">Used</option>
                </select>
              </div>
            </div>

            {/* DYNAMIC SPECIFICATIONS UI */}
            <div>
              {renderDynamicSpecs(category, specData, setSpecData)}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Bei ya Kununua</label>
                <input type="number" value={buyingPrice} onChange={e => setBuyingPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-black" placeholder="200000" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Bei ya Kuuza</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-black text-[#0F172A]" placeholder="250000" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-sm transition mt-4 shadow-md">
              {isLoading ? 'Inasindika...' : 'Hifadhi Bidhaa'}
            </button>
          </form>
        </div>

        {/* ORODHA YA BIDHAA NA STOCK (TABLE) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-max">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold">Orodha ya Inventory</h2>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">Jumla: {products.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-4">Picha & SKU</th>
                  <th className="px-4 py-4">Bidhaa & Taarifa</th>
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
                    <td className="px-4 py-4 font-bold text-gray-800">
                      {p.name} 
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                         <span className="text-[9px] uppercase text-gray-400 font-bold bg-gray-100 px-1.5 py-0.5 rounded">{p.category}</span>
                         {p.badge && <span className="text-[9px] uppercase text-[#F2A900] font-black bg-yellow-50 px-1.5 py-0.5 rounded">{p.badge}</span>}
                         {p.condition && <span className="text-[9px] uppercase text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">{p.condition}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#0F172A] font-black">{p.price.toLocaleString()}</td>
                    <td className="px-4 py-4 font-bold">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider ${p.stockQuantity > 5 ? 'bg-green-100 text-green-700' : p.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stockQuantity} Pcs
                      </span>
                    </td>
                    <td className="px-4 py-4">
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
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Badili au Ongeza Picha (Mwisho 5)</label>
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
                {editImagePreviews.length < 5 && (
                  <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, true)} ref={editFileInputRef} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition cursor-pointer" />
                )}
              </div>

              <div><label className="block text-xs font-bold text-gray-500 mb-1">Jina la Bidhaa</label><input type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Kategoria</label>
                  <select value={editingProduct.category} onChange={(e) => handleCategoryChange(e, true)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm font-medium">
                    {STANDARD_CATEGORIES.map(catOpt => (
                      <option key={catOpt} value={catOpt}>{catOpt}</option>
                    ))}
                    {/* Fallback ya Legacy Categories */}
                    {!STANDARD_CATEGORIES.includes(editingProduct.category) && (
                      <option value={editingProduct.category}>{editingProduct.category} (Legacy)</option>
                    )}
                  </select>
                </div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Brand</label><input type="text" value={editingProduct.brand} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-500 mb-1">SKU</label><input type="text" value={editingProduct.sku} onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Stock</label><input type="number" value={editingProduct.stockQuantity} onChange={e => setEditingProduct({...editingProduct, stockQuantity: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              </div>

              {/* SEHEMU YA BADGE NA CONDITION PAMOJA (EDIT) */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><FiTag className="text-[#F2A900]"/> Badge</label>
                  <select value={editingProduct.badge || ''} onChange={e => setEditingProduct({...editingProduct, badge: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm font-medium">
                    <option value="">Hakuna</option>
                    <option value="Hot">🔥 Hot</option>
                    <option value="Sale">🏷️ Sale</option>
                    <option value="New">✨ New Arrival</option>
                    <option value="Clearance">📦 Clearance</option>
                    <option value="Top Rated">⭐ Top Rated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Condition</label>
                  <select value={editingProduct.condition || 'Brand New'} onChange={e => setEditingProduct({...editingProduct, condition: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm font-medium">
                    <option value="Brand New">Brand New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
              </div>

              {/* DYNAMIC EDIT SPECS */}
              <div>
                {renderDynamicSpecs(editingProduct.category, editSpecData, setEditSpecData)}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
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
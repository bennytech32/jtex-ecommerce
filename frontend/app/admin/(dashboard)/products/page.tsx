'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiBox, FiDatabase, FiAlertTriangle, FiCheckCircle, FiX, FiSettings, FiTag, FiCpu, FiTruck, FiAnchor, FiLayers, FiTrash2, FiPackage } from 'react-icons/fi';

export default function AdminProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States za Kategoria na Specs kutoka DB
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbSpecTemplates, setDbSpecTemplates] = useState<any[]>([]);

  // --- Management States (Kwa ajili ya kutengeneza Cat/Specs mpya) ---
  const [showManager, setShowManager] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newSpecTitle, setNewSpecTitle] = useState('');
  const [newSpecFields, setNewSpecFields] = useState<string>(''); 

  // --- Form States (Add Product) ---
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState(''); 
  const [badge, setBadge] = useState(''); 
  const [condition, setCondition] = useState('Brand New');
  const [colors, setColors] = useState(''); // Multi-colour support
  const [buyingPrice, setBuyingPrice] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  
  // Spec States
  const [specData, setSpecData] = useState<any>({}); 
  const [customSpecs, setCustomSpecs] = useState<{key: string, value: string}[]>([]); 
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Pre-Order States
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [shippingOrigin, setShippingOrigin] = useState<'Dubai' | 'China'>('Dubai');
  const [freightType, setFreightType] = useState<'Air' | 'Sea'>('Air');

  // Wholesale States (NEW)
  const [isWholesale, setIsWholesale] = useState(false);
  const [wholesaleTier2Price, setWholesaleTier2Price] = useState('');
  const [wholesaleTier3Price, setWholesaleTier3Price] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  // Shipping Data Config
  const shippingConfig = {
    Dubai: { days: "5–10 business days", icon: "🇦🇪" },
    China: { days: "10–30 business days", icon: "🇨🇳" },
    Air: { desc: "Fastest shipping option.", icon: <FiTruck className="text-sky-600"/> },
    Sea: { desc: "Longer transit time.", icon: <FiAnchor className="text-blue-800"/> }
  };

  // Auto-generate SKU
  useEffect(() => {
    if (name && selectedCategoryId) {
      const catObj = dbCategories.find(c => c.id === selectedCategoryId || c.name === selectedCategoryId);
      const catName = catObj ? catObj.name : 'PROD';
      const prefix = catName.substring(0, 3).toUpperCase();
      const namePart = name.substring(0, 3).toUpperCase();
      const randomId = Math.floor(1000 + Math.random() * 9000);
      setSku(`${prefix}-${namePart}-${randomId}`);
    }
  }, [name, selectedCategoryId, dbCategories]);

  // --- API Fetches ---
  const fetchInitialData = async () => {
    try {
      const [catRes, specRes] = await Promise.all([
        fetch(`${API_URL}/api/categories`).catch(() => ({ ok: false, json: () => [] })), 
        fetch(`${API_URL}/api/spec-templates`).catch(() => ({ ok: false, json: () => [] })) 
      ]);

      let fetchedCats = [];
      if (catRes.ok) fetchedCats = await catRes.json();
      if (fetchedCats.length === 0) {
          fetchedCats = [
              { id: '1', name: 'Smartphones' }, { id: '2', name: 'Laptops' },
              { id: '3', name: 'Monitors' }, { id: '4', name: 'Printers' },
              { id: '5', name: 'Accessories' }, { id: '6', name: 'Servers' },
              { id: '7', name: 'Desktop Computers' }, { id: '8', name: 'Smart TVs' }
          ];
      }
      setDbCategories(fetchedCats);

      if (specRes.ok) setDbSpecTemplates(await specRes.json());
      
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // ==========================================
  // SMART AI SPECIFICATIONS GENERATOR
  // ==========================================
  const generateSmartSpecs = (categoryName: string) => {
    const cat = categoryName.toLowerCase();
    let autoFields: string[] = [];

    const dbTemplate = dbSpecTemplates.find(t => t.title.toLowerCase() === cat);
    if (dbTemplate) {
      autoFields = dbTemplate.fields;
    } 
    else if (cat.includes('laptop') || cat.includes('computer') || cat.includes('desktop') || cat.includes('mini pc')) {
      autoFields = ['Processor', 'Processor Speed', 'RAM', 'Storage', 'Graphics', 'Display Size', 'Operating System', 'Battery Life'];
    } 
    else if (cat.includes('phone') || cat.includes('smartphone') || cat.includes('tablet')) {
      autoFields = ['Display', 'Resolution', 'Processor', 'RAM', 'Storage', 'Main Camera', 'Selfie Camera', 'Battery Capacity', 'Network'];
    }
    else if (cat.includes('server')) {
      autoFields = ['Server Type', 'Processor', 'Memory', 'Storage Controller', 'Drive Bays', 'Network', 'Power Supply'];
    }
    else if (cat.includes('monitor') || cat.includes('tv') || cat.includes('display')) {
      autoFields = ['Screen Size', 'Resolution', 'Panel Type', 'Refresh Rate', 'Response Time', 'Connectivity', 'Smart Features'];
    }
    else if (cat.includes('printer') || cat.includes('scanner')) {
      autoFields = ['Print Technology', 'Print Speed', 'Resolution', 'Connectivity', 'Paper Capacity', 'Functions'];
    }
    else if (cat.includes('accessory') || cat.includes('accessories')) {
      autoFields = ['Type', 'Connectivity', 'Compatibility', 'Material', 'Cable Length'];
    }

    if (autoFields.length > 0) {
      const newSpecObj: any = {};
      autoFields.forEach(field => {
        newSpecObj[field] = '';
      });
      setSpecData(newSpecObj);
    } else {
      setSpecData({});
    }
  };

  useEffect(() => {
    if (selectedCategoryId) {
      const catObj = dbCategories.find(c => c.id === selectedCategoryId || c.name === selectedCategoryId);
      if (catObj) {
        generateSmartSpecs(catObj.name);
      }
    } else {
      setSpecData({});
    }
  }, [selectedCategoryId, dbCategories, dbSpecTemplates]);


  // --- Management Logic ---
  const handleSaveCategory = async () => {
    if(!newCatName.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: newCatName.trim() })
      });
      if(res.ok) {
        const savedCat = await res.json();
        setDbCategories([...dbCategories, savedCat]);
        setNewCatName('');
        setMessage('Kategoria imehifadhiwa kikamilifu!');
      } else {
        const newCat = { id: Date.now().toString(), name: newCatName.trim() };
        setDbCategories([...dbCategories, newCat]);
        setNewCatName('');
        setMessage('Kategoria imehifadhiwa kwa muda (API missing).');
      }
    } catch (err) { 
        const newCat = { id: Date.now().toString(), name: newCatName.trim() };
        setDbCategories([...dbCategories, newCat]);
        setNewCatName('');
        setMessage('Kategoria imehifadhiwa kwa muda (API offline).');
    }
    setIsLoading(false);
  };

  const handleSaveSpecTemplate = async () => {
    if(!newSpecTitle.trim() || !newSpecFields.trim()) return;
    setIsLoading(true);
    const fieldsArray = newSpecFields.split(',').map(f => f.trim()).filter(f => f !== '');
    try {
      const res = await fetch(`${API_URL}/api/spec-templates`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ title: newSpecTitle.trim(), fields: fieldsArray })
      });
      if(res.ok) {
        const savedTemplate = await res.json();
        setDbSpecTemplates([...dbSpecTemplates, savedTemplate]);
        setNewSpecTitle(''); setNewSpecFields('');
        setMessage('Spec Template imehifadhiwa kikamilifu!');
      } else {
        const newTemp = { id: Date.now().toString(), title: newSpecTitle.trim(), fields: fieldsArray };
        setDbSpecTemplates([...dbSpecTemplates, newTemp]);
        setNewSpecTitle(''); setNewSpecFields('');
      }
    } catch (err) { 
        const newTemp = { id: Date.now().toString(), title: newSpecTitle.trim(), fields: fieldsArray };
        setDbSpecTemplates([...dbSpecTemplates, newTemp]);
        setNewSpecTitle(''); setNewSpecFields('');
    }
    setIsLoading(false);
  };

  const applySpecTemplate = (templateId: string) => {
    const template = dbSpecTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    const initialData: any = {};
    template.fields.forEach((field: string) => {
      initialData[field] = '';
    });
    setSpecData(initialData);
  };

  // --- Image Handling ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      let filesArray = Array.from(files);
      const spaceLeft = 5 - imagePreviews.length;
      
      if (filesArray.length > spaceLeft) {
        alert(`Limit is 5 images. You can only add ${spaceLeft} more.`);
        filesArray = filesArray.slice(0, spaceLeft);
      }

      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImageFiles(prev => [...prev, ...filesArray]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddCustomSpec = () => {
    setCustomSpecs([...customSpecs, { key: '', value: '' }]);
  };

  const handleCustomSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...customSpecs];
    updated[index][field] = val;
    setCustomSpecs(updated);
  };

  const removeCustomSpec = (index: number) => {
    setCustomSpecs(customSpecs.filter((_, i) => i !== index));
  };

  // --- Submit Logic (ADD ONLY) ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');

    let finalCategory = selectedCategoryId;
    const catObj = dbCategories.find(c => c.id === selectedCategoryId || c.name === selectedCategoryId);
    if(catObj) finalCategory = catObj.name;
    
    if(!finalCategory) { setError('Tafadhali chagua kategoria.'); setIsLoading(false); return;}

    const finalSpecs = { ...specData };
    
    // Injiza Rangi kwenye Specifications kama ipo
    if (colors.trim() !== '') {
       finalSpecs['Color'] = colors.trim();
    }

    // Injiza Wholesale kwenye Specifications
    if (isWholesale) {
      finalSpecs['isWholesale'] = 'Yes';
      if(wholesaleTier2Price) finalSpecs['wholesaleTier2Price'] = wholesaleTier2Price;
      if(wholesaleTier3Price) finalSpecs['wholesaleTier3Price'] = wholesaleTier3Price;
    }

    customSpecs.forEach(spec => {
      if (spec.key.trim() !== '') finalSpecs[spec.key.trim()] = spec.value;
    });

    const preOrderInfo = isPreOrder ? {
      isPreOrder: true,
      origin: shippingOrigin,
      freight: freightType,
      estDays: shippingConfig[shippingOrigin].days
    } : { isPreOrder: false };

    const formData = new FormData();
    formData.append('sku', sku); 
    formData.append('name', name);
    formData.append('category', finalCategory); 
    formData.append('brand', brand);
    formData.append('model', modelName); 
    formData.append('badge', badge); 
    formData.append('condition', condition);
    formData.append('buyingPrice', buyingPrice); 
    formData.append('price', price);
    formData.append('stockQuantity', isPreOrder ? '999' : stockQuantity); 
    formData.append('specifications', JSON.stringify(finalSpecs));
    formData.append('preOrderInfo', JSON.stringify(preOrderInfo)); 
    
    imageFiles.forEach((file) => formData.append('images', file));

    try {
      const res = await fetch(`${API_URL}/api/products`, { method: 'POST', body: formData });
      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch(e) { data = { error: rawText }; }

      if (res.ok) {
        setMessage('Product added successfully!');
        setSku(''); setName(''); setBrand(''); setModelName(''); setBadge(''); setCondition('Brand New'); setColors(''); setBuyingPrice(''); setPrice(''); setStockQuantity(''); 
        setSelectedCategoryId(''); setSpecData({}); setCustomSpecs([]);
        setImageFiles([]); setImagePreviews([]);
        setIsPreOrder(false); setIsWholesale(false); setWholesaleTier2Price(''); setWholesaleTier3Price('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        window.scrollTo(0,0); 
      } else {
        setError(`Failed: ${data.error || "Server rejected the data."}`);
      }
    } catch (err: any) { setError(`Network error: ${err.message}`);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500">Add stock, categories, colours, wholesale and Pre-Orders.</p>
        </div>
        <button onClick={() => setShowManager(!showManager)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${showManager ? 'bg-gray-200 text-gray-800' : 'bg-[#0F172A] text-white'}`}>
          <FiLayers/> {showManager ? 'Close Manager' : 'Manage Cats & Specs'}
        </button>
      </div>

      {message && <div className="mb-4 p-4 bg-green-50 text-green-600 text-sm rounded-xl flex items-center gap-2 font-bold shadow-sm border border-green-100"><FiCheckCircle className="text-lg" /> {message}</div>}
      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 font-bold shadow-sm border border-red-100"><FiAlertTriangle className="text-lg" /> {error}</div>}

      {/* MANAGER */}
      {showManager && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100 p-6 rounded-2xl border border-gray-200 animate-fade-in">
          <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2"><FiPlus className="text-green-500"/> Create New Category</h3>
            <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Solar Panels" className="w-full border rounded-lg px-3 py-2 text-sm"/>
            <button onClick={handleSaveCategory} disabled={isLoading || !newCatName} className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold disabled:bg-gray-300">Save Category</button>
            <div className="pt-2 text-xs text-gray-500">Current: {dbCategories.map(c=>c.name).join(', ')}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2"><FiSettings className="text-blue-500"/> Create Spec Template</h3>
            <input type="text" value={newSpecTitle} onChange={e => setNewSpecTitle(e.target.value)} placeholder="Template Title (e.g. Laptop Basic)" className="w-full border rounded-lg px-3 py-2 text-sm"/>
            <textarea value={newSpecFields} onChange={e => setNewSpecFields(e.target.value)} placeholder="Fields, separated, by, commas" className="w-full border rounded-lg px-3 py-2 text-sm h-16"></textarea>
            <button onClick={handleSaveSpecTemplate} disabled={isLoading || !newSpecTitle || !newSpecFields} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold disabled:bg-gray-300">Save Specs Template</button>
             <div className="pt-2 text-xs text-gray-500">Current: {dbSpecTemplates.map(t=>t.title).join(', ')}</div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleAddProduct} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Product Images (Max 5)</label>
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"><FiX className="text-xs" /></button>
                    </div>
                  ))}
                </div>
              )}
              {imagePreviews.length < 5 && (
                <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e)} ref={fileInputRef} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F2A900]/10 file:text-[#0F172A] cursor-pointer" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Product Name</label>
                <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2"><FiBox className="text-gray-400 mr-2" /><input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm font-semibold text-gray-900" placeholder="e.g. iPhone 15 Pro Max" /></div>
              </div>

              <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">Category <span className="text-[9px] text-[#F2A900] bg-yellow-50 px-2 py-0.5 rounded-full lowercase">Auto-loads Specs</span></label>
                  <select required value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-bold text-gray-800 focus:border-[#F2A900]">
                    <option value="">-- Select Category --</option>
                    {dbCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {dbCategories.length === 0 && <p className="text-[10px] text-red-500 mt-1">No categories. Use Manager to add.</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Brand</label>
                  <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-semibold text-gray-800" placeholder="Apple" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><FiCpu className="text-gray-400"/> Model</label>
                  <input type="text" value={modelName} onChange={e => setModelName(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-semibold text-gray-800" placeholder="A2849" />
                </div>
              </div>

              {/* RANGI (MULTICOLOUR SUPPORT) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Available Colors (Comma Separated)</label>
                <input type="text" value={colors} onChange={e => setColors(e.target.value)} className="w-full bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 outline-none text-sm font-bold text-blue-900 focus:border-blue-500" placeholder="e.g. Black, Silver, Titanium" />
                <p className="text-[10px] text-gray-400 mt-1">Hizi zitatengeneza vitufe vya rangi kule mbele.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><FiTag className="text-[#F2A900]"/> Badge</label>
                  <select value={badge} onChange={e => setBadge(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-medium">
                    <option value="">None</option>
                    <option value="Hot">🔥 Hot</option>
                    <option value="Sale">🏷️ Sale</option>
                    <option value="New">✨ New Arrival</option>
                    <option value="Pre-Order">📦 Pre-Order</option>
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
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">SKU (Auto)</label>
                  <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg px-3 py-2"><FiDatabase className="text-gray-400 mr-2" /><input type="text" required value={sku} onChange={e => setSku(e.target.value)} className="w-full bg-transparent outline-none text-sm text-gray-600 font-mono" /></div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Physical Stock</label>
                  <input type="number" required={!isPreOrder} disabled={isPreOrder} value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-bold text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" placeholder={isPreOrder ? "N/A" : "50"} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Buying Price</label>
                  <input type="number" value={buyingPrice} onChange={e => setBuyingPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-black text-gray-600" placeholder="200000" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-green-600 uppercase mb-1">Selling Price</label>
                  <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-green-50 border border-green-200 rounded-lg px-3 py-2 outline-none text-sm font-black text-[#0A101D] focus:border-green-500" placeholder="250000" />
                </div>
              </div>

              {/* WHOLESALE PRICING SECTION (NEW) */}
              <div className="border border-green-100 rounded-2xl overflow-hidden mt-4">
                <div className="bg-green-50/30 p-4 flex items-center justify-between border-b border-green-100">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isWholesale ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}><FiPackage size={20}/></div>
                        <div>
                            <label className="block text-sm font-bold text-gray-800">Wholesale Pricing</label>
                            <p className="text-[10px] text-gray-500">Washa kama bidhaa inauzwa kwa bei ya jumla.</p>
                        </div>
                    </div>
                    <input type="checkbox" checked={isWholesale} onChange={e => setIsWholesale(e.target.checked)} className="w-6 h-6 accent-green-600 cursor-pointer"/>
                </div>

                {isWholesale && (
                  <div className="bg-white p-4 grid grid-cols-2 gap-3 animate-fade-in">
                    <div>
                      <label className="block text-[10px] font-bold text-green-700 uppercase mb-1">Price for 2-5 Pcs (Optional)</label>
                      <input type="number" value={wholesaleTier2Price} onChange={e => setWholesaleTier2Price(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm font-semibold text-gray-800 focus:border-green-400" placeholder="e.g. 240000" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-green-700 uppercase mb-1">Price for &gt;5 Pcs (Optional)</label>
                      <input type="number" value={wholesaleTier3Price} onChange={e => setWholesaleTier3Price(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm font-semibold text-gray-800 focus:border-green-400" placeholder="e.g. 230000" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-100 pb-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isPreOrder ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}><FiTruck size={20}/></div>
                    <div>
                        <label className="block text-sm font-bold text-gray-800">Available for Pre-Order</label>
                        <p className="text-[11px] text-gray-500">Enable this if the product is out of stock or requires special ordering.</p>
                    </div>
                </div>
                <input type="checkbox" checked={isPreOrder} onChange={e => setIsPreOrder(e.target.checked)} className="w-6 h-6 accent-blue-600 cursor-pointer"/>
            </div>

            {isPreOrder && (
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mt-3 space-y-4 animate-fade-in">
                <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2"><FiTruck/> Pre-Order Shipping Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-blue-700 uppercase mb-1">Shipping Origin</label>
                    <select value={shippingOrigin} onChange={e => setShippingOrigin(e.target.value as any)} className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2.5 outline-none text-sm font-semibold text-gray-800 focus:border-blue-400 transition">
                      <option value="Dubai">🇦🇪 Dubai → TZ</option>
                      <option value="China">🇨🇳 China → TZ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-700 uppercase mb-1">Freight Type</label>
                    <select value={freightType} onChange={e => setFreightType(e.target.value as any)} className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2.5 outline-none text-sm font-semibold text-gray-800 focus:border-blue-400 transition">
                      <option value="Air">✈️ Air Freight (Fast)</option>
                      <option value="Sea">🚢 Sea Freight (Slower)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SMART AI & CUSTOM SPECS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
               <h3 className="text-lg font-bold text-gray-900">Specifications</h3>
               {Object.keys(specData).length > 0 && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"><FiCheckCircle/> Auto-Loaded</span>}
            </div>
            
            {/* Template Overrider (Kama AI imekosea) */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Override Template (Optional)</label>
              <select onChange={(e) => applySpecTemplate(e.target.value)} className="w-full max-w-xs bg-gray-50 border rounded-lg px-3 py-1.5 outline-none text-xs text-gray-600 font-medium focus:border-[#F2A900]">
                <option value="">-- Change Template Manually --</option>
                {dbSpecTemplates.map(temp => (
                    <option key={temp.id} value={temp.id}>{temp.title}</option>
                ))}
              </select>
            </div>
            
            {/* Auto-Loaded Specs Fields */}
            {Object.keys(specData).length > 0 && (
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(specData).map(field => (
                    <div key={field}>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{field}</label>
                      <input 
                        type="text" 
                        value={specData[field] || ''} 
                        onChange={e => setSpecData({...specData, [field]: e.target.value})} 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm font-medium focus:border-[#F2A900] transition-colors" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Specs Builder */}
            <div className="p-5 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-700">Custom Extra Fields</h3>
                <button type="button" onClick={() => handleAddCustomSpec()} className="text-[11px] font-bold text-[#0A101D] bg-gray-200 px-3 py-1.5 rounded-lg hover:bg-[#F2A900] hover:text-black transition flex items-center gap-1">
                  <FiPlus/> Add Field
                </button>
              </div>
              
              {customSpecs.length === 0 && <p className="text-xs text-gray-400 italic">No custom fields added yet.</p>}

              <div className="space-y-3">
                {customSpecs.map((spec, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center gap-3">
                    <input type="text" placeholder="Field Name (e.g. Warranty)" value={spec.key} onChange={e => handleCustomSpecChange(index, 'key', e.target.value)} className="w-full sm:w-1/3 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm font-bold focus:border-[#F2A900]" />
                    <input type="text" placeholder="Value (e.g. 1 Year)" value={spec.value} onChange={e => handleCustomSpecChange(index, 'value', e.target.value)} className="w-full sm:flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F2A900]" />
                    <button type="button" onClick={() => removeCustomSpec(index)} className="w-full sm:w-auto text-red-500 bg-red-50 hover:bg-red-100 p-2.5 rounded-lg transition font-bold text-sm flex justify-center items-center"><FiTrash2/></button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#0A101D] hover:bg-gray-800 text-white font-black py-4 rounded-xl text-base transition mt-8 shadow-xl disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-2">
            {isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</> : 'Save Product & List Online'}
          </button>
        </form>
      </div>
    </div>
  );
}
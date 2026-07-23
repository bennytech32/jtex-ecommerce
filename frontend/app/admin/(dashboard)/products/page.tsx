'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, FiBox, FiDatabase, FiAlertTriangle, FiCheckCircle, FiX, 
  FiSettings, FiTag, FiCpu, FiTruck, FiAnchor, FiLayers, FiTrash2, 
  FiPackage, FiImage, FiDollarSign, FiList 
} from 'react-icons/fi';

export default function AdminProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States za Kategoria na Specs kutoka DB
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbSpecTemplates, setDbSpecTemplates] = useState<any[]>([]);

  // --- Management States ---
  const [showManager, setShowManager] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newSpecTitle, setNewSpecTitle] = useState('');
  const [newSpecFields, setNewSpecFields] = useState<string>(''); 

  // --- Form States (Add Product) ---
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState(''); // OPTIONAL
  const [badge, setBadge] = useState(''); 
  const [condition, setCondition] = useState('Brand New');
  const [colors, setColors] = useState(''); 
  const [buyingPrice, setBuyingPrice] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  
  // Spec States
  const [specData, setSpecData] = useState<any>({}); 
  const [customSpecs, setCustomSpecs] = useState<{key: string, value: string}[]>([]); 
  const [selectedTemplateId, setSelectedTemplateId] = useState(''); // NEW: Kwa ajili ya Auto-Select Dropdown
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Pre-Order States
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [shippingOrigin, setShippingOrigin] = useState<'Dubai' | 'China'>('Dubai');
  const [freightType, setFreightType] = useState<'Air' | 'Sea'>('Air');

  // Wholesale States
  const [isWholesale, setIsWholesale] = useState(false);
  const [wholesaleTier2Price, setWholesaleTier2Price] = useState('');
  const [wholesaleTier3Price, setWholesaleTier3Price] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  // Shipping Config
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
    let matchedTemplateId = '';

    // 1. ANGALIA DATABASE TEMPLATES KWANZA (Auto-Select Custom Templates)
    const dbTemplate = dbSpecTemplates.find(t => t.title.toLowerCase() === cat);
    if (dbTemplate) {
      autoFields = dbTemplate.fields;
      matchedTemplateId = dbTemplate.id;
    } 
    // 2. KAMA HAKUNA DB TEMPLATE, TUMIA AI FALLBACK LOGIC
    else {
      if (cat.includes('laptop') || cat.includes('computer')) {
        autoFields = ['Processor', 'RAM', 'Storage', 'Graphics', 'Display Size', 'Operating System'];
      } 
      else if (cat.includes('phone') || cat.includes('tablet')) {
        autoFields = ['Display', 'Processor', 'RAM', 'Storage', 'Main Camera', 'Battery Capacity'];
      }
      // Akili ya Nguo/Viatu (Fashion)
      else if (cat.includes('cloth') || cat.includes('wear') || cat.includes('shoe') || cat.includes('fashion') || cat.includes('apparel')) {
        autoFields = ['Size', 'Material / Fabric', 'Gender', 'Care Instructions', 'Fit Type'];
      }
      // Akili ya Samani / Furniture
      else if (cat.includes('furniture') || cat.includes('chair') || cat.includes('table') || cat.includes('sofa')) {
        autoFields = ['Dimensions (L x W x H)', 'Material', 'Weight Capacity', 'Color/Finish'];
      }
      else if (cat.includes('server')) {
        autoFields = ['Server Type', 'Processor', 'Memory', 'Storage Controller', 'Power Supply'];
      }
      else if (cat.includes('tv') || cat.includes('monitor')) {
        autoFields = ['Screen Size', 'Resolution', 'Panel Type', 'Refresh Rate', 'Smart Features'];
      }
      else if (cat.includes('printer')) {
        autoFields = ['Print Technology', 'Print Speed', 'Resolution', 'Connectivity'];
      }
    }

    // Set fields
    if (autoFields.length > 0) {
      const newSpecObj: any = {};
      autoFields.forEach(field => { newSpecObj[field] = ''; });
      setSpecData(newSpecObj);
    } else {
      setSpecData({});
    }

    // Set ID for dropdown to show correctly
    setSelectedTemplateId(matchedTemplateId);
  };

  useEffect(() => {
    if (selectedCategoryId) {
      const catObj = dbCategories.find(c => c.id === selectedCategoryId || c.name === selectedCategoryId);
      if (catObj) {
        generateSmartSpecs(catObj.name);
      }
    } else {
      setSpecData({});
      setSelectedTemplateId('');
    }
  }, [selectedCategoryId, dbCategories, dbSpecTemplates]);

  // Handle Manual Template Override
  const applySpecTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) {
      // Re-trigger smart specs if manual is cleared
      const catObj = dbCategories.find(c => c.id === selectedCategoryId);
      if (catObj) generateSmartSpecs(catObj.name);
      return;
    }

    const template = dbSpecTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    const initialData: any = {};
    template.fields.forEach((field: string) => {
      initialData[field] = '';
    });
    setSpecData(initialData);
  };

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
        const catToAdd = savedCat.category || savedCat.data || savedCat;
        const finalCat = { id: catToAdd.id || catToAdd._id || Date.now().toString(), name: catToAdd.name || newCatName.trim() };
        setDbCategories(prev => [...prev, finalCat]);
        setNewCatName('');
        setMessage('Category saved perfectly!');
      }
    } catch (err) {}
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
        setMessage('Template saved perfectly!');
      }
    } catch (err) {}
    setIsLoading(false);
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

  // --- KUFUTA SPEC MOJA MOJA KWENYE AUTO-LOADED ---
  const handleRemoveAutoSpec = (fieldToRemove: string) => {
    const updatedSpecs = { ...specData };
    delete updatedSpecs[fieldToRemove];
    setSpecData(updatedSpecs);
  };

  const handleAddCustomSpec = () => setCustomSpecs([...customSpecs, { key: '', value: '' }]);
  const handleCustomSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...customSpecs]; updated[index][field] = val; setCustomSpecs(updated);
  };
  const removeCustomSpec = (index: number) => setCustomSpecs(customSpecs.filter((_, i) => i !== index));

  // --- Submit Logic (ADD ONLY) ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');

    let finalCategory = selectedCategoryId;
    const catObj = dbCategories.find(c => c.id === selectedCategoryId || c.name === selectedCategoryId);
    if(catObj) finalCategory = catObj.name;
    
    if(!finalCategory) { setError('Please select a category.'); setIsLoading(false); return;}

    const finalSpecs = { ...specData };
    if (colors.trim() !== '') finalSpecs['Color'] = colors.trim();
    if (isWholesale) {
      finalSpecs['isWholesale'] = 'Yes';
      if(wholesaleTier2Price) finalSpecs['wholesaleTier2Price'] = wholesaleTier2Price;
      if(wholesaleTier3Price) finalSpecs['wholesaleTier3Price'] = wholesaleTier3Price;
    }

    customSpecs.forEach(spec => {
      if (spec.key.trim() !== '') finalSpecs[spec.key.trim()] = spec.value;
    });

    const preOrderInfo = isPreOrder ? {
      isPreOrder: true, origin: shippingOrigin, freight: freightType, estDays: shippingConfig[shippingOrigin].days
    } : { isPreOrder: false };

    const formData = new FormData();
    formData.append('sku', sku); 
    formData.append('name', name);
    formData.append('category', finalCategory); 
    formData.append('brand', brand);
    formData.append('model', modelName); // Now Optional, safe if empty
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
        setMessage('Product added successfully to live store!');
        setSku(''); setName(''); setBrand(''); setModelName(''); setBadge(''); setCondition('Brand New'); setColors(''); setBuyingPrice(''); setPrice(''); setStockQuantity(''); 
        setSelectedCategoryId(''); setSpecData({}); setCustomSpecs([]); setSelectedTemplateId('');
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
    <div className="max-w-5xl mx-auto font-sans pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Add New Product</h1>
          <p className="text-xs text-gray-500 mt-1">Smart form with AI-powered categories and specs.</p>
        </div>
        <button onClick={() => setShowManager(!showManager)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm border ${showManager ? 'bg-white border-gray-200 text-gray-800' : 'bg-[#0A101D] text-white border-transparent'}`}>
          <FiLayers/> {showManager ? 'Close Manager' : 'Manage Categories & Specs'}
        </button>
      </div>

      {message && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm rounded-2xl flex items-center gap-2 font-bold shadow-sm border border-emerald-100"><FiCheckCircle size={18} /> {message}</div>}
      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl flex items-center gap-2 font-bold shadow-sm border border-red-100"><FiAlertTriangle size={18} /> {error}</div>}

      {/* MANAGER COMPONENT */}
      {showManager && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-inner animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-black text-sm flex items-center gap-2 text-gray-800"><FiPlus className="text-emerald-500"/> Add Category</h3>
            <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Solar Panels" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#F2A900]"/>
            <button onClick={handleSaveCategory} disabled={isLoading || !newCatName} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-2.5 rounded-xl text-xs font-bold disabled:bg-gray-300 transition">Save Category</button>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-black text-sm flex items-center gap-2 text-gray-800"><FiSettings className="text-blue-500"/> Create Spec Template</h3>
            <input type="text" value={newSpecTitle} onChange={e => setNewSpecTitle(e.target.value)} placeholder="Title (e.g. Shirts)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#F2A900]"/>
            <textarea value={newSpecFields} onChange={e => setNewSpecFields(e.target.value)} placeholder="Fields: Size, Material, Fit" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#F2A900] h-16"></textarea>
            <button onClick={handleSaveSpecTemplate} disabled={isLoading || !newSpecTitle || !newSpecFields} className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 rounded-xl text-xs font-bold disabled:bg-gray-300 transition">Save Template</button>
          </div>
        </div>
      )}

      {/* MAIN FORM WITH PROFESSIONAL SECTIONS */}
      <form onSubmit={handleAddProduct} className="space-y-6">
        
        {/* SECTION 1: MEDIA & BASIC INFO */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2"><FiBox className="text-[#F2A900]"/> Basic Information</h2>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Product Media (Max 5)</label>
              <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl p-4 text-center hover:bg-gray-100 transition">
                <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e)} ref={fileInputRef} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center py-6">
                  <FiImage size={32} className="text-gray-300 mb-2" />
                  <span className="text-xs font-bold text-blue-600">Click to upload images</span>
                  <span className="text-[10px] font-medium text-gray-400 mt-1">JPEG, PNG, WEBP allowed</span>
                </label>
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group w-[70px] h-[70px]">
                      <img src={preview} className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"><FiX className="text-xs" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full lg:w-2/3 space-y-5">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Product Name <span className="text-red-500">*</span></label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-bold text-gray-900 focus:border-[#F2A900] transition" placeholder="e.g. Nike Air Max, iPhone 15..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-2">Category <span className="text-[9px] text-[#F2A900] bg-yellow-50 px-2 py-0.5 rounded-full capitalize">AI Powered</span></label>
                    <select required value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-bold text-gray-800 focus:border-[#F2A900] transition cursor-pointer">
                      <option value="">-- Select Category --</option>
                      {dbCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Brand <span className="text-gray-300 font-normal">(Optional)</span></label>
                  <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-semibold text-gray-800 focus:border-[#F2A900] transition" placeholder="e.g. Nike, Apple..." />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">Model <span className="text-blue-500 font-medium capitalize ml-1 bg-blue-50 px-2 py-0.5 rounded-md">Optional</span></label>
                  <input type="text" value={modelName} onChange={e => setModelName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-semibold text-gray-800 focus:border-[#F2A900] transition" placeholder="e.g. A2849 (Leave blank for clothes)" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Available Colors</label>
                  <input type="text" value={colors} onChange={e => setColors(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-bold text-gray-800 focus:border-[#F2A900] transition" placeholder="e.g. Red, Blue, Black" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Condition</label>
                  <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-semibold cursor-pointer focus:border-[#F2A900]">
                    <option value="Brand New">Brand New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Marketing Badge</label>
                  <select value={badge} onChange={e => setBadge(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-semibold cursor-pointer focus:border-[#F2A900]">
                    <option value="">None (Standard)</option>
                    <option value="Hot">🔥 Hot</option>
                    <option value="Sale">🏷️ Sale</option>
                    <option value="New">✨ New Arrival</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PRICING & INVENTORY */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2"><FiDollarSign className="text-emerald-500"/> Pricing & Inventory</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">SKU (Auto)</label>
              <input type="text" required value={sku} onChange={e => setSku(e.target.value)} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-mono text-gray-600 focus:border-[#F2A900] transition" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Physical Stock <span className="text-red-500">*</span></label>
              <input type="number" required={!isPreOrder} disabled={isPreOrder} value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-black text-gray-900 focus:border-[#F2A900] disabled:opacity-50 transition" placeholder={isPreOrder ? "Pre-order active" : "50"} />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Buying Price (TZS)</label>
              <input type="number" value={buyingPrice} onChange={e => setBuyingPrice(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-black text-gray-700 focus:border-[#F2A900] transition" placeholder="e.g. 200000" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-emerald-600 uppercase tracking-wider mb-1.5">Selling Price (TZS) <span className="text-red-500">*</span></label>
              <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-3 outline-none text-sm font-black text-[#0A101D] focus:border-emerald-500 transition shadow-sm" placeholder="e.g. 250000" />
            </div>
          </div>

          {/* Wholesale Section */}
          <div className="mt-6 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isWholesale ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}><FiPackage size={18}/></div>
                    <div>
                        <label className="block text-sm font-black text-gray-800">Enable Wholesale Pricing</label>
                        <p className="text-[10px] text-gray-500 font-medium">Offer discounts for bulk purchases</p>
                    </div>
                </div>
                <input type="checkbox" checked={isWholesale} onChange={e => setIsWholesale(e.target.checked)} className="w-5 h-5 accent-emerald-600 cursor-pointer"/>
            </div>

            {isWholesale && (
              <div className="bg-white p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-gray-200 animate-fade-in">
                <div>
                  <label className="block text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1.5">Price for 2-5 Pcs</label>
                  <input type="number" value={wholesaleTier2Price} onChange={e => setWholesaleTier2Price(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-gray-800 focus:border-emerald-400" placeholder="e.g. 240000" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1.5">Price for &gt;5 Pcs</label>
                  <input type="number" value={wholesaleTier3Price} onChange={e => setWholesaleTier3Price(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-gray-800 focus:border-emerald-400" placeholder="e.g. 230000" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: SHIPPING & PRE-ORDER */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isPreOrder ? 'bg-blue-100 text-blue-600 shadow-sm' : 'bg-gray-100 text-gray-400'}`}><FiTruck size={20}/></div>
                  <div>
                      <h2 className="text-base font-black text-gray-900">Pre-Order Logistics</h2>
                      <p className="text-[11px] font-medium text-gray-500">Enable if product ships directly from abroad</p>
                  </div>
              </div>
              <input type="checkbox" checked={isPreOrder} onChange={e => setIsPreOrder(e.target.checked)} className="w-6 h-6 accent-blue-600 cursor-pointer"/>
          </div>

          {isPreOrder && (
            <div className="mt-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in">
              <div>
                <label className="block text-[11px] font-black text-blue-800 uppercase tracking-wider mb-1.5">Origin Country</label>
                <select value={shippingOrigin} onChange={e => setShippingOrigin(e.target.value as any)} className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 outline-none text-sm font-bold text-gray-800 focus:border-blue-400 cursor-pointer shadow-sm">
                  <option value="Dubai">🇦🇪 Dubai (UAE)</option>
                  <option value="China">🇨🇳 China (PRC)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-blue-800 uppercase tracking-wider mb-1.5">Preferred Freight</label>
                <select value={freightType} onChange={e => setFreightType(e.target.value as any)} className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 outline-none text-sm font-bold text-gray-800 focus:border-blue-400 cursor-pointer shadow-sm">
                  <option value="Air">✈️ Air Freight (Fast)</option>
                  <option value="Sea">🚢 Sea Freight (Economical)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: SMART SPECIFICATIONS (AI) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
             <div>
               <h2 className="text-base font-black text-gray-900 flex items-center gap-2"><FiList className="text-purple-500"/> Smart Specifications</h2>
               <p className="text-[11px] font-medium text-gray-500 mt-1">Fields are automatically generated based on the chosen category.</p>
             </div>
             
             {/* Dropdown inayo-sync na AI / Template Selection */}
             <div className="min-w-[200px]">
               <select 
                 value={selectedTemplateId}
                 onChange={(e) => applySpecTemplate(e.target.value)} 
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none text-[11px] font-bold text-gray-700 cursor-pointer focus:border-purple-400"
               >
                 <option value="">AI Auto-Generated / Custom</option>
                 {dbSpecTemplates.map(temp => (
                     <option key={temp.id} value={temp.id}>Template: {temp.title}</option>
                 ))}
               </select>
             </div>
          </div>
          
          {Object.keys(specData).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
              {Object.keys(specData).map(field => (
                <div key={field} className="relative group bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">{field}</label>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveAutoSpec(field)} 
                      className="text-red-400 hover:text-red-600 transition p-1 bg-white rounded-md border border-gray-200 shadow-sm"
                      title="Remove field"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={specData[field] || ''} 
                    onChange={e => setSpecData({...specData, [field]: e.target.value})} 
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 outline-none text-sm font-semibold focus:border-purple-400 shadow-sm" 
                    placeholder={`Enter ${field.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100 mb-8 text-xs font-bold text-gray-400">
              No specifications loaded. Select a category or template first.
            </div>
          )}

          {/* Custom Specs Builder */}
          <div className="p-6 border border-dashed border-gray-300 rounded-2xl bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-gray-700">Add Extra Custom Fields</h3>
              <button type="button" onClick={handleAddCustomSpec} className="text-[11px] font-bold text-[#0A101D] bg-white border border-gray-200 px-4 py-2 rounded-xl hover:border-[#F2A900] transition flex items-center gap-1.5 shadow-sm">
                <FiPlus/> Add Field
              </button>
            </div>

            <div className="space-y-3">
              {customSpecs.map((spec, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center gap-3">
                  <input type="text" placeholder="Title (e.g. Warranty)" value={spec.key} onChange={e => handleCustomSpecChange(index, 'key', e.target.value)} className="w-full sm:w-1/3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold focus:border-[#F2A900] shadow-sm" />
                  <input type="text" placeholder="Value (e.g. 1 Year Local)" value={spec.value} onChange={e => handleCustomSpecChange(index, 'value', e.target.value)} className="w-full sm:flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-medium focus:border-[#F2A900] shadow-sm" />
                  <button type="button" onClick={() => removeCustomSpec(index)} className="w-full sm:w-auto text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 p-2.5 rounded-xl transition flex justify-center items-center"><FiTrash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 pb-10">
          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#0A101D] to-gray-900 hover:from-black hover:to-black text-white font-black py-4 rounded-2xl text-base transition-all shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:scale-[1.01] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2">
            {isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing & Uploading...</> : 'Launch Product to Store 🚀'}
          </button>
        </div>
      </form>
    </div>
  );
}
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiBox, FiDatabase, FiAlertTriangle, FiCheckCircle, FiImage, FiX, FiEdit2, FiTrash2, FiSettings, FiTag, FiCpu } from 'react-icons/fi';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Laptops'); 
  const [customCategory, setCustomCategory] = useState(''); 
  const [accessoryType, setAccessoryType] = useState('');
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState(''); 
  const [badge, setBadge] = useState(''); 
  const [condition, setCondition] = useState('Brand New');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [specData, setSpecData] = useState<any>({}); 
  const [customSpecs, setCustomSpecs] = useState<{key: string, value: string}[]>([]); 
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Edit States
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editSpecData, setEditSpecData] = useState<any>({});
  const [editCustomSpecs, setEditCustomSpecs] = useState<{key: string, value: string}[]>([]); 
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  const STANDARD_CATEGORIES = [
    "Laptops", "Desktop Computers", "All-in-One PCs", "Mini PCs", "Workstations", 
    "Servers", "Monitors", "Printers", "Scanners", "Projectors", 
    "TVs", "Smart TVs", "Digital Signage Displays", "Mobile Phones", "Smartphones", 
    "Tablets", "E-Readers", "Smartwatches", "Fitness Trackers", 
    "Accessories", 
    "Gaming Consoles", "VR Headsets", "Home & Kitchen", "Beauty", "Other"
  ];

  const ACCESSORY_TYPES = [
    "Phone / Tablet", "Computer / Laptop", "Gaming", "Audio / Studio", "Automotive", "Other"
  ];

  const getImagesArray = (imgData: string) => {
    if (!imgData) return [];
    try {
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) ? parsed : [imgData];
    } catch(e) {
      return [imgData]; 
    }
  };

  useEffect(() => {
    if (name && category && !editingProduct) {
      const catToUse = category === 'Other' && customCategory ? customCategory : category;
      const prefix = catToUse.substring(0, 3).toUpperCase();
      const namePart = name.substring(0, 3).toUpperCase();
      const randomId = Math.floor(1000 + Math.random() * 9000);
      setSku(`${prefix}-${namePart}-${randomId}`);
    }
  }, [name, category, customCategory, editingProduct]);

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
      setEditingProduct({ ...editingProduct, category: val, accessoryType: '' });
    } else {
      setCategory(val);
      setAccessoryType('');
      setCustomCategory(''); 
      setSpecData({});
    }
  };

  const handleAccessoryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, isEdit: boolean = false) => {
    const val = e.target.value;
    if (isEdit) {
      setEditingProduct({ ...editingProduct, accessoryType: val });
      setEditSpecData({});
    } else {
      setAccessoryType(val);
      setSpecData({});
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (files) {
      let filesArray = Array.from(files);
      const currentPreviews = isEdit ? editImagePreviews : imagePreviews;
      const spaceLeft = 5 - currentPreviews.length;
      
      if (filesArray.length > spaceLeft) {
        alert(`Limit is 5 images. You can only add ${spaceLeft} more.`);
        filesArray = filesArray.slice(0, spaceLeft);
      }

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
      setEditImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    } else {
      setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
      setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleAddCustomSpec = (isEdit: boolean = false) => {
    if (isEdit) {
      setEditCustomSpecs([...editCustomSpecs, { key: '', value: '' }]);
    } else {
      setCustomSpecs([...customSpecs, { key: '', value: '' }]);
    }
  };

  const handleCustomSpecChange = (index: number, field: 'key' | 'value', val: string, isEdit: boolean = false) => {
    if (isEdit) {
      const updated = [...editCustomSpecs];
      updated[index][field] = val;
      setEditCustomSpecs(updated);
    } else {
      const updated = [...customSpecs];
      updated[index][field] = val;
      setCustomSpecs(updated);
    }
  };

  const removeCustomSpec = (index: number, isEdit: boolean = false) => {
    if (isEdit) {
      setEditCustomSpecs(editCustomSpecs.filter((_, i) => i !== index));
    } else {
      setCustomSpecs(customSpecs.filter((_, i) => i !== index));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');

    let finalCategory = category;
    
    if (category === 'Accessories' && accessoryType) {
       finalCategory = `Accessories - ${accessoryType}`;
    } else if (category === 'Other' && customCategory.trim() !== '') {
       finalCategory = customCategory.trim();
    }

    const finalSpecs = { ...specData };
    customSpecs.forEach(spec => {
      if (spec.key.trim() !== '') {
        finalSpecs[spec.key.trim()] = spec.value;
      }
    });

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
    formData.append('stockQuantity', stockQuantity); 
    formData.append('specifications', JSON.stringify(finalSpecs));
    
    imageFiles.forEach((file) => formData.append('images', file));

    try {
      const res = await fetch(`${API_URL}/api/products`, { method: 'POST', body: formData });
      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch(e) { data = { error: rawText }; }

      if (res.ok) {
        setMessage('Product added successfully!');
        setSku(''); setName(''); setBrand(''); setModelName(''); setBadge(''); setCondition('Brand New'); setBuyingPrice(''); setPrice(''); setStockQuantity(''); 
        setSpecData({}); setCustomSpecs([]); setAccessoryType(''); setCustomCategory('');
        setImageFiles([]); setImagePreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchProducts();
      } else {
        setError(`Failed: ${data.error || "Server rejected the data."}`);
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setError(''); setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      const errorText = await res.text();
      if (res.ok) {
        setMessage('Product deleted successfully!');
        fetchProducts(); 
      } else {
        let errorMsg = res.statusText;
        try { const parsed = JSON.parse(errorText); if (parsed.error) errorMsg = parsed.error; } catch(e) { if (errorText && errorText.length < 150) errorMsg = errorText; }
        setError(`Delete failed: ${errorMsg}`);
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`);
    }
  };

  const openEditModal = (product: any) => {
    let baseCategory = product.category;
    let accType = '';
    
    if (baseCategory && baseCategory.startsWith('Accessories - ')) {
       baseCategory = 'Accessories';
       accType = product.category.replace('Accessories - ', '');
    } else if (!STANDARD_CATEGORIES.includes(baseCategory)) {
       baseCategory = 'Other';
       setCustomCategory(product.category);
    } else {
       setCustomCategory('');
    }

    setEditingProduct({ ...product, category: baseCategory, accessoryType: accType });
    setEditImageFiles([]);
    
    const existingImages = getImagesArray(product.imageUrl).map((img: string) => `${API_URL}${img}`);
    setEditImagePreviews(existingImages);
    
    if (product.specifications) {
      try { 
        const parsedSpecs = JSON.parse(product.specifications); 
        
        const knownFields = getStandardFields(baseCategory, accType);
        const stSpecs: any = {};
        const cuSpecs: {key: string, value: string}[] = [];

        Object.keys(parsedSpecs).forEach(key => {
           if (knownFields.includes(key)) {
             stSpecs[key] = parsedSpecs[key];
           } else {
             cuSpecs.push({ key, value: parsedSpecs[key] });
           }
        });

        setEditSpecData(stSpecs);
        setEditCustomSpecs(cuSpecs);

      } catch (e) { 
        setEditSpecData({}); 
        setEditCustomSpecs([]);
      }
    } else {
      setEditSpecData({});
      setEditCustomSpecs([]);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');

    let finalCategory = editingProduct.category;
    if (editingProduct.category === 'Accessories' && editingProduct.accessoryType) {
      finalCategory = `Accessories - ${editingProduct.accessoryType}`;
    } else if (editingProduct.category === 'Other' && customCategory.trim() !== '') {
      finalCategory = customCategory.trim();
    }

    const finalSpecs = { ...editSpecData };
    editCustomSpecs.forEach(spec => {
      if (spec.key.trim() !== '') {
        finalSpecs[spec.key.trim()] = spec.value;
      }
    });

    const formData = new FormData();
    formData.append('sku', editingProduct.sku); 
    formData.append('name', editingProduct.name);
    formData.append('category', finalCategory); 
    formData.append('brand', editingProduct.brand);
    formData.append('model', editingProduct.model || ''); 
    formData.append('badge', editingProduct.badge || ''); 
    formData.append('condition', editingProduct.condition || 'Brand New');
    formData.append('buyingPrice', editingProduct.buyingPrice); 
    formData.append('price', editingProduct.price);
    formData.append('stockQuantity', editingProduct.stockQuantity); 
    formData.append('specifications', JSON.stringify(finalSpecs));
    
    editImageFiles.forEach((file) => formData.append('images', file));

    try {
      const res = await fetch(`${API_URL}/api/products/${editingProduct.id}`, { method: 'PUT', body: formData });
      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch(e) { data = { error: rawText }; }

      if (res.ok) {
        setMessage('Product updated successfully!');
        setEditingProduct(null);
        fetchProducts();
      } else {
        setError(`Failed: ${data.error || "Server rejected the data."}`);
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ======================================================================
  // DYNAMIC SPECIFICATIONS KUTOKA KWENYE PICHA ZAKO
  // ======================================================================
  const getStandardFields = (cat: string, accType?: string) => {
    let fields: string[] = [];
    const normalizedCat = cat ? cat.toLowerCase() : '';

    if (normalizedCat === 'accessories') {
       const type = accType?.toLowerCase() || '';
       if (type.includes('phone') || type.includes('tablet')) fields = ['Connection Type', 'Cable Length / Capacity', 'Fast Charging Support', 'Color', 'Material'];
       else if (type.includes('computer') || type.includes('laptop')) fields = ['Interface (USB/Type-C)', 'DPI/Sensitivity', 'Cable Length', 'Ergonomics', 'Color'];
       else if (type.includes('gaming')) fields = ['Compatibility', 'Connection Type', 'Feedback/Vibration', 'RGB Lighting', 'Color'];
       else if (type.includes('audio') || type.includes('studio')) fields = ['Connection Type', 'Frequency Response', 'Microphone Type', 'Cable Length', 'Color'];
       else if (type.includes('automotive')) fields = ['Voltage/Power Output', 'Mounting Type', 'Connectivity (e.g. 4G/GSM)', 'Cable Length', 'Material'];
       else fields = ['Connection Type', 'Compatibility', 'Color', 'Material', 'Special Features'];
    } 
    else if (normalizedCat.includes('server')) {
      fields = ['Server Type', 'Processor', 'Processor Speed', 'Memory', 'Storage', 'RAID Controller', 'Network', 'Operating System', 'Ports', 'Color'];
    } 
    else if (normalizedCat.includes('mini pc') || normalizedCat.includes('desktop computer') || normalizedCat.includes('all-in-one') || normalizedCat.includes('workstation')) {
      fields = ['Desktop Type', 'Processor', 'Processor Speed', 'RAM', 'Storage', 'Graphics', 'Resolution', 'Connectivity', 'Ports', 'Color'];
    } 
    else if (normalizedCat.includes('laptop')) {
      fields = ['Processor', 'Processor Speed', 'RAM', 'Storage', 'Graphics', 'Display Size', 'Resolution', 'Operating System', 'Connectivity', 'Ports', 'Battery', 'Color'];
    } 
    else if (normalizedCat.includes('monitor')) {
      fields = ['Screen Size', 'Display Type', 'Resolution', 'Refresh Rate', 'Response Time', 'Brightness', 'Connectivity', 'Ports', 'Features', 'Color'];
    } 
    else if (normalizedCat.includes('digital signage')) {
      fields = ['Display Type', 'Screen Size', 'Resolution', 'Brightness', 'Refresh Rate', 'Operating System', 'Connectivity', 'Features', 'Color'];
    } 
    else if (normalizedCat.includes('tv') || normalizedCat.includes('smart tv')) {
      fields = ['Display Technology', 'Screen Size', 'Resolution', 'Refresh Rate', 'HDR', 'Audio', 'Connectivity', 'Features', 'Operating System', 'Color'];
    } 
    else if (normalizedCat.includes('projector')) {
      fields = ['Display Technology', 'Resolution', 'Brightness', 'Contrast Ratio', 'Lamp Life', 'Projection Size', 'Connectivity', 'Features', 'Color'];
    } 
    else if (normalizedCat.includes('printer')) {
      fields = ['Printer Type', 'Functions', 'Print Technology', 'Print Speed', 'Print Resolution', 'Paper Size', 'Paper Capacity', 'Connectivity', 'Features', 'Color'];
    } 
    else if (normalizedCat.includes('scanner')) {
      fields = ['Scanner Type', 'Scan Speed', 'Scan Resolution', 'Document Feeder', 'Display', 'Connectivity', 'Features', 'Color'];
    } 
    else if (normalizedCat.includes('phone') || normalizedCat.includes('smartphone') || normalizedCat.includes('tablet') || normalizedCat.includes('e-reader')) {
      fields = ['Network', 'SIM', 'Display', 'Resolution', 'Processor', 'Memory', 'Storage', 'Expandable Storage', 'Battery', 'Connectivity', 'Features', 'Color'];
    } 
    else if (normalizedCat.includes('smartwatch') || normalizedCat.includes('fitness tracker')) {
      fields = ['Screen Size', 'Battery Life', 'Water Resistance', 'OS Compatibility', 'Connectivity', 'Features', 'Color'];
    } 
    else if (normalizedCat.includes('console') || normalizedCat.includes('vr')) {
      fields = ['Storage', 'Resolution Output', 'Included Controllers', 'Connectivity', 'Features', 'Color'];
    } 
    else if (normalizedCat.includes('home') || normalizedCat.includes('kitchen')) {
      fields = ['Material', 'Power (Watts)', 'Color', 'Dimensions', 'Features'];
    } 
    else if (normalizedCat !== 'other') {
      fields = ['Feature 1', 'Feature 2', 'Color', 'Weight'];
    }
    return fields;
  };

  const renderDynamicSpecs = (cat: string, currentState: any, setState: any, accType?: string) => {
    const fields = getStandardFields(cat, accType);
    if (fields.length === 0) return null; 

    const title = cat === 'Accessories' && accType ? `${accType} Specs` : `${cat} Specs`;

    return (
      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 mt-2">
        <h3 className="text-xs font-black text-gray-700 mb-3 flex items-center gap-2"><FiSettings/> {title}</h3>
        <div className="grid grid-cols-2 gap-3">
          {fields.map(field => (
            <div key={field}>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{field}</label>
              <input 
                type="text" 
                value={currentState[field] || ''} 
                onChange={e => setState({...currentState, [field]: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F2A900] transition" 
                placeholder={`Enter ${field}`} 
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCustomSpecsBuilder = (customArray: {key: string, value: string}[], isEdit: boolean) => {
    return (
      <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/30">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-gray-700">Custom Specifications</h3>
          <button type="button" onClick={() => handleAddCustomSpec(isEdit)} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition flex items-center gap-1">
            <FiPlus/> Add Field
          </button>
        </div>
        
        {customArray.length === 0 && <p className="text-[10px] text-gray-400 italic">No custom specifications added.</p>}

        <div className="space-y-2">
          {customArray.map((spec, index) => (
            <div key={index} className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Spec Name (e.g. Warranty)" 
                value={spec.key} 
                onChange={e => handleCustomSpecChange(index, 'key', e.target.value, isEdit)} 
                className="w-1/3 bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none text-[11px] focus:border-[#F2A900]" 
              />
              <input 
                type="text" 
                placeholder="Value (e.g. 1 Year)" 
                value={spec.value} 
                onChange={e => handleCustomSpecChange(index, 'value', e.target.value, isEdit)} 
                className="flex-1 bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none text-[11px] focus:border-[#F2A900]" 
              />
              <button type="button" onClick={() => removeCustomSpec(index, isEdit)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition">
                <FiTrash2 size={14}/>
              </button>
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
          <h1 className="text-2xl font-black text-gray-900">Products & Inventory</h1>
          <p className="text-sm text-gray-500">Manage your stock, custom categories, SKUs, and specs here.</p>
        </div>
      </div>

      {message && <div className="mb-4 p-4 bg-green-50 text-green-600 text-sm rounded-xl flex items-center gap-2 font-bold shadow-sm"><FiCheckCircle className="text-lg" /> {message}</div>}
      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 font-bold shadow-sm break-words"><FiAlertTriangle className="text-lg" /> {error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ADD PRODUCT FORM */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-max">
          <h2 className="font-bold mb-4 flex items-center gap-2 border-b pb-3">
            <FiPlus className="text-[#F2A900]" /> Add New Product
          </h2>

          <form onSubmit={handleAddProduct} className="space-y-4">
            
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Product Images (Max 5)</label>
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
              {imagePreviews.length < 5 && (
                <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, false)} ref={fileInputRef} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F2A900]/10 file:text-[#0F172A] hover:file:bg-[#F2A900]/20 transition cursor-pointer" />
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Product Name</label>
              <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2"><FiBox className="text-gray-400 mr-2" /><input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm" placeholder="e.g. HP LaserJet Pro / iPhone 15" /></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Category</label>
                <select value={category} onChange={(e) => handleCategoryChange(e, false)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-medium">
                  {STANDARD_CATEGORIES.map(catOpt => (
                    <option key={catOpt} value={catOpt}>{catOpt}</option>
                  ))}
                </select>
              </div>
              
              {category === 'Accessories' && (
                <div className="col-span-2 animate-fade-in">
                  <label className="block text-[11px] font-bold text-blue-500 uppercase mb-1 flex items-center gap-1">Accessory For?</label>
                  <select required value={accessoryType} onChange={(e) => handleAccessoryTypeChange(e, false)} className="w-full bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 outline-none text-sm font-medium text-blue-800 focus:border-blue-400">
                    <option value="">Select Accessory Type</option>
                    {ACCESSORY_TYPES.map(accOpt => (
                      <option key={accOpt} value={accOpt}>{accOpt}</option>
                    ))}
                  </select>
                </div>
              )}

              {category === 'Other' && (
                <div className="col-span-2 animate-fade-in">
                  <label className="block text-[11px] font-bold text-purple-600 uppercase mb-1 flex items-center gap-1">Custom Category Name</label>
                  <input type="text" required value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="w-full bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 outline-none text-sm focus:border-purple-500" placeholder="e.g. Solar Panels" />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Brand</label>
                <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm" placeholder="Apple / HP" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><FiCpu className="text-gray-400"/> Model</label>
                <input type="text" value={modelName} onChange={e => setModelName(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F2A900]" placeholder="e.g. ProBook 840 G8" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">SKU (Auto)</label>
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
                  <option value="">None</option>
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

            <div>
              {renderDynamicSpecs(category, specData, setSpecData, accessoryType)}
              {renderCustomSpecsBuilder(customSpecs, false)}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Buying Price</label>
                <input type="number" value={buyingPrice} onChange={e => setBuyingPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-black" placeholder="200000" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Selling Price</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none text-sm font-black text-[#0F172A]" placeholder="250000" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-sm transition mt-4 shadow-md">
              {isLoading ? 'Processing...' : 'Save Product'}
            </button>
          </form>
        </div>

        {/* INVENTORY LIST TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-max">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold">Inventory List</h2>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">Total: {products.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-4">Image & SKU</th>
                  <th className="px-4 py-4">Product Details</th>
                  <th className="px-4 py-4">Price (Tsh)</th>
                  <th className="px-4 py-4">Stock</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {products.map((p) => {
                  const displayImage = getImagesArray(p.imageUrl)[0];
                  
                  return (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 flex items-center gap-3">
                      {displayImage ? ( <img src={`${API_URL}${displayImage}`} className="w-10 h-10 object-cover rounded border border-gray-200 bg-white" /> ) : ( <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl">{p.imageEmoji || '📦'}</div> )}
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{p.sku}</span>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-800">
                      {p.name} 
                      <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                        {p.brand} {p.model ? <span className="text-blue-600 font-bold ml-1">| Model: {p.model}</span> : ''}
                      </div>
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
                )})}
                {products.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium">No products in database.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-black flex items-center gap-2"><FiEdit2 className="text-blue-500" /> Edit Product</h2>
              <button onClick={() => setEditingProduct(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"><FiX size={20} /></button>
            </div>
            
            <form onSubmit={handleUpdateProduct} className="p-4 sm:p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Images (Adding new replaces all)</label>
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

              <div><label className="block text-xs font-bold text-gray-500 mb-1">Product Name</label><input type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select value={editingProduct.category} onChange={(e) => handleCategoryChange(e, true)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm font-medium">
                    {STANDARD_CATEGORIES.map(catOpt => (
                      <option key={catOpt} value={catOpt}>{catOpt}</option>
                    ))}
                    {!STANDARD_CATEGORIES.includes(editingProduct.category) && (
                      <option value={editingProduct.category}>{editingProduct.category} (Legacy)</option>
                    )}
                  </select>
                </div>
                
                {editingProduct.category === 'Accessories' && (
                  <div className="col-span-2 animate-fade-in">
                    <label className="block text-[11px] font-bold text-blue-500 uppercase mb-1 flex items-center gap-1">Accessory For?</label>
                    <select required value={editingProduct.accessoryType || ''} onChange={(e) => handleAccessoryTypeChange(e, true)} className="w-full bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 outline-none text-sm font-medium text-blue-800 focus:border-blue-400">
                      <option value="">Select Accessory Type</option>
                      {ACCESSORY_TYPES.map(accOpt => (
                        <option key={accOpt} value={accOpt}>{accOpt}</option>
                      ))}
                    </select>
                  </div>
                )}

                {editingProduct.category === 'Other' && (
                  <div className="col-span-2 animate-fade-in">
                    <label className="block text-[11px] font-bold text-purple-600 uppercase mb-1 flex items-center gap-1">Custom Category Name</label>
                    <input type="text" required value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="w-full bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 outline-none text-sm focus:border-purple-500" placeholder="e.g. Solar Panels" />
                  </div>
                )}

                <div><label className="block text-xs font-bold text-gray-500 mb-1">Brand</label><input type="text" value={editingProduct.brand} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                <div><label className="block text-xs font-bold text-blue-500 mb-1 flex items-center gap-1"><FiCpu/> Model Name</label><input type="text" value={editingProduct.model || ''} onChange={e => setEditingProduct({...editingProduct, model: e.target.value})} className="w-full border border-blue-200 focus:border-[#F2A900] rounded-xl px-3 py-2 text-sm" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-500 mb-1">SKU</label><input type="text" value={editingProduct.sku} onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Stock</label><input type="number" value={editingProduct.stockQuantity} onChange={e => setEditingProduct({...editingProduct, stockQuantity: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><FiTag className="text-[#F2A900]"/> Badge</label>
                  <select value={editingProduct.badge || ''} onChange={e => setEditingProduct({...editingProduct, badge: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm font-medium">
                    <option value="">None</option>
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

              <div>
                {renderDynamicSpecs(editingProduct.category, editSpecData, setEditSpecData, editingProduct.accessoryType)}
                {renderCustomSpecsBuilder(editCustomSpecs, true)}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Buying Price</label><input type="number" value={editingProduct.buyingPrice} onChange={e => setEditingProduct({...editingProduct, buyingPrice: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Selling Price</label><input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              </div>

              <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-md">
                  {isLoading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
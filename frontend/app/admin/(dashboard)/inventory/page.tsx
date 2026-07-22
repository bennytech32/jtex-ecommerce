'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiX, FiCheckCircle, FiAlertTriangle, FiTruck, FiAnchor, FiTag, FiCpu, FiFilter, FiImage, FiSettings, FiPlus } from 'react-icons/fi';

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // --- Edit States ---
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editSpecData, setEditSpecData] = useState<any>({});
  const [editCustomSpecs, setEditCustomSpecs] = useState<{key: string, value: string}[]>([]); 
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [editIsPreOrder, setEditIsPreOrder] = useState(false);
  const [editShippingOrigin, setEditShippingOrigin] = useState<'Dubai' | 'China'>('Dubai');
  const [editFreightType, setEditFreightType] = useState<'Air' | 'Sea'>('Air');
  const [editCustomCategory, setEditCustomCategory] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  const STANDARD_CATEGORIES = [
    "Laptops", "Desktop Computers", "All-in-One PCs", "Mini PCs", "Workstations", 
    "Servers", "Monitors", "Printers", "Scanners", "Projectors", 
    "TVs", "Smart TVs", "Digital Signage Displays", "Mobile Phones", "Smartphones", 
    "Tablets", "E-Readers", "Smartwatches", "Fitness Trackers", 
    "Accessories", "Gaming Consoles", "VR Headsets", "Home & Kitchen", "Beauty", "Other"
  ];

  const ACCESSORY_TYPES = [
    "Phone / Tablet", "Computer / Laptop", "Gaming", "Audio / Studio", "Automotive", "Other"
  ];

  const shippingConfig = {
    Dubai: { days: "5–10 business days", icon: "🇦🇪" },
    China: { days: "10–30 business days", icon: "🇨🇳" },
    Air: { desc: "Fastest shipping option.", icon: <FiTruck className="text-sky-600"/> },
    Sea: { desc: "Longer transit time.", icon: <FiAnchor className="text-blue-800"/> }
  };

  const getImagesArray = (imgData: string) => {
    if (!imgData) return [];
    try {
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) ? parsed : [imgData];
    } catch(e) { return [imgData]; }
  };

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/api/products`, { cache: 'no-store' }),
        fetch(`${API_URL}/api/categories`).catch(() => ({ ok: false, json: () => [] }))
      ]);

      if (prodRes.ok) {
        const pData = await prodRes.json();
        setProducts(pData);
        setFilteredProducts(pData);
      }
      
      if (catRes.ok) {
        const cData = await catRes.json();
        setDbCategories(cData.length > 0 ? cData : STANDARD_CATEGORIES.map((c, i) => ({id: i.toString(), name: c})));
      } else {
        setDbCategories(STANDARD_CATEGORIES.map((c, i) => ({id: i.toString(), name: c})));
      }
    } catch (err) {
      setError('Imeshindwa kupakia data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Search & Filter Logic
  useEffect(() => {
    let result = products;
    if (filterCategory !== 'All') {
      result = result.filter(p => p.category?.toLowerCase().includes(filterCategory.toLowerCase()));
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
    }
    setFilteredProducts(result);
  }, [searchQuery, filterCategory, products]);

  const handleDeleteProduct = async (id: string | number) => {
    if (!window.confirm("Una uhakika unataka kufuta bidhaa hii kabisa?")) return;
    setError(''); setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Bidhaa imefutwa kikamilifu!');
        fetchInitialData(); 
      } else { setError('Imeshindwa kufuta bidhaa.'); }
    } catch (err: any) { setError(`Tatizo la mtandao: ${err.message}`); }
  };

  // ==========================================
  // EDIT LOGIC
  // ==========================================
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
    else if (normalizedCat.includes('server')) fields = ['Server Type', 'Processor', 'Processor Speed', 'Memory', 'Storage', 'RAID Controller', 'Network', 'Operating System', 'Ports', 'Color'];
    else if (normalizedCat.includes('mini pc') || normalizedCat.includes('desktop') || normalizedCat.includes('all-in-one') || normalizedCat.includes('workstation')) fields = ['Desktop Type', 'Processor', 'Processor Speed', 'RAM', 'Storage', 'Graphics', 'Resolution', 'Connectivity', 'Ports', 'Color'];
    else if (normalizedCat.includes('laptop')) fields = ['Processor', 'Processor Speed', 'RAM', 'Storage', 'Graphics', 'Display Size', 'Resolution', 'Operating System', 'Connectivity', 'Ports', 'Battery', 'Color'];
    else if (normalizedCat.includes('monitor')) fields = ['Screen Size', 'Display Type', 'Resolution', 'Refresh Rate', 'Response Time', 'Brightness', 'Connectivity', 'Ports', 'Features', 'Color'];
    else if (normalizedCat.includes('digital signage')) fields = ['Display Type', 'Screen Size', 'Resolution', 'Brightness', 'Refresh Rate', 'Operating System', 'Connectivity', 'Features', 'Color'];
    else if (normalizedCat.includes('tv') || normalizedCat.includes('smart tv')) fields = ['Display Technology', 'Screen Size', 'Resolution', 'Refresh Rate', 'HDR', 'Audio', 'Connectivity', 'Features', 'Operating System', 'Color'];
    else if (normalizedCat.includes('projector')) fields = ['Display Technology', 'Resolution', 'Brightness', 'Contrast Ratio', 'Lamp Life', 'Projection Size', 'Connectivity', 'Features', 'Color'];
    else if (normalizedCat.includes('printer')) fields = ['Printer Type', 'Functions', 'Print Technology', 'Print Speed', 'Print Resolution', 'Paper Size', 'Paper Capacity', 'Connectivity', 'Features', 'Color'];
    else if (normalizedCat.includes('scanner')) fields = ['Scanner Type', 'Scan Speed', 'Scan Resolution', 'Document Feeder', 'Display', 'Connectivity', 'Features', 'Color'];
    else if (normalizedCat.includes('phone') || normalizedCat.includes('tablet') || normalizedCat.includes('e-reader')) fields = ['Network', 'SIM', 'Display', 'Resolution', 'Processor', 'Memory', 'Storage', 'Expandable Storage', 'Battery', 'Connectivity', 'Features', 'Color'];
    else if (normalizedCat.includes('smartwatch') || normalizedCat.includes('fitness')) fields = ['Screen Size', 'Battery Life', 'Water Resistance', 'OS Compatibility', 'Connectivity', 'Features', 'Color'];
    else if (normalizedCat.includes('console') || normalizedCat.includes('vr')) fields = ['Storage', 'Resolution Output', 'Included Controllers', 'Connectivity', 'Features', 'Color'];
    else if (normalizedCat.includes('home') || normalizedCat.includes('kitchen')) fields = ['Material', 'Power (Watts)', 'Color', 'Dimensions', 'Features'];
    else if (normalizedCat !== 'other') fields = ['Feature 1', 'Feature 2', 'Color', 'Weight'];
    
    return fields;
  };

  const openEditModal = (product: any) => {
    let baseCategory = product.category;
    let accType = '';
    
    if (baseCategory && baseCategory.startsWith('Accessories - ')) {
       baseCategory = 'Accessories';
       accType = product.category.replace('Accessories - ', '');
    } else if (!dbCategories.find(c => c.name === baseCategory) && !STANDARD_CATEGORIES.includes(baseCategory)) {
       baseCategory = 'Other';
       setEditCustomCategory(product.category);
    } else {
       setEditCustomCategory('');
    }

    setEditingProduct({ ...product, category: baseCategory, accessoryType: accType });
    setEditImageFiles([]);
    
    const existingImages = getImagesArray(product.imageUrl).map((img: string) => img.startsWith('http') ? img : `${API_URL}${img}`);
    setEditImagePreviews(existingImages);
    
    if (product.specifications) {
      try { 
        const parsed = JSON.parse(product.specifications); 
        const knownFields = getStandardFields(baseCategory, accType);
        const stSpecs: any = {};
        const cuSpecs: {key: string, value: string}[] = [];

        Object.keys(parsed).forEach(key => {
           if (knownFields.includes(key)) stSpecs[key] = parsed[key];
           else cuSpecs.push({ key, value: parsed[key] });
        });

        setEditSpecData(stSpecs);
        setEditCustomSpecs(cuSpecs);
      } catch (e) { setEditSpecData({}); setEditCustomSpecs([]); }
    } else {
      setEditSpecData({}); setEditCustomSpecs([]);
    }

    if (product.preOrderInfo) {
      try {
        const pInfo = JSON.parse(product.preOrderInfo);
        setEditIsPreOrder(pInfo.isPreOrder || false);
        if (pInfo.isPreOrder) {
          setEditShippingOrigin(pInfo.origin || 'Dubai');
          setEditFreightType(pInfo.freight || 'Air');
        }
      } catch (e) { setEditIsPreOrder(false); }
    } else { setEditIsPreOrder(false); }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      let filesArray = Array.from(files);
      const spaceLeft = 5 - editImagePreviews.length;
      if (filesArray.length > spaceLeft) {
        alert(`Mwisho ni picha 5. Unaweza kuongeza ${spaceLeft} tu.`);
        filesArray = filesArray.slice(0, spaceLeft);
      }
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setEditImageFiles(prev => [...prev, ...filesArray]);
      setEditImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeEditImage = (indexToRemove: number) => {
    setEditImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');

    let finalCategory = editingProduct.category;
    if (editingProduct.category === 'Accessories' && editingProduct.accessoryType) {
      finalCategory = `Accessories - ${editingProduct.accessoryType}`;
    } else if (editingProduct.category === 'Other' && editCustomCategory.trim() !== '') {
      finalCategory = editCustomCategory.trim();
    }

    const finalSpecs = { ...editSpecData };
    editCustomSpecs.forEach(spec => {
      if (spec.key.trim() !== '') finalSpecs[spec.key.trim()] = spec.value;
    });

    const preOrderInfo = editIsPreOrder ? {
      isPreOrder: true,
      origin: editShippingOrigin,
      freight: editFreightType,
      estDays: shippingConfig[editShippingOrigin].days
    } : { isPreOrder: false };

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
    formData.append('stockQuantity', editIsPreOrder ? '999' : editingProduct.stockQuantity); 
    formData.append('specifications', JSON.stringify(finalSpecs));
    formData.append('preOrderInfo', JSON.stringify(preOrderInfo));
    
    editImageFiles.forEach((file) => formData.append('images', file));

    try {
      const res = await fetch(`${API_URL}/api/products/${editingProduct.id}`, { method: 'PUT', body: formData });
      if (res.ok) {
        setMessage('Bidhaa imesasishwa kikamilifu!');
        setEditingProduct(null);
        fetchInitialData();
      } else {
        const rawText = await res.text();
        setError(`Imeshindwa: ${rawText}`);
      }
    } catch (err: any) { setError(`Tatizo la mtandao: ${err.message}`);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A101D]">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">Tazama, hariri, na dhibiti bidhaa zako zote zilizopo sokoni.</p>
        </div>
      </div>

      {message && <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-xl flex items-center gap-2 font-bold shadow-sm border border-green-100"><FiCheckCircle size={18} /> {message}</div>}
      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2 font-bold shadow-sm border border-red-100"><FiAlertTriangle size={18} /> {error}</div>}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
           <div className="bg-gray-100 p-2.5 rounded-xl text-gray-500"><FiFilter size={18}/></div>
           <select 
             value={filterCategory} 
             onChange={(e) => setFilterCategory(e.target.value)} 
             className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#F2A900] font-semibold w-full md:w-48 transition"
           >
             <option value="All">All Categories</option>
             {dbCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
           </select>
        </div>
        
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
          <input 
            type="text" 
            placeholder="Search by Name, SKU, or Brand..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-[#F2A900] transition"
          />
        </div>
      </div>

      {/* PROFESSIONAL INVENTORY TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0A101D] text-white">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold">Product Info</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold">Category & Brand</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold">Price (TZS)</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold">Stock Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-10 text-center"><div className="w-8 h-8 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="p-16 text-center text-gray-500 font-medium bg-gray-50/50">Hakuna bidhaa zilizopatikana.</td></tr>
              ) : (
                filteredProducts.map((p) => {
                  const displayImage = getImagesArray(p.imageUrl)[0];
                  const imgUrl = displayImage ? (displayImage.startsWith('http') ? displayImage : `${API_URL}${displayImage}`) : null;
                  let preInfo: any = null;
                  try { if(p.preOrderInfo) preInfo = JSON.parse(p.preOrderInfo); } catch(e){}

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0">
                             {imgUrl ? <img src={imgUrl} className="w-full h-full object-contain mix-blend-multiply" alt=""/> : <span className="text-xl">📦</span>}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-tight mb-1 line-clamp-1">{p.name}</p>
                            <span className="font-mono text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{p.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-[#0A101D] mb-1">{p.category}</p>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase">{p.brand || 'N/A'} {p.model ? `• ${p.model}` : ''}</p>
                      </td>
                      <td className="px-6 py-4 font-black text-[#0A101D] whitespace-nowrap">
                        {p.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {preInfo && preInfo.isPreOrder ? (
                           <div className="inline-flex flex-col gap-1">
                              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded text-[10px] uppercase font-bold flex items-center gap-1.5 w-max">
                                 <FiTruck/> Pre-Order
                              </span>
                              <span className="text-[9px] font-semibold text-gray-500">{shippingConfig[preInfo.origin as 'Dubai'|'China'].icon} {preInfo.origin}</span>
                           </div>
                        ) : (
                          <span className={`inline-flex px-2 py-1 rounded text-[10px] uppercase font-bold border ${p.stockQuantity > 5 ? 'bg-green-50 text-green-700 border-green-200' : p.stockQuantity > 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                              {p.stockQuantity} Pcs In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(p)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition border border-blue-100 hover:border-transparent" title="Edit">
                            <FiEdit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition border border-red-100 hover:border-transparent" title="Delete">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* EDIT MODAL - FULLY FUNCTIONAL */}
      {/* ========================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 bg-[#0A101D]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl relative my-auto">
            
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 p-5 lg:px-8 flex justify-between items-center z-10 rounded-t-3xl">
              <h2 className="text-xl font-black text-[#0A101D] flex items-center gap-2"><FiEdit2 className="text-[#F2A900]" /> Edit Product</h2>
              <button onClick={() => setEditingProduct(null)} className="w-8 h-8 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-full flex items-center justify-center transition"><FiX size={18} /></button>
            </div>
            
            <div className="p-5 lg:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <form id="editForm" onSubmit={handleUpdateProduct} className="space-y-6">
                
                {/* Images */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-2"><FiImage className="text-[#F2A900]"/> Product Images</label>
                  {editImagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {editImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group w-20 h-20 bg-white rounded-xl border border-gray-200 p-1">
                          <img src={preview} className="w-full h-full object-contain" />
                          <button type="button" onClick={() => removeEditImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><FiX className="text-xs" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  {editImagePreviews.length < 5 && (
                    <input type="file" accept="image/*" multiple onChange={(e) => handleEditImageChange(e)} ref={editFileInputRef} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F2A900]/10 file:text-[#0F172A] cursor-pointer" />
                  )}
                  <p className="text-[10px] text-gray-400 mt-2 italic">Kumbuka: Ukiongeza picha mpya, zitafuta zile za zamani mtandaoni.</p>
                </div>

                {/* Name & Basics */}
                <div><label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Product Name</label><input type="text" required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#F2A900] outline-none font-semibold text-gray-900" /></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Category</label>
                      <select value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-gray-800 focus:border-[#F2A900]">
                        {dbCategories.map(cat => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                        {!dbCategories.find(c => c.name === editingProduct.category) && (<option value={editingProduct.category}>{editingProduct.category} (Legacy)</option>)}
                      </select>
                    </div>
                    
                    {editingProduct.category === 'Accessories' && (
                      <div className="animate-fade-in">
                        <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1">Accessory For?</label>
                        <select required value={editingProduct.accessoryType || ''} onChange={(e) => setEditingProduct({...editingProduct, accessoryType: e.target.value})} className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-blue-900 focus:border-blue-400">
                          <option value="">Select Option</option>
                          {ACCESSORY_TYPES.map(acc => (<option key={acc} value={acc}>{acc}</option>))}
                        </select>
                      </div>
                    )}

                    {editingProduct.category === 'Other' && (
                      <div className="animate-fade-in">
                        <label className="block text-[11px] font-bold text-purple-600 uppercase mb-1">Custom Category Name</label>
                        <input type="text" required value={editCustomCategory} onChange={e => setEditCustomCategory(e.target.value)} className="w-full bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-purple-900 focus:border-purple-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Brand</label><input type="text" value={editingProduct.brand} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none font-semibold text-gray-800" /></div>
                        <div><label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 flex items-center gap-1"><FiCpu/> Model</label><input type="text" value={editingProduct.model || ''} onChange={e => setEditingProduct({...editingProduct, model: e.target.value})} className="w-full bg-gray-50 border border-blue-200 focus:border-blue-400 rounded-xl px-3 py-2.5 text-sm outline-none font-semibold text-gray-800" /></div>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">SKU</label><input type="text" value={editingProduct.sku} onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-500" /></div>
                        <div><label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Stock</label><input type="number" disabled={editIsPreOrder} value={editingProduct.stockQuantity} onChange={e => setEditingProduct({...editingProduct, stockQuantity: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-[#0A101D] disabled:bg-gray-100" /></div>
                     </div>
                  </div>
                </div>

                {/* Pre-Order Toggle & Panel */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-gray-50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${editIsPreOrder ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}><FiTruck size={20}/></div>
                      <div><label className="block text-sm font-bold text-gray-900">Available for Pre-Order</label><p className="text-[10px] font-medium text-gray-500 mt-0.5">Activate for out-of-stock items.</p></div>
                    </div>
                    <input type="checkbox" checked={editIsPreOrder} onChange={e => setEditIsPreOrder(e.target.checked)} className="w-6 h-6 accent-blue-600 cursor-pointer"/>
                  </div>
                  
                  {editIsPreOrder && (
                    <div className="bg-white p-5 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                      <div>
                        <label className="block text-[11px] font-bold text-blue-600 uppercase mb-2">Origin</label>
                        <select value={editShippingOrigin} onChange={e => setEditShippingOrigin(e.target.value as any)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-semibold text-gray-800 focus:border-blue-400">
                          <option value="Dubai">🇦🇪 Dubai → TZ</option><option value="China">🇨🇳 China → TZ</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-blue-600 uppercase mb-2">Freight Method</label>
                        <select value={editFreightType} onChange={e => setEditFreightType(e.target.value as any)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-semibold text-gray-800 focus:border-blue-400">
                          <option value="Air">✈️ Air Freight (Fast)</option><option value="Sea">🚢 Sea Freight (Slower)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Specs Section */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 mb-4">Specifications & Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><FiTag className="text-[#F2A900]"/> Badge</label>
                      <select value={editingProduct.badge || ''} onChange={e => setEditingProduct({...editingProduct, badge: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-gray-800">
                        <option value="">None</option><option value="Hot">🔥 Hot</option><option value="Sale">🏷️ Sale</option><option value="New">✨ New Arrival</option><option value="Pre-Order">📦 Pre-Order</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Condition</label>
                      <select value={editingProduct.condition || 'Brand New'} onChange={e => setEditingProduct({...editingProduct, condition: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-gray-800">
                        <option value="Brand New">Brand New</option><option value="Refurbished">Refurbished</option><option value="Used">Used</option>
                      </select>
                    </div>
                  </div>

                  {/* Standard Specs */}
                  {Object.keys(editSpecData).length > 0 && (
                    <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200 mb-4">
                      <h4 className="text-[11px] font-bold text-gray-600 uppercase mb-3 flex items-center gap-2"><FiSettings/> Standard Template Specs</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(editSpecData).map(field => (
                          <div key={field}>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{field}</label>
                            <input type="text" value={editSpecData[field] || ''} onChange={e => setEditSpecData({...editSpecData, [field]: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm font-medium focus:border-[#F2A900]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Specs */}
                  <div className="p-5 border border-dashed border-gray-300 rounded-2xl bg-gray-50/30">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold text-gray-700">Custom Fields</h3>
                      <button type="button" onClick={() => setEditCustomSpecs([...editCustomSpecs, {key:'', value:''}])} className="text-[11px] font-bold text-[#0A101D] bg-gray-200 px-3 py-1.5 rounded-lg hover:bg-[#F2A900] hover:text-black transition flex items-center gap-1"><FiPlus/> Add Field</button>
                    </div>
                    {editCustomSpecs.length === 0 && <p className="text-xs text-gray-400 italic">No extra custom fields.</p>}
                    <div className="space-y-3">
                      {editCustomSpecs.map((spec, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-center gap-3">
                          <input type="text" placeholder="Field Name" value={spec.key} onChange={e => {const u=[...editCustomSpecs]; u[index].key=e.target.value; setEditCustomSpecs(u)}} className="w-full sm:w-1/3 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F2A900] font-bold" />
                          <input type="text" placeholder="Value" value={spec.value} onChange={e => {const u=[...editCustomSpecs]; u[index].value=e.target.value; setEditCustomSpecs(u)}} className="w-full sm:flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F2A900]" />
                          <button type="button" onClick={() => setEditCustomSpecs(editCustomSpecs.filter((_,i)=>i!==index))} className="text-red-500 bg-red-50 p-2.5 rounded-lg hover:bg-red-100 transition"><FiTrash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Buying Price</label>
                    <input type="number" value={editingProduct.buyingPrice} onChange={e => setEditingProduct({...editingProduct, buyingPrice: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-black text-gray-600" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-green-600 uppercase mb-1">Selling Price (Public)</label>
                    <input type="number" required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 outline-none text-sm font-black text-[#0A101D] focus:border-green-500" />
                  </div>
                </div>

              </form>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 p-5 lg:px-8 rounded-b-3xl flex gap-4">
              <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-4 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-100 transition">Cancel</button>
              <button form="editForm" type="submit" disabled={isLoading} className="flex-[2] bg-[#0A101D] hover:bg-gray-800 text-white font-black py-4 rounded-xl text-sm transition shadow-lg disabled:bg-gray-400">
                {isLoading ? 'Updating...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
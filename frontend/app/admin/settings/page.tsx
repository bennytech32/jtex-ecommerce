'use client';

import React, { useState } from 'react';
import { FiSettings, FiSave, FiGlobe, FiLock, FiTruck, FiMapPin, FiPercent } from 'react-icons/fi';

const translations = {
  en: {
    title: "System Settings",
    subtitle: "Modify store configurations, security protocols, and location-based shipping fees.",
    tabGeneral: "Store Information",
    tabShipping: "Shipping & COD",
    tabSecurity: "Security Settings",
    generalTitle: "Basic Jtex Configurations",
    platformName: "Platform Name",
    contactEmail: "Contact Email Address",
    metaDesc: "Meta Description (SEO)",
    saveBtn: "Save Settings",
    shippingTitle: "Regional Shipping Logistics & Upfront Fees",
    shippingDesc: "Set specific delivery fees for all 31 regions across Tanzania. These values are used live during customer checkout.",
    regionLabel: "Region Name",
    feeLabel: "Fee (TZS)",
    upfrontTitle: "COD Upfront Payment Percentage",
    upfrontLabel: "Upfront Percentage (%)",
    upfrontHelp: "% of total order amount required from out-of-Dar customers before dispatch.",
    securityTitle: "Account Security Management",
    securityDesc: "Update your Super Admin access credentials and master passwords here.",
    securityBtn: "Send Password Reset Email",
    alertSuccess: "System settings updated successfully! 🔥",
    switchLang: "SWAHILI"
  },
  sw: {
    title: "Mipangilio ya Mfumo",
    subtitle: "Badilisha taarifa za duka, ulinzi, na gharama za usafirishaji wa mikoani.",
    tabGeneral: "Taarifa za Duka",
    tabShipping: "Usafirishaji & COD",
    tabSecurity: "Ulinzi (Security)",
    generalTitle: "Taarifa za Msingi za Jtex",
    platformName: "Jina la Jukwaa",
    contactEmail: "Barua Pepe ya Mawasiliano",
    metaDesc: "Maelezo (Meta Description)",
    saveBtn: "Hifadhi Mabadiliko",
    shippingTitle: "Gharama za Mikoani & Kianzio",
    shippingDesc: "Weka gharama maalum za usafirishaji kwa mikoa yote 31 ya Tanzania. Bei hizi zinasomwa live wakati mteja anafanya checkout mbele.",
    regionLabel: "Jina la Mkoa",
    feeLabel: "Gharama (TZS)",
    upfrontTitle: "Asilimia ya Kianzio (COD Upfront Payment)",
    upfrontLabel: "Asilimia ya Kianzio (%)",
    upfrontHelp: "% ya kiasi cha oda itakayolipwa na wateja wa mikoani kabla ya mzigo kusafirishwa.",
    securityTitle: "Ulinzi wa Akaunti",
    securityDesc: "Badilisha nywila (password) yako ya Super Admin na mifumo ya ulinzi hapa.",
    securityBtn: "Tuma Barua Pepe ya Kubadili Nywila",
    alertSuccess: "Mipangilio ya mfumo imehifadhiwa kikamilifu! 🔥",
    switchLang: "ENGLISH"
  }
};

const initialRegions = [
  { id: 'dar', name: 'Dar es Salaam', fee: 0 },
  { id: 'arusha', name: 'Arusha', fee: 10000 },
  { id: 'dodoma', name: 'Dodoma', fee: 10000 },
  { id: 'mwanza', name: 'Mwanza', fee: 10000 },
  { id: 'mbeya', name: 'Mbeya', fee: 10000 },
  { id: 'geita', name: 'Geita', fee: 12000 },
  { id: 'iringa', name: 'Iringa', fee: 10000 },
  { id: 'kagera', name: 'Kagera', fee: 12000 },
  { id: 'katavi', name: 'Katavi', fee: 15000 },
  { id: 'kigoma', name: 'Kigoma', fee: 15000 },
  { id: 'kilimanjaro', name: 'Kilimanjaro', fee: 10000 },
  { id: 'lindi', name: 'Lindi', fee: 10000 },
  { id: 'manyara', name: 'Manyara', fee: 10000 },
  { id: 'mara', name: 'Mara', fee: 12000 },
  { id: 'morogoro', name: 'Morogoro', fee: 8000 },
  { id: 'mtwara', name: 'Mtwara', fee: 10000 },
  { id: 'njombe', name: 'Njombe', fee: 10000 },
  { id: 'pwani', name: 'Pwani', fee: 5000 },
  { id: 'rukwa', name: 'Rukwa', fee: 15000 },
  { id: 'ruvuma', name: 'Ruvuma', fee: 12000 },
  { id: 'shinyanga', name: 'Shinyanga', fee: 10000 },
  { id: 'simiyu', name: 'Simiyu', fee: 12000 },
  { id: 'singida', name: 'Singida', fee: 10000 },
  { id: 'songwe', name: 'Songwe', fee: 12000 },
  { id: 'tabora', name: 'Tabora', fee: 10000 },
  { id: 'tanga', name: 'Tanga', fee: 10000 },
  { id: 'znz_urban', name: 'Zanzibar Urban/West', fee: 15000 },
  { id: 'znz_north', name: 'Zanzibar North', fee: 15000 },
  { id: 'znz_south', name: 'Zanzibar South/Central', fee: 15000 },
  { id: 'pemba_north', name: 'Pemba North', fee: 15000 },
  { id: 'pemba_south', name: 'Pemba South', fee: 15000 }
];

export default function AdminSettings() {
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  const [activeTab, setActiveTab] = useState<'general' | 'shipping' | 'security'>('general');
  
  // Dynamic editable states
  const [regions, setRegions] = useState(initialRegions);
  const [upfrontPercent, setUpfrontPercent] = useState(20);
  const [platformName, setPlatformName] = useState("Jtex Marketplace");
  const [contactEmail, setContactEmail] = useState("support@jtex.co.tz");
  const [metaDescription, setMetaDescription] = useState("Pata bidhaa bora kwa bei nafuu Tanzania.");

  const t = translations[lang];

  // Kushughulikia mabadiliko ya bei ya mkoa maalum
  const handleFeeChange = (id: string, newFee: number) => {
    setRegions(prev => prev.map(r => r.id === id ? { ...r, fee: newFee } : r));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Katika awamu ijayo tunaweza kutuma hii object kwenda kwenye API database ya live
    const configurationPayload = {
      platformName,
      contactEmail,
      metaDescription,
      upfrontPercent,
      regions
    };
    console.log("Saving Configuration to Live Server:", configurationPayload);
    alert(t.alertSuccess);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{t.title}</h1>
          <p className="text-sm text-gray-500 font-medium">{t.subtitle}</p>
        </div>
        <button 
          onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-[#0F172A] w-max shadow-sm hover:bg-gray-50 transition"
        >
          <FiGlobe /> {t.switchLang}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full md:w-64 bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100 p-4">
          <ul className="space-y-1.5">
            <li>
              <button 
                onClick={() => setActiveTab('general')} 
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-black flex items-center gap-3 transition ${activeTab === 'general' ? 'bg-[#0F172A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiGlobe className="text-lg" /> {t.tabGeneral}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('shipping')} 
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-black flex items-center gap-3 transition ${activeTab === 'shipping' ? 'bg-[#0F172A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiTruck className="text-lg" /> {t.tabShipping}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('security')} 
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-black flex items-center gap-3 transition ${activeTab === 'security' ? 'bg-[#0F172A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiLock className="text-lg" /> {t.tabSecurity}
              </button>
            </li>
          </ul>
        </div>

        {/* WORKSPACE AREA */}
        <div className="flex-1 p-5 sm:p-8 lg:p-10">
          
          {/* TAB 1: GENERAL SYSTEM SETTINGS */}
          {activeTab === 'general' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-black text-gray-900 mb-6 border-b pb-3 uppercase tracking-wider">{t.generalTitle}</h2>
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.platformName}</label>
                    <input 
                      type="text" 
                      value={platformName} 
                      onChange={e => setPlatformName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F2A900]/40 text-sm font-bold text-gray-800 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.contactEmail}</label>
                    <input 
                      type="email" 
                      value={contactEmail} 
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F2A900]/40 text-sm font-bold text-gray-800 transition" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.metaDesc}</label>
                  <textarea 
                    rows={4} 
                    value={metaDescription} 
                    onChange={e => setMetaDescription(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F2A900]/40 text-sm font-medium text-gray-700 transition"
                  />
                </div>
                <button type="submit" className="bg-[#0F172A] text-white px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-gray-800 transition shadow-sm">
                  <FiSave /> {t.saveBtn}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ALL 31 TANZANIA REGIONS LOGISTICS EDITABLE */}
          {activeTab === 'shipping' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-wider">{t.shippingTitle}</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed max-w-2xl">{t.shippingDesc}</p>
              
              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* 20% COD Upfront Configuration */}
                <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60 mb-6">
                  <h3 className="font-black text-gray-900 text-sm mb-1.5 flex items-center gap-2"><FiPercent className="text-[#F2A900]" /> {t.upfrontTitle}</h3>
                  <p className="text-xs text-gray-500 mb-4">{t.upfrontHelp}</p>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      value={upfrontPercent} 
                      onChange={e => setUpfrontPercent(Number(e.target.value))}
                      className="w-24 bg-white border-2 border-gray-200 focus:border-[#F2A900] rounded-xl px-3 py-2 outline-none text-sm font-black text-gray-900 transition text-center" 
                    />
                    <span className="text-sm font-black text-gray-700">%</span>
                  </div>
                </div>

                {/* Regions Grid (31 Regions) */}
                <div className="max-h-[400px] overflow-y-auto border border-gray-100 rounded-2xl p-2 bg-gray-50/20 pr-4 space-y-2">
                  {regions.map((region) => (
                    <div key={region.id} className="flex justify-between items-center p-3.5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition shadow-sm">
                      <div className="flex items-center gap-3">
                        <FiMapPin className={(region.fee === 0) ? 'text-green-500' : 'text-gray-400'} />
                        <span className="font-bold text-gray-800 text-sm">{region.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-bold">TZS</span>
                        <input 
                          type="number" 
                          value={region.fee} 
                          onChange={e => handleFeeChange(region.id, Number(e.target.value))}
                          className={`w-32 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none text-sm font-black text-right transition focus:ring-2 focus:ring-[#F2A900]/40 ${
                            region.fee === 0 ? 'text-green-600 font-black' : 'text-gray-900'
                          }`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="bg-[#0F172A] text-white px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-gray-800 transition shadow-md">
                  <FiSave /> {t.saveBtn}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: ACCOUNT SECURITY */}
          {activeTab === 'security' && (
            <div className="animate-fade-in text-center py-12 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
                <FiLock />
              </div>
              <h2 className="text-lg font-black text-gray-900 mb-1">{t.securityTitle}</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">{t.securityDesc}</p>
              <button onClick={() => alert('Reset sequence initialized!')} className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl text-sm font-black transition shadow-sm">
                {t.securityBtn}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
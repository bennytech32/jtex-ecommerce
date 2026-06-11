'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiHelpCircle, FiTruck, FiRefreshCcw, FiMapPin, 
  FiMessageCircle, FiSearch, FiChevronDown, FiChevronRight, 
  FiPackage, FiGlobe, FiMail 
} from 'react-icons/fi';

import TopTicker from '../components/navigation/TopTicker';
import NavbarLinks from '../components/navigation/NavbarLinks';
import Footer from '../components/common/Footer';

const translations = {
  en: {
    helpCenter: "Help Center",
    searchHelp: "How can we help you today?",
    tabs: {
      faq: "FAQs",
      track: "Track Your Order",
      returns: "Returns & Refunds",
      shipping: "Shipping Info",
      contact: "Contact Us"
    },
    track: {
      title: "Track Your Order",
      desc: "Enter your Order ID below to check the current status of your delivery.",
      placeholder: "e.g. ORD-123456",
      btn: "Track Order"
    },
    shipping: {
      title: "Shipping Information",
      subtitle1: "Delivery Zones & Fees",
      dar: "Dar es Salaam: Free Delivery (Within 24 Hours)",
      regions: "Other Regions (Tanzania): TZS 10,000 (2-3 Business Days)",
      eastAfrica: "East Africa (Kenya, Uganda, Rwanda): TZS 25,000 (3-5 Business Days)",
      subtitle2: "Delivery Rules",
      rule1: "Orders placed before 2:00 PM are processed the same day.",
      rule2: "A 20% upfront payment is required for deliveries outside Dar es Salaam.",
      rule3: "Our couriers will call you 30 minutes before arriving."
    },
    returns: {
      title: "Returns & Refunds Policy",
      intro: "We want you to be completely satisfied with your purchase. If you're not, here is our policy:",
      subtitle1: "7-Day Return Window",
      text1: "You have 7 days from the date of delivery to return an item if it is defective or not as described.",
      subtitle2: "Conditions for Return",
      text2: "Items must be unused, in their original packaging, and with all accessories and tags attached.",
      subtitle3: "Refund Process",
      text3: "Once we receive and inspect the item, refunds are processed within 3-5 business days to your original payment method (Mobile Money or Bank)."
    },
    faqData: [
      { q: "How do I make a payment?", a: "We accept Cash on Delivery (Dar es Salaam only), Mobile Money (M-Pesa, Tigo Pesa, Airtel Money), and Bank Cards." },
      { q: "Can I cancel my order?", a: "Yes, you can cancel your order within 1 hour of placing it by contacting our support team." },
      { q: "Do you sell original products?", a: "Absolutely. All our products are 100% genuine and come with a manufacturer's warranty." },
      { q: "What happens if I miss my delivery?", a: "Our courier will attempt delivery twice. If missed, the package will be returned to our warehouse, and you may need to pay an extra fee for redelivery." }
    ]
  },
  sw: {
    helpCenter: "Kituo cha Msaada",
    searchHelp: "Tukusaidie nini leo?",
    tabs: {
      faq: "Maswali Yanayoulizwa",
      track: "Fuatilia Oda Yako",
      returns: "Kurudisha & Kurejeshewa Pesa",
      shipping: "Taarifa za Usafirishaji",
      contact: "Wasiliana Nasi"
    },
    track: {
      title: "Fuatilia Oda Yako",
      desc: "Ingiza Namba ya Oda (Order ID) hapa chini kuona mzigo wako umefikia wapi.",
      placeholder: "Mfano: ORD-123456",
      btn: "Fuatilia Oda"
    },
    shipping: {
      title: "Taarifa za Usafirishaji",
      subtitle1: "Gharama na Maeneo",
      dar: "Dar es Salaam: Usafiri Bure (Ndani ya Saa 24)",
      regions: "Mikoani (Tanzania): TZS 10,000 (Siku 2-3 za Kazi)",
      eastAfrica: "Afrika Mashariki (Kenya, Uganda, Rwanda): TZS 25,000 (Siku 3-5 za Kazi)",
      subtitle2: "Sheria za Usafirishaji",
      rule1: "Oda zinazowekwa kabla ya saa 8:00 Mchana zinashughulikiwa siku hiyo hiyo.",
      rule2: "Kianzio cha 20% kinahitajika kwa wateja wa mkoani (Nje ya Dar es Salaam).",
      rule3: "Msafirishaji wetu atakupigia simu dakika 30 kabla ya kukufikia."
    },
    returns: {
      title: "Sera ya Kurudisha Bidhaa",
      intro: "Tunajali kuridhika kwako. Ikiwa haujaridhishwa na bidhaa, hii hapa ni sera yetu:",
      subtitle1: "Siku 7 za Kurudisha",
      text1: "Una siku 7 kuanzia siku uliyopokea mzigo kurudisha bidhaa ikiwa ina tatizo la kiwandani.",
      subtitle2: "Vigezo vya Kurudisha",
      text2: "Bidhaa haipaswi kuwa imetumika, lazima iwe kwenye box lake la asili, ikiwa na vifaa vyake vyote.",
      subtitle3: "Mchakato wa Pesa",
      text3: "Baada ya kupokea na kukagua bidhaa, pesa inarudishwa ndani ya siku 3-5 za kazi kupitia njia uliyotumia kulipia."
    },
    faqData: [
      { q: "Nalipiaje mzigo wangu?", a: "Tunapokea Malipo wakati wa kupokea mzigo (Dar pekee), Mitandao ya Simu (M-Pesa, Tigo Pesa, HaloPesa), na Kadi za Benki." },
      { q: "Je, naweza kusitisha (cancel) oda yangu?", a: "Ndio, unaweza kusitisha oda yako ndani ya saa 1 baada ya kuagiza kwa kuwasiliana na namba zetu za huduma kwa wateja." },
      { q: "Mnauza bidhaa orijino?", a: "Ndiyo asilimia 100%. Bidhaa zetu zote ni orijino na zinakuja na waranti (warranty) ya kiwandani." },
      { q: "Itakuwaje kama nisipopatikana wakati mzigo unaletwa?", a: "Msafirishaji wetu atajaribu kukuletea mara mbili. Ukikosekana, mzigo utarudishwa stoo na unaweza kutozwa faini ya usafiri wa kurudia." }
    ]
  }
};

export default function HelpCenter() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  const [activeTab, setActiveTab] = useState('faq');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [trackingId, setTrackingId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState<any>(null);

  const t = translations[lang];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['faq', 'track', 'returns', 'shipping', 'contact'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if(!trackingId) return;
    setTrackingStatus({ loading: true });
    setTimeout(() => {
      setTrackingStatus({
        loading: false,
        found: true,
        status: "SHIPPED",
        date: new Date().toLocaleDateString(),
        msg: lang === 'en' ? "Your order is on the way!" : "Mzigo wako upo njiani!"
      });
    }, 1500);
  };

  const tabs = [
    { id: 'faq', icon: <FiHelpCircle />, label: t.tabs.faq },
    { id: 'track', icon: <FiPackage />, label: t.tabs.track },
    { id: 'shipping', icon: <FiTruck />, label: t.tabs.shipping },
    { id: 'returns', icon: <FiRefreshCcw />, label: t.tabs.returns },
    { id: 'contact', icon: <FiMessageCircle />, label: t.tabs.contact },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans antialiased flex flex-col">
      <TopTicker />
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span onClick={() => router.push('/')} className="text-2xl font-black text-[#0F172A] tracking-tight cursor-pointer">
            J<span className="text-[#F2A900]">tex</span>
          </span>
          <button onClick={() => setLang(lang === 'en' ? 'sw' : 'en')} className="text-xs font-bold border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition">
            {lang === 'en' ? 'SW' : 'EN'}
          </button>
        </div>
      </header>
      <NavbarLinks />

      <div className="bg-[#0F172A] text-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black mb-4">{t.helpCenter}</h1>
          <div className="relative max-w-xl mx-auto flex items-center">
            <FiSearch className="absolute left-4 text-gray-400 text-lg" />
            <input 
              type="text" 
              placeholder={t.searchHelp} 
              className="w-full pl-12 pr-4 py-3.5 rounded-full outline-none text-gray-900 text-sm font-medium focus:ring-2 focus:ring-[#F2A900]"
            />
          </div>
        </div>
      </div>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 flex-1 -mt-8">
        
        <aside className="w-full lg:w-[280px] flex-shrink-0 relative z-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <nav className="p-2 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id ? 'bg-[#F2A900] text-[#0F172A] shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3"><span className="text-lg">{tab.icon}</span> {tab.label}</span>
                  {activeTab === tab.id && <FiChevronRight />}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <section className="flex-1 min-w-0 relative z-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 min-h-[500px]">
            
            {activeTab === 'faq' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3"><FiHelpCircle className="text-[#F2A900]"/> {t.tabs.faq}</h2>
                <div className="space-y-4">
                  {t.faqData.map((faq, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full px-5 py-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <span className="font-bold text-gray-900 text-sm">{faq.q}</span>
                        <FiChevronDown className={`transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaq === index && (
                        <div className="p-5 text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'track' && (
              <div className="animate-fade-in max-w-xl">
                <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3"><FiPackage className="text-[#F2A900]"/> {t.track.title}</h2>
                <p className="text-gray-500 text-sm mb-8">{t.track.desc}</p>
                <form onSubmit={handleTrack} className="flex gap-3 mb-8">
                  <input 
                    type="text" 
                    required
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder={t.track.placeholder}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F2A900]/50 text-sm font-mono uppercase"
                  />
                  <button type="submit" className="bg-[#0F172A] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition">
                    {t.track.btn}
                  </button>
                </form>

                {trackingStatus && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                    {trackingStatus.loading ? (
                      <div className="w-8 h-8 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><FiTruck /></div>
                        <h4 className="font-black text-gray-900 text-lg mb-1">{trackingStatus.status}</h4>
                        <p className="text-gray-500 text-sm mb-2">Updated: {trackingStatus.date}</p>
                        <p className="font-bold text-blue-600 text-sm bg-blue-50 py-2 rounded-lg">{trackingStatus.msg}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3"><FiTruck className="text-[#F2A900]"/> {t.shipping.title}</h2>
                
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 text-lg mb-4">{t.shipping.subtitle1}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"><FiMapPin className="text-[#F2A900] mt-1 text-lg" /><p className="text-sm font-medium">{t.shipping.dar}</p></div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"><FiMapPin className="text-gray-400 mt-1 text-lg" /><p className="text-sm font-medium">{t.shipping.regions}</p></div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"><FiGlobe className="text-blue-400 mt-1 text-lg" /><p className="text-sm font-medium">{t.shipping.eastAfrica}</p></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-4">{t.shipping.subtitle2}</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                    <li>{t.shipping.rule1}</li>
                    <li>{t.shipping.rule2}</li>
                    <li>{t.shipping.rule3}</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3"><FiRefreshCcw className="text-[#F2A900]"/> {t.returns.title}</h2>
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">{t.returns.intro}</p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-yellow-50 text-[#F2A900] rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg">1</div>
                    <div><h4 className="font-black text-gray-900 mb-1">{t.returns.subtitle1}</h4><p className="text-sm text-gray-600">{t.returns.text1}</p></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-yellow-50 text-[#F2A900] rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg">2</div>
                    <div><h4 className="font-black text-gray-900 mb-1">{t.returns.subtitle2}</h4><p className="text-sm text-gray-600">{t.returns.text2}</p></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-yellow-50 text-[#F2A900] rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg">3</div>
                    <div><h4 className="font-black text-gray-900 mb-1">{t.returns.subtitle3}</h4><p className="text-sm text-gray-600">{t.returns.text3}</p></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3"><FiMessageCircle className="text-[#F2A900]"/> {t.tabs.contact}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <a href="https://wa.me/255700000000" target="_blank" className="flex items-center gap-4 bg-green-50 p-6 rounded-2xl border border-green-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl"><FiMessageCircle /></div>
                    <div><h4 className="font-black text-green-900">WhatsApp</h4><p className="text-xs text-green-700 mt-1">Live Chat (24/7)</p></div>
                  </a>
                  <a href="mailto:support@jtex.co.tz" className="flex items-center gap-4 bg-blue-50 p-6 rounded-2xl border border-blue-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl"><FiMail /></div>
                    <div><h4 className="font-black text-blue-900">Email</h4><p className="text-xs text-blue-700 mt-1">support@jtex.co.tz</p></div>
                  </a>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
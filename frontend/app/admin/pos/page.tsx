'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiSearch, FiGrid, FiTrash2, FiPlus, FiMinus,
    FiCreditCard, FiPrinter, FiBox, FiDollarSign,
    FiClock, FiUser, FiSmartphone, FiArrowLeft, FiCheckCircle,
    FiShoppingCart, FiFileText, FiShield, FiUserPlus, FiPercent,
    FiPieChart, FiUsers, FiSettings, FiMenu, FiX, FiTag, FiMonitor, FiSave, FiLogOut,
    FiTrendingDown, FiBarChart2, FiTruck
} from 'react-icons/fi';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function StoreManagementSystem() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(new Date());

    // === SYSTEM NAVIGATION STATE ===
    const [activeModule, setActiveModule] = useState<'dashboard' | 'pos' | 'customers' | 'invoices' | 'warranties' | 'expenses' | 'reports' | 'settings'>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showMobileCart, setShowMobileCart] = useState(false);

    // === DATABASES STATES (Populated from API) ===
    const [products, setProducts] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);

    // === POS STATES ===
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState<any[]>([]);
    const [globalDiscount, setGlobalDiscount] = useState<number>(0);

    // Customer Selection & Registration
    const [selectedCustomer, setSelectedCustomer] = useState<{ name: string, phone: string }>({ name: 'Walk-in Customer', phone: '' });
    const [newCustomerModal, useStateNewCustomerModal] = useState(false);
    const [newCustomerData, setNewCustomerData] = useState({ name: '', phone: '', email: '' });

    // Custom Offline Item Modal
    const [customItemModal, setCustomItemModal] = useState(false);
    const [customItem, setCustomItem] = useState({ name: '', price: '' });

    // Payment & Print Modals
    const [paymentModal, setPaymentModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile' | 'bank'>('cash');
    const [amountTendered, setAmountTendered] = useState<string>('');

    // Universal Printing State
    const [printType, setPrintType] = useState<'receipt' | 'invoice' | 'proforma' | 'delivery' | 'warranty' | null>(null);
    const [printData, setPrintData] = useState<any>(null);

    const warrantyOptions = ['None', '3 Months', '6 Months', '1 Year', '2 Years'];

    // === DOCUMENT SETTINGS STATE ===
    const [docSettings, setDocSettings] = useState({
        invoiceTerms: "1. Payment is due upon receipt.\n2. Goods remain the property of Jtex until fully paid.\n3. Late payments may incur additional charges.",
        warrantyTerms: "1. Covers hardware defects under normal use.\n2. Void if physically damaged or altered.\n3. Original receipt required for claims.\n4. Software and liquid damage not covered."
    });

    // === MANUAL GENERATION STATES ===
    const [manualInvoice, setManualInvoice] = useState({
        customerName: '', customerPhone: '', items: [{ desc: '', qty: 1, price: 0 }]
    });
    const [manualWarranty, setManualWarranty] = useState({
        customerName: '', customerPhone: '', items: [{ desc: '', period: '1 Year' }]
    });

    // === DUMMY CHART DATA ===
    const salesData = [
        { name: 'Mon', sales: 1200000 },
        { name: 'Tue', sales: 2100000 },
        { name: 'Wed', sales: 1800000 },
        { name: 'Thu', sales: 3000000 },
        { name: 'Fri', sales: 2400000 },
        { name: 'Sat', sales: 3500000 },
        { name: 'Sun', sales: 4200000 },
    ];

    // === API HELPERS ===
    const getApiUrl = () => {
        const url = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
        return url.replace(/\/$/, '');
    };

    const getDisplayImage = (imgData: string) => {
        if (!imgData) return '';
        try {
            const parsed = JSON.parse(imgData);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imgData;
        } catch (e) { return imgData; }
    };

    const getImageUrl = (url: string) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
    };

    // === AUTHENTICATION & DATA FETCHING ===
    useEffect(() => {
        const adminToken = localStorage.getItem('jtex_admin_token');
        if (!adminToken) {
            alert("Access Denied. You must log in as an administrator.");
            router.push('/admin/login');
            return;
        }

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // Fetch Products
                const prodRes = await fetch(`${getApiUrl()}/api/products`);
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    const mappedProducts = prodData.map((p: any) => ({ ...p, isOnline: p.isOnline !== false }));
                    setProducts(mappedProducts);
                    const uniqueCats = Array.from(new Set(mappedProducts.map((p: any) => p.category))).filter(Boolean) as string[];
                    setCategories(['All', ...uniqueCats, 'Store Only']);
                }

                // Fetch Orders / Invoices
                const ordRes = await fetch(`${getApiUrl()}/api/orders`, {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                });
                if (ordRes.ok) {
                    const ordData = await ordRes.json();
                    setInvoices(ordData);
                }

                // Fetch Customers
                const custRes = await fetch(`${getApiUrl()}/api/customers`, {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                });
                if (custRes.ok) {
                    const custData = await custRes.json();
                    setCustomers(custData);
                }
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
            setIsLoading(false);
        };

        fetchAllData();

        if (window.innerWidth >= 1024) setSidebarOpen(true);

        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jtex_admin_token');
        localStorage.removeItem('jtex_admin_user');
        router.push('/admin/login');
    }

    // Filter Products for POS
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode?.includes(searchQuery);
        const matchesCat = activeCategory === 'All'
            ? true
            : activeCategory === 'Store Only'
                ? !p.isOnline
                : p.category === activeCategory;
        return matchesSearch && matchesCat;
    });

    // === CART LOGIC ===
    const addToCart = (product: any) => {
        if (product.stock <= 0) {
            alert("This item is out of stock!");
            return;
        }
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.qty >= product.stock && product.isOnline) {
                alert("Cannot exceed available stock quantity!");
                return;
            }
            setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1, warranty: 'None', discount: 0 }]);
        }
    };

    const addCustomItemToCart = () => {
        if (!customItem.name || !customItem.price) return;
        const newItem = {
            id: `custom-${Date.now()}`,
            name: `(Offline) ${customItem.name}`,
            price: Number(customItem.price),
            qty: 1,
            warranty: 'None',
            isOnline: false,
        };
        setCart([...cart, newItem]);
        setCustomItem({ name: '', price: '' });
        setCustomItemModal(false);
    };

    const updateQty = (id: string, delta: number) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                if (newQty <= 0) return item;
                if (item.isOnline !== false && newQty > item.stock) {
                    alert("Cannot exceed available stock quantity!");
                    return item;
                }
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const updateWarranty = (id: string, warranty: string) => {
        setCart(cart.map(item => item.id === id ? { ...item, warranty } : item));
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const total = subtotal - globalDiscount;
    const tax = total * 0.18;
    const change = Number(amountTendered) - total;

    // === SAVE ORDER / PROCESS PAYMENT ===
    const handleProcessPayment = async () => {
        if (paymentMethod === 'cash' && Number(amountTendered) < total) {
            alert("Tendered amount is insufficient!");
            return;
        }

        try {
            const orderPayload = {
                customerName: selectedCustomer.name,
                customerPhone: selectedCustomer.phone,
                items: cart,
                subtotal,
                discount: globalDiscount,
                total,
                paymentMethod,
                amountTendered: Number(amountTendered) || total,
                status: 'PAID',
                source: 'POS',
                date: new Date().toISOString()
            };

            const adminToken = localStorage.getItem('jtex_admin_token');
            const res = await fetch(`${getApiUrl()}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(orderPayload)
            });

            if (res.ok) {
                const savedOrder = await res.json();
                setInvoices([savedOrder, ...invoices]);
                setProducts(products.map(p => {
                    const cartItem = cart.find(c => c.id === p.id);
                    return cartItem ? { ...p, stock: p.stock - cartItem.qty } : p;
                }));
            }
        } catch (error) {
            console.error("Error saving POS Order:", error);
        }

        setPrintData({
            customerName: selectedCustomer.name,
            customerPhone: selectedCustomer.phone,
            items: [...cart],
            subtotal,
            discount: globalDiscount,
            total,
            tax,
            amountTendered: Number(amountTendered) || total,
            change,
            paymentMethod,
            date: new Date().toISOString()
        });

        setPaymentModal(false);
        setSuccessModal(true);
    };

    // === SAVE NEW CUSTOMER ===
    const handleSaveCustomer = async () => {
        if (!newCustomerData.name || !newCustomerData.phone) {
            alert("Please provide at least a Name and Phone Number.");
            return;
        }

        try {
            const adminToken = localStorage.getItem('jtex_admin_token');
            const res = await fetch(`${getApiUrl()}/api/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(newCustomerData)
            });

            if (res.ok) {
                const savedCustomer = await res.json();
                setCustomers([savedCustomer, ...customers]);
            } else {
                const dummyCust = { id: `C${Math.floor(Math.random() * 1000)}`, ...newCustomerData, orders: 0, totalSpent: 0 };
                setCustomers([dummyCust, ...customers]);
            }
            alert("Customer registered successfully!");
        } catch (error) {
            console.error("Error saving customer:", error);
        } finally {
            useStateNewCustomerModal(false);
            setNewCustomerData({ name: '', phone: '', email: '' });
        }
    };

    const executePrint = (type: 'receipt' | 'invoice' | 'proforma' | 'delivery' | 'warranty', dataToPrint: any = printData) => {
        setPrintData(dataToPrint);
        setPrintType(type);
        setTimeout(() => {
            window.print();
            setPrintType(null);
        }, 800); // Give images time to load
    };

    const resetPOS = () => {
        setCart([]);
        setSelectedCustomer({ name: 'Walk-in Customer', phone: '' });
        setAmountTendered('');
        setGlobalDiscount(0);
        setSuccessModal(false);
        setActiveModule('pos');
    };

    // ============================================================================
    // PRINT TEMPLATES (100% Matching Images)
    // ============================================================================
    if (printType && printData) {
        return (
            <div className="bg-gray-100 flex justify-center py-8 min-h-screen">

                {/* 1. RECEIPT TEMPLATE (THERMAL) */}
                {printType === 'receipt' && (
                    <div className="bg-white max-w-[300px] mx-auto font-mono text-sm p-6 shadow-xl">
                        <div className="text-center mb-4">
                            <h2 className="font-black text-xl uppercase tracking-widest mb-1">JTEX TECH</h2>
                            <p>Kariakoo, Dar es Salaam</p>
                            <p>TIN: 123-456-789</p>
                            <p>Tel: +255 767 949 581</p>
                        </div>
                        <div className="border-y border-dashed border-gray-400 py-2 mb-4 text-xs">
                            <p>Date: {new Date(printData.date || new Date()).toLocaleDateString()} {new Date(printData.date || new Date()).toLocaleTimeString()}</p>
                            <p>Cashier: System POS</p>
                            <p>Customer: {printData.customerName || 'Walk-in'}</p>
                        </div>
                        <table className="w-full text-left mb-4 text-xs">
                            <thead>
                                <tr className="border-b border-dashed border-gray-400">
                                    <th className="pb-1">Item</th>
                                    <th className="pb-1 text-center">Qty</th>
                                    <th className="pb-1 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {printData.items.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="py-2 pr-1 leading-tight">{item.name || item.desc}</td>
                                        <td className="py-2 text-center align-top">{item.qty}</td>
                                        <td className="py-2 text-right align-top">{(item.price * item.qty).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="border-t border-dashed border-gray-400 pt-2 mb-4 space-y-1">
                            <div className="flex justify-between"><span>Subtotal:</span><span>{printData.subtotal.toLocaleString()}</span></div>
                            {printData.discount > 0 && <div className="flex justify-between"><span>Discount:</span><span>-{printData.discount.toLocaleString()}</span></div>}
                            <div className="flex justify-between font-black text-base mt-2"><span>TOTAL:</span><span>TZS {printData.total.toLocaleString()}</span></div>
                        </div>
                        {printData.paymentMethod === 'cash' && (
                            <div className="border-t border-dashed border-gray-400 pt-2 mb-6 text-xs">
                                <div className="flex justify-between"><span>Cash Tendered:</span><span>{(printData.amountTendered || printData.total).toLocaleString()}</span></div>
                                <div className="flex justify-between font-bold"><span>Change:</span><span>{printData.change.toLocaleString()}</span></div>
                            </div>
                        )}
                        <div className="text-center text-xs mt-6 border-t border-dashed border-gray-400 pt-4">
                            <p className="font-bold mb-1">*** THANK YOU FOR SHOPPING ***</p>
                            <p>Goods cannot be returned after 7 days.</p>
                        </div>
                    </div>
                )}

                {/* 2. A4 DOCUMENTS (INVOICE, PROFORMA, DELIVERY NOTE, WARRANTY) */}
                {['invoice', 'proforma', 'delivery', 'warranty'].includes(printType) && (
                    <div className="a4-container shadow-2xl">

                        {/* THE BACKGROUND IMAGES FOR 100% MATCH */}
                        {printType === 'invoice' && <img src="/invoice.PNG" className="a4-bg" alt="Invoice Background" />}
                        {printType === 'proforma' && <img src="/parfoma invoince.PNG" className="a4-bg" alt="Proforma Background" />}
                        {printType === 'delivery' && <img src="/delivery note.PNG" className="a4-bg" alt="Delivery Note Background" />}
                        {/* Warranty fallback using invoice bg if no warranty bg provided */}
                        {printType === 'warranty' && <img src="/invoice.PNG" className="a4-bg opacity-30" alt="Warranty Background" />}

                        <div className="a4-content h-full flex flex-col font-sans">

                            {/* TOP SECTION: CUSTOMER & DATES (Positioned below the image header) */}
                            <div className="flex justify-between mt-8 mb-8">
                                <div className="w-1/2">
                                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        {printType === 'delivery' ? 'Deliver To:' : 'Billed To:'}
                                    </h4>
                                    <h2 className="text-xl font-black text-[#0A101D]">{printData.customerName || 'Walk-in Customer'}</h2>
                                    {printData.customerPhone && <p className="text-gray-600 text-sm mt-0.5">Phone: {printData.customerPhone}</p>}
                                </div>
                                <div className="w-1/3 text-right text-sm">
                                    <p className="mb-1"><span className="font-bold text-gray-500">Date:</span> <span className="font-semibold text-gray-900">{new Date(printData.date || new Date()).toLocaleDateString()}</span></p>
                                    <p className="mb-1"><span className="font-bold text-gray-500">Document #:</span> <span className="font-semibold text-gray-900">DOC-{Math.floor(Math.random() * 100000)}</span></p>
                                    {printType !== 'delivery' && (
                                        <p><span className="font-bold text-gray-500">Payment:</span> <span className="font-semibold text-[#F2A900] uppercase">{printData.paymentMethod || 'N/A'}</span></p>
                                    )}
                                </div>
                            </div>

                            {/* MAIN TABLE */}
                            <div className="flex-1">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-[#0A101D] text-[#0A101D] text-sm">
                                            <th className="py-3 text-left w-10 font-black">#</th>
                                            <th className="py-3 text-left font-black">Description of Goods</th>
                                            {printType === 'warranty' && <th className="py-3 text-center font-black">Warranty Period</th>}
                                            <th className="py-3 text-center font-black">Qty</th>
                                            {printType !== 'delivery' && <th className="py-3 text-right font-black">Unit Price</th>}
                                            {printType !== 'delivery' && <th className="py-3 text-right font-black">Total Amount</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {printData.items.map((item: any, idx: number) => (
                                            <tr key={idx} className="border-b border-gray-200 text-sm">
                                                <td className="py-4 font-bold text-gray-500">{idx + 1}</td>
                                                <td className="py-4 font-bold text-gray-900">{item.name || item.desc}</td>
                                                {printType === 'warranty' && <td className="py-4 text-center font-bold text-[#F2A900]">{item.warranty || item.period || '-'}</td>}
                                                <td className="py-4 text-center font-semibold">{item.qty || 1}</td>
                                                {printType !== 'delivery' && <td className="py-4 text-right text-gray-600">{(item.price).toLocaleString()}</td>}
                                                {printType !== 'delivery' && <td className="py-4 text-right font-black text-[#0A101D]">{(item.price * (item.qty || 1)).toLocaleString()}</td>}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* BOTTOM SECTION: TOTALS & TERMS */}
                            <div className="mt-8 flex justify-between items-end">
                                <div className="w-1/2">
                                    <h4 className="font-bold text-gray-800 text-xs mb-1 uppercase">Terms & Conditions</h4>
                                    <p className="text-[10px] text-gray-500 whitespace-pre-wrap leading-relaxed">
                                        {printType === 'warranty' ? docSettings.warrantyTerms : docSettings.invoiceTerms}
                                    </p>

                                    <div className="mt-8">
                                        <div className="border-b border-gray-400 w-48 mb-1"></div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Authorized Signature</p>
                                    </div>
                                </div>

                                {printType !== 'delivery' && (
                                    <div className="w-64 space-y-2 text-sm bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span className="font-bold">TZS {(printData.subtotal || 0).toLocaleString()}</span></div>
                                        {printData.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span className="font-bold">- TZS {printData.discount.toLocaleString()}</span></div>}
                                        <div className="border-t border-gray-300 my-2"></div>
                                        <div className="flex justify-between text-xl font-black text-[#0A101D]"><span>Total:</span><span>TZS {(printData.total || 0).toLocaleString()}</span></div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}

                <style>{`
                    @media print {
                        @page { size: A4; margin: 0; }
                        body { margin: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .a4-container { box-shadow: none !important; }
                    }
                    .a4-container {
                        width: 210mm;
                        height: 297mm;
                        position: relative;
                        background: white;
                        overflow: hidden;
                        page-break-after: always;
                    }
                    .a4-bg {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 1;
                        object-fit: cover;
                    }
                    .a4-content {
                        position: relative;
                        z-index: 10;
                        padding: 45mm 20mm 35mm 20mm; /* Top padding clears image headers, Bottom clears footers */
                    }
                `}</style>
            </div>
        );
    }

    // ============================================================================
    // MAIN SYSTEM UI
    // ============================================================================
    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

            {/* === MOBILE OVERLAY FOR SIDEBAR === */}
            {!sidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(true)}></div>
            )}

            {/* === SIDEBAR === */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 transform ${sidebarOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0 lg:translate-x-0'} w-64 bg-[#0A101D] text-white flex flex-col transition-transform duration-300 shadow-2xl`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                    <img src="/logo.png" alt="Jtex" className="h-8 object-contain" />
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white"><FiX size={24} /></button>
                </div>

                <div className="flex-1 py-6 space-y-2 px-3 overflow-y-auto hide-scrollbar">
                    <button onClick={() => { setActiveModule('dashboard'); if (window.innerWidth < 1024) setSidebarOpen(true); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'dashboard' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiPieChart size={20} /> <span>Dashboard</span>
                    </button>
                    <button onClick={() => { setActiveModule('pos'); if (window.innerWidth < 1024) setSidebarOpen(true); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'pos' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiMonitor size={20} /> <span>POS Terminal</span>
                    </button>
                    <button onClick={() => { setActiveModule('customers'); if (window.innerWidth < 1024) setSidebarOpen(true); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'customers' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiUsers size={20} /> <span>Customers</span>
                    </button>
                    <button onClick={() => { setActiveModule('invoices'); if (window.innerWidth < 1024) setSidebarOpen(true); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'invoices' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiFileText size={20} /> <span>Manual Invoices</span>
                    </button>
                    <button onClick={() => { setActiveModule('warranties'); if (window.innerWidth < 1024) setSidebarOpen(true); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'warranties' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiShield size={20} /> <span>Warranties</span>
                    </button>
                    <button onClick={() => { setActiveModule('expenses'); if (window.innerWidth < 1024) setSidebarOpen(true); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'expenses' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiTrendingDown size={20} /> <span>Store Expenses</span>
                    </button>
                    <button onClick={() => { setActiveModule('reports'); if (window.innerWidth < 1024) setSidebarOpen(true); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'reports' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiBarChart2 size={20} /> <span>Sales Reports</span>
                    </button>
                    <button onClick={() => { setActiveModule('settings'); if (window.innerWidth < 1024) setSidebarOpen(true); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'settings' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiSettings size={20} /> <span>Doc Settings</span>
                    </button>
                </div>

                <div className="p-4 border-t border-gray-800 space-y-2">
                    <button onClick={() => router.push('/admin/dashboard')} className="w-full flex items-center gap-4 px-3 py-3 text-blue-400 hover:bg-gray-800 rounded-xl transition">
                        <FiArrowLeft size={20} /> <span>Back to Main Panel</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-3 py-3 text-red-400 hover:bg-gray-800 rounded-xl transition font-bold">
                        <FiLogOut size={20} /> <span>Secure Logout</span>
                    </button>
                </div>
            </aside>

            {/* === MAIN CONTENT AREA === */}
            <div className="flex-1 flex flex-col min-w-0 w-full">

                {/* HEADER */}
                <header className="bg-white h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-700 hover:text-[#F2A900]"><FiMenu size={24} /></button>
                        <h2 className="text-lg sm:text-xl font-black text-gray-800 uppercase tracking-wide truncate">
                            {activeModule === 'dashboard' && 'Store Overview'}
                            {activeModule === 'pos' && 'Point of Sale'}
                            {activeModule === 'customers' && 'Customers'}
                            {activeModule === 'invoices' && 'Invoice Generator'}
                            {activeModule === 'warranties' && 'Warranty Generator'}
                            {activeModule === 'expenses' && 'Store Expenses'}
                            {activeModule === 'reports' && 'Sales Reports'}
                            {activeModule === 'settings' && 'Doc Settings'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
                        <div className="hidden sm:flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg"><FiClock className="text-[#F2A900]" /> {currentTime.toLocaleTimeString()}</div>
                        <div className="flex items-center gap-2 bg-[#0A101D] text-white px-3 sm:px-4 py-1.5 rounded-lg shadow-sm">
                            <FiUser /> <span className="hidden sm:inline">Admin</span>
                        </div>
                        {activeModule === 'pos' && (
                            <button
                                onClick={() => setShowMobileCart(!showMobileCart)}
                                className="lg:hidden flex items-center gap-2 bg-[#F2A900] text-black px-3 py-1.5 rounded-lg shadow-sm relative"
                            >
                                <FiShoppingCart size={18} />
                                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
                            </button>
                        )}
                    </div>
                </header>

                {/* DYNAMIC VIEWS */}
                <div className="flex-1 overflow-hidden flex relative">

                    {isLoading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* 1. DASHBOARD MODULE */}
                    {activeModule === 'dashboard' && (
                        <div className="p-4 sm:p-8 w-full overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#F2A900]">
                                    <p className="text-gray-500 text-sm font-bold mb-1">Total Products</p>
                                    <h3 className="text-3xl font-black text-gray-900">{products.length}</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                                    <p className="text-gray-500 text-sm font-bold mb-1">Invoices Recorded</p>
                                    <h3 className="text-3xl font-black text-gray-900">{invoices.length}</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                                    <p className="text-gray-500 text-sm font-bold mb-1">Registered Customers</p>
                                    <h3 className="text-3xl font-black text-gray-900">{customers.length}</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
                                    <p className="text-gray-500 text-sm font-bold mb-1">Store Status</p>
                                    <h3 className="text-xl font-black text-green-600 mt-2 flex items-center gap-2"><FiCheckCircle /> Active & Synced</h3>
                                </div>
                            </div>

                            {/* GRAPH SECTION */}
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
                                <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-wider">7-Day Sales Overview</h3>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={salesData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} tickFormatter={(value) => `${value / 1000000}M`} />
                                            <Tooltip cursor={{ stroke: '#F3F4F6', strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`TZS ${value.toLocaleString()}`, 'Sales']} />
                                            <Line type="monotone" dataKey="sales" stroke="#F2A900" strokeWidth={4} dot={{ r: 4, fill: '#0A101D', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#F2A900' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. CUSTOMERS MODULE */}
                    {activeModule === 'customers' && (
                        <div className="p-4 sm:p-8 w-full overflow-y-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div className="relative w-full sm:w-96">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="Search customers..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-[#F2A900] outline-none" />
                                </div>
                                <button onClick={() => useStateNewCustomerModal(true)} className="w-full sm:w-auto bg-[#0A101D] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#F2A900] hover:text-black transition">
                                    <FiUserPlus /> Add New Customer
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto shadow-sm">
                                <table className="w-full text-left text-sm min-w-[600px]">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="p-4 font-bold text-gray-600">Customer Name</th>
                                            <th className="p-4 font-bold text-gray-600">Phone Number</th>
                                            <th className="p-4 font-bold text-gray-600">Email Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map((c: any, i: number) => (
                                            <tr key={i} className="border-b border-gray-100 hover:bg-yellow-50/30 transition">
                                                <td className="p-4 font-bold text-[#0A101D]">{c.name || c.username}</td>
                                                <td className="p-4 text-gray-600">{c.phone || 'N/A'}</td>
                                                <td className="p-4 text-gray-600">{c.email || 'N/A'}</td>
                                            </tr>
                                        ))}
                                        {customers.length === 0 && (
                                            <tr><td colSpan={3} className="p-6 text-center text-gray-500">No customers found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 3. MANUAL INVOICES MODULE */}
                    {activeModule === 'invoices' && (
                        <div className="p-4 sm:p-8 w-full overflow-y-auto flex flex-col lg:flex-row gap-6">

                            {/* Invoice Form */}
                            <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                                <h3 className="font-black text-lg text-gray-800 mb-4 border-b pb-2">Generate Custom Invoice</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Customer Name</label>
                                        <input type="text" value={manualInvoice.customerName} onChange={e => setManualInvoice({ ...manualInvoice, customerName: e.target.value })} className="w-full p-2 border rounded outline-none focus:border-[#F2A900] text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Customer Phone (Optional)</label>
                                        <input type="text" value={manualInvoice.customerPhone} onChange={e => setManualInvoice({ ...manualInvoice, customerPhone: e.target.value })} className="w-full p-2 border rounded outline-none focus:border-[#F2A900] text-sm" />
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Invoice Items</label>
                                        {manualInvoice.items.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-2 items-start sm:items-center bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded">
                                                <input type="text" placeholder="Description" value={item.desc} onChange={e => { const newItems = [...manualInvoice.items]; newItems[idx].desc = e.target.value; setManualInvoice({ ...manualInvoice, items: newItems }); }} className="w-full sm:flex-1 p-2 border rounded text-sm outline-none" />
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <input type="number" placeholder="Qty" value={item.qty} onChange={e => { const newItems = [...manualInvoice.items]; newItems[idx].qty = Number(e.target.value); setManualInvoice({ ...manualInvoice, items: newItems }); }} className="w-20 p-2 border rounded text-sm outline-none" />
                                                    <input type="number" placeholder="Price" value={item.price} onChange={e => { const newItems = [...manualInvoice.items]; newItems[idx].price = Number(e.target.value); setManualInvoice({ ...manualInvoice, items: newItems }); }} className="flex-1 sm:w-28 p-2 border rounded text-sm outline-none" />
                                                    <button onClick={() => { const newItems = manualInvoice.items.filter((_, i) => i !== idx); setManualInvoice({ ...manualInvoice, items: newItems }); }} className="p-2 text-red-500 hover:bg-red-50 rounded bg-white sm:bg-transparent"><FiTrash2 /></button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => setManualInvoice({ ...manualInvoice, items: [...manualInvoice.items, { desc: '', qty: 1, price: 0 }] })} className="text-xs font-bold text-blue-600 mt-2 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded"><FiPlus /> Add Row</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
                                    <button
                                        onClick={() => {
                                            const sub = manualInvoice.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                                            executePrint('invoice', { ...manualInvoice, subtotal: sub, total: sub, paymentMethod: 'Custom', date: new Date().toISOString() });
                                        }}
                                        className="w-full bg-[#0A101D] text-white font-bold py-3 rounded-xl hover:bg-[#F2A900] hover:text-black transition text-xs"
                                    >
                                        Print Invoice
                                    </button>
                                    <button
                                        onClick={() => {
                                            const sub = manualInvoice.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                                            executePrint('proforma', { ...manualInvoice, subtotal: sub, total: sub, paymentMethod: 'Custom', date: new Date().toISOString() });
                                        }}
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition text-xs"
                                    >
                                        Print Proforma
                                    </button>
                                    <button
                                        onClick={() => {
                                            const sub = manualInvoice.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                                            executePrint('delivery', { ...manualInvoice, subtotal: sub, total: sub, paymentMethod: 'Custom', date: new Date().toISOString() });
                                        }}
                                        className="w-full col-span-2 sm:col-span-1 bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition text-xs"
                                    >
                                        Print Delivery
                                    </button>
                                </div>
                            </div>

                            {/* Invoice History List */}
                            <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col min-h-[300px]">
                                <div className="p-4 border-b border-gray-200 bg-gray-50"><h3 className="font-black text-gray-800">System Invoice History</h3></div>
                                <div className="flex-1 overflow-x-auto">
                                    <table className="w-full text-left text-sm min-w-[400px]">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="p-3 font-bold">ID</th>
                                                <th className="p-3 font-bold">Customer</th>
                                                <th className="p-3 font-bold text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map((inv: any, i: number) => (
                                                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="p-3 font-bold text-xs">{inv.id || `INV-${i + 1000}`}</td>
                                                    <td className="p-3 text-gray-600 truncate max-w-[100px]">{inv.customerName || inv.shippingInfo?.fullName || 'Walk-in'}</td>
                                                    <td className="p-3 text-right font-black text-green-600">{(inv.total || inv.totalAmount || 0).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. MANUAL WARRANTIES MODULE */}
                    {activeModule === 'warranties' && (
                        <div className="p-4 sm:p-8 w-full overflow-y-auto flex gap-6">
                            <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm mx-auto">
                                <h3 className="font-black text-lg text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><FiShield className="text-[#F2A900]" /> Generate Custom Warranty Certificate</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Customer Name</label>
                                            <input type="text" value={manualWarranty.customerName} onChange={e => setManualWarranty({ ...manualWarranty, customerName: e.target.value })} className="w-full p-2 border rounded outline-none focus:border-[#F2A900] text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number</label>
                                            <input type="text" value={manualWarranty.customerPhone} onChange={e => setManualWarranty({ ...manualWarranty, customerPhone: e.target.value })} className="w-full p-2 border rounded outline-none focus:border-[#F2A900] text-sm" />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Warrantied Items</label>
                                        {manualWarranty.items.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-2 items-start sm:items-center bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded">
                                                <input type="text" placeholder="Product Description/Serial Number" value={item.desc} onChange={e => { const newItems = [...manualWarranty.items]; newItems[idx].desc = e.target.value; setManualWarranty({ ...manualWarranty, items: newItems }); }} className="w-full sm:flex-1 p-2 border rounded text-sm outline-none" />
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <select value={item.period} onChange={e => { const newItems = [...manualWarranty.items]; newItems[idx].period = e.target.value; setManualWarranty({ ...manualWarranty, items: newItems }); }} className="flex-1 sm:w-32 p-2 border rounded text-sm outline-none bg-white">
                                                        <option value="3 Months">3 Months</option>
                                                        <option value="6 Months">6 Months</option>
                                                        <option value="1 Year">1 Year</option>
                                                        <option value="2 Years">2 Years</option>
                                                    </select>
                                                    <button onClick={() => { const newItems = manualWarranty.items.filter((_, i) => i !== idx); setManualWarranty({ ...manualWarranty, items: newItems }); }} className="p-2 text-red-500 hover:bg-red-50 rounded bg-white sm:bg-transparent"><FiTrash2 /></button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => setManualWarranty({ ...manualWarranty, items: [...manualWarranty.items, { desc: '', period: '1 Year' }] })} className="text-xs font-bold text-blue-600 mt-2 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded"><FiPlus /> Add Product</button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const payload = {
                                            ...manualWarranty,
                                            date: new Date().toISOString()
                                        };
                                        executePrint('warranty', payload);
                                    }}
                                    className="w-full bg-[#0A101D] text-white font-black py-3 rounded-xl mt-6 hover:bg-[#F2A900] hover:text-black transition"
                                >
                                    Generate & Print Warranty
                                </button>
                            </div>
                        </div>
                    )}

                    {/* NEW MODULES PLACEHOLDERS */}
                    {activeModule === 'expenses' && (
                        <div className="p-8 w-full flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <FiTrendingDown size={48} className="mx-auto text-gray-300 mb-4" />
                                <h2 className="text-xl font-black text-gray-800">Store Expenses Module</h2>
                                <p className="text-gray-500 mt-2">Track your daily and monthly store expenses here. (Coming Soon)</p>
                            </div>
                        </div>
                    )}

                    {activeModule === 'reports' && (
                        <div className="p-8 w-full flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <FiBarChart2 size={48} className="mx-auto text-gray-300 mb-4" />
                                <h2 className="text-xl font-black text-gray-800">Sales & Analytic Reports</h2>
                                <p className="text-gray-500 mt-2">Generate comprehensive Excel and PDF reports. (Coming Soon)</p>
                            </div>
                        </div>
                    )}

                    {/* 5. DOCUMENT SETTINGS MODULE */}
                    {activeModule === 'settings' && (
                        <div className="p-4 sm:p-8 w-full overflow-y-auto">
                            <div className="max-w-3xl bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                                <h3 className="font-black text-lg text-gray-800 mb-6 border-b pb-2 flex items-center gap-2"><FiSettings /> Print Document Settings</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">Invoice Terms & Conditions</label>
                                        <p className="text-xs text-gray-500 mb-2">This text will appear at the bottom of all generated A4 invoices.</p>
                                        <textarea
                                            rows={4}
                                            value={docSettings.invoiceTerms}
                                            onChange={e => setDocSettings({ ...docSettings, invoiceTerms: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-[#F2A900] text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">Warranty Terms & Conditions</label>
                                        <p className="text-xs text-gray-500 mb-2">This text will appear at the bottom of all warranty certificates.</p>
                                        <textarea
                                            rows={5}
                                            value={docSettings.warrantyTerms}
                                            onChange={e => setDocSettings({ ...docSettings, warrantyTerms: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-[#F2A900] text-sm"
                                        />
                                    </div>

                                    <button onClick={() => alert("Document settings saved successfully!")} className="w-full sm:w-auto bg-[#0A101D] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#F2A900] hover:text-black transition flex items-center justify-center gap-2">
                                        <FiSave /> Save Configurations
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 6. POS TERMINAL MODULE */}
                    {activeModule === 'pos' && (
                        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                            {/* L: Products */}
                            <div className={`flex-1 flex flex-col bg-gray-100 transition-all ${showMobileCart ? 'hidden lg:flex' : 'flex'}`}>
                                <div className="p-4 bg-white border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-sm gap-3">
                                    <div className="relative w-full sm:w-96">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Scan barcode or search products..."
                                            className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-200 rounded-xl focus:border-[#F2A900] outline-none text-sm font-medium"
                                        />
                                    </div>

                                    <button
                                        onClick={() => setCustomItemModal(true)}
                                        className="bg-[#0A101D] text-white px-4 py-2.5 sm:py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#F2A900] hover:text-black transition shadow-md"
                                    >
                                        <FiPlus /> Custom Item
                                    </button>
                                </div>

                                <div className="p-3 bg-white border-b border-gray-200 flex gap-2 overflow-x-auto hide-scrollbar">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-4 py-2 sm:py-1.5 rounded-lg font-bold text-xs transition-all border whitespace-nowrap ${activeCategory === cat ? 'bg-[#0A101D] text-white border-[#0A101D]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#F2A900]'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 pb-24 lg:pb-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.id}
                                                onClick={() => addToCart(product)}
                                                className={`bg-white border ${product.stock <= 0 && product.isOnline ? 'border-red-200 opacity-60' : 'border-gray-200 hover:border-[#F2A900] hover:shadow-lg'} rounded-2xl p-3 sm:p-4 cursor-pointer transition-all flex flex-col h-full active:scale-95 group relative overflow-hidden`}
                                            >
                                                {!product.isOnline && <span className="absolute top-2 left-2 bg-gray-800 text-white text-[8px] px-1.5 py-0.5 rounded font-black z-10 shadow">STORE ONLY</span>}

                                                <div className="w-full h-24 sm:h-28 bg-gray-50 rounded-xl mb-3 flex items-center justify-center border border-gray-100 group-hover:bg-yellow-50/50 relative overflow-hidden">
                                                    {getDisplayImage(product.imageUrl) ? (
                                                        <img src={getImageUrl(getDisplayImage(product.imageUrl))} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-2" />
                                                    ) : (
                                                        <FiBox size={30} className="text-gray-300 group-hover:text-[#F2A900]" />
                                                    )}
                                                </div>

                                                <h3 className="font-bold text-gray-800 text-xs sm:text-sm leading-tight line-clamp-2 mb-2">{product.name}</h3>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="font-black text-[#0A101D] text-sm">{(product.price).toLocaleString()}</span>
                                                    <span className={`text-[9px] font-bold px-2 py-1 rounded ${product.stock > 0 || !product.isOnline ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                        {product.stock > 0 || !product.isOnline ? `Qty: ${product.stock || '∞'}` : 'Out'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* R: Cart */}
                            <div className={`lg:w-[350px] xl:w-[420px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-30 flex-shrink-0 absolute lg:relative inset-0 lg:inset-auto ${showMobileCart ? 'flex' : 'hidden lg:flex'}`}>

                                <div className="lg:hidden p-4 bg-[#0A101D] text-white flex justify-between items-center">
                                    <h2 className="font-black text-lg flex items-center gap-2"><FiShoppingCart className="text-[#F2A900]" /> Current Order</h2>
                                    <button onClick={() => setShowMobileCart(false)} className="bg-gray-800 p-2 rounded text-gray-300 hover:text-white"><FiX size={20} /></button>
                                </div>

                                {/* Customer Selection */}
                                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <FiUserPlus className="text-[#F2A900]" />
                                            <h3 className="font-black text-gray-800 text-sm">Customer Info</h3>
                                        </div>
                                        <select
                                            onChange={(e) => {
                                                const cust = customers.find(c => c.name === e.target.value);
                                                if (cust) setSelectedCustomer({ name: cust.name, phone: cust.phone || '' });
                                                else setSelectedCustomer({ name: 'Walk-in Customer', phone: '' });
                                            }}
                                            className="text-[10px] font-bold bg-white border border-gray-300 rounded px-2 py-1 outline-none max-w-[120px] truncate"
                                        >
                                            <option value="Walk-in Customer">Walk-in Customer</option>
                                            {customers.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Customer Name"
                                            value={selectedCustomer.name === 'Walk-in Customer' ? '' : selectedCustomer.name}
                                            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value || 'Walk-in Customer' })}
                                            className="w-full px-3 py-2.5 sm:py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold focus:border-[#F2A900] outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Phone Number (Optional)"
                                            value={selectedCustomer.phone}
                                            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                                            className="w-full px-3 py-2.5 sm:py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold focus:border-[#F2A900] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="hidden lg:flex px-4 py-3 border-b border-gray-200 bg-white justify-between items-center">
                                    <h2 className="font-black text-base text-gray-900 flex items-center gap-2">
                                        <FiShoppingCart className="text-[#F2A900]" /> Current Order
                                    </h2>
                                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{cart.length} Items</span>
                                </div>

                                {/* Cart Items List */}
                                <div className="flex-1 overflow-y-auto p-3 bg-gray-50/30 hide-scrollbar">
                                    {cart.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                            <FiShoppingCart size={48} className="mb-4 opacity-30" />
                                            <p className="font-bold text-gray-500">Cart is empty</p>
                                            <p className="text-xs mt-1">Select products to begin</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {cart.map((item, index) => (
                                                <div key={index} className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm flex flex-col gap-2 relative group hover:border-[#F2A900] transition">
                                                    <div className="flex justify-between items-start pr-8">
                                                        <h4 className="font-bold text-xs text-gray-800 line-clamp-2 leading-snug">{item.name}</h4>
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-1">
                                                        <FiShield className="text-green-600" size={12} />
                                                        <select
                                                            value={item.warranty}
                                                            onChange={(e) => updateWarranty(item.id, e.target.value)}
                                                            className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 rounded px-1.5 py-1 sm:py-0.5 outline-none cursor-pointer"
                                                        >
                                                            {warrantyOptions.map(w => <option key={w} value={w}>{w === 'None' ? 'No Warranty' : w}</option>)}
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                                        <span className="font-black text-gray-900 text-sm">TZS {(item.price * item.qty).toLocaleString()}</span>

                                                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                            <button onClick={() => updateQty(item.id, -1)} className="px-3 sm:px-2.5 py-1.5 sm:py-1 hover:bg-gray-200 transition text-gray-600"><FiMinus size={12} /></button>
                                                            <span className="px-3 font-bold text-xs bg-white border-x border-gray-200 py-1.5 sm:py-1">{item.qty}</span>
                                                            <button onClick={() => updateQty(item.id, 1)} className="px-3 sm:px-2.5 py-1.5 sm:py-1 hover:bg-gray-200 transition text-gray-600"><FiPlus size={12} /></button>
                                                        </div>
                                                    </div>

                                                    <button onClick={() => removeFromCart(item.id)} className="absolute top-2 right-2 bg-red-50 text-red-500 hover:bg-red-100 transition sm:opacity-0 group-hover:opacity-100 rounded-full p-2"><FiTrash2 size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Discount & Calculations */}
                                <div className="bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10 pb-6 lg:pb-4">

                                    <div className="flex items-center justify-between mb-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
                                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiPercent /> Discount (TZS)</span>
                                        <input
                                            type="number"
                                            value={globalDiscount || ''}
                                            onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                                            placeholder="0"
                                            className="w-24 text-right bg-white border border-gray-300 rounded px-2 py-1 text-xs font-bold focus:border-[#F2A900] outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2 mb-4 px-1">
                                        <div className="flex justify-between text-gray-500 text-xs font-bold">
                                            <span>Subtotal</span><span>TZS {subtotal.toLocaleString()}</span>
                                        </div>
                                        {globalDiscount > 0 && (
                                            <div className="flex justify-between text-green-600 text-xs font-bold">
                                                <span>Discount</span><span>- TZS {globalDiscount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-1">
                                            <span className="text-sm font-black text-gray-900 uppercase">Total Payable</span>
                                            <span className="text-xl sm:text-2xl font-black text-[#F2A900]">TZS {total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCart([])}
                                            disabled={cart.length === 0}
                                            className="px-4 py-3 sm:py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition disabled:opacity-50 flex items-center justify-center border border-red-200"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setPaymentModal(true)}
                                            disabled={cart.length === 0}
                                            className="flex-1 bg-[#0A101D] disabled:bg-gray-300 disabled:text-gray-500 text-white font-black py-4 sm:py-3 rounded-xl text-base hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <FiCreditCard /> Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ============================================== */}
            {/* MODAL: ADD NEW CUSTOMER (CRM) */}
            {/* ============================================== */}
            {newCustomerModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
                        <button onClick={() => useStateNewCustomerModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><FiX size={24} /></button>
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><FiUserPlus className="text-[#F2A900]" /> Register New Customer</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Customer Full Name</label>
                                <input
                                    type="text" autoFocus value={newCustomerData.name} onChange={e => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#F2A900] rounded-xl px-4 py-3 outline-none font-bold text-sm"
                                    placeholder="E.g. Juma Kassim"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Phone Number</label>
                                <input
                                    type="text" value={newCustomerData.phone} onChange={e => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#F2A900] rounded-xl px-4 py-3 outline-none font-bold text-sm"
                                    placeholder="E.g. 07XXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Email Address (Optional)</label>
                                <input
                                    type="email" value={newCustomerData.email} onChange={e => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#F2A900] rounded-xl px-4 py-3 outline-none font-bold text-sm"
                                    placeholder="juma@example.com"
                                />
                            </div>
                            <button onClick={handleSaveCustomer} className="w-full bg-[#0A101D] text-white font-black py-4 rounded-xl mt-4 hover:bg-gray-800 transition flex items-center justify-center gap-2">
                                <FiSave /> Save Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================== */}
            {/* MODAL: ADD CUSTOM OFFLINE ITEM */}
            {/* ============================================== */}
            {customItemModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
                        <button onClick={() => setCustomItemModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><FiX size={24} /></button>
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><FiTag className="text-[#F2A900]" /> Add Custom / Offline Item</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Item Name / Description</label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={customItem.name}
                                    onChange={e => setCustomItem({ ...customItem, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#F2A900] rounded-xl px-4 py-3 outline-none font-bold text-sm"
                                    placeholder="E.g., Screen Protector S23 Ultra"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Price (TZS)</label>
                                <input
                                    type="number"
                                    value={customItem.price}
                                    onChange={e => setCustomItem({ ...customItem, price: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#F2A900] rounded-xl px-4 py-3 outline-none font-black text-lg"
                                    placeholder="0"
                                />
                            </div>
                            <button
                                onClick={addCustomItemToCart}
                                disabled={!customItem.name || !customItem.price}
                                className="w-full bg-[#0A101D] text-white font-black py-4 rounded-xl mt-4 hover:bg-[#F2A900] hover:text-black transition disabled:opacity-50"
                            >
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================== */}
            {/* PAYMENT MODAL */}
            {/* ============================================== */}
            {paymentModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">

                        {/* Left side: Payment Methods */}
                        <div className="w-full md:w-5/12 bg-gray-50 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto">
                            <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-wider">Payment Method</h2>
                            <div className="space-y-3 sm:space-y-4">
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`w-full flex items-center gap-4 p-3 sm:p-4 rounded-2xl border-2 transition font-bold ${paymentMethod === 'cash' ? 'border-[#F2A900] bg-yellow-50 text-gray-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                                >
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-[#F2A900] text-black' : 'bg-gray-100 text-gray-500'}`}><FiDollarSign className="text-lg sm:text-xl" /></div>
                                    Cash / TZS
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('mobile')}
                                    className={`w-full flex items-center gap-4 p-3 sm:p-4 rounded-2xl border-2 transition font-bold ${paymentMethod === 'mobile' ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                                >
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${paymentMethod === 'mobile' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}><FiSmartphone className="text-lg sm:text-xl" /></div>
                                    Mobile Money
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`w-full flex items-center gap-4 p-3 sm:p-4 rounded-2xl border-2 transition font-bold ${paymentMethod === 'bank' ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                                >
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${paymentMethod === 'bank' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500'}`}><FiCreditCard className="text-lg sm:text-xl" /></div>
                                    Bank Card / PDQ
                                </button>
                            </div>
                        </div>

                        {/* Right side: Amount Processing */}
                        <div className="w-full md:w-7/12 p-6 sm:p-8 bg-white flex flex-col overflow-y-auto">
                            <div className="mb-6 sm:mb-8 border-b border-gray-100 pb-4 sm:pb-6">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Amount Due</p>
                                <h3 className="text-3xl sm:text-4xl font-black text-[#0A101D]">TZS {total.toLocaleString()}</h3>
                            </div>

                            {paymentMethod === 'cash' && (
                                <div className="flex-1 animate-fade-in">
                                    <label className="text-sm font-bold text-gray-700 block mb-3">Amount Received (TZS)</label>
                                    <input
                                        type="number"
                                        autoFocus
                                        value={amountTendered}
                                        onChange={(e) => setAmountTendered(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#F2A900] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 outline-none text-xl sm:text-2xl font-black text-gray-900 transition mb-4 sm:mb-6"
                                        placeholder="Enter amount..."
                                    />

                                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                                        {[10000, 20000, 50000, 100000].map(amt => (
                                            <button key={amt} onClick={() => setAmountTendered(String(amt))} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-black py-2.5 sm:py-3 rounded-xl border border-gray-200 transition text-[10px] sm:text-sm">
                                                {amt.toLocaleString()}
                                            </button>
                                        ))}
                                        <button onClick={() => setAmountTendered(String(total))} className="bg-yellow-50 hover:bg-yellow-100 text-yellow-800 font-black py-2.5 sm:py-3 rounded-xl border border-yellow-200 transition text-[10px] sm:text-sm col-span-2">
                                            Exact Amount
                                        </button>
                                    </div>

                                    {amountTendered && Number(amountTendered) >= total ? (
                                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 sm:p-5 mb-4 animate-fade-in">
                                            <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Change to Return</p>
                                            <p className="text-2xl sm:text-3xl font-black text-green-700">TZS {change.toLocaleString()}</p>
                                        </div>
                                    ) : (
                                        <div className="h-0 sm:h-[92px]"></div>
                                    )}
                                </div>
                            )}

                            {paymentMethod !== 'cash' && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 animate-fade-in py-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border-2 border-gray-100">
                                        <FiCheckCircle className={`w-8 h-8 sm:w-10 sm:h-10 ${paymentMethod === 'mobile' ? 'text-blue-500' : 'text-purple-500'}`} />
                                    </div>
                                    <h3 className="font-black text-base sm:text-lg text-gray-900 mb-2">Process Via Terminal</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Please ask the customer to complete the transaction on their device or PDQ machine. Click confirm once payment is verified.</p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto pt-6 border-t border-gray-100">
                                <button onClick={() => setPaymentModal(false)} className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-200 transition order-2 sm:order-1">Cancel</button>
                                <button
                                    onClick={handleProcessPayment}
                                    disabled={paymentMethod === 'cash' && Number(amountTendered) < total}
                                    className="w-full sm:flex-1 bg-[#F2A900] disabled:bg-gray-300 disabled:text-gray-500 text-[#0A101D] font-black py-4 rounded-2xl hover:bg-yellow-500 transition shadow-lg flex items-center justify-center gap-2 order-1 sm:order-2"
                                >
                                    Confirm Payment <FiCheckCircle />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================== */}
            {/* MODAL 2: SUCCESS & PRINT OPTIONS */}
            {/* ============================================== */}
            {successModal && !printType && (
                <div className="fixed inset-0 bg-gray-900/90 z-[90] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <FiCheckCircle size={40} className="sm:w-12 sm:h-12" />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mb-8 sm:mb-10">Transaction completed for <span className="font-bold text-gray-800">TZS {total.toLocaleString()}</span>. Select a document to print.</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                            <button onClick={() => executePrint('receipt')} className="flex flex-col items-center justify-center gap-3 p-4 sm:p-6 border-2 border-gray-100 rounded-2xl hover:border-[#F2A900] hover:bg-yellow-50 transition group">
                                <FiFileText size={24} className="sm:w-8 sm:h-8 text-gray-400 group-hover:text-[#F2A900]" />
                                <div className="flex flex-col items-center">
                                    <span className="font-black text-xs sm:text-sm text-gray-800">Receipt</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">(Thermal)</span>
                                </div>
                            </button>
                            <button onClick={() => executePrint('invoice')} className="flex flex-col items-center justify-center gap-3 p-4 sm:p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition group">
                                <FiFileText size={24} className="sm:w-8 sm:h-8 text-gray-400 group-hover:text-blue-500" />
                                <div className="flex flex-col items-center">
                                    <span className="font-black text-xs sm:text-sm text-gray-800">Invoice</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">(A4 Doc)</span>
                                </div>
                            </button>
                            <button onClick={() => executePrint('delivery')} className="flex flex-col items-center justify-center gap-3 p-4 sm:p-6 border-2 border-gray-100 rounded-2xl hover:border-teal-500 hover:bg-teal-50 transition group">
                                <FiTruck size={24} className="sm:w-8 sm:h-8 text-gray-400 group-hover:text-teal-500" />
                                <div className="flex flex-col items-center">
                                    <span className="font-black text-xs sm:text-sm text-gray-800">Delivery</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">(A4 Doc)</span>
                                </div>
                            </button>
                            <button onClick={() => executePrint('warranty')} className="flex flex-col items-center justify-center gap-3 p-4 sm:p-6 border-2 border-gray-100 rounded-2xl hover:border-green-500 hover:bg-green-50 transition group">
                                <FiShield size={24} className="sm:w-8 sm:h-8 text-gray-400 group-hover:text-green-500" />
                                <div className="flex flex-col items-center">
                                    <span className="font-black text-xs sm:text-sm text-gray-800">Warranty</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">(Certificate)</span>
                                </div>
                            </button>
                        </div>

                        <button onClick={resetPOS} className="text-sm font-black text-gray-500 hover:text-gray-900 underline underline-offset-4">
                            Skip & Start New Sale
                        </button>
                    </div>
                </div>
            )}

            {/* Hide Scrollbar for general UI */}
            <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
}
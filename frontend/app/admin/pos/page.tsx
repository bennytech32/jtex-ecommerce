'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiSearch, FiGrid, FiTrash2, FiPlus, FiMinus,
    FiCreditCard, FiPrinter, FiBox, FiDollarSign,
    FiClock, FiUser, FiSmartphone, FiArrowLeft, FiCheckCircle,
    FiShoppingCart, FiFileText, FiShield, FiUserPlus, FiPercent,
    FiPieChart, FiUsers, FiSettings, FiMenu, FiX, FiTag, FiMonitor, FiSave
} from 'react-icons/fi';

export default function StoreManagementSystem() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(new Date());

    // === SYSTEM NAVIGATION STATE ===
    const [activeModule, setActiveModule] = useState<'dashboard' | 'pos' | 'customers' | 'invoices' | 'warranties' | 'settings'>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

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
    const [newCustomerModal, setNewCustomerModal] = useState(false);
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
    const [printType, setPrintType] = useState<'receipt' | 'invoice' | 'warranty' | null>(null);
    const [printData, setPrintData] = useState<any>(null); // Holds data for manual prints

    const warrantyOptions = ['None', '3 Months', '6 Months', '1 Year', '2 Years'];

    // === DOCUMENT SETTINGS STATE ===
    const [docSettings, setDocSettings] = useState({
        invoiceTerms: "1. Payment is due upon receipt.\n2. Goods remain the property of Jtex until fully paid.\n3. Late payments may incur additional charges.",
        warrantyTerms: "1. Covers hardware defects under normal use.\n2. Void if physically damaged or altered.\n3. Original receipt required for claims.\n4. Software and liquid damage not covered."
    });

    // === MANUAL GENERATION STATES ===
    // State for manual invoice creation
    const [manualInvoice, setManualInvoice] = useState({
        customerName: '',
        customerPhone: '',
        items: [{ desc: '', qty: 1, price: 0 }]
    });

    // State for manual warranty creation
    const [manualWarranty, setManualWarranty] = useState({
        customerName: '',
        customerPhone: '',
        items: [{ desc: '', period: '1 Year' }]
    });

    // === API HELPERS ===
    const getApiUrl = () => {
        const url = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
        return url.replace(/\/$/, '');
    };

    const getImageUrl = (url: string) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
    };

    const getDisplayImage = (imgData: string) => {
        if (!imgData) return '';
        try {
            const parsed = JSON.parse(imgData);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imgData;
        } catch (e) {
            return imgData;
        }
    };

    // === DATA FETCHING (LIVE) ===
    useEffect(() => {
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
                const ordRes = await fetch(`${getApiUrl()}/api/orders`);
                if (ordRes.ok) {
                    const ordData = await ordRes.json();
                    setInvoices(ordData);
                }

                // Fetch Customers
                const custRes = await fetch(`${getApiUrl()}/api/customers`);
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
        return () => clearInterval(timer);
    }, []);

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

            const res = await fetch(`${getApiUrl()}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

        // Prepare print data based on current cart
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
            const res = await fetch(`${getApiUrl()}/api/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            setNewCustomerModal(false);
            setNewCustomerData({ name: '', phone: '', email: '' });
        }
    };

    const executePrint = (type: 'receipt' | 'invoice' | 'warranty', dataToPrint: any = printData) => {
        setPrintData(dataToPrint);
        setPrintType(type);
        setTimeout(() => {
            window.print();
            setPrintType(null);
        }, 500);
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
    // PRINT TEMPLATES (Overlays entire screen when printing)
    // ============================================================================
    if (printType && printData) {
        return (
            <div className="bg-white text-black p-8 min-h-screen">
                {/* 1. RECEIPT TEMPLATE */}
                {printType === 'receipt' && (
                    <div className="max-w-[300px] mx-auto font-mono text-sm">
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
                                <div className="flex justify-between"><span>Cash Tendered:</span><span>{printData.amountTendered.toLocaleString()}</span></div>
                                <div className="flex justify-between font-bold"><span>Change:</span><span>{printData.change.toLocaleString()}</span></div>
                            </div>
                        )}
                        <div className="text-center text-xs mt-6 border-t border-dashed border-gray-400 pt-4">
                            <p className="font-bold mb-1">*** THANK YOU FOR SHOPPING ***</p>
                            <p>Goods cannot be returned after 7 days.</p>
                        </div>
                    </div>
                )}

                {/* 2. INVOICE TEMPLATE */}
                {printType === 'invoice' && (
                    <div className="max-w-4xl mx-auto font-sans">
                        <div className="flex justify-between items-start mb-10 border-b-4 border-[#0A101D] pb-6">
                            <div>
                                <img src="/logo.png" alt="Jtex Logo" className="h-16 mb-2 grayscale" />
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">TAX INVOICE</h1>
                                <p className="text-gray-500 font-bold mt-1">Invoice #: INV-{Math.floor(Math.random() * 100000)}</p>
                            </div>
                            <div className="text-right text-sm">
                                <h3 className="font-black text-lg text-gray-900">Jtex Technologies</h3>
                                <p>TanHouse, Dar es Salaam</p>
                                <p>TIN: 123-456-789 | VRN: 987654321</p>
                                <p>Email: info@jtex.co.tz | Tel: +255 767 949 581</p>
                            </div>
                        </div>
                        <div className="flex justify-between mb-10">
                            <div className="w-1/2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To:</h4>
                                <h2 className="text-xl font-black text-gray-900">{printData.customerName || 'Walk-in Customer'}</h2>
                                {printData.customerPhone && <p className="text-gray-600 mt-1">Phone: {printData.customerPhone}</p>}
                            </div>
                            <div className="w-1/2 text-right">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Invoice Details:</h4>
                                <p><span className="font-bold">Date:</span> {new Date(printData.date || new Date()).toLocaleDateString()}</p>
                                <p><span className="font-bold">Payment Method:</span> <span className="uppercase">{printData.paymentMethod || 'N/A'}</span></p>
                                <p><span className="font-bold">Status:</span> <span className="text-green-600 font-black">PAID</span></p>
                            </div>
                        </div>
                        <table className="w-full mb-10 border-collapse">
                            <thead>
                                <tr className="bg-[#0A101D] text-white text-sm">
                                    <th className="p-3 text-left w-12">#</th>
                                    <th className="p-3 text-left">Description</th>
                                    <th className="p-3 text-center">Warranty</th>
                                    <th className="p-3 text-center">Qty</th>
                                    <th className="p-3 text-right">Unit Price</th>
                                    <th className="p-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {printData.items.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-200 text-sm">
                                        <td className="p-3 font-bold">{idx + 1}</td>
                                        <td className="p-3 font-bold text-gray-800">{item.name || item.desc} {item.isOnline === false && <span className="text-[10px] text-gray-400">(Offline)</span>}</td>
                                        <td className="p-3 text-center text-gray-500">{item.warranty && item.warranty !== 'None' ? item.warranty : '-'}</td>
                                        <td className="p-3 text-center">{item.qty}</td>
                                        <td className="p-3 text-right">{(item.price).toLocaleString()}</td>
                                        <td className="p-3 text-right font-bold">{(item.price * item.qty).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-start mb-12">
                            <div className="w-1/2 pr-10">
                                <h4 className="font-bold text-gray-800 text-sm mb-2">Terms & Conditions</h4>
                                <p className="text-xs text-gray-500 whitespace-pre-wrap">{docSettings.invoiceTerms}</p>
                            </div>
                            <div className="w-72 space-y-3 text-sm">
                                <div className="flex justify-between border-b border-gray-100 pb-2"><span>Subtotal:</span><span className="font-bold">TZS {(printData.subtotal || 0).toLocaleString()}</span></div>
                                {printData.discount > 0 && <div className="flex justify-between border-b border-gray-100 pb-2 text-green-600"><span>Discount:</span><span className="font-bold">- TZS {printData.discount.toLocaleString()}</span></div>}
                                <div className="flex justify-between text-xl font-black text-[#0A101D] pt-2"><span>Total:</span><span>TZS {(printData.total || 0).toLocaleString()}</span></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mt-20 pt-6 border-t border-gray-200">
                            <div className="text-center w-64">
                                <div className="border-b border-gray-800 mb-2"></div>
                                <p className="text-xs font-bold text-gray-500">Authorized Signature & Stamp</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. WARRANTY CERTIFICATE TEMPLATE */}
                {printType === 'warranty' && (
                    <div className="max-w-4xl mx-auto font-sans border-[8px] border-[#0A101D] p-10 relative min-h-[800px]">
                        <div className="absolute top-10 right-10 text-[#F2A900] opacity-20"><FiShield size={150} /></div>
                        <div className="text-center mb-10 relative z-10">
                            <img src="/logo.png" alt="Jtex Logo" className="h-16 mx-auto mb-4 grayscale" />
                            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-widest border-b-2 border-[#F2A900] inline-block pb-2">Warranty Certificate</h1>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mb-10 relative z-10 text-sm">
                            <div>
                                <h3 className="font-black text-gray-900 border-b border-gray-200 pb-2 mb-3">Customer Information</h3>
                                <p><span className="font-bold text-gray-500">Name:</span> {printData.customerName}</p>
                                <p><span className="font-bold text-gray-500">Phone:</span> {printData.customerPhone || 'N/A'}</p>
                                <p><span className="font-bold text-gray-500">Date Issued:</span> {new Date(printData.date || new Date()).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 border-b border-gray-200 pb-2 mb-3">Dealer Information</h3>
                                <p><span className="font-bold text-gray-500">Company:</span> Jtex Technologies</p>
                                <p><span className="font-bold text-gray-500">Location:</span> Dar es Salaam, Tanzania</p>
                                <p><span className="font-bold text-gray-500">Contact:</span> +255 767 949 581</p>
                            </div>
                        </div>
                        <table className="w-full mb-10 border border-gray-200 text-sm relative z-10">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left border-b border-gray-200">Covered Product Description</th>
                                    <th className="p-3 text-left border-b border-gray-200">Warranty Period</th>
                                </tr>
                            </thead>
                            <tbody>
                                {printData.items.filter((i: any) => i.warranty && i.warranty !== 'None' || i.period).map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-200">
                                        <td className="p-3 font-bold">{item.name || item.desc}</td>
                                        <td className="p-3 font-black text-[#F2A900]">{item.warranty || item.period}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mb-10 text-xs text-gray-600 space-y-2 leading-relaxed bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-black text-gray-900 text-sm mb-2">Terms and Conditions</h4>
                            <p className="whitespace-pre-wrap">{docSettings.warrantyTerms}</p>
                        </div>

                        <div className="flex justify-between items-end pt-10 px-10 absolute bottom-10 left-0 right-0">
                            <div className="text-center">
                                <div className="border-b border-gray-800 w-48 mb-2 h-10"></div>
                                <p className="text-xs font-bold text-gray-500">Customer Signature</p>
                            </div>
                            <div className="text-center">
                                <div className="border-b border-gray-800 w-48 mb-2 h-10 flex items-end justify-center"><span className="font-serif italic text-xl text-blue-800">Jtex Auth</span></div>
                                <p className="text-xs font-bold text-gray-500">Authorized Signature & Stamp</p>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`@media print { @page { margin: 0; } body { background: white; margin: 0; padding: 20px; } }`}</style>
            </div>
        );
    }

    // ============================================================================
    // MAIN SYSTEM UI
    // ============================================================================
    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

            {/* === SIDEBAR === */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0A101D] text-white flex flex-col transition-all duration-300 shadow-2xl relative z-40`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                    {sidebarOpen ? <img src="/logo.png" alt="Jtex" className="h-8 object-contain" /> : <div className="w-8 h-8 bg-[#F2A900] text-black font-black flex items-center justify-center rounded">JT</div>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white"><FiMenu size={20} /></button>
                </div>

                <div className="flex-1 py-6 space-y-2 px-3 overflow-y-auto hide-scrollbar">
                    <button onClick={() => setActiveModule('dashboard')} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'dashboard' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiPieChart size={20} /> {sidebarOpen && <span>Dashboard</span>}
                    </button>
                    <button onClick={() => setActiveModule('pos')} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'pos' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiMonitor size={20} /> {sidebarOpen && <span>POS Terminal</span>}
                    </button>
                    <button onClick={() => setActiveModule('customers')} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'customers' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiUsers size={20} /> {sidebarOpen && <span>Customers</span>}
                    </button>
                    <button onClick={() => setActiveModule('invoices')} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'invoices' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiFileText size={20} /> {sidebarOpen && <span>Generate Invoices</span>}
                    </button>
                    <button onClick={() => setActiveModule('warranties')} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'warranties' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiShield size={20} /> {sidebarOpen && <span>Generate Warranties</span>}
                    </button>
                    <button onClick={() => setActiveModule('settings')} className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition ${activeModule === 'settings' ? 'bg-[#F2A900] text-black font-bold shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiSettings size={20} /> {sidebarOpen && <span>Doc Settings</span>}
                    </button>
                </div>

                <div className="p-4 border-t border-gray-800">
                    <button onClick={() => router.push('/admin/dashboard')} className="w-full flex items-center gap-4 px-3 py-3 text-red-400 hover:bg-gray-800 rounded-xl transition">
                        <FiArrowLeft size={20} /> {sidebarOpen && <span>Exit to Admin</span>}
                    </button>
                </div>
            </aside>

            {/* === MAIN CONTENT AREA === */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* HEADER */}
                <header className="bg-white h-16 flex items-center justify-between px-6 shadow-sm z-10 border-b border-gray-200">
                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">
                        {activeModule === 'dashboard' && 'Store Overview'}
                        {activeModule === 'pos' && 'Point of Sale Terminal'}
                        {activeModule === 'customers' && 'Customer Management'}
                        {activeModule === 'invoices' && 'Manual Invoice Generator'}
                        {activeModule === 'warranties' && 'Manual Warranty Generator'}
                        {activeModule === 'settings' && 'Document Settings'}
                    </h2>
                    <div className="flex items-center gap-4 text-sm font-bold">
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg"><FiClock className="text-[#F2A900]" /> {currentTime.toLocaleTimeString()}</div>
                        <div className="flex items-center gap-2 bg-[#0A101D] text-white px-4 py-1.5 rounded-lg shadow-sm">
                            <FiUser /> Benjamin (Manager)
                        </div>
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
                        <div className="p-8 w-full overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                        </div>
                    )}

                    {/* 2. CUSTOMERS MODULE */}
                    {activeModule === 'customers' && (
                        <div className="p-8 w-full overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <div className="relative w-96">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="Search customers..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-[#F2A900] outline-none" />
                                </div>
                                <button onClick={() => setNewCustomerModal(true)} className="bg-[#0A101D] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#F2A900] hover:text-black transition">
                                    <FiUserPlus /> Add New Customer
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm">
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
                        <div className="p-8 w-full overflow-y-auto flex gap-6">

                            {/* Invoice Form */}
                            <div className="w-1/2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
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
                                            <div key={idx} className="flex gap-2 mb-2 items-start">
                                                <input type="text" placeholder="Description" value={item.desc} onChange={e => { const newItems = [...manualInvoice.items]; newItems[idx].desc = e.target.value; setManualInvoice({ ...manualInvoice, items: newItems }); }} className="flex-1 p-2 border rounded text-sm outline-none" />
                                                <input type="number" placeholder="Qty" value={item.qty} onChange={e => { const newItems = [...manualInvoice.items]; newItems[idx].qty = Number(e.target.value); setManualInvoice({ ...manualInvoice, items: newItems }); }} className="w-16 p-2 border rounded text-sm outline-none" />
                                                <input type="number" placeholder="Price" value={item.price} onChange={e => { const newItems = [...manualInvoice.items]; newItems[idx].price = Number(e.target.value); setManualInvoice({ ...manualInvoice, items: newItems }); }} className="w-24 p-2 border rounded text-sm outline-none" />
                                                <button onClick={() => { const newItems = manualInvoice.items.filter((_, i) => i !== idx); setManualInvoice({ ...manualInvoice, items: newItems }); }} className="p-2 text-red-500 hover:bg-red-50 rounded"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => setManualInvoice({ ...manualInvoice, items: [...manualInvoice.items, { desc: '', qty: 1, price: 0 }] })} className="text-xs font-bold text-blue-600 mt-2 flex items-center gap-1"><FiPlus /> Add Row</button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const sub = manualInvoice.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                                        const payload = {
                                            ...manualInvoice,
                                            subtotal: sub,
                                            total: sub,
                                            discount: 0,
                                            paymentMethod: 'Custom',
                                            date: new Date().toISOString()
                                        };
                                        executePrint('invoice', payload);
                                    }}
                                    className="w-full bg-[#0A101D] text-white font-black py-3 rounded-xl mt-6 hover:bg-[#F2A900] hover:text-black transition"
                                >
                                    Generate & Print Invoice
                                </button>
                            </div>

                            {/* Invoice History List */}
                            <div className="w-1/2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                                <div className="p-4 border-b border-gray-200 bg-gray-50"><h3 className="font-black text-gray-800">System Invoice History</h3></div>
                                <div className="flex-1 overflow-y-auto">
                                    <table className="w-full text-left text-sm">
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
                                                    <td className="p-3 text-right font-black text-green-600">{(inv.total || 0).toLocaleString()}</td>
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
                        <div className="p-8 w-full overflow-y-auto flex gap-6">
                            <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mx-auto">
                                <h3 className="font-black text-lg text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><FiShield className="text-[#F2A900]" /> Generate Custom Warranty Certificate</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
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
                                            <div key={idx} className="flex gap-2 mb-2 items-start">
                                                <input type="text" placeholder="Product Description/Serial Number" value={item.desc} onChange={e => { const newItems = [...manualWarranty.items]; newItems[idx].desc = e.target.value; setManualWarranty({ ...manualWarranty, items: newItems }); }} className="flex-1 p-2 border rounded text-sm outline-none" />
                                                <select value={item.period} onChange={e => { const newItems = [...manualWarranty.items]; newItems[idx].period = e.target.value; setManualWarranty({ ...manualWarranty, items: newItems }); }} className="w-32 p-2 border rounded text-sm outline-none bg-white">
                                                    <option value="3 Months">3 Months</option>
                                                    <option value="6 Months">6 Months</option>
                                                    <option value="1 Year">1 Year</option>
                                                    <option value="2 Years">2 Years</option>
                                                </select>
                                                <button onClick={() => { const newItems = manualWarranty.items.filter((_, i) => i !== idx); setManualWarranty({ ...manualWarranty, items: newItems }); }} className="p-2 text-red-500 hover:bg-red-50 rounded"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => setManualWarranty({ ...manualWarranty, items: [...manualWarranty.items, { desc: '', period: '1 Year' }] })} className="text-xs font-bold text-blue-600 mt-2 flex items-center gap-1"><FiPlus /> Add Product</button>
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

                    {/* 5. DOCUMENT SETTINGS MODULE */}
                    {activeModule === 'settings' && (
                        <div className="p-8 w-full overflow-y-auto">
                            <div className="max-w-3xl bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
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

                                    <button onClick={() => alert("Document settings saved successfully!")} className="bg-[#0A101D] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#F2A900] hover:text-black transition flex items-center gap-2">
                                        <FiSave /> Save Configurations
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 6. POS TERMINAL MODULE (Duka na Custom Items) */}
                    {activeModule === 'pos' && (
                        <div className="flex-1 flex overflow-hidden">
                            {/* L: Products */}
                            <div className="flex-1 flex flex-col bg-gray-100">
                                <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
                                    <div className="relative w-96">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Scan barcode or search products..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-[#F2A900] outline-none text-sm font-medium"
                                        />
                                    </div>

                                    {/* ADD CUSTOM/OFFLINE ITEM BUTTON */}
                                    <button
                                        onClick={() => setCustomItemModal(true)}
                                        className="bg-[#0A101D] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#F2A900] hover:text-black transition shadow-md"
                                    >
                                        <FiPlus /> Custom Item
                                    </button>
                                </div>

                                <div className="p-3 bg-white border-b border-gray-200 flex gap-2 overflow-x-auto hide-scrollbar">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all border ${activeCategory === cat ? 'bg-[#0A101D] text-white border-[#0A101D]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#F2A900]'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.id}
                                                onClick={() => addToCart(product)}
                                                className={`bg-white border ${product.stock <= 0 && product.isOnline ? 'border-red-200 opacity-60' : 'border-gray-200 hover:border-[#F2A900] hover:shadow-lg'} rounded-2xl p-3 cursor-pointer transition-all flex flex-col h-full active:scale-95 group relative overflow-hidden`}
                                            >
                                                {!product.isOnline && <span className="absolute top-2 left-2 bg-gray-800 text-white text-[8px] px-1.5 py-0.5 rounded font-black z-10 shadow">STORE ONLY</span>}

                                                {/* PRODUCT IMAGE FIX */}
                                                <div className="w-full h-24 bg-gray-50 rounded-xl mb-3 flex items-center justify-center border border-gray-100 group-hover:bg-yellow-50/50 relative overflow-hidden">
                                                    {getDisplayImage(product.imageUrl) ? (
                                                        <img src={getImageUrl(getDisplayImage(product.imageUrl))} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-2" />
                                                    ) : (
                                                        <FiBox size={30} className="text-gray-300 group-hover:text-[#F2A900]" />
                                                    )}
                                                </div>

                                                <h3 className="font-bold text-gray-800 text-xs leading-tight line-clamp-2 mb-2">{product.name}</h3>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="font-black text-[#0A101D] text-sm">{(product.price).toLocaleString()}</span>
                                                    <span className={`text-[9px] font-bold px-2 py-1 rounded ${product.stock > 0 || !product.isOnline ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                        {product.stock > 0 || !product.isOnline ? `Qty: ${product.stock || '∞'}` : 'Out of Stock'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* R: Cart */}
                            <div className="w-[350px] xl:w-[420px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-20 flex-shrink-0">

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
                                            className="text-[10px] font-bold bg-white border border-gray-300 rounded px-2 py-1 outline-none"
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
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold focus:border-[#F2A900] outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Phone Number (Optional)"
                                            value={selectedCustomer.phone}
                                            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold focus:border-[#F2A900] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="px-4 py-3 border-b border-gray-200 bg-white flex justify-between items-center">
                                    <h2 className="font-black text-base text-gray-900 flex items-center gap-2">
                                        <FiShoppingCart className="text-[#F2A900]" /> Current Order
                                    </h2>
                                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{cart.length} Items</span>
                                </div>

                                {/* Cart Items List */}
                                <div className="flex-1 overflow-y-auto p-2 bg-gray-50/30 hide-scrollbar">
                                    {cart.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                            <FiShoppingCart size={48} className="mb-4 opacity-30" />
                                            <p className="font-bold text-gray-500">Cart is empty</p>
                                            <p className="text-xs mt-1">Select products to begin</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {cart.map((item, index) => (
                                                <div key={index} className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm flex flex-col gap-2 relative group hover:border-[#F2A900] transition">
                                                    <div className="flex justify-between items-start pr-6">
                                                        <h4 className="font-bold text-xs text-gray-800 line-clamp-2 leading-snug">{item.name}</h4>
                                                    </div>

                                                    {/* Warranty Selector */}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <FiShield className="text-green-600" size={12} />
                                                        <select
                                                            value={item.warranty}
                                                            onChange={(e) => updateWarranty(item.id, e.target.value)}
                                                            className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                                                        >
                                                            {warrantyOptions.map(w => <option key={w} value={w}>{w === 'None' ? 'No Warranty' : w}</option>)}
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                                        <span className="font-black text-gray-900 text-sm">TZS {(item.price * item.qty).toLocaleString()}</span>

                                                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                            <button onClick={() => updateQty(item.id, -1)} className="px-2.5 py-1 hover:bg-gray-200 transition text-gray-600"><FiMinus size={12} /></button>
                                                            <span className="px-3 font-bold text-xs bg-white border-x border-gray-200 py-1">{item.qty}</span>
                                                            <button onClick={() => updateQty(item.id, 1)} className="px-2.5 py-1 hover:bg-gray-200 transition text-gray-600"><FiPlus size={12} /></button>
                                                        </div>
                                                    </div>

                                                    <button onClick={() => removeFromCart(item.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 bg-white rounded-full p-1"><FiTrash2 size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Discount & Calculations */}
                                <div className="bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">

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
                                            <span className="text-2xl font-black text-[#F2A900]">TZS {total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCart([])}
                                            disabled={cart.length === 0}
                                            className="px-4 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition disabled:opacity-50 flex items-center justify-center border border-red-200"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setPaymentModal(true)}
                                            disabled={cart.length === 0}
                                            className="flex-1 bg-[#0A101D] disabled:bg-gray-300 disabled:text-gray-500 text-white font-black py-3 rounded-xl text-base hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg"
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
                        <button onClick={() => setNewCustomerModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><FiX size={24} /></button>
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
                    <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

                        {/* Left side: Payment Methods */}
                        <div className="w-full md:w-5/12 bg-gray-50 p-8 border-r border-gray-200">
                            <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-wider">Payment Method</h2>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition font-bold ${paymentMethod === 'cash' ? 'border-[#F2A900] bg-yellow-50 text-gray-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-[#F2A900] text-black' : 'bg-gray-100 text-gray-500'}`}><FiDollarSign className="text-xl" /></div>
                                    Cash / TZS
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('mobile')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition font-bold ${paymentMethod === 'mobile' ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'mobile' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}><FiSmartphone className="text-xl" /></div>
                                    Mobile Money
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition font-bold ${paymentMethod === 'bank' ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'bank' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500'}`}><FiCreditCard className="text-xl" /></div>
                                    Bank Card / PDQ
                                </button>
                            </div>
                        </div>

                        {/* Right side: Amount Processing */}
                        <div className="w-full md:w-7/12 p-8 bg-white flex flex-col">
                            <div className="mb-8 border-b border-gray-100 pb-6">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Amount Due</p>
                                <h3 className="text-4xl font-black text-[#0A101D]">TZS {total.toLocaleString()}</h3>
                            </div>

                            {paymentMethod === 'cash' && (
                                <div className="flex-1 animate-fade-in">
                                    <label className="text-sm font-bold text-gray-700 block mb-3">Amount Received (TZS)</label>
                                    <input
                                        type="number"
                                        autoFocus
                                        value={amountTendered}
                                        onChange={(e) => setAmountTendered(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#F2A900] rounded-2xl px-5 py-4 outline-none text-2xl font-black text-gray-900 transition mb-6"
                                        placeholder="Enter amount..."
                                    />

                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {[10000, 20000, 50000, 100000].map(amt => (
                                            <button key={amt} onClick={() => setAmountTendered(String(amt))} className="bg-gray-50 hover:bg-gray-200 text-gray-800 font-black py-3 rounded-xl border border-gray-200 transition text-sm">
                                                {amt.toLocaleString()}
                                            </button>
                                        ))}
                                        <button onClick={() => setAmountTendered(String(total))} className="bg-yellow-50 hover:bg-yellow-100 text-yellow-800 font-black py-3 rounded-xl border border-yellow-200 transition text-sm col-span-2">
                                            Exact Amount
                                        </button>
                                    </div>

                                    {amountTendered && Number(amountTendered) >= total ? (
                                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-4 animate-fade-in">
                                            <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Change to Return</p>
                                            <p className="text-3xl font-black text-green-700">TZS {change.toLocaleString()}</p>
                                        </div>
                                    ) : (
                                        <div className="h-[92px]"></div>
                                    )}
                                </div>
                            )}

                            {paymentMethod !== 'cash' && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center px-8 animate-fade-in">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border-2 border-gray-100">
                                        <FiCheckCircle size={40} className={paymentMethod === 'mobile' ? 'text-blue-500' : 'text-purple-500'} />
                                    </div>
                                    <h3 className="font-black text-lg text-gray-900 mb-2">Process Via Terminal</h3>
                                    <p className="text-sm text-gray-500 font-medium">Please ask the customer to complete the transaction on their device or PDQ machine. Click confirm once payment is verified.</p>
                                </div>
                            )}

                            <div className="flex gap-4 mt-auto pt-6 border-t border-gray-100">
                                <button onClick={() => setPaymentModal(false)} className="px-8 py-4 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-200 transition">Cancel</button>
                                <button
                                    onClick={handleProcessPayment}
                                    disabled={paymentMethod === 'cash' && Number(amountTendered) < total}
                                    className="flex-1 bg-[#F2A900] disabled:bg-gray-300 disabled:text-gray-500 text-[#0A101D] font-black py-4 rounded-2xl hover:bg-yellow-500 transition shadow-lg flex items-center justify-center gap-2"
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
                    <div className="bg-white rounded-3xl w-full max-w-xl p-10 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

                        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheckCircle size={48} />
                        </div>

                        <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 font-medium mb-10">Transaction completed for <span className="font-bold text-gray-800">TZS {total.toLocaleString()}</span>. Please select the document to print for the customer.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <button onClick={() => executePrint('receipt')} className="flex flex-col items-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-[#F2A900] hover:bg-yellow-50 transition group">
                                <FiFileText size={32} className="text-gray-400 group-hover:text-[#F2A900]" />
                                <span className="font-black text-sm text-gray-800">Print Receipt</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase">(Thermal / Small)</span>
                            </button>
                            <button onClick={() => executePrint('invoice')} className="flex flex-col items-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition group">
                                <FiFileText size={32} className="text-gray-400 group-hover:text-blue-500" />
                                <span className="font-black text-sm text-gray-800">Print Invoice</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase">(A4 Document)</span>
                            </button>
                            <button onClick={() => executePrint('warranty')} className="flex flex-col items-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-green-500 hover:bg-green-50 transition group">
                                <FiShield size={32} className="text-gray-400 group-hover:text-green-500" />
                                <span className="font-black text-sm text-gray-800">Warranty Card</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase">(Certificate)</span>
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
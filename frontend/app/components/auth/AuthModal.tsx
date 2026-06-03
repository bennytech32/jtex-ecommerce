import React, { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser, FiPhone, FiArrowRight } from 'react-icons/fi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true); // Hubadilisha kati ya Login na Register
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hapa ndipo API ya backend inapoitwa
    alert(isLogin ? "Umefanikiwa Kuingia!" : "Akaunti Imetengenezwa Kikamilifu!");
    onSuccess(); // Funga modal na ruhusu mteja aendelee
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background giza (Overlay) - ukibofya nje inafunga modal */}
      <div 
        className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Kadi ya Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Kitufe cha Kufunga (Close X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition"
        >
          <FiX size={18} />
        </button>

        {/* Kichwa cha Modal */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1A2E4C] p-6 text-center text-white">
          <h2 className="text-2xl font-black mb-1">
            J<span className="text-[#F2A900]">tex</span>
          </h2>
          <p className="text-xs text-gray-300 font-medium">
            {isLogin ? "Karibu tena! Ingia kwenye akaunti yako." : "Jiunge sasa upate ofa kabambe!"}
          </p>
        </div>

        {/* Fomu */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Jina Kamili</label>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-3 py-2.5 focus-within:border-[#F2A900] transition">
                    <FiUser className="text-gray-400 mr-2" />
                    <input type="text" placeholder="John Doe" className="w-full bg-transparent text-sm outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Namba ya Simu</label>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-3 py-2.5 focus-within:border-[#F2A900] transition">
                    <FiPhone className="text-gray-400 mr-2" />
                    <input type="tel" placeholder="0767..." className="w-full bg-transparent text-sm outline-none" required />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Barua Pepe</label>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-3 py-2.5 focus-within:border-[#F2A900] transition">
                <FiMail className="text-gray-400 mr-2" />
                <input type="email" placeholder="email@example.com" className="w-full bg-transparent text-sm outline-none" required />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">Nywila</label>
                {isLogin && <a href="#" className="text-[10px] text-[#F2A900] font-bold">Umesahau?</a>}
              </div>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-3 py-2.5 focus-within:border-[#F2A900] transition">
                <FiLock className="text-gray-400 mr-2" />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-transparent text-sm outline-none" required />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#F2A900] text-[#0F172A] font-bold py-3 rounded-xl mt-4 flex justify-center items-center gap-2 hover:bg-yellow-500 transition">
              {isLogin ? "Ingia (Login)" : "Kamilisha Usajili"} <FiArrowRight />
            </button>
          </form>

          {/* Toggle Button Kati ya Login na Register */}
          <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
            {isLogin ? "Hauna akaunti? " : "Tayari una akaunti? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-[#0F172A] font-black hover:text-[#F2A900] transition underline"
            >
              {isLogin ? "Jisajili Hapa" : "Ingia Hapa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
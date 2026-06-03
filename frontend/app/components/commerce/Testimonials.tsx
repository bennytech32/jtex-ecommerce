import React from 'react';
import { FiStar } from 'react-icons/fi';

const reviews = [
  { id: 1, name: "Aisha M.", role: "Mteja wa Dar es Salaam", text: "Mzigo umefika kwa wakati na ukiwa salama kabisa. Huduma yenu ni nzuri sana, nitaendelea kununua Jtex!", rating: 5 },
  { id: 2, name: "Baraka K.", role: "Mteja wa Mwanza", text: "Kusema ukweli nilikuwa na wasiwasi kuagiza online, lakini Jtex wamenithibitishia kuwa ni waaminifu. TV yangu inafanya kazi vizuri.", rating: 5 },
  { id: 3, name: "Salome J.", role: "Mteja wa Arusha", text: "Bei zenu ni rafiki ukilinganisha na maduka mengine. App inatumika kiurahisi sana. Nawapa nyota 4 kwa sababu mzigo ulichelewa kidogo.", rating: 4 },
];

export default function Testimonials() {
  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl border border-gray-100 shadow-sm mt-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Wateja Wanasemaje?</h2>
        <p className="text-sm text-gray-500">Soma maoni ya wateja wetu waliofanya manunuzi hivi karibuni.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100 relative">
            <div className="text-4xl text-gray-200 absolute top-4 right-4 font-serif">"</div>
            <div className="flex text-[#F2A900] mb-3">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < review.rating ? "fill-current" : "text-gray-300"} size={14} />
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-4 italic relative z-10">"{review.text}"</p>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
              <p className="text-xs text-gray-400">{review.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
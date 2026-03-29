import React from 'react';
import Link from 'next/link';
import { Briefcase, HelpCircle, Star, Target } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-white pt-10 mt-8 w-full block">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-10">
        <div>
          <h3 className="text-[#878787] text-sm mb-4">ABOUT</h3>
          <ul className="text-xs space-y-2 font-medium">
            <li><Link href="/" className="hover:underline">Contact Us</Link></li>
            <li><Link href="/" className="hover:underline">About Us</Link></li>
            <li><Link href="/" className="hover:underline">Careers</Link></li>
            <li><Link href="/" className="hover:underline">Flipkart Stories</Link></li>
            <li><Link href="/" className="hover:underline">Press</Link></li>
            <li><Link href="/" className="hover:underline">Corporate Information</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-[#878787] text-sm mb-4">GROUP COMPANIES</h3>
          <ul className="text-xs space-y-2 font-medium">
            <li><Link href="/" className="hover:underline">Myntra</Link></li>
            <li><Link href="/" className="hover:underline">Cleartrip</Link></li>
            <li><Link href="/" className="hover:underline">Shopsy</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-[#878787] text-sm mb-4">HELP</h3>
          <ul className="text-xs space-y-2 font-medium">
            <li><Link href="/" className="hover:underline">Payments</Link></li>
            <li><Link href="/" className="hover:underline">Shipping</Link></li>
            <li><Link href="/" className="hover:underline">Cancellation & Returns</Link></li>
            <li><Link href="/" className="hover:underline">FAQ</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-[#878787] text-sm mb-4">CONSUMER POLICY</h3>
          <ul className="text-xs space-y-2 font-medium">
            <li><Link href="/" className="hover:underline">Cancellation & Returns</Link></li>
            <li><Link href="/" className="hover:underline">Terms Of Use</Link></li>
            <li><Link href="/" className="hover:underline">Security</Link></li>
            <li><Link href="/" className="hover:underline">Privacy</Link></li>
            <li><Link href="/" className="hover:underline">Sitemap</Link></li>
          </ul>
        </div>

        <div className="col-span-2 border-t md:border-t-0 md:border-l border-gray-600 pl-0 md:pl-8 mt-4 md:mt-0 pt-4 md:pt-0">
          <h3 className="text-[#878787] text-sm mb-4">Mail Us:</h3>
          <p className="text-xs leading-loose text-gray-300">
            Flipkart Internet Private Limited, <br/>
            Buildings Alyssa, Begonia & <br/>
            Clove Embassy Tech Village, <br/>
            Outer Ring Road, Devarabeesanahalli Village, <br/>
            Bengaluru, 560103, <br/>
            Karnataka, India
          </p>
        </div>
      </div>
      
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
           <div className="flex gap-4 lg:gap-8 flex-wrap justify-center">
             <div className="flex items-center gap-2"><Briefcase size={16} className="text-[#ffe11b]" /> <span>Become a Seller</span></div>
             <div className="flex items-center gap-2"><Star size={16} className="text-[#ffe11b]" /> <span>Advertise</span></div>
             <div className="flex items-center gap-2"><Target size={16} className="text-[#ffe11b]" /> <span>Gift Cards</span></div>
             <div className="flex items-center gap-2"><HelpCircle size={16} className="text-[#ffe11b]" /> <span>Help Center</span></div>
           </div>
           
           <div>
             © 2007-2024 Flipkart.com
           </div>
           
           <div>
             <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg" alt="Payment Methods" className="h-5" />
           </div>
        </div>
      </div>
    </footer>
  );
}

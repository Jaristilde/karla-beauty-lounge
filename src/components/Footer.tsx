import { Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h4 className="font-serif text-2xl mb-4">KARLA BEAUTY LOUNGE</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium hair installs and custom units. Where luxury meets confidence. Your crown deserves the best.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/karlabeautylounge?igsh=aTQ1aWMyaW16Y2No" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-pink-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-pink-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-pink-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-4 text-pink-400">Services</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Bridal Packages</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Custom Wig Units</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Lace Wig Installs</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Natural Hair Care</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Install Academy</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium mb-4 text-pink-400">Quick Links</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#book" className="hover:text-teal-400 transition-colors">Book Appointment</a></li>
              <li><a href="#gallery" className="hover:text-teal-400 transition-colors">Before & After</a></li>
              <li><a href="#tips" className="hover:text-teal-400 transition-colors">Hair Care Tips</a></li>
              <li><a href="#faq" className="hover:text-teal-400 transition-colors">FAQ</a></li>
              <li><a href="#terms" className="hover:text-teal-400 transition-colors">Terms & Policies</a></li>
              <li><a href="#refunds" className="hover:text-teal-400 transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium mb-4 text-pink-400">Contact Info</h5>
            <ul className="space-y-3 text-sm text-gray-400 mb-6">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-teal-400 flex-shrink-0 mt-1" />
                <span>12545 NE 7th Ave, Downtown North Miami, FL 33161</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-teal-400 flex-shrink-0" />
                <a href="tel:305-305-5691" className="hover:text-teal-400 transition-colors">(305) 305-5691</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-teal-400 flex-shrink-0" />
                <a href="mailto:hello@karlabeautylounge.com" className="hover:text-teal-400 transition-colors">hello@karlabeautylounge.com</a>
              </li>
            </ul>

            <div>
              <h6 className="font-medium mb-3 text-sm">Subscribe to Newsletter</h6>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-full text-sm text-black focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-pink-500 px-6 py-2 rounded-r-full hover:bg-pink-600 transition-colors text-sm font-medium"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2025 Karla Beauty Lounge. All rights reserved. Made with <span className="text-pink-500">♥</span> for confident queens.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <h1 className="text-2xl font-serif tracking-wider">KARLA BEAUTY LOUNGE</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-sm font-medium hover:text-teal-500 transition-colors">HOME</a>
            <a href="#services" className="text-sm font-medium hover:text-teal-500 transition-colors">SERVICES</a>
            <a href="#book" className="text-sm font-medium hover:text-pink-500 transition-colors">BOOK NOW</a>
            <a href="#before-after" className="text-sm font-medium hover:text-teal-500 transition-colors">BEFORE & AFTER</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-teal-500 transition-colors">TESTIMONIALS</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 hover:text-teal-500 transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 hover:text-teal-500 transition-colors">
              <User size={20} />
            </button>
            <button className="p-2 hover:text-teal-500 transition-colors">
              <ShoppingBag size={20} />
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-4">
            <a href="#home" className="block text-sm font-medium hover:text-teal-500">HOME</a>
            <a href="#services" className="block text-sm font-medium hover:text-teal-500">SERVICES</a>
            <a href="#book" className="block text-sm font-medium hover:text-pink-500">BOOK NOW</a>
            <a href="#before-after" className="block text-sm font-medium hover:text-teal-500">BEFORE & AFTER</a>
            <a href="#testimonials" className="block text-sm font-medium hover:text-teal-500">TESTIMONIALS</a>
          </div>
        </div>
      )}
    </header>
  );
}

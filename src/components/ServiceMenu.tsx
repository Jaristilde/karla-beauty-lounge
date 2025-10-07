import { Calendar, Sparkles } from 'lucide-react';

interface Service {
  name: string;
  description: string;
  popular?: boolean;
  special?: boolean;
  icon?: string;
}

const services: Service[] = [
  {
    name: 'Bridal Packages',
    description: 'Look stunning on your special day with our luxury bridal hair services',
    popular: true,
    icon: '👰🏽'
  },
  {
    name: 'Custom Wig Unit',
    description: 'Personalized units made to fit your style and preferences perfectly',
    icon: '✨'
  },
  {
    name: 'Install Sew In',
    description: 'Seamless, natural-looking sew-in installations that last',
    icon: '💇🏽‍♀️'
  },
  {
    name: 'Lace Wig Install',
    description: 'Flawless lace application with undetectable hairlines',
    popular: true,
    icon: '🎯'
  },
  {
    name: 'Natural Hair Care',
    description: 'Healthy hair maintenance and protective styling for natural hair',
    icon: '🌿'
  },
  {
    name: 'Ponytails',
    description: 'Sleek and stylish ponytail installs for any occasion',
    icon: '💁🏽‍♀️'
  },
  {
    name: 'Protective Bond In Style',
    description: 'Protective styling using the bond-in method for healthy growth',
    icon: '🛡️'
  },
  {
    name: 'Re-curl / Maintenance',
    description: 'Refresh and maintain your style to keep it looking fresh',
    popular: true,
    icon: '🔄'
  },
  {
    name: 'VIP Sundays & Mondays',
    description: 'Exclusive VIP appointment slots for premium service',
    special: true,
    icon: '👑'
  },
  {
    name: 'Weave/Wig Install Academy',
    description: 'Learn professional install techniques from the pros',
    icon: '🎓'
  },
  {
    name: 'Wednesday Special',
    description: 'Midweek exclusive deals and special service packages',
    special: true,
    icon: '🎁'
  },
];

export default function ServiceMenu() {
  const scrollToBooking = (serviceName: string) => {
    const bookingSection = document.getElementById('book');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      sessionStorage.setItem('selectedService', serviceName);
      window.dispatchEvent(new CustomEvent('serviceSelected', { detail: serviceName }));
    }
  };

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            Our Services
          </div>
          <h2 className="text-5xl md:text-6xl font-serif mb-6">Premium Hair Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From bridal packages to custom units, we offer premium services designed to make you look and feel flawless. Each service is crafted with care and expertise.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-teal-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>

              <div className="relative z-10">
                {service.popular && (
                  <div className="absolute -top-4 -right-4">
                    <div className="bg-pink-500 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                      <Sparkles size={12} />
                      <span className="font-bold">POPULAR</span>
                    </div>
                  </div>
                )}

                {service.special && (
                  <div className="absolute -top-4 -right-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                      <Sparkles size={12} />
                      <span className="font-bold">SPECIAL</span>
                    </div>
                  </div>
                )}

                <div className="text-4xl mb-4">{service.icon}</div>

                <h3 className="text-xl font-serif mb-3 group-hover:text-pink-500 transition-colors">
                  {service.name}
                </h3>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>

                <button
                  onClick={() => scrollToBooking(service.name)}
                  className="w-full bg-black text-white py-3 px-6 rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-teal-500 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105 transform font-medium"
                >
                  <Calendar size={18} />
                  <span>SELECT</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="#book">
            <button className="bg-gradient-to-r from-pink-500 to-teal-500 text-white px-12 py-4 rounded-full text-lg font-medium hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
              View All Services & Book Now
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

import { Sparkles, Clock, Award, HelpCircle } from 'lucide-react';
import Header from './components/Header';
import AboutSection from './components/AboutSection';
import ServiceMenu from './components/ServiceMenu';
import BeforeAfter from './components/BeforeAfter';
import BookingSection from './components/BookingSection';
import TestimonialSlider from './components/TestimonialSlider';
import Footer from './components/Footer';
import mainImageWhiteTop from './assets/images/Main_Image_WhiteTop2.jpeg';
import karlaBobSpecial from './assets/images/Karla-bob-special.jpeg';
import laceWigSewIn from './assets/images/Lace_WigSewin.jpg';
import flawlessBob from './assets/images/Flawless_Bob.jpg';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-teal-50/30 to-cyan-50/40">
          <div className="absolute inset-0 opacity-30 bg-cover bg-center"
               style={{ backgroundImage: 'url(https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left order-2 lg:order-1">
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="text-teal-500" size={20} />
                  <p className="text-sm tracking-widest uppercase text-gray-700 font-medium">Where Hair Meets Confidence</p>
                </div>

                <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight text-gray-900">
                  THE HAIR <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-teal-500">BLOG</span>
                </h1>

                <p className="text-lg md:text-xl max-w-xl mb-10 text-gray-700 leading-relaxed">
                  Your all-access pass to hair hacks, styling trends, and expert-approved advice from the Karla Beauty Lounge squad.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#services">
                    <button className="bg-pink-500 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-pink-600 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl">
                      Explore Styles
                    </button>
                  </a>
                  <a href="#book">
                    <button className="border-2 border-gray-800 text-gray-800 px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-105 transform">
                      Book Now
                    </button>
                  </a>
                </div>
              </div>

              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 to-teal-400 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
                  <img
                    src={mainImageWhiteTop}
                    alt="Karla Beauty Lounge Model"
                    className="relative w-full max-w-md lg:max-w-lg h-auto object-cover rounded-3xl shadow-2xl"
                    style={{ filter: 'brightness(1.05) contrast(1.03) saturate(1.05)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-pink-500 group-hover:to-pink-600 transition-all duration-300">
                  <Award className="text-pink-500 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-2xl font-serif mb-3">Premium Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  100% virgin human hair that looks and feels natural
                </p>
              </div>

              <div className="group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-teal-500 group-hover:to-teal-600 transition-all duration-300">
                  <Clock className="text-teal-500 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-2xl font-serif mb-3">Quick Install</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get your dream look in minutes, not hours
                </p>
              </div>

              <div className="group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-pink-500 group-hover:to-teal-500 transition-all duration-300">
                  <Sparkles className="text-purple-500 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-2xl font-serif mb-3">Flawless Blend</h3>
                <p className="text-gray-600 leading-relaxed">
                  Seamless integration with your natural hair
                </p>
              </div>
            </div>
          </div>
        </section>

        <AboutSection />

        <section className="relative py-32 bg-gradient-to-br from-pink-500 to-teal-500 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full"
                 style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              More Than Hair.<br />It's <span className="italic">Confidence.</span>
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-95">
              At Karla Beauty Lounge, we know your hair is more than just a style—it's confidence, identity, and self-care. That's why we create installs and custom units that blend seamlessly, style effortlessly, and keep you flawless even on your busiest days.
            </p>
          </div>
        </section>

        <section id="shop" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block bg-gradient-to-r from-pink-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                Shop Hair
              </div>
              <h2 className="text-5xl md:text-6xl font-serif mb-6">Transform Your Look</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From sleek and straight to bold and curly, we've got the perfect style for every vibe.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden shadow-md">
                  <img
                    src={karlaBobSpecial}
                    alt="Wednesday Bob Quick Weave Special"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ filter: 'brightness(1.12) contrast(1.05) saturate(1.1)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-4 left-4">
                      <Sparkles className="text-pink-300" size={20} style={{ animation: 'sparkle 2s infinite' }} />
                    </div>
                    <div className="absolute top-12 right-8">
                      <Sparkles className="text-white" size={16} style={{ animation: 'sparkle 2.5s infinite 0.3s' }} />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      SPECIAL
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-serif mb-1">Wednesday Bob Quick Weave Special</h3>
                    <p className="text-sm opacity-90 mb-1">Protective Style – 1 Hour @ $100</p>
                    <p className="text-xs opacity-80 mb-4">A sleek, protective bob weave styled to perfection</p>
                    <a href="#book">
                      <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-pink-500 hover:text-white transition-colors">
                        Book Now
                      </button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden shadow-md">
                  <img
                    src={laceWigSewIn}
                    alt="Lace Wig Sew-In"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ filter: 'brightness(1.12) contrast(1.05) saturate(1.1)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-6 left-6">
                      <Sparkles className="text-teal-300" size={18} style={{ animation: 'sparkle 2.2s infinite' }} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-serif mb-2">Lace Wig Sew-In</h3>
                    <p className="text-sm opacity-90 mb-4">Flawless lace application</p>
                    <a href="#book">
                      <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-pink-500 hover:text-white transition-colors">
                        Book Now
                      </button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden shadow-md">
                  <img
                    src={flawlessBob}
                    alt="Flawless Bob"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ filter: 'brightness(1.12) contrast(1.05) saturate(1.1)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-8 right-6">
                      <Sparkles className="text-pink-200" size={18} style={{ animation: 'sparkle 2.4s infinite 0.2s' }} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-serif mb-2">Flawless Bob</h3>
                    <p className="text-sm opacity-90 mb-4">Sleek & sophisticated</p>
                    <a href="#book">
                      <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-pink-500 hover:text-white transition-colors">
                        Book Now
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServiceMenu />

        <BeforeAfter />

        <TestimonialSlider />

        <section id="tips" className="py-24 bg-gradient-to-b from-white to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block bg-gradient-to-r from-pink-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                Hair Care Tips
              </div>
              <h2 className="text-5xl md:text-6xl font-serif mb-6">Sleek Tips</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Expert advice to keep your hair looking flawless between appointments.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Washing Your Install', tip: 'Use sulfate-free shampoo and lukewarm water' },
                { title: 'Nighttime Care', tip: 'Wrap with a silk scarf or use a satin pillowcase' },
                { title: 'Heat Styling', tip: 'Always use heat protectant and low to medium heat' },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-teal-100 rounded-full flex items-center justify-center mb-6">
                    <HelpCircle className="text-pink-500" size={28} />
                  </div>
                  <h3 className="text-xl font-serif mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BookingSection />

        <section className="py-20 bg-gradient-to-r from-pink-500 to-teal-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-4xl md:text-5xl font-serif mb-4">Ready to Slay?</h3>
            <p className="text-lg md:text-xl mb-10 opacity-95 max-w-2xl mx-auto">
              Don't wait. Book your appointment today and step into your confidence.
            </p>
            <a href="#book">
              <button className="bg-white text-pink-500 px-12 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform shadow-2xl">
                Book Your Appointment Now
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;

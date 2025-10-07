import { Sparkles, Award } from 'lucide-react';
import ownerPhoto from '../assets/images/Owner.jpeg';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={ownerPhoto}
                alt="Karla - Award Winning Hairstylist"
                className="w-full h-full object-cover object-center"
                style={{ filter: 'brightness(1.05) contrast(1.02)' }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center space-x-3 mb-2">
                <Award className="text-pink-500" size={24} />
                <span className="font-serif text-lg leading-tight">Best Hairstylist</span>
              </div>
              <p className="text-sm text-gray-600">Miami Under 40 Award Winner</p>
            </div>
          </div>

          <div>
            <div className="inline-block bg-gradient-to-r from-pink-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              About Karla Beauty Lounge
            </div>

            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Your Hair is Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-teal-500">Crown</span>
            </h2>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Karla Beauty Lounge, we believe your hair is your crown — and we make it shine. Whether you're a bride, a baddie, or a boss, we specialize in premium installs, wig units, and natural hair care that blend effortlessly and slay every time.
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Every service is crafted with precision, passion, and the highest quality virgin hair. We don't just style hair—we transform confidence, one install at a time.
            </p>

            <div className="bg-gradient-to-r from-pink-100 to-teal-50 p-6 rounded-2xl border-l-4 border-pink-500 mb-8">
              <div className="flex items-start space-x-3 mb-4">
                <Award size={24} className="text-pink-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2 text-gray-900">Meet Karla - Award-Winning Stylist</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Hi, my name is Karla! I've been in this business for over 10 years, and during that time, I've had the privilege of helping many talented stylists open their own salons and build successful careers. My passion is creating flawless installs and empowering others to discover their confidence through beautiful hair.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    Honored as Best Hairstylist in Miami Under 40, I bring expertise, artistry, and dedication to every client who sits in my chair. You'll leave not just looking amazing, but feeling unstoppable.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#book">
                <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform">
                  Book with Karla
                </button>
              </a>
              <a href="#shop">
                <button className="border-2 border-black text-black px-8 py-3 rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300 hover:scale-105 transform">
                  Shop Hair
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

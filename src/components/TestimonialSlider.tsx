import { ChevronLeft, ChevronRight, Star, Play } from 'lucide-react';
import { useState } from 'react';
import karlaClient1 from '../assets/images/Karla-Client 1.jpg';
import karlaClient2 from '../assets/images/Karla-Client 2.jpg';
import karlaCustomWig from '../assets/images/Karla-Custom-wig.jpg';
import silkPress from '../assets/images/Silk press.jpg';

const slogans = [
  "The Girls Ate. No Crumbs Left.",
  "Why We Stay Booked 🔥",
  "Installed & Obsessed 😍",
  "What They're Loving ✨"
];

const testimonials = [
  {
    image: karlaClient1,
    name: 'Jasmine M.',
    service: 'Silk Press w/ Glued Extensions',
    rating: 5,
    quote: 'Karla made me feel like a whole new person! The install is flawless and looks so natural.',
    tag: 'VIP Install'
  },
  {
    image: karlaClient2,
    name: 'Marie P.',
    service: 'Bridal Perfection',
    rating: 5,
    quote: 'I love how light and natural my custom unit feels — zero stress, all slay!',
    tag: 'Unit Day'
  },
  {
    image: karlaCustomWig,
    name: 'Aaliyah R.',
    service: 'Custom Wig Install',
    rating: 5,
    quote: 'This custom wig transformed my look — soft, bouncy, and easy to maintain!',
    tag: 'Clip-In Upgrade'
  },
  {
    image: silkPress,
    name: 'Jasmine M.',
    service: 'Silk Press w/ Glued Extensions',
    rating: 5,
    quote: 'The quality is unmatched! My silk press looks like it grew from my scalp.',
    tag: 'VIP Slay'
  }
];

export default function TestimonialSlider() {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextSlogan = () => {
    setCurrentSlogan((prev) => (prev + 1) % slogans.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            Client Love
          </div>

          <div className="mb-6">
            <div className="flex justify-center space-x-2 mb-4">
              {slogans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlogan(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlogan === index ? 'bg-pink-500 w-8' : 'bg-gray-300'
                  }`}
                  aria-label={`View slogan ${index + 1}`}
                />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-4 transition-all duration-500 cursor-pointer hover:text-pink-500" onClick={nextSlogan}>
              {slogans[currentSlogan]}
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See what our clients are saying about their transformations.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative h-96 md:h-auto group">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(1.1) contrast(1.05) saturate(1.08)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute top-4 left-4">
                  <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center space-x-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4">
                  <div className="bg-gradient-to-r from-pink-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    {testimonials[currentTestimonial].tag}
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
                    <Play size={32} className="text-pink-500 fill-pink-500" />
                  </button>
                </div>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <svg className="w-12 h-12 text-pink-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
                    {testimonials[currentTestimonial].quote}
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-2xl mb-1">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-pink-500 font-medium">
                    {testimonials[currentTestimonial].service}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-pink-50 hover:text-pink-500"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextTestimonial}
              className="bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-pink-50 hover:text-pink-500"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentTestimonial === index ? 'bg-pink-500 w-8' : 'bg-gray-300'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 ${
                currentTestimonial === index ? 'ring-4 ring-pink-500' : 'hover:ring-2 hover:ring-gray-300'
              }`}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                style={{ filter: 'brightness(1.1) contrast(1.05) saturate(1.08)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm font-medium">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

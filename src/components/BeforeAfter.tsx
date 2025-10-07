import { useEffect, useRef, useState } from 'react';
import bridalImage from '../assets/images/Bridal Image Hairstyle.jpg';
import flawlessRawHair from '../assets/images/Flawless Raw_Hair.jpg';
import customWig from '../assets/images/Karla-Custom-wig.jpg';
import silkPress from '../assets/images/Silk press.jpg';

interface BeforeAfterItem {
  image: string;
  title: string;
  description: string;
}

const transformations: BeforeAfterItem[] = [
  {
    image: bridalImage,
    title: 'Bridal Perfection',
    description: 'Elegant bridal hairstyle for the perfect day'
  },
  {
    image: customWig,
    title: 'Custom Wig Install',
    description: 'Soft, bouncy, and easy to maintain'
  },
  {
    image: silkPress,
    title: 'Silk Press w/ Glued Extensions',
    description: 'Silky smooth perfection'
  },
  {
    image: flawlessRawHair,
    title: 'Flawless Raw Hair',
    description: 'Premium virgin hair, natural flow'
  }
];

export default function BeforeAfter() {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(transformations.length).fill(false));
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observer && itemRefs.current[index]) {
          observer.unobserve(itemRefs.current[index]!);
        }
      });
    };
  }, []);

  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            Before & After Gallery
          </div>
          <h2 className="text-5xl md:text-6xl font-serif mb-6">Effortless Installs. Real Results.</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See the magic happen. Real clients, real transformations, real confidence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {transformations.map((item, index) => (
            <div
              key={index}
              ref={el => itemRefs.current[index] = el}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-700 transform ${
                visibleItems[index]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden relative group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  style={{ filter: 'brightness(1.12) contrast(1.05) saturate(1.1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-serif mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#book">
            <button className="bg-gradient-to-r from-pink-500 to-teal-500 text-white px-12 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
              Get Your Transformation
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

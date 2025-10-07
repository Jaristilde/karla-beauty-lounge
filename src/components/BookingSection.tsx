import BookingForm from './BookingForm';

export default function BookingSection() {
  return (
    <section id="book" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-serif mb-6">Book Your Appointment</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your service and choose a time that works for you. We can't wait to see you!
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-teal-50 rounded-2xl p-8 md:p-12 shadow-lg">
          <BookingForm />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Questions? Call us at <a href="tel:555-123-4567" className="text-pink-500 hover:underline font-medium">(555) 123-4567</a> or email <a href="mailto:hello@karlabeautylounge.com" className="text-pink-500 hover:underline font-medium">hello@karlabeautylounge.com</a>
          </p>
        </div>
      </div>
    </section>
  );
}

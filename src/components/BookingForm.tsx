import { useState, useEffect } from 'react';
import { supabase, Service, ServiceCategory } from '../lib/supabase';
import { Calendar, Clock, DollarSign, CheckCircle } from 'lucide-react';

const sendSMSNotification = async (bookingInfo: {
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  notes: string;
}) => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/functions/v1/send-booking-notification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingInfo),
    });

    if (!response.ok) {
      console.error('Failed to send SMS notification');
    }
  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
};

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceId: string;
  addonIds: string[];
  date: string;
  time: string;
  notes: string;
}

export default function BookingForm() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [addons, setAddons] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceId: '',
    addonIds: [],
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    loadData();

    const selectedService = sessionStorage.getItem('selectedService');
    if (selectedService) {
      setTimeout(() => {
        const service = services.find(s => s.name === selectedService);
        if (service) {
          setFormData(prev => ({ ...prev, serviceId: service.id }));
        }
      }, 100);
    }

    const handleServiceSelection = (event: CustomEvent) => {
      const serviceName = event.detail;
      const service = services.find(s => s.name === serviceName);
      if (service) {
        setFormData(prev => ({ ...prev, serviceId: service.id }));
      }
    };

    window.addEventListener('serviceSelected', handleServiceSelection as EventListener);
    return () => {
      window.removeEventListener('serviceSelected', handleServiceSelection as EventListener);
    };
  }, [services]);

  const loadData = async () => {
    try {
      const [categoriesRes, servicesRes] = await Promise.all([
        supabase.from('service_categories').select('*').order('display_order'),
        supabase.from('services').select('*').order('display_order'),
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (servicesRes.error) throw servicesRes.error;

      setCategories(categoriesRes.data || []);
      const allServices = servicesRes.data || [];
      setServices(allServices.filter((s) => !s.is_addon));
      setAddons(allServices.filter((s) => s.is_addon));
    } catch (err) {
      setError('Failed to load services. Please refresh the page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getSelectedService = () => {
    return services.find((s) => s.id === formData.serviceId);
  };

  const getSelectedAddons = () => {
    return addons.filter((a) => formData.addonIds.includes(a.id));
  };

  const calculateTotal = () => {
    const service = getSelectedService();
    const selectedAddons = getSelectedAddons();
    const servicePrice = service?.price_cents || 0;
    const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price_cents, 0);
    return servicePrice + addonsPrice;
  };

  const calculateDuration = () => {
    const service = getSelectedService();
    const selectedAddons = getSelectedAddons();
    const serviceDuration = service?.duration_minutes || 0;
    const addonsDuration = selectedAddons.reduce((sum, a) => sum + a.duration_minutes, 0);
    return serviceDuration + addonsDuration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Create or get customer
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      let customerId: string;

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Create appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          service_id: formData.serviceId,
          appointment_date: formData.date,
          appointment_time: formData.time,
          notes: formData.notes,
          status: 'pending',
        })
        .select('id')
        .single();

      if (appointmentError) throw appointmentError;

      // Add addons
      if (formData.addonIds.length > 0) {
        const addonInserts = formData.addonIds.map((addonId) => ({
          appointment_id: appointment.id,
          service_id: addonId,
        }));

        const { error: addonsError } = await supabase
          .from('appointment_addons')
          .insert(addonInserts);

        if (addonsError) throw addonsError;
      }

      await sendSMSNotification({
        customerName: `${formData.firstName} ${formData.lastName}`,
        serviceName: getSelectedService()?.name || '',
        date: formData.date,
        time: formData.time,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
      });

      setSuccess(true);
      setStep(1);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        serviceId: '',
        addonIds: [],
        date: '',
        time: '',
        notes: '',
      });
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAddon = (addonId: string) => {
    setFormData((prev) => ({
      ...prev,
      addonIds: prev.addonIds.includes(addonId)
        ? prev.addonIds.filter((id) => id !== addonId)
        : [...prev.addonIds, addonId],
    }));
  };

  const getServicesByCategory = (categoryId: string) => {
    return services.filter((s) => s.category_id === categoryId);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getAvailableTimes = () => {
    return [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-serif mb-4">Booking Confirmed!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for booking with Karla Beauty Lounge. We've sent a confirmation email to {formData.email}.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 md:p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${step >= 1 ? 'text-pink-500' : 'text-gray-400'}`}>
            Select Service
          </span>
          <span className={`text-sm font-medium ${step >= 2 ? 'text-pink-500' : 'text-gray-400'}`}>
            Date & Time
          </span>
          <span className={`text-sm font-medium ${step >= 3 ? 'text-pink-500' : 'text-gray-400'}`}>
            Your Details
          </span>
        </div>
        <div className="flex gap-2">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
        </div>
      </div>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-serif mb-4">Select Your Service</h3>
          {categories
            .filter((cat) => getServicesByCategory(cat.id).length > 0)
            .map((category) => (
              <div key={category.id} className="space-y-3">
                <h4 className="font-semibold text-lg text-gray-800">{category.name}</h4>
                <div className="space-y-2">
                  {getServicesByCategory(category.id).map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceId: service.id })}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        formData.serviceId === service.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {service.duration_minutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {formatPrice(service.price_cents)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

          {/* Add-ons */}
          {formData.serviceId && addons.length > 0 && (
            <div className="space-y-3 pt-6 border-t">
              <h4 className="font-semibold text-lg text-gray-800">Add-on Services (Optional)</h4>
              <div className="space-y-2">
                {addons.map((addon) => (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      formData.addonIds.includes(addon.id)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{addon.name}</div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          {addon.duration_minutes > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              +{addon.duration_minutes} min
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            +{formatPrice(addon.price_cents)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {formData.serviceId && (
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total Duration:</span>
                <span className="font-medium">{calculateDuration()} minutes</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Price:</span>
                <span className="text-pink-500">{formatPrice(calculateTotal())}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!formData.serviceId}
            className="w-full bg-pink-500 text-white py-3 rounded-full hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            Continue to Date & Time
          </button>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-serif mb-4">Choose Date & Time</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Select Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={getTodayDate()}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Select Time
            </label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Choose a time</option>
              {getAvailableTimes().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Any special requests or information we should know?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full hover:bg-gray-300 transition-colors font-medium"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!formData.date || !formData.time}
              className="flex-1 bg-pink-500 text-white py-3 rounded-full hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Continue to Details
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact Details */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-serif mb-4">Your Contact Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Booking Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{getSelectedService()?.name}</span>
              </div>
              {getSelectedAddons().length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Add-ons:</span>
                  <span className="font-medium">{getSelectedAddons().length}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{formData.time}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold text-pink-500">{formatPrice(calculateTotal())}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full hover:bg-gray-300 transition-colors font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-pink-500 text-white py-3 rounded-full hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

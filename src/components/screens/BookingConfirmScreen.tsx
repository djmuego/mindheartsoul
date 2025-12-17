
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';
import { getMentorById } from '../../services/mockData';
import { createBooking } from '../../services/bookingsService';
import { createPayment, markPaymentComplete } from '../../services/payments/paymentsService';
import { useSession } from '../../context/SessionContext';
import { useLanguage } from '../../context/LanguageContext';
import { pushNotification } from '../../services/notificationsService';

export const BookingConfirmScreen: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSession();
  const { t } = useLanguage();

  const state = location.state as { sessionTypeId: string; startsAtIso: string; note?: string } | undefined;

  if (!mentorId || !state || !user) {
    return <div className="p-8 text-center">Invalid State</div>;
  }

  const mentor = getMentorById(mentorId);
  const sessionType = mentor?.sessionTypes.find(st => st.id === state.sessionTypeId);
  const startTime = new Date(state.startsAtIso);

  if (!mentor || !sessionType) return null;

  const handleConfirm = async () => {
    const booking = createBooking(
      user.id,
      mentor.id,
      sessionType.id,
      startTime,
      sessionType.durationMin,
      state.note
    );

    try {
      // Create payment record
      const payment = createPayment({
        userId: user.id,
        purpose: 'booking',
        relatedId: booking.id,
        amount: sessionType.price,
        currency: 'USD',
        provider: 'stripe', // Default to Stripe for bookings
        metadata: { mentorId: mentor.id, sessionTypeId: sessionType.id }
      });

      // Simulate instant payment success (stub)
      markPaymentComplete(payment.id);
      
      // Notify
      pushNotification(user.id, 'booking_confirmed', 'notifications.bookingConfirmed', { bookingId: booking.id });
      
      navigate(`/booking/${booking.id}`, { replace: true });
    } catch (e) {
      console.error("Payment failed", e);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('booking.confirm')}</h1>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-24">
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">{t('booking.summary')}</h2>
          
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
             <img src={mentor.avatarUrl} className="w-16 h-16 rounded-full object-cover" alt={mentor.name} />
             <div>
               <h3 className="font-bold text-slate-900 dark:text-white text-lg">{mentor.name}</h3>
               <p className="text-indigo-600 dark:text-indigo-400 font-medium">{sessionType.label}</p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-200">
              <Calendar className="text-slate-400" size={20} />
              <span className="font-medium">{startTime.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-200">
              <Clock className="text-slate-400" size={20} />
              <span className="font-medium">{startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({sessionType.durationMin} min)</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="font-medium text-slate-600 dark:text-slate-400">Total Price</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">${sessionType.price}</span>
        </div>

      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20 safe-area-pb">
        <button
          onClick={handleConfirm}
          className={`w-full py-3 flex items-center justify-center space-x-2 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none`}
        >
          <span>Confirm & Pay</span>
        </button>
      </div>
    </div>
  );
};

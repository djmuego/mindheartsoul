import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft, DollarSign, ExternalLink, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { getBookingById, updateBookingStatus } from '../../services/bookingsService';
import { getMentorById } from '../../services/mockData';
import { useLanguage } from '../../context/LanguageContext';

export const BookingDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Local state to force re-render on status update since we don't use a global store for bookings yet
  const [, setRefresh] = useState(0);
  
  const booking = getBookingById(id || '');

  if (!booking) {
    return <div className="p-8 text-center">Booking not found</div>;
  }

  const mentor = getMentorById(booking.mentorId);
  const sessionType = mentor?.sessionTypes.find(st => st.id === booking.sessionTypeId);
  
  if (!mentor || !sessionType) return <div>Invalid Booking Data</div>;

  const startTime = new Date(booking.startsAtIso);

  const handlePay = () => {
    updateBookingStatus(booking.id, 'confirmed');
    setRefresh(r => r + 1);
  };

  const handleCancel = () => {
    updateBookingStatus(booking.id, 'cancelled');
    setRefresh(r => r + 1);
  };

  const handleJoin = () => {
    // Navigate to SessionJoinScreen for better UX and join status validation
    navigate(`/sessions/${booking.id}`);
  };

  const StatusBadge = () => {
    switch (booking.status) {
      case 'confirmed':
        return <div className="flex items-center space-x-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm font-medium"><CheckCircle size={14} /><span>Confirmed</span></div>;
      case 'cancelled':
        return <div className="flex items-center space-x-1 text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-sm font-medium"><XCircle size={14} /><span>Cancelled</span></div>;
      default:
        return <div className="flex items-center space-x-1 text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full text-sm font-medium"><AlertCircle size={14} /><span>Pending Payment</span></div>;
    }
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate('/home')} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Booking Details</h1>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-24">
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
           <img src={mentor.avatarUrl} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" alt={mentor.name} />
           <h2 className="text-xl font-bold text-slate-900 dark:text-white">{mentor.name}</h2>
           <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">{sessionType.label}</p>
           <div className="flex justify-center">
             <StatusBadge />
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
           <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
             <span className="text-slate-500 dark:text-slate-400">Date</span>
             <span className="font-medium text-slate-900 dark:text-white">{startTime.toLocaleDateString()}</span>
           </div>
           <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
             <span className="text-slate-500 dark:text-slate-400">Time</span>
             <span className="font-medium text-slate-900 dark:text-white">{startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
           </div>
           <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
             <span className="text-slate-500 dark:text-slate-400">Price</span>
             <span className="font-medium text-slate-900 dark:text-white">${sessionType.price}</span>
           </div>
           {booking.note && (
             <div className="py-2">
               <span className="block text-slate-500 dark:text-slate-400 mb-1">Note</span>
               <p className="text-slate-700 dark:text-slate-300 italic text-sm">{booking.note}</p>
             </div>
           )}
        </div>

        {booking.status === 'confirmed' && (
          <button 
            onClick={handleJoin}
            className={`w-full py-4 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-200 dark:shadow-none`}
          >
            <ExternalLink size={20} />
            <span>{t('booking.join')}</span>
          </button>
        )}

        {booking.status === 'pending_payment' && (
          <button 
            onClick={handlePay}
            className={`w-full py-4 flex items-center justify-center space-x-2 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none`}
          >
            <DollarSign size={20} />
            <span>{t('booking.pay')}</span>
          </button>
        )}

        {booking.status !== 'cancelled' && (
          <button 
             onClick={handleCancel}
             className="w-full py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors"
          >
            {t('booking.cancel')}
          </button>
        )}

      </div>
    </div>
  );
};
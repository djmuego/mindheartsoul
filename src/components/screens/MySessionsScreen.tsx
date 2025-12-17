import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageCircle, Clock, User } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { useT } from '../../i18n/useT';
import { getBookingsByUser } from '../../services/bookingsService';
import { getMentorById } from '../../services/mockData';

export const MySessionsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const t = useT();

  const bookings = useMemo(() => {
    if (!user) return [];
    return getBookingsByUser(user.id).reverse(); // Most recent first
  }, [user]);

  const pendingBookings = useMemo(() => bookings.filter(b => b.status === 'pending_payment'), [bookings]);
  const confirmedBookings = useMemo(() => bookings.filter(b => b.status === 'confirmed'), [bookings]);
  const pastBookings = useMemo(() => bookings.filter(b => b.status === 'cancelled' || b.status === 'completed'), [bookings]);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending_payment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      completed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    };
    return styles[status as keyof typeof styles] || styles.pending_payment;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending_payment: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const renderBookingCard = (booking: any) => {
    const mentor = getMentorById(booking.mentorId);
    if (!mentor) return null;

    return (
      <div
        key={booking.id}
        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => navigate(`/booking/${booking.id}`)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={mentor.avatarUrl || 'https://picsum.photos/seed/mentor/100/100'}
              alt={mentor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{mentor.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{booking.sessionName}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(booking.status)}`}>
            {getStatusLabel(booking.status)}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{booking.time}</span>
          </div>
        </div>

        {booking.status === 'confirmed' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/chat/mentor:${booking.mentorId}`);
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
          >
            <MessageCircle size={16} />
            <span>{t('booking.openChat')}</span>
          </button>
        )}

        {booking.status === 'pending_payment' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/booking/${booking.id}`);
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            {t('booking.pay')}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {t('nav.sessions') || 'My Sessions'}
        </h1>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center shadow-sm">
            <User size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t('booking.none')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Book a consultation with a mentor to get started.
            </p>
            <button
              onClick={() => navigate('/mentors')}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition-colors"
            >
              {t('disabled.findMentor')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {confirmedBookings.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {t('mentor.confirmed')}
                </h2>
                <div className="space-y-3">
                  {confirmedBookings.map(renderBookingCard)}
                </div>
              </section>
            )}

            {pendingBookings.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {t('booking.pending')}
                </h2>
                <div className="space-y-3">
                  {pendingBookings.map(renderBookingCard)}
                </div>
              </section>
            )}

            {pastBookings.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {t('mentor.history')}
                </h2>
                <div className="space-y-3">
                  {pastBookings.map(renderBookingCard)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

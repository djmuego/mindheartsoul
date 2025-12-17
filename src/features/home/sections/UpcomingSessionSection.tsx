import React, { useMemo } from 'react';
import { useSession } from '../../../context/SessionContext';
import { useT } from '../../../i18n/useT';
import { getBookingsByUser } from '../../../services/bookingsService';
import { getMentorById } from '../../../services/mockData';
import { Video, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Brand } from '../../../constants';

export const UpcomingSessionSection: React.FC = () => {
  const { user } = useSession();
  const t = useT();
  const navigate = useNavigate();

  const upcomingBooking = useMemo(() => {
    if (!user) return null;
    const bookings = getBookingsByUser(user.id);
    const now = new Date();
    return bookings.find(b => b.status === 'confirmed' && new Date(b.startsAtIso) > now);
  }, [user]);

  const upcomingMentor = upcomingBooking ? getMentorById(upcomingBooking.mentorId) : null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('common.book')}</h2>
      {upcomingBooking && upcomingMentor ? (
        <div 
           onClick={() => navigate(`/booking/${upcomingBooking.id}`)}
           className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
        >
           <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full text-indigo-600 dark:text-indigo-400">
                <Video size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-slate-900 dark:text-white text-sm">{upcomingMentor.name}</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                   {new Date(upcomingBooking.startsAtIso).toLocaleDateString()} • {new Date(upcomingBooking.startsAtIso).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </p>
              </div>
           </div>
           <div className={`px-3 py-1.5 rounded-full bg-${Brand.colors.primary} text-white text-xs font-bold`}>
             Join
           </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
           <p className="text-slate-500 dark:text-slate-400 mb-4">{t('booking.none')}</p>
           <button 
             onClick={() => navigate('/mentors')}
             className={`text-${Brand.colors.primary} dark:text-indigo-400 font-medium text-sm flex items-center justify-center space-x-1`}
           >
             <span>{t('mentors.title')}</span>
             <ArrowRight size={16} />
           </button>
        </div>
      )}
    </section>
  );
};

import React from 'react';
import { useT } from '../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Video } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { getBookings } from '../../services/bookingsService';

export const MentorBookingsScreen: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  const { user } = useSession();
  const myBookings = user ? getBookings().filter(b => b.mentorId === user.id) : [];

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('mentor.bookings')}</h1>
      </div>

      <div className="p-4 space-y-4">
        {myBookings.length === 0 && <p className="text-center text-slate-500 mt-10">No bookings yet.</p>}
        {myBookings.map(b => (
          <div key={b.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-900 dark:text-white">{new Date(b.startsAtIso).toLocaleDateString()}</span>
                <span className={`text-xs px-2 py-1 rounded capitalize ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{b.status}</span>
             </div>
             <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
               {new Date(b.startsAtIso).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
             </div>
             {b.status === 'confirmed' && (
               <button 
                 onClick={() => navigate(`/sessions/${b.id}`)}
                 className="flex items-center space-x-2 text-indigo-600 font-medium text-sm"
               >
                 <Video size={16} />
                 <span>Join Session</span>
               </button>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

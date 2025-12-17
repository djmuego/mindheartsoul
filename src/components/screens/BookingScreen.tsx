import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft } from 'lucide-react';
import { getMentorById } from '../../services/mockData';
import { getMockTimeSlots } from '../../services/bookingsService';
import { useLanguage } from '../../context/LanguageContext';

export const BookingScreen: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const [searchParams] = useSearchParams();
  const sessionTypeId = searchParams.get('type');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const mentor = getMentorById(mentorId || '');
  const sessionType = mentor?.sessionTypes.find(st => st.id === sessionTypeId);

  // Generate next 7 days
  const dates = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const timeSlots = useMemo(() => {
    if (!mentorId) return [];
    return getMockTimeSlots(mentorId, selectedDate.toISOString());
  }, [mentorId, selectedDate]);

  if (!mentor || !sessionType) {
    return <div className="p-8 text-center">Invalid Booking Request</div>;
  }

  const handleContinue = () => {
    if (!selectedTime) return;
    
    // Construct ISO date string for selected slot
    const [hours, mins] = selectedTime.split(':');
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(parseInt(hours), parseInt(mins), 0, 0);

    navigate(`/book/confirm/${mentor.id}`, {
      state: {
        sessionTypeId: sessionType.id,
        startsAtIso: startDateTime.toISOString(),
        note
      }
    });
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
           <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{t('booking.selectTime')}</h1>
           <p className="text-xs text-slate-500 dark:text-slate-400">{mentor.name} • {sessionType.label}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 p-6 space-y-6">
        {/* Date Selector */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Date</h3>
          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
            {dates.map((date) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                  className={`flex-none w-16 h-20 rounded-2xl flex flex-col items-center justify-center space-y-1 border transition-all
                    ${isSelected 
                       ? `bg-${Brand.colors.primary} border-${Brand.colors.primary} text-white shadow-lg shadow-indigo-200 dark:shadow-none` 
                       : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                >
                  <span className="text-xs font-medium uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className="text-xl font-bold">{date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Available Slots</h3>
          <div className="grid grid-cols-3 gap-3">
             {timeSlots.map(time => {
               const isSelected = selectedTime === time;
               return (
                 <button
                   key={time}
                   onClick={() => setSelectedTime(time)}
                   className={`py-3 rounded-xl border text-sm font-medium transition-all
                     ${isSelected 
                       ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300' 
                       : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300'
                     }`}
                 >
                   {time}
                 </button>
               );
             })}
          </div>
          {timeSlots.length === 0 && <p className="text-slate-400 text-sm">No slots available for this date.</p>}
        </div>
        
        {/* Note */}
        <div>
           <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Note (Optional)</h3>
           <textarea
             value={note}
             onChange={(e) => setNote(e.target.value)}
             placeholder="Anything specific you want to discuss?"
             className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors h-24 resize-none"
           />
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20 safe-area-pb">
        <button
          onClick={handleContinue}
          disabled={!selectedTime}
          className={`w-full py-3 flex items-center justify-center space-x-2 bg-${Brand.colors.primary} hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all`}
        >
          <span>{t('common.continue')}</span>
        </button>
      </div>
    </div>
  );
};
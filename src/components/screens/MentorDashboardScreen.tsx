
import React from 'react';
// import { Brand } from '../../constants';
import { useT } from '../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Users, ChevronLeft } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { getBookings } from '../../services/bookingsService';

export const MentorDashboardScreen: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  const { user } = useSession();

  const myBookings = user ? getBookings().filter(b => b.mentorId === user.id) : [];
  const confirmedBookings = myBookings.filter(b => b.status === 'confirmed');

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate('/profile')} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('mentor.dashboard')}</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-slate-500 mb-2">
              <Users size={18} />
              <span className="text-xs font-semibold uppercase">{t('mentor.totalSessions')}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{confirmedBookings.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-slate-500 mb-2">
              <DollarSign size={18} />
              <span className="text-xs font-semibold uppercase">{t('mentor.income')}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">${confirmedBookings.length * 80}</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/mentor/bookings')}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                <Calendar size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 dark:text-white">{t('mentor.bookings')}</h3>
                <p className="text-sm text-slate-500">View upcoming sessions</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/mentor/availability')}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                <Clock size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 dark:text-white">{t('mentor.availability')}</h3>
                <p className="text-sm text-slate-500">Manage your schedule</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/courses/manage')}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 dark:text-white">Manage Courses</h3>
                <p className="text-sm text-slate-500">Create & edit courses</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

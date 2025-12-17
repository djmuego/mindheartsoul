
import { useState } from 'react';
import { useT } from '../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X } from 'lucide-react';
import { getUsers, updateUserRole } from '../../services/usersService';
import { getMentorProfiles, approveMentor } from '../../services/mentorsService';
// import { User, MentorProfile } from '../../types';
import { useSession } from '../../context/SessionContext';

export const AdminDashboardScreen: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState<'users' | 'mentors'>('mentors');
  const [, setRefresh] = useState(0);

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  const users = getUsers();
  const mentors = getMentorProfiles();
  const pendingMentors = users.filter(u => u.role === 'mentor_pending');

  const handleApprove = (userId: string) => {
    approveMentor(userId);
    setRefresh(r => r + 1);
  };

  const handleReject = (userId: string) => {
    updateUserRole(userId, 'user');
    setRefresh(r => r + 1);
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button onClick={() => navigate('/profile')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('admin.dashboard')}</h1>
      </div>

      <div className="p-4">
        <div className="flex space-x-2 mb-4">
          <button 
             onClick={() => setActiveTab('mentors')}
             className={`px-4 py-2 rounded-full text-sm font-bold ${activeTab === 'mentors' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}
          >
             Pending Mentors ({pendingMentors.length})
          </button>
          <button 
             onClick={() => setActiveTab('users')}
             className={`px-4 py-2 rounded-full text-sm font-bold ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}
          >
             All Users ({users.length})
          </button>
        </div>

        <div className="space-y-3">
          {activeTab === 'mentors' && pendingMentors.map(u => {
            const profile = mentors.find(m => m.userId === u.id);
            return (
              <div key={u.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                     <h3 className="font-bold text-slate-900 dark:text-white">{u.name}</h3>
                     <p className="text-sm text-slate-500">{u.email}</p>
                     <p className="text-xs text-indigo-500 mt-1">{profile?.title || 'No Title'}</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <button onClick={() => handleApprove(u.id)} className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg font-medium flex justify-center items-center space-x-1">
                    <Check size={16} /> <span>Approve</span>
                  </button>
                  <button onClick={() => handleReject(u.id)} className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-medium flex justify-center items-center space-x-1">
                    <X size={16} /> <span>Reject</span>
                  </button>
                </div>
              </div>
            );
          })}

          {activeTab === 'users' && users.map(u => (
            <div key={u.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                 <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                 <p className="text-xs text-slate-400">{u.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

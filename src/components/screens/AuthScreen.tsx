import React, { useState } from 'react';
import { Brand } from '../../constants';
import { useSession } from '../../context/SessionContext';
import { UserRole } from '../../types';

export const AuthScreen: React.FC = () => {
  const { loginMock } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('seeker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup
    const finalName = name || (email.split('@')[0]);
    loginMock(finalName, email, role);
  };

  const handleGuest = () => {
    loginMock('Guest User', 'guest@local', 'seeker');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-${Brand.colors.background} dark:bg-slate-950 transition-colors duration-200`}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className={`text-3xl font-bold text-${Brand.colors.primary} dark:text-white mb-2`}>{Brand.name}</h1>
          <p className="text-slate-500 dark:text-slate-400">Connect your mind, heart, and soul.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  placeholder="Your Name"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Dev Role Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role (Dev)</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
              >
                <option value="seeker">Seeker</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className={`w-full py-3 mt-2 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200 dark:shadow-none`}
            >
              Continue
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center space-y-4">
            <button
              type="button"
              onClick={handleGuest}
              className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
            >
              Continue as Guest
            </button>
            
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className={`text-sm text-${Brand.colors.primary} hover:text-indigo-700 font-semibold`}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
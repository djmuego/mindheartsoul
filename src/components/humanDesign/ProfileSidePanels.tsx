import React from 'react';
import { HumanDesignProfile } from '../../features/humanDesign/engine/types';

interface ProfileSidePanelsProps {
  profile: HumanDesignProfile;
  userName?: string;
}

export const ProfileSidePanels: React.FC<ProfileSidePanelsProps> = ({ profile, userName }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      {/* Left Panel - Personality (Личность) */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-bold text-purple-400">ЛИЧНОСТЬ</h3>
            </div>
            {userName && (
              <p className="text-sm text-slate-400">
                {userName}
              </p>
            )}
          </div>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Ваш Тип</div>
            <div className="text-2xl font-bold text-white">{profile.type}</div>
            <div className="text-sm text-slate-400 mt-1">Ман. Генератор</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Профиль</div>
            <div className="text-xl font-bold text-white">{profile.profile}</div>
            <div className="text-sm text-slate-400 mt-1">
              <span className="text-purple-400">Ролевая Модель — Отшельник</span>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Внутренний Авторитет</div>
            <div className="text-lg font-bold text-white">{profile.authority}</div>
            <div className="text-sm text-slate-400 mt-1">Эмоциональный</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Внешняя Стратегия</div>
            <div className="text-lg font-bold text-white">{profile.strategy}</div>
            <div className="text-sm text-slate-400 mt-1">Откликаться на жизнь</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-red-900/30">
            <div className="text-xs text-red-500 uppercase tracking-wider mb-2">Тема Не-Я</div>
            <div className="text-lg font-bold text-red-400">{profile.theme}</div>
            <div className="text-sm text-slate-400 mt-1">Фрустрация/Гнев</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Design (Дизайн) */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-bold text-red-400">ДИЗАЙН</h3>
            </div>
            <p className="text-sm text-slate-400">Бессознательное</p>
          </div>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Определенность</div>
            <div className="text-lg font-bold text-white">Целостная</div>
            <div className="text-sm text-slate-400 mt-1">Single Definition</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Ложное Я</div>
            <div className="space-y-2 mt-2">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                <div className="text-sm text-slate-300">Удовлетворение/Покой</div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-1.5"></div>
                <div className="text-sm text-slate-400">Фрустрация/Гнев</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Подпись</div>
            <div className="text-lg font-bold text-green-400">Удовлетворение</div>
            <div className="text-sm text-slate-400 mt-1">Когда следуете стратегии</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Предназначение</div>
            <div className="text-sm text-slate-300 leading-relaxed">
              Откликаться на жизнь. Гнев показывает, что вы не ждете отклика.
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/30 to-red-900/30 rounded-xl p-4 border border-purple-700/30">
            <div className="text-xs text-purple-400 uppercase tracking-wider mb-2">Инкарнационный Крест</div>
            <div className="text-sm font-semibold text-white">
              Левоугольный Крест <span className="text-slate-400">Предназначения</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

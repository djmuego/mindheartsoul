import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Clock, Play } from 'lucide-react';
import { Brand } from '../../constants';
import { useT } from '../../i18n/useT';

// Mock meditation data
const MOCK_MEDITATIONS = [
  {
    id: 'med1',
    title: 'Morning Mindfulness',
    description: 'Start your day with clarity and peace',
    duration: 10,
    imageUrl: 'https://picsum.photos/seed/med1/400/300',
    category: 'Mindfulness'
  },
  {
    id: 'med2',
    title: 'Deep Relaxation',
    description: 'Release tension and stress from your body',
    duration: 15,
    imageUrl: 'https://picsum.photos/seed/med2/400/300',
    category: 'Relaxation'
  },
  {
    id: 'med3',
    title: 'Loving Kindness',
    description: 'Cultivate compassion for yourself and others',
    duration: 12,
    imageUrl: 'https://picsum.photos/seed/med3/400/300',
    category: 'Heart'
  },
  {
    id: 'med4',
    title: 'Sleep Meditation',
    description: 'Drift into peaceful, restorative sleep',
    duration: 20,
    imageUrl: 'https://picsum.photos/seed/med4/400/300',
    category: 'Sleep'
  }
];

export const MeditationScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Mindfulness', 'Relaxation', 'Heart', 'Sleep'];

  const filteredMeditations = activeFilter === 'All' 
    ? MOCK_MEDITATIONS 
    : MOCK_MEDITATIONS.filter(m => m.category === activeFilter);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center space-x-4 mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('meditation.title')}</h1>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${activeFilter === filter 
                  ? `bg-${Brand.colors.primary} text-white` 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeditations.map(meditation => (
            <div 
              key={meditation.id}
              onClick={() => navigate(`/meditation/${meditation.id}`)}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="relative h-40 bg-gradient-to-br from-green-400 to-blue-500 overflow-hidden">
                <img 
                  src={meditation.imageUrl} 
                  alt={meditation.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full flex items-center space-x-1">
                  <Clock size={14} className="text-slate-600 dark:text-slate-300" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{meditation.duration} min</span>
                </div>
              </div>
              
              <div className="p-4">
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                  {meditation.category}
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1 mb-1">
                  {meditation.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  {meditation.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredMeditations.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <Heart size={48} className="mx-auto mb-4 opacity-50" />
            <p>No meditations in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

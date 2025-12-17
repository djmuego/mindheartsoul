import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Clock, Heart, CheckCircle } from 'lucide-react';
import { Brand } from '../../constants';
import { useT } from '../../i18n/useT';

// Mock data (same as in MeditationScreen)
const MOCK_MEDITATIONS = [
  {
    id: 'med1',
    title: 'Morning Mindfulness',
    description: 'Start your day with clarity and peace. This gentle guided meditation helps you center yourself, set positive intentions, and prepare mentally for the day ahead.',
    duration: 10,
    imageUrl: 'https://picsum.photos/seed/med1/400/300',
    category: 'Mindfulness',
    benefits: [
      'Reduces morning anxiety',
      'Improves focus and concentration',
      'Sets a positive tone for the day',
      'Increases self-awareness'
    ]
  },
  {
    id: 'med2',
    title: 'Deep Relaxation',
    description: 'Release tension and stress from your body. Progressive relaxation technique that guides you through each muscle group, promoting deep physical and mental relaxation.',
    duration: 15,
    imageUrl: 'https://picsum.photos/seed/med2/400/300',
    category: 'Relaxation',
    benefits: [
      'Relieves muscle tension',
      'Lowers stress hormones',
      'Improves sleep quality',
      'Enhances overall wellbeing'
    ]
  },
  {
    id: 'med3',
    title: 'Loving Kindness',
    description: 'Cultivate compassion for yourself and others. Traditional metta meditation that opens your heart and strengthens your capacity for empathy and connection.',
    duration: 12,
    imageUrl: 'https://picsum.photos/seed/med3/400/300',
    category: 'Heart',
    benefits: [
      'Increases positive emotions',
      'Strengthens relationships',
      'Boosts self-compassion',
      'Reduces negative thinking'
    ]
  },
  {
    id: 'med4',
    title: 'Sleep Meditation',
    description: 'Drift into peaceful, restorative sleep. Calming body scan and visualization technique that quiets the mind and prepares your body for deep, healing rest.',
    duration: 20,
    imageUrl: 'https://picsum.photos/seed/med4/400/300',
    category: 'Sleep',
    benefits: [
      'Helps you fall asleep faster',
      'Improves sleep quality',
      'Reduces nighttime anxiety',
      'Promotes restful recovery'
    ]
  }
];

export const MeditationDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useT();

  const meditation = MOCK_MEDITATIONS.find(m => m.id === id);

  if (!meditation) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        <p>Meditation not found</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleStart = () => {
    // In a real app, this would navigate to a player screen or start playback
    alert(`Starting meditation: "${meditation.title}"\n\nIn a full app, this would open the meditation player.`);
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
        <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">{meditation.title}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Image */}
        <div className="relative h-64 bg-gradient-to-br from-green-400 to-blue-500 overflow-hidden">
          <img 
            src={meditation.imageUrl} 
            alt={meditation.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {meditation.category}
            </span>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              {meditation.title}
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Duration & Play Button */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <Clock size={20} />
              <span className="font-semibold">{meditation.duration} minutes</span>
            </div>
            <button 
              onClick={handleStart}
              className={`flex items-center space-x-2 px-6 py-3 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-full font-semibold transition-colors shadow-lg`}
            >
              <Play size={20} fill="currentColor" />
              <span>Start</span>
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {meditation.description}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Benefits</h3>
            <div className="space-y-2">
              {meditation.benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon Note */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="text-blue-600 dark:text-blue-400" size={24} />
              <h3 className="font-bold text-slate-900 dark:text-white">Full Library Coming Soon</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t('meditation.comingSoon')} We're creating a comprehensive meditation library with audio guides, timers, and progress tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

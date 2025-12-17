import React from 'react';
import { Brain, MessageCircle, Heart, Compass, Zap, Anchor, Shield, Sun } from 'lucide-react';
import { HDCenters } from '../../features/humanDesign/engine/types';

interface CenterDescriptionsProps {
  centers: HDCenters;
}

type CenterInfo = {
  name: string;
  icon: React.ElementType;
  color: string;
  defined: {
    title: string;
    description: string;
    traits: string[];
  };
  undefined: {
    title: string;
    description: string;
    traits: string[];
  };
};

const centerInfo: Record<string, CenterInfo> = {
  head: {
    name: 'Head Center',
    icon: Brain,
    color: 'purple',
    defined: {
      title: 'Defined Head',
      description: 'You have consistent mental pressure and inspiration. Your mind naturally generates questions and ideas.',
      traits: ['Fixed way of thinking', 'Consistent inspiration', 'Mental pressure from within']
    },
    undefined: {
      title: 'Undefined Head',
      description: 'You are open to different ways of thinking and can be influenced by others\' mental pressure.',
      traits: ['Flexible thinking', 'Amplifies others\' ideas', 'Can be overwhelmed by questions']
    }
  },
  ajna: {
    name: 'Ajna Center',
    icon: Brain,
    color: 'green',
    defined: {
      title: 'Defined Ajna',
      description: 'You have a fixed way of processing and conceptualizing information. Your mental clarity is consistent.',
      traits: ['Fixed mental processing', 'Consistent perspective', 'Reliable mental patterns']
    },
    undefined: {
      title: 'Undefined Ajna',
      description: 'You have flexibility in how you process and understand information. You can see multiple perspectives.',
      traits: ['Mental flexibility', 'Multiple viewpoints', 'Adaptable understanding']
    }
  },
  throat: {
    name: 'Throat Center',
    icon: MessageCircle,
    color: 'blue',
    defined: {
      title: 'Defined Throat',
      description: 'You have consistent access to manifestation and communication. You can speak and act reliably.',
      traits: ['Reliable communication', 'Consistent action', 'Natural manifestor']
    },
    undefined: {
      title: 'Undefined Throat',
      description: 'Your communication and action are influenced by others. You may feel pressure to speak or act.',
      traits: ['Variable expression', 'Learns from others', 'Adapts communication style']
    }
  },
  g: {
    name: 'G Center (Identity)',
    icon: Compass,
    color: 'yellow',
    defined: {
      title: 'Defined G Center',
      description: 'You have a fixed sense of identity and direction. You know who you are and where you\'re going.',
      traits: ['Fixed identity', 'Consistent direction', 'Self-assured']
    },
    undefined: {
      title: 'Undefined G Center',
      description: 'Your identity and direction are flexible and influenced by your environment and others.',
      traits: ['Flexible identity', 'Explores different paths', 'Adapts to environment']
    }
  },
  heart: {
    name: 'Heart/Ego Center',
    icon: Heart,
    color: 'red',
    defined: {
      title: 'Defined Heart',
      description: 'You have consistent willpower and ego strength. You can make and keep commitments reliably.',
      traits: ['Strong willpower', 'Consistent ego', 'Natural leadership']
    },
    undefined: {
      title: 'Undefined Heart',
      description: 'Your willpower fluctuates. You may try to prove your worth or make promises you can\'t keep.',
      traits: ['Variable willpower', 'Learns about self-worth', 'No consistent ego']
    }
  },
  sacral: {
    name: 'Sacral Center',
    icon: Zap,
    color: 'orange',
    defined: {
      title: 'Defined Sacral',
      description: 'You have consistent life-force energy and capacity to work. You are a Generator type.',
      traits: ['Sustainable energy', 'Built to work', 'Responds to life']
    },
    undefined: {
      title: 'Undefined Sacral',
      description: 'Your energy comes in waves. You need rest and are not designed for consistent work.',
      traits: ['Inconsistent energy', 'Needs regular rest', 'Not built for 9-5']
    }
  },
  root: {
    name: 'Root Center',
    icon: Anchor,
    color: 'red',
    defined: {
      title: 'Defined Root',
      description: 'You have consistent pressure to get things done. You have your own fixed rhythm and drive.',
      traits: ['Internal pressure', 'Consistent drive', 'Fixed rhythm']
    },
    undefined: {
      title: 'Undefined Root',
      description: 'You experience pressure from others to rush or complete tasks. You can feel hurried.',
      traits: ['Absorbs pressure', 'Variable pace', 'Can feel rushed']
    }
  },
  spleen: {
    name: 'Spleen Center',
    icon: Shield,
    color: 'violet',
    defined: {
      title: 'Defined Spleen',
      description: 'You have consistent intuition and immune system. Your instincts are reliable in the moment.',
      traits: ['Reliable intuition', 'Strong instincts', 'Spontaneous awareness']
    },
    undefined: {
      title: 'Undefined Spleen',
      description: 'Your intuition and fears amplify. You can hold onto fear or be overly concerned with health/safety.',
      traits: ['Amplifies fear', 'Variable intuition', 'Learns about wellbeing']
    }
  },
  solar: {
    name: 'Solar Plexus',
    icon: Sun,
    color: 'yellow',
    defined: {
      title: 'Defined Solar Plexus',
      description: 'You experience emotional waves. Your emotions move through consistent cycles.',
      traits: ['Emotional authority', 'Emotional waves', 'Needs time for clarity']
    },
    undefined: {
      title: 'Undefined Solar Plexus',
      description: 'You absorb and amplify others\' emotions. You avoid confrontation and seek harmony.',
      traits: ['Absorbs emotions', 'Seeks peace', 'Empathic to others']
    }
  }
};

export const CenterDescriptions: React.FC<CenterDescriptionsProps> = ({ centers }) => {
  const getColorClasses = (color: string, defined: boolean) => {
    if (!defined) return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    
    const colors: Record<string, string> = {
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    };
    
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        Your Centers Explained
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(centers).map(([centerKey, isDefined]) => {
          const info = centerInfo[centerKey];
          if (!info) return null;

          const Icon = info.icon;
          const status = isDefined ? info.defined : info.undefined;
          const colorClasses = getColorClasses(info.color, isDefined);

          return (
            <div
              key={centerKey}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${colorClasses}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {info.name}
                    </h4>
                    <span className={`text-xs font-medium ${isDefined ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {isDefined ? 'Defined' : 'Undefined'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status description */}
              <div className="mb-3">
                <h5 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                  {status.title}
                </h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {status.description}
                </p>
              </div>

              {/* Traits */}
              <div className="space-y-1.5">
                {status.traits.map((trait, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${isDefined ? 'bg-indigo-500' : 'bg-slate-400'}`}></div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {trait}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mt-6">
        <h4 className="font-bold text-lg mb-2">Your Unique Design</h4>
        <p className="text-white/90 text-sm leading-relaxed">
          Your bodygraph shows{' '}
          <span className="font-bold">
            {Object.values(centers).filter(Boolean).length} defined
          </span>{' '}
          and{' '}
          <span className="font-bold">
            {Object.values(centers).filter(v => !v).length} undefined
          </span>{' '}
          centers. Defined centers give you consistent, reliable energy in those areas. 
          Undefined centers are where you are open, flexible, and can be influenced by others.
        </p>
      </div>
    </div>
  );
};

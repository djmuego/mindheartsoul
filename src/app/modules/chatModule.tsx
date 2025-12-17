
import { MessageCircle } from 'lucide-react';
import { AppModule } from './types';
import { ChatListScreen } from '../../components/screens/ChatListScreen';
import { ChatThreadScreen } from '../../components/screens/ChatThreadScreen';

export const chatModule: AppModule = {
  id: 'chat',
  // featureFlag: 'aiGuideEnabled', // REMOVED - Chat is core feature for Chat Consultations
  nav: {
    placement: 'bottom',
    order: 30,
    icon: MessageCircle,
    path: '/chat',
    labelKey: 'nav.messages'
  },
  routes: [
    { path: 'chat', element: <ChatListScreen /> },
    { path: 'chat/:id', element: <ChatThreadScreen /> }
  ]
};

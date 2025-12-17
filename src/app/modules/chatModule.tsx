
import { MessageCircle } from 'lucide-react';
import { AppModule } from './types';
import { ChatListScreen } from '../../components/screens/ChatListScreen';
import { ChatThreadScreen } from '../../components/screens/ChatThreadScreen';

export const chatModule: AppModule = {
  id: 'chat',
  featureFlag: 'aiGuideEnabled', // Chat primarily drives AI in this MVP
  headerActions: [
    {
      id: 'chat-action',
      icon: MessageCircle,
      path: '/chat',
      order: 20
    }
  ],
  routes: [
    { path: 'chat', element: <ChatListScreen /> },
    { path: 'chat/:id', element: <ChatThreadScreen /> }
  ]
};

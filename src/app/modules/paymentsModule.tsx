
import { AppModule } from './types';
import { PaymentScreen } from '../../components/screens/payment/PaymentScreen';

export const paymentsModule: AppModule = {
  id: 'payments',
  routes: [
    {
      path: '/payment',
      element: <PaymentScreen />,
      layout: 'fullscreen',
    },
  ],
};

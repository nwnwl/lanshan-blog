import { TransitionProvider } from './lib/TransitionContext';
import { RouteTransition } from './components/RouterTransition';

export default function PagetestLayout({ children }: { children: React.ReactNode }) {
  return (
    <TransitionProvider>
      {children}
      <RouteTransition />
    </TransitionProvider>
  );
}

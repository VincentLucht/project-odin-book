import LazyPostOverviews from '@/components/Lazy/LazyPostOverviews';

interface HomepageLazyProps {
  showSidebar: boolean;
  amount?: number;
}
export default function HomepageLazy({ showSidebar, amount = 6 }: HomepageLazyProps) {
  return <LazyPostOverviews amount={amount} showSidebar={showSidebar} />;
}

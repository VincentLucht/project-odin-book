import LazyPostOverviews from '@/components/Lazy/LazyPostOverviews';

interface HomepageLazyProps {
  showSidebar: boolean;
}
export default function HomepageLazy({ showSidebar }: HomepageLazyProps) {
  return <LazyPostOverviews amount={6} showSidebar={showSidebar} />;
}

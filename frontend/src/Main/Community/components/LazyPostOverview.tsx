import { useInView } from 'react-intersection-observer';
import PostOverview from '@/Main/Post/components/PostOverview/PostOverview';

export default function LazyPostOverview(props: any) {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {inView ? <PostOverview {...props} /> : <div style={{ minHeight: '200px' }} />}
    </div>
  );
}

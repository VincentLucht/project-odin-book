import LazyCompartment from '@/components/Lazy/LazyCompartment';
import { useMemo } from 'react';

interface LazyPostFlairProps {
  className?: string;
}

export default function LazyPostFlair({ className }: LazyPostFlairProps) {
  const nameLength = useMemo(() => (Math.floor(Math.random() * 16) + 5) * 6, []);

  return <LazyCompartment width={nameLength} height={16} className={className} />;
}

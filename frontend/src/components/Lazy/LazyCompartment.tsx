interface LazyCompartmentProps {
  height?: number;
  width?: number;
  className?: string;
}

export default function LazyCompartment({
  height = 16,
  width,
  className,
}: LazyCompartmentProps) {
  return <div className={`${className} skeleton-rd`} style={{ height, width }}></div>;
}

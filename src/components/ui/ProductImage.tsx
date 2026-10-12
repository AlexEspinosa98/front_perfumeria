/* eslint-disable @next/next/no-img-element */
export default function ProductImage({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center text-primary/30 ${className}`}>
        <span className="material-symbols-outlined text-6xl">water_drop</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}

export default function AnimatedBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-blob-a absolute -left-32 top-1/4 h-[480px] w-[480px] rounded-full bg-iris/30 blur-3xl motion-reduce:animate-none" />
      <div className="animate-blob-b absolute -right-24 bottom-0 h-[520px] w-[520px] rounded-full bg-aurora/20 blur-3xl motion-reduce:animate-none" />
      <div className="animate-blob-c absolute left-1/2 top-12 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-amber-warm/10 blur-3xl motion-reduce:animate-none" />
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
    </div>
  );
}

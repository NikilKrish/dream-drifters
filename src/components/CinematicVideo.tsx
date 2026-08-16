import { useEffect, useRef, useState } from 'react';
import { shouldLoadAmbientVideo } from '../lib/motion';

interface CinematicVideoProps {
  poster: string;
  posterAvif: string;
  mobilePoster?: string;
  mobilePosterAvif?: string;
  mp4: string;
  webm: string;
  mobileMp4?: string;
  mobileWebm?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

export function CinematicVideo({ poster, posterAvif, mobilePoster, mobilePosterAvif, mp4, webm, mobileMp4, mobileWebm, alt, className = '', eager = false }: CinematicVideoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [visible, setVisible] = useState(eager);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number }).connection;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const hasMobileSource = Boolean(mobileMp4 || mobileWebm);
    const allowed = shouldLoadAmbientVideo({
      hasSource: Boolean(mp4 || webm),
      isDeviceCapable: !(typeof deviceMemory === 'number' && deviceMemory < 4) && (window.matchMedia('(min-width: 1100px)').matches || hasMobileSource),
      saveData: Boolean(connection?.saveData) || connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g',
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
    if (!allowed || !rootRef.current) return;
    if (eager) {
      const timer = window.setTimeout(() => setShouldMount(true), 360);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setShouldMount(true);
    }, { rootMargin: '240px 0px', threshold: 0.05 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [eager, mp4, webm, mobileMp4, mobileWebm]);

  useEffect(() => {
    if (!videoRef.current || !ready || failed) return;
    if (visible) void videoRef.current.play().catch(() => setFailed(true));
    else videoRef.current.pause();
  }, [failed, ready, visible]);

  const state = failed ? 'failed' : ready ? 'playing' : 'poster';
  return (
    <div ref={rootRef} className={`cinematic-media ${ready && !failed ? 'is-video-ready' : ''} ${className}`.trim()} data-video-state={state}>
      <picture>
        {mobilePosterAvif && <source media="(max-width: 699px)" type="image/avif" srcSet={mobilePosterAvif} />}
        {mobilePoster && <source media="(max-width: 699px)" type="image/webp" srcSet={mobilePoster} />}
        <source type="image/avif" srcSet={posterAvif} />
        <img src={poster} alt={alt} width="1920" height="1080" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'low'} decoding="async" />
      </picture>
      {shouldMount && !failed && (
        <video ref={videoRef} muted loop playsInline preload="metadata" onCanPlay={() => setReady(true)} onError={() => setFailed(true)} aria-hidden="true">
          {mobileWebm && <source media="(max-width: 699px)" src={mobileWebm} type="video/webm" />}
          {mobileMp4 && <source media="(max-width: 699px)" src={mobileMp4} type="video/mp4" />}
          <source src={webm} type="video/webm" /><source src={mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

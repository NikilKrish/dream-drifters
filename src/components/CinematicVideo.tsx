import { useEffect, useRef, useState } from 'react';
import { Play } from '@phosphor-icons/react';
import { shouldLoadAmbientVideo } from '../lib/motion';

type PlaybackState = 'poster' | 'loading' | 'playing' | 'paused' | 'blocked' | 'failed';

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
  const [playbackState, setPlaybackState] = useState<PlaybackState>('poster');

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
    if (!rootRef.current) return;
    if (!allowed) {
      setPlaybackState('paused');
      return;
    }
    if (eager) {
      const timer = window.setTimeout(() => {
        setShouldMount(true);
        setPlaybackState('loading');
      }, 360);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) {
        setShouldMount(true);
        setPlaybackState((current) => current === 'poster' ? 'loading' : current);
      }
    }, { rootMargin: '240px 0px', threshold: 0.05 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [eager, mp4, webm, mobileMp4, mobileWebm]);

  useEffect(() => {
    if (!videoRef.current || !ready || playbackState === 'failed' || playbackState === 'blocked' || playbackState === 'playing') return;
    if (visible) {
      void videoRef.current.play()
        .then(() => setPlaybackState('playing'))
        .catch(() => setPlaybackState('blocked'));
    } else {
      videoRef.current.pause();
      setPlaybackState('paused');
    }
  }, [playbackState, ready, visible]);

  const playManually = () => {
    setVisible(true);
    if (!videoRef.current) {
      setShouldMount(true);
      setPlaybackState('loading');
      return;
    }
    void videoRef.current.play()
      .then(() => setPlaybackState('playing'))
      .catch(() => setPlaybackState('blocked'));
  };

  return (
    <div ref={rootRef} className={`cinematic-media ${playbackState === 'playing' ? 'is-video-ready' : ''} ${className}`.trim()} data-video-state={playbackState}>
      <picture>
        {mobilePosterAvif && <source media="(max-width: 699px)" type="image/avif" srcSet={mobilePosterAvif} />}
        {mobilePoster && <source media="(max-width: 699px)" type="image/webp" srcSet={mobilePoster} />}
        <source type="image/avif" srcSet={posterAvif} />
        <img src={poster} alt={alt} width="1920" height="1080" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'low'} decoding="async" />
      </picture>
      {shouldMount && playbackState !== 'failed' && (
        <video ref={videoRef} muted loop playsInline preload="metadata" onCanPlay={() => setReady(true)} onError={(event) => {
          if (event.target === event.currentTarget) setPlaybackState('failed');
        }} aria-hidden="true">
          {mobileMp4 && <source media="(max-width: 699px)" src={mobileMp4} type="video/mp4" />}
          {mobileWebm && <source media="(max-width: 699px)" src={mobileWebm} type="video/webm" />}
          <source src={mp4} type="video/mp4" /><source src={webm} type="video/webm" />
        </video>
      )}
      {(playbackState === 'blocked' || playbackState === 'paused') && (
        <button className="cinematic-media__play" type="button" onClick={playManually} aria-label="Play background video">
          <Play weight="fill" aria-hidden="true" />
          <span>Play video</span>
        </button>
      )}
    </div>
  );
}

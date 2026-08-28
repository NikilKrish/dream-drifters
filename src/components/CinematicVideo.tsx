import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from '@phosphor-icons/react';
import { selectResponsiveVideoOutput, shouldLoadAmbientVideo } from '../lib/motion';
import type { ResponsiveVideoOutput } from '../types';

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
  responsiveVideoOutputs?: ResponsiveVideoOutput[];
  posterSrcSet?: string;
  posterAvifSrcSet?: string;
  posterSizes?: string;
  alt: string;
  className?: string;
  eager?: boolean;
  showPlayControl?: boolean;
  ownershipThreshold?: number;
}

export function CinematicVideo({ poster, posterAvif, mobilePoster, mobilePosterAvif, mp4, webm, mobileMp4, mobileWebm, responsiveVideoOutputs, posterSrcSet, posterAvifSrcSet, posterSizes = '100vw', alt, className = '', eager = false, showPlayControl = true, ownershipThreshold = .35 }: CinematicVideoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playRequestRef = useRef(0);
  const [shouldMount, setShouldMount] = useState(false);
  const [visible, setVisible] = useState(eager);
  const [ready, setReady] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('poster');
  const [manuallyPaused, setManuallyPaused] = useState(false);

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number }).connection;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectedOutput = responsiveVideoOutputs ? selectResponsiveVideoOutput(responsiveVideoOutputs, {
    viewportWidth: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio,
    deviceMemory,
    effectiveType: connection?.effectiveType,
    saveData: Boolean(connection?.saveData),
    reducedMotion,
  }) : undefined;
  const selectedMp4 = selectedOutput?.formats.find(({ kind }) => kind === 'mp4')?.path;
  const selectedWebm = selectedOutput?.formats.find(({ kind }) => kind === 'webm')?.path;
  const canOfferPlayback = !responsiveVideoOutputs || Boolean(selectedOutput);

  useEffect(() => {
    const hasMobileSource = Boolean(mobileMp4 || mobileWebm);
    const allowed = responsiveVideoOutputs ? Boolean(selectedOutput) : shouldLoadAmbientVideo({
      hasSource: Boolean(mp4 || webm),
      isDeviceCapable: !(typeof deviceMemory === 'number' && deviceMemory < 4) && (window.matchMedia('(min-width: 1100px)').matches || hasMobileSource),
      saveData: Boolean(connection?.saveData) || connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g',
      reducedMotion,
    });
    if (!rootRef.current) return;
    if (!allowed) {
      setPlaybackState('paused');
      return;
    }
    const timer = eager ? window.setTimeout(() => {
        setShouldMount(true);
        setPlaybackState('loading');
      }, 360) : undefined;
    const observer = new IntersectionObserver(([entry]) => {
      const ownsChapter = entry.isIntersecting && (entry.intersectionRatio ?? 1) >= ownershipThreshold;
      setVisible(ownsChapter);
      if (entry.isIntersecting && !eager) {
        setShouldMount(true);
        setPlaybackState((current) => current === 'poster' ? 'loading' : current);
      }
    }, { rootMargin: '0px', threshold: [0, ownershipThreshold] });
    observer.observe(rootRef.current);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [connection?.effectiveType, connection?.saveData, deviceMemory, eager, mp4, webm, mobileMp4, mobileWebm, ownershipThreshold, reducedMotion, responsiveVideoOutputs, selectedOutput]);

  useEffect(() => {
    if (!videoRef.current || !canPlay || playbackState === 'failed' || playbackState === 'blocked') return;
    if (!visible) {
      playRequestRef.current += 1;
      videoRef.current.pause();
      setPlaybackState('paused');
      return;
    }
    if (manuallyPaused || playbackState === 'playing') return;
    const request = ++playRequestRef.current;
    void videoRef.current.play()
      .then(() => {
        if (request === playRequestRef.current) setPlaybackState('playing');
        else videoRef.current?.pause();
      })
      .catch(() => {
        if (request === playRequestRef.current) setPlaybackState('blocked');
      });
  }, [canPlay, manuallyPaused, playbackState, visible]);

  const playManually = () => {
    setManuallyPaused(false);
    setVisible(true);
    if (!videoRef.current) {
      setShouldMount(true);
      setPlaybackState('loading');
      return;
    }
    setPlaybackState('paused');
  };

  const pauseManually = () => {
    playRequestRef.current += 1;
    videoRef.current?.pause();
    setManuallyPaused(true);
    setPlaybackState('paused');
  };

  return (
    <div ref={rootRef} className={`cinematic-media ${ready && playbackState !== 'blocked' && playbackState !== 'failed' ? 'is-video-ready' : ''} ${className}`.trim()} data-video-state={playbackState}>
      <picture>
        {mobilePosterAvif && <source media="(max-width: 699px)" type="image/avif" srcSet={mobilePosterAvif} />}
        {mobilePoster && <source media="(max-width: 699px)" type="image/webp" srcSet={mobilePoster} />}
        <source type="image/avif" srcSet={posterAvifSrcSet ?? posterAvif} sizes={posterAvifSrcSet ? posterSizes : undefined} />
        <img src={poster} srcSet={posterSrcSet} sizes={posterSrcSet ? posterSizes : undefined} alt={alt} width="1920" height="1080" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'low'} decoding="async" />
      </picture>
      {shouldMount && playbackState !== 'failed' && (
        <video ref={videoRef} muted loop playsInline preload="metadata" onCanPlay={() => setCanPlay(true)} onLoadedData={() => setReady(true)} data-video-output={selectedOutput?.label} onError={(event) => {
          if (event.target === event.currentTarget) setPlaybackState('failed');
        }} aria-hidden="true">
          {responsiveVideoOutputs ? <>
            {selectedMp4 && <source src={selectedMp4} type="video/mp4" />}
            {selectedWebm && <source src={selectedWebm} type="video/webm" />}
          </> : <>
            {mobileMp4 && <source media="(max-width: 699px)" src={mobileMp4} type="video/mp4" />}
            {mobileWebm && <source media="(max-width: 699px)" src={mobileWebm} type="video/webm" />}
            <source src={mp4} type="video/mp4" /><source src={webm} type="video/webm" />
          </>}
        </video>
      )}
      {showPlayControl && visible && canOfferPlayback && (playbackState === 'blocked' || playbackState === 'paused') && (
        <button className="cinematic-media__play" type="button" onClick={playManually} aria-label="Play background video">
          <Play weight="fill" aria-hidden="true" />
          <span>Play video</span>
        </button>
      )}
      {showPlayControl && visible && playbackState === 'playing' && (
        <button className="cinematic-media__play" type="button" onClick={pauseManually} aria-label="Pause background video">
          <Pause weight="fill" aria-hidden="true" />
          <span>Pause video</span>
        </button>
      )}
    </div>
  );
}

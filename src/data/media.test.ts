import { describe, expect, it } from 'vitest';
import type { MediaAsset } from '../types';
import { packages } from './packages';
import { activeChapterMedia, getChapterMedia, getResponsiveImageSrcSet, isMediaAssetApproved, mediaAssets, packageMediaAssets } from './media';

describe('active chapter media', () => {
  it('assigns each active non-package chapter its own semantic asset without reusing package files', () => {
    const assetsById = new Map(mediaAssets.map((asset) => [asset.id, asset]));
    const activeAssets = activeChapterMedia.map((assignment) => assetsById.get(assignment.assetId));
    const packageFiles = new Set(packages.flatMap((item) => [item.image, item.imageAvif]));

    expect(activeChapterMedia.map((assignment) => assignment.chapter)).toEqual([
      'hero', 'about', 'direction', 'services', 'assurance', 'enquiry',
    ]);
    expect(new Set(activeChapterMedia.map((assignment) => assignment.assetId)).size).toBe(activeChapterMedia.length);
    expect(activeAssets.every(Boolean)).toBe(true);
    expect(activeAssets.map((asset) => asset?.chapter)).toEqual(activeChapterMedia.map((assignment) => assignment.chapter));
    expect(activeChapterMedia.map((assignment) => getChapterMedia(assignment.chapter).id)).toEqual(activeChapterMedia.map((assignment) => assignment.assetId));
    expect(activeAssets.flatMap((asset) => asset?.formats.map((format) => format.path) ?? []).filter((path) => packageFiles.has(path))).toEqual([]);
    expect(activeAssets.every((asset) => asset && asset.focalPoint.x >= 0 && asset.focalPoint.x <= 100 && asset.focalPoint.y >= 0 && asset.focalPoint.y <= 100)).toBe(true);
  });

  it('blocks preview media until licence, consent and replacement approval are all resolved', () => {
    expect(mediaAssets.filter(isMediaAssetApproved).map(({ id }) => id)).toEqual(['hero-tropical-aerial', 'about-people']);

    const approved: MediaAsset = {
      ...mediaAssets[0],
      licenceStatus: 'approved',
      consentStatus: 'not-applicable',
      replacementState: 'approved',
    };
    expect(isMediaAssetApproved(approved)).toBe(true);
    expect(isMediaAssetApproved({ ...approved, licenceStatus: 'review-required' })).toBe(false);
    expect(isMediaAssetApproved({ ...approved, consentStatus: 'required' })).toBe(false);
    expect(isMediaAssetApproved({ ...approved, replacementState: 'replace-before-production' })).toBe(false);
  });

  it('records an approved native 4K hero master and all adaptive video outputs', () => {
    const hero = getChapterMedia('hero');
    const metadata = hero.productionMetadata!;

    expect(hero.id).toBe('hero-tropical-aerial');
    expect(hero.licenceStatus).toBe('approved');
    expect(metadata).toMatchObject({
      photographer: 'Adrien JACTA',
      sourcePage: 'https://www.pexels.com/video/drone-footage-of-an-empty-tropical-beach-14920039/',
      licence: { name: 'Pexels License' },
      downloadDate: '2026-08-25',
      originalDimensions: { width: 3840, height: 2160 },
      durationSeconds: 12,
      frameRate: 25,
      productionApproval: { approvedForProduction: true },
    });
    expect(metadata.videoOutputs?.map(({ label, dimensions }) => ({ label, dimensions }))).toEqual([
      { label: 'mobile', dimensions: { width: 1080, height: 1920 } },
      { label: 'standard', dimensions: { width: 1920, height: 1080 } },
      { label: 'desktop', dimensions: { width: 2560, height: 1440 } },
      { label: 'ultra', dimensions: { width: 3840, height: 2160 } },
    ]);
    expect(metadata.videoOutputs?.every((output) => output.formats.map(({ kind }) => kind).join(',') === 'mp4,webm')).toBe(true);
  });

  it('uses the supplied Direction loop on desktop and poster-only art on mobile', () => {
    const direction = getChapterMedia('direction');
    expect(direction.id).toBe('direction-train');
    expect(direction.formats.map(({ kind }) => kind)).toEqual(['mp4', 'webm']);
    expect(direction.posters.map(({ kind }) => kind)).toEqual(['avif', 'webp']);
    expect(direction.mobileSources.map(({ kind }) => kind)).toEqual(['avif', 'webp']);
  });

  it('records the approved About source and responsive 4K production contract', () => {
    const about = getChapterMedia('about');
    const metadata = about.productionMetadata!;

    expect(metadata).toMatchObject({
      photographer: 'Kindel Media',
      sourcePage: 'https://www.pexels.com/photo/man-couple-love-people-7979588/',
      licence: {
        name: 'Pexels License',
        url: 'https://www.pexels.com/license/',
        termsUrl: 'https://www.pexels.com/terms-of-service/',
      },
      downloadDate: '2026-08-25',
      originalDimensions: { width: 5196, height: 3464 },
      crop: { width: 4616, height: 3462, aspectRatio: '4:3' },
      productionApproval: { approvedForProduction: true },
    });
    expect(metadata.consentReleaseRationale).toMatch(/endorse|affiliat/i);
    expect(metadata.outputs.map(({ dimensions }) => dimensions)).toEqual([
      { width: 4096, height: 3072 },
      { width: 1920, height: 1440 },
      { width: 960, height: 720 },
    ]);
    expect(getResponsiveImageSrcSet(about, 'avif')).toBe('/media/about-people-960.avif 960w, /media/about-people-1920.avif 1920w, /media/about-people.avif 4096w');
    expect(getResponsiveImageSrcSet(about, 'webp')).toBe('/media/about-people-960.webp 960w, /media/about-people-1920.webp 1920w, /media/about-people.webp 4096w');
  });

  it('registers every package master at 3840x2160 with licensed responsive outputs', () => {
    expect(packageMediaAssets.map(({ id }) => id)).toEqual(packages.map(({ id }) => id));
    expect(packageMediaAssets.map(({ productionMetadata: { photographer, originalDimensions } }) => ({ photographer, originalDimensions }))).toEqual([
      { photographer: 'Ken Cheung', originalDimensions: { width: 4770, height: 2680 } },
      { photographer: 'Brellbell PJ', originalDimensions: { width: 4896, height: 3264 } },
      { photographer: 'Ákos Szűcs', originalDimensions: { width: 4775, height: 2985 } },
      { photographer: 'Tom Fisk', originalDimensions: { width: 8640, height: 5760 } },
      { photographer: 'Denitsa Kireva', originalDimensions: { width: 6720, height: 4480 } },
      { photographer: 'Michael Kabus', originalDimensions: { width: 4912, height: 3264 } },
    ]);

    packageMediaAssets.forEach((asset) => {
      const travelPackage = packages.find(({ id }) => id === asset.id)!;
      const metadata = asset.productionMetadata;
      expect(metadata.licence).toEqual({
        name: 'Pexels License',
        url: 'https://www.pexels.com/license/',
        termsUrl: 'https://www.pexels.com/terms-of-service/',
      });
      expect(metadata.downloadDate).toBe('2026-08-25');
      expect(metadata.sourcePage).toMatch(/^https:\/\/www\.pexels\.com\/photo\//);
      expect(metadata.productionApproval.approvedForProduction).toBe(true);
      expect(metadata.consentReleaseRationale.length).toBeGreaterThan(30);
      expect(metadata.crop.aspectRatio).toBe('16:9');
      expect(metadata.outputs.map(({ dimensions }) => dimensions)).toEqual([
        { width: 3840, height: 2160 },
        { width: 1920, height: 1080 },
        { width: 960, height: 540 },
      ]);
      expect(metadata.outputs[0].formats.map(({ path }) => path)).toEqual([travelPackage.imageAvif, travelPackage.image]);
      expect(asset.altText).toBe(travelPackage.imageAlt);
      expect(asset.focalPoint.x).toBeGreaterThanOrEqual(0);
      expect(asset.focalPoint.x).toBeLessThanOrEqual(100);
      expect(asset.focalPoint.y).toBeGreaterThanOrEqual(0);
      expect(asset.focalPoint.y).toBeLessThanOrEqual(100);
    });
  });
});

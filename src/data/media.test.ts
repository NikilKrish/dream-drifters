import { describe, expect, it } from 'vitest';
import type { MediaAsset } from '../types';
import { packages } from './packages';
import { activeChapterMedia, getChapterMedia, isMediaAssetApproved, mediaAssets } from './media';

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
    expect(mediaAssets.filter(isMediaAssetApproved)).toEqual([]);

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
});

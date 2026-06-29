import { describe, it, expect } from "vitest";
import {
  calculateExposure,
  calculateFocalLengthScale,
  scoreAttempt,
} from "@/lib/exposure-engine";
import type { CameraSettings, ScenarioIdealSettings } from "@/types";

const baseSettings: CameraSettings = {
  iso: 100,
  aperture: 2.8,
  shutterSpeed: 1 / 500,
  focalLength: 50,
  subjectDistance: 3,
  ambientLight: 14,
  tripod: false,
};

describe("calculateExposure", () => {
  it("calculates EV correctly for ISO 100, f/2.8, 1/500s", () => {
    const result = calculateExposure(baseSettings);
    // EV100 = log2(2.8² / 0.002) = log2(3920) ≈ 11.94
    expect(result.ev).toBeCloseTo(11.94, 1);
  });

  it("marks as underexposed when camera EV is more than 1 stop above scene", () => {
    const dark = { ...baseSettings, shutterSpeed: 1 / 16000, iso: 100 };
    const result = calculateExposure(dark);
    expect(result.isUnderexposed).toBe(true);
  });

  it("marks as overexposed when camera EV is more than 1 stop below scene", () => {
    const bright = { ...baseSettings, iso: 12800, shutterSpeed: 1 / 30 };
    const result = calculateExposure(bright);
    expect(result.isOverexposed).toBe(true);
  });

  it("detects noise at ISO >= 3200", () => {
    const noisy = { ...baseSettings, iso: 3200 };
    expect(calculateExposure(noisy).hasNoise).toBe(true);
  });

  it("lowers camera EV when ISO goes up", () => {
    const lowIso = calculateExposure({ ...baseSettings, iso: 100 });
    const highIso = calculateExposure({ ...baseSettings, iso: 800 });
    expect(highIso.ev).toBeLessThan(lowIso.ev);
  });

  it("no noise below ISO 3200", () => {
    const clean = { ...baseSettings, iso: 1600 };
    expect(calculateExposure(clean).hasNoise).toBe(false);
  });

  it("detects motion blur when shutter < 1/60 without tripod", () => {
    const blurry = { ...baseSettings, shutterSpeed: 1 / 30, tripod: false };
    expect(calculateExposure(blurry).hasMotionBlur).toBe(true);
  });

  it("does not mark a normal handheld 1/125s frame as motion blurred", () => {
    const steady = { ...baseSettings, shutterSpeed: 1 / 125, tripod: false };
    expect(calculateExposure(steady).hasMotionBlur).toBe(false);
  });

  it("tripod removes camera shake but not slow-shutter subject blur", () => {
    const steady = { ...baseSettings, shutterSpeed: 1 / 10, tripod: true };
    const result = calculateExposure(steady);
    expect(result.cameraShakeBlurPx).toBe(0);
    expect(result.subjectMotionBlurPx).toBeGreaterThan(0);
  });

  it("detects shallow DoF at f/1.8, 50mm, 3m", () => {
    const bokeh = { ...baseSettings, aperture: 1.8 };
    expect(calculateExposure(bokeh).hasShallowDof).toBe(true);
  });

  it("DoF increases as aperture closes (f/16 > f/2.8)", () => {
    const open = calculateExposure({ ...baseSettings, aperture: 2.8 });
    const closed = calculateExposure({ ...baseSettings, aperture: 16 });
    expect(closed.dofMm).toBeGreaterThan(open.dofMm);
  });

  it("85mm f/1.8 creates strong background blur without motion blur", () => {
    const result = calculateExposure({
      ...baseSettings,
      aperture: 1.8,
      shutterSpeed: 1 / 500,
      focalLength: 85,
      subjectDistance: 2,
    });

    expect(result.backgroundBlurPx).toBeGreaterThanOrEqual(5);
    expect(result.motionBlurPx).toBe(0);
  });

  it("f/11 keeps background blur low compared to f/1.8", () => {
    const wide = calculateExposure({
      ...baseSettings,
      aperture: 1.8,
      focalLength: 85,
      subjectDistance: 2,
    });
    const stopped = calculateExposure({
      ...baseSettings,
      aperture: 11,
      focalLength: 85,
      subjectDistance: 2,
    });

    expect(stopped.backgroundBlurPx).toBeLessThanOrEqual(0.2);
    expect(wide.backgroundBlurPx).toBeGreaterThan(stopped.backgroundBlurPx);
  });

  it("slow shutter at f/8 creates motion blur without artificial bokeh", () => {
    const result = calculateExposure({
      ...baseSettings,
      aperture: 8,
      shutterSpeed: 1 / 15,
      focalLength: 50,
      subjectDistance: 3,
    });

    expect(result.motionBlurPx).toBeGreaterThan(2);
    expect(result.backgroundBlurPx).toBe(0);
  });

  it("1/1000s freezes subject motion", () => {
    const result = calculateExposure({
      ...baseSettings,
      iso: 800,
      aperture: 2.8,
      shutterSpeed: 1 / 1000,
      focalLength: 50,
    });

    expect(result.subjectMotionBlurPx).toBeLessThanOrEqual(0.1);
  });

  it("85mm is approximately 3.4x tighter than 25mm", () => {
    const ratio = calculateFocalLengthScale(85) / calculateFocalLengthScale(25);

    expect(ratio).toBeCloseTo(3.4, 1);
  });

  it("returns normalized preview filters from exposure and ISO", () => {
    const neutral = calculateExposure(baseSettings);
    const under = calculateExposure({
      ...baseSettings,
      shutterSpeed: 1 / 4000,
      iso: 100,
    });
    const over = calculateExposure({
      ...baseSettings,
      shutterSpeed: 1 / 30,
      iso: 3200,
    });

    expect(under.previewBrightnessPercent).toBeLessThan(
      neutral.previewBrightnessPercent,
    );
    expect(over.previewBrightnessPercent).toBeGreaterThan(
      neutral.previewBrightnessPercent,
    );
    expect(over.grainOpacity).toBeGreaterThan(0);
    expect(over.previewSaturationPercent).toBeLessThan(
      neutral.previewSaturationPercent,
    );
  });
});

describe("scoreAttempt", () => {
  const ideal: ScenarioIdealSettings = {
    iso: 100,
    aperture: 2.8,
    shutterSpeed: 1 / 500,
    toleranceEV: 1,
    requiresShallowDof: false,
    requiresFrozenMotion: false,
    requiresLowNoise: false,
  };

  it("returns score 100 when settings match ideal exactly", () => {
    const result = calculateExposure(baseSettings);
    const feedback = scoreAttempt(result, baseSettings, ideal);
    expect(feedback.score.total).toBe(100);
    expect(feedback.messages).toHaveLength(0);
  });

  it("penalizes when exposure is off by more than 1 EV", () => {
    const badSettings = { ...baseSettings, iso: 100, shutterSpeed: 1 / 60 };
    const result = calculateExposure(badSettings);
    const feedback = scoreAttempt(result, badSettings, ideal);
    expect(feedback.score.exposureScore).toBeLessThan(40);
  });

  it("penalizes noise when scenario requires low noise", () => {
    const noisyIdeal: ScenarioIdealSettings = {
      ...ideal,
      requiresLowNoise: true,
    };
    const noisySettings = { ...baseSettings, iso: 6400 };
    const result = calculateExposure(noisySettings);
    const feedback = scoreAttempt(result, noisySettings, noisyIdeal);
    expect(feedback.score.noiseScore).toBeLessThan(20);
  });

  it("includes at least one pt-BR feedback message when exposure is wrong", () => {
    const badSettings = { ...baseSettings, shutterSpeed: 1 / 4000 };
    const result = calculateExposure(badSettings);
    const feedback = scoreAttempt(result, badSettings, ideal);
    expect(feedback.messages.length).toBeGreaterThan(0);
    expect(feedback.messages[0]).toMatch(/[a-záéíóúãõâêôç]/i);
  });

  it("includes idealSettings in feedback", () => {
    const result = calculateExposure(baseSettings);
    const feedback = scoreAttempt(result, baseSettings, ideal);
    expect(feedback.idealSettings.iso).toBe(100);
    expect(feedback.idealSettings.aperture).toBe(2.8);
  });
});

import { describe, it, expect } from "vitest";
import { calculateExposure, scoreAttempt } from "@/lib/exposure-engine";
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

  it("marks as underexposed when EV is more than 1 stop below scene", () => {
    const dark = { ...baseSettings, shutterSpeed: 1 / 4000, iso: 100 };
    const result = calculateExposure(dark);
    expect(result.isUnderexposed).toBe(true);
  });

  it("marks as overexposed when EV is more than 1 stop above scene", () => {
    const bright = { ...baseSettings, iso: 12800, shutterSpeed: 1 / 30 };
    const result = calculateExposure(bright);
    expect(result.isOverexposed).toBe(true);
  });

  it("detects noise at ISO >= 3200", () => {
    const noisy = { ...baseSettings, iso: 3200 };
    expect(calculateExposure(noisy).hasNoise).toBe(true);
  });

  it("no noise below ISO 3200", () => {
    const clean = { ...baseSettings, iso: 1600 };
    expect(calculateExposure(clean).hasNoise).toBe(false);
  });

  it("detects motion blur when shutter < 1/60 without tripod", () => {
    const blurry = { ...baseSettings, shutterSpeed: 1 / 30, tripod: false };
    expect(calculateExposure(blurry).hasMotionBlur).toBe(true);
  });

  it("no motion blur with tripod even at slow shutter", () => {
    const steady = { ...baseSettings, shutterSpeed: 1 / 10, tripod: true };
    expect(calculateExposure(steady).hasMotionBlur).toBe(false);
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

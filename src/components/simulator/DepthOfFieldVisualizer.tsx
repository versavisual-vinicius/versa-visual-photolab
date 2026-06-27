"use client";
import { useRef, useEffect } from "react";
import type { CameraSettings, ExposureResult } from "@/types";

interface Props {
  settings: CameraSettings;
  result: ExposureResult;
}

export default function DepthOfFieldVisualizer({ settings, result }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    const camX = 40;
    const camY = H / 2;
    ctx.fillStyle = "#64748b";
    ctx.fillRect(camX - 15, camY - 10, 30, 20);
    ctx.beginPath();
    ctx.arc(camX, camY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#94a3b8";
    ctx.fill();

    const maxDist = 15;
    const subjectX =
      camX + (settings.subjectDistance / maxDist) * (W - camX - 60);
    const dofMeters = Math.min(result.dofMm / 1000, 10);
    const dofHalfPixels = Math.min(
      (dofMeters / maxDist) * (W - camX - 60) * 0.5,
      80,
    );
    const coneAngle =
      settings.focalLength < 50
        ? 0.4
        : settings.focalLength < 100
          ? 0.25
          : 0.15;

    ctx.beginPath();
    ctx.moveTo(camX, camY);
    ctx.lineTo(W - 20, camY - H * coneAngle);
    ctx.lineTo(W - 20, camY + H * coneAngle);
    ctx.closePath();
    ctx.fillStyle = "rgba(99,102,241,0.08)";
    ctx.fill();
    ctx.strokeStyle = "rgba(99,102,241,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(subjectX - 10, camY - dofHalfPixels);
    ctx.lineTo(subjectX + 10, camY - dofHalfPixels);
    ctx.lineTo(subjectX + 10, camY + dofHalfPixels);
    ctx.lineTo(subjectX - 10, camY + dofHalfPixels);
    ctx.closePath();
    ctx.fillStyle = "rgba(236,72,153,0.35)";
    ctx.fill();
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#f1f5f9";
    ctx.beginPath();
    ctx.arc(subjectX, camY - 22, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(subjectX - 5, camY - 14, 10, 22);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText(`${settings.subjectDistance}m`, subjectX - 10, camY + 50);
    ctx.fillText(`f/${settings.aperture}`, camX - 10, camY + 35);
    ctx.fillStyle = "#ec4899";
    ctx.fillText(
      result.dofMm < 1000
        ? `DOF: ${result.dofMm.toFixed(0)}mm`
        : `DOF: ${(result.dofMm / 1000).toFixed(1)}m`,
      subjectX - 25,
      camY - dofHalfPixels - 8,
    );
  }, [settings, result]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={160}
      className="w-full rounded-lg border border-border"
      style={{ maxHeight: 160 }}
    />
  );
}

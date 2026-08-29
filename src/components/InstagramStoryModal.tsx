import React, { useState, useRef } from 'react';
import { Archetype, UserPsychologicalVector } from '../types';
import { getKickassProfile } from '../utils/personalityHype';
import { 
  Instagram, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Compass,
  Target
} from 'lucide-react';

interface InstagramStoryModalProps {
  archetype: Archetype;
  vector: UserPsychologicalVector;
  onClose: () => void;
}

const HOUSE_MOTTOS: Record<string, string> = {
  'The Strategists': 'ANALYZE. OPTIMIZE. OUTMANEUVER.',
  'The Navigators': 'OWN IT. LEAD IT. NAVIGATE EVERYTHING.',
  'The Explorers': 'DISRUPT. INVENT. BEND REALITY.',
  'The Diplomats': 'CONNECT. HARMONIZE. TRANSCEND.',
  'The Guardians': 'DEFEND. ENDURE. ANCHOR TRUTH.',
  'The Innovators': 'CHALLENGE. DISRUPT. REVOLUTIONIZE.'
};

export const InstagramStoryModal: React.FC<InstagramStoryModalProps> = ({
  archetype,
  vector,
  onClose
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isAssertive = vector.identityVariant === 'Assertive';
  const kickassInfo = getKickassProfile(archetype.code, isAssertive);
  const houseMotto = HOUSE_MOTTOS[archetype.house] || 'OWN IT. LEAD IT. NAVIGATE EVERYTHING.';

  // HEXACO Traits for Spider Graph with exact labels matching image
  const hexacoData = [
    { label: 'Honesty-Humility', short: 'H', val: vector.hexaco.honestyHumility, color: '#8B5CF6' },
    { label: 'Extraversion', short: 'E', val: vector.hexaco.emotionality, color: '#6366F1' },
    { label: 'eXtraversion', short: 'X', val: vector.hexaco.extraversion, color: '#0EA5E9' },
    { label: 'Agreeableness', short: 'A', val: vector.hexaco.agreeableness, color: '#F59E0B' },
    { label: 'Conscientiousness', short: 'C', val: vector.hexaco.conscientiousness, color: '#8B5CF6' },
    { label: 'Openness', short: 'O', val: vector.hexaco.openness, color: '#EC4899' },
  ];

  // Helper to safely format primary domain
  const safePrimaryDomain = vector.riasec.primaryDomain || 'Strategic & Analytical';

  // Robust Text Wrapping Helper for Canvas
  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 5
  ): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        if (lineCount < maxLines - 1) {
          ctx.fillText(line.trim(), x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
          lineCount++;
        } else {
          ctx.fillText((line + words[n] + '...').trim(), x, currentY);
          return currentY + lineHeight;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY + lineHeight;
  };

  // Helper for drawing rounded rectangles on canvas
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // Render Story to High-Res 1080x1920 Canvas matching image.png exactly
  const drawStoryCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(canvas);
        return;
      }

      // 1. Background Fill (Sleek Dark Slate Backdrop)
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, 1080, 1920);

      // Subtle Outer Ambient Glow
      const bgGlow = ctx.createRadialGradient(540, 960, 100, 540, 960, 900);
      bgGlow.addColorStop(0, 'rgba(30, 58, 138, 0.25)');
      bgGlow.addColorStop(1, 'rgba(6, 11, 24, 1.0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, 1080, 1920);

      // 2. Top Story Header Bar
      const topBarX = 64;
      const topBarY = 48;
      const topBarW = 952;
      const topBarH = 72;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      drawRoundedRect(ctx, topBarX, topBarY, topBarW, topBarH, 16);
      ctx.fill();

      // Top Tag
      ctx.font = '900 22px monospace';
      ctx.fillStyle = '#F8FAFC';
      ctx.fillText('OMNIPSYCHE // UNIFIED PSYCHOMETRIC GRAPH', topBarX + 24, topBarY + 45);

      // Top Status Pill (Bright Yellow Verified)
      const pillW = 176;
      const pillH = 50;
      const pillX = topBarX + topBarW - pillW - 12;
      const pillY = topBarY + 11;
      ctx.fillStyle = '#FFE600';
      drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 10);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 20px monospace';
      ctx.fillText('★ VERIFIED', pillX + 22, pillY + 33);

      // 3. Main Story Card Container (White Frame)
      const cardX = 48;
      const cardY = 140;
      const cardW = 984;
      const cardH = 1700;

      // Card Background
      ctx.fillStyle = '#F8FAFC';
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
      ctx.fill();

      // Subtle Outer Card Border
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 3;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
      ctx.stroke();

      // ==========================================
      // 4. HOUSE HEADER BANNER
      // ==========================================
      const houseH = 108;
      const houseGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
      houseGrad.addColorStop(0, '#2563EB'); // Royal blue
      houseGrad.addColorStop(1, '#4F46E5'); // Indigo

      ctx.save();
      drawRoundedRect(ctx, cardX, cardY, cardW, houseH + 20, 32);
      ctx.clip();
      ctx.fillStyle = houseGrad;
      ctx.fillRect(cardX, cardY, cardW, houseH);
      ctx.restore();

      // House Icon Circle on Left
      ctx.fillStyle = '#1D4ED8';
      ctx.beginPath();
      ctx.arc(cardX + 64, cardY + 54, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // House Compass Symbol
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cardX + 64, cardY + 54, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cardX + 64, cardY + 30);
      ctx.lineTo(cardX + 64, cardY + 78);
      ctx.moveTo(cardX + 40, cardY + 54);
      ctx.lineTo(cardX + 88, cardY + 54);
      ctx.stroke();

      // House Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 28px monospace';
      ctx.fillText(`HOUSE // ${archetype.house.toUpperCase()}`, cardX + 112, cardY + 63);

      // Archetype Code Pill on Right (e.g. ESTJ-A)
      const codePillW = 230;
      const codePillH = 64;
      const codePillX = cardX + cardW - codePillW - 28;
      const codePillY = cardY + 22;

      ctx.fillStyle = '#060B18';
      drawRoundedRect(ctx, codePillX, codePillY, codePillW, codePillH, 14);
      ctx.fill();

      ctx.fillStyle = '#FFE600';
      ctx.font = '900 32px monospace';
      ctx.textAlign = 'center';
      const fullCode = `${archetype.code}-${vector.identityVariant.substring(0, 1).toUpperCase()}`;
      ctx.fillText(fullCode, codePillX + codePillW / 2, codePillY + 44);
      ctx.textAlign = 'left';

      // ==========================================
      // 5. HERO ARCHETYPE TITLE & 3D CREST SECTION
      // ==========================================
      const heroY = cardY + houseH + 36;

      // Archetype Name
      ctx.font = '900 60px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(archetype.name, cardX + 40, heroY + 48);

      // Subtitle / Moniker
      ctx.font = '800 27px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#2563EB';
      ctx.fillText(`"${archetype.title}"`, cardX + 40, heroY + 92);

      // 3D Shield Crest on Top Right
      const shieldCX = cardX + cardW - 130;
      const shieldCY = heroY + 54;
      const shieldW = 140;
      const shieldH = 160;

      // Shield Shadow & Base
      ctx.save();
      const shieldGrad = ctx.createLinearGradient(shieldCX - 60, shieldCY - 70, shieldCX + 60, shieldCY + 80);
      shieldGrad.addColorStop(0, '#1E293B');
      shieldGrad.addColorStop(0.5, '#334155');
      shieldGrad.addColorStop(1, '#0F172A');

      ctx.fillStyle = shieldGrad;
      ctx.beginPath();
      ctx.moveTo(shieldCX, shieldCY - 70);
      ctx.lineTo(shieldCX + 60, shieldCY - 40);
      ctx.lineTo(shieldCX + 50, shieldCY + 40);
      ctx.quadraticCurveTo(shieldCX, shieldCY + 85, shieldCX, shieldCY + 85);
      ctx.quadraticCurveTo(shieldCX, shieldCY + 85, shieldCX - 50, shieldCY + 40);
      ctx.lineTo(shieldCX - 60, shieldCY - 40);
      ctx.closePath();
      ctx.fill();

      // Shield Chrome Border
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Inner Glowing Compass Star
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(shieldCX, shieldCY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(shieldCX, shieldCY - 34);
      ctx.lineTo(shieldCX + 8, shieldCY - 8);
      ctx.lineTo(shieldCX + 34, shieldCY);
      ctx.lineTo(shieldCX + 8, shieldCY + 8);
      ctx.lineTo(shieldCX, shieldCY + 34);
      ctx.lineTo(shieldCX - 8, shieldCY + 8);
      ctx.lineTo(shieldCX - 34, shieldCY);
      ctx.lineTo(shieldCX - 8, shieldCY - 8);
      ctx.closePath();
      ctx.fillStyle = '#E2E8F0';
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // ==========================================
      // 6. MASSIVE HEXACO SPIDER GRAPH SECTION
      // ==========================================
      const radarBoxY = heroY + 124;
      const radarBoxW = cardW - 80;
      const radarBoxH = 460; // Extra tall & spacious

      // Radar Container Card
      ctx.fillStyle = '#FFFFFF';
      drawRoundedRect(ctx, cardX + 40, radarBoxY, radarBoxW, radarBoxH, 24);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, cardX + 40, radarBoxY, radarBoxW, radarBoxH, 24);
      ctx.stroke();

      // Radar Card Header
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 20px monospace';
      ctx.fillText('HEXACO PI-R PSYCHOMETRIC SPECTRUM', cardX + 68, radarBoxY + 40);
      ctx.fillStyle = '#64748B';
      ctx.font = '700 16px monospace';
      ctx.fillText('(6-AXIS RADAR)', cardX + 68, radarBoxY + 64);

      // Left Dot Grid Pattern (4 cols x 8 rows)
      ctx.fillStyle = '#CBD5E1';
      for (let dx = 0; dx < 4; dx++) {
        for (let dy = 0; dy < 8; dy++) {
          ctx.beginPath();
          ctx.arc(cardX + 78 + dx * 20, radarBoxY + 150 + dy * 28, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Large Radar Geometry
      const radarCenterX = cardX + 380; // Placed generously on left/center
      const radarCenterY = radarBoxY + 255;
      const radarRadius = 165; // Massive radius!

      // Draw Concentric Rings (33%, 66%, 100%)
      const rings = [0.33, 0.66, 1.0];
      rings.forEach((ringPct) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
          const px = radarCenterX + radarRadius * ringPct * Math.cos(angle);
          const py = radarCenterY + radarRadius * ringPct * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = ringPct === 1.0 ? '#94A3B8' : '#E2E8F0';
        ctx.lineWidth = ringPct === 1.0 ? 2 : 1.5;
        ctx.stroke();
      });

      // Draw Axis Lines
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
        const px = radarCenterX + radarRadius * Math.cos(angle);
        const py = radarCenterY + radarRadius * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(radarCenterX, radarCenterY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw Trait Polygon (Translucent Blue/Indigo Fill)
      ctx.beginPath();
      hexacoData.forEach((trait, i) => {
        const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
        const normalized = Math.max(0.18, trait.val / 100);
        const px = radarCenterX + radarRadius * normalized * Math.cos(angle);
        const py = radarCenterY + radarRadius * normalized * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 4.5;
      ctx.stroke();

      // Draw Trait Data Point Circles & Outer Labels
      hexacoData.forEach((trait, i) => {
        const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
        const normalized = Math.max(0.18, trait.val / 100);
        const px = radarCenterX + radarRadius * normalized * Math.cos(angle);
        const py = radarCenterY + radarRadius * normalized * Math.sin(angle);

        // Point circle (Yellow with dark border)
        ctx.beginPath();
        ctx.arc(px, py, 7.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE600';
        ctx.fill();
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Label around radar
        const labelDist = radarRadius + 36;
        const lx = radarCenterX + labelDist * Math.cos(angle);
        const ly = radarCenterY + labelDist * Math.sin(angle);

        ctx.font = '900 17px monospace';
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        ctx.fillText(`${trait.short}: ${trait.val}%`, lx, ly + 6);
      });
      ctx.textAlign = 'left';

      // Radar Legend (Right Column inside Spider Box matching image)
      const legendX = cardX + radarBoxW - 260;
      const legendY = radarBoxY + 115;
      const legendRowH = 50;

      hexacoData.forEach((trait, idx) => {
        const rowY = legendY + idx * legendRowH;

        // Colored Circle with Letter
        ctx.fillStyle = trait.color;
        ctx.beginPath();
        ctx.arc(legendX + 16, rowY + 12, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '900 13px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(trait.short, legendX + 16, rowY + 17);
        ctx.textAlign = 'left';

        // Trait Full Name
        ctx.font = '700 16px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#334155';
        ctx.fillText(trait.label, legendX + 42, rowY + 18);
      });

      // ==========================================
      // 7. KEY PSYCHOMETRIC MARKERS (4 Cards with Colored Accent Bars)
      // ==========================================
      const markersY = radarBoxY + radarBoxH + 20;
      const markerW = (radarBoxW - 20) / 2;
      const markerH = 104;

      const markers = [
        { 
          label: '⚡ EQ & STAMINA', 
          val: `${vector.traitEq.score}% EQ`, 
          sub: 'Emotional Agility',
          accentColor: '#FFE600' // Yellow
        },
        { 
          label: '🛡️ ATTACHMENT', 
          val: vector.attachment.style, 
          sub: `Anx: ${vector.attachment.anxiety}% | Avoid: ${vector.attachment.avoidance}%`,
          accentColor: '#EF4444' // Red/Coral
        },
        { 
          label: '🎯 RIASEC CODE', 
          val: `Holland: ${vector.riasec.hollandCode}`, 
          sub: safePrimaryDomain,
          accentColor: '#6366F1' // Purple
        },
        { 
          label: '💎 DUCKWORTH GRIT', 
          val: `${vector.grit.score} / 5.0`, 
          sub: 'Perseverance Baseline',
          accentColor: '#06B6D4' // Cyan/Teal
        }
      ];

      markers.forEach((m, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const mx = cardX + 40 + col * (markerW + 20);
        const my = markersY + row * (markerH + 16);

        // Marker Card Background
        ctx.fillStyle = '#FFFFFF';
        drawRoundedRect(ctx, mx, my, markerW, markerH, 16);
        ctx.fill();
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, mx, my, markerW, markerH, 16);
        ctx.stroke();

        // Left Colored Accent Bar
        ctx.fillStyle = m.accentColor;
        ctx.beginPath();
        ctx.moveTo(mx + 16, my);
        ctx.lineTo(mx + 8, my);
        ctx.quadraticCurveTo(mx, my, mx, my + 16);
        ctx.lineTo(mx, my + markerH - 16);
        ctx.quadraticCurveTo(mx, my + markerH, mx + 8, my + markerH);
        ctx.lineTo(mx + 8, my + markerH);
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.font = '900 13px monospace';
        ctx.fillStyle = '#64748B';
        ctx.fillText(m.label, mx + 24, my + 28);

        // Value
        ctx.font = '900 24px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.fillText(m.val, mx + 24, my + 60);

        // Subtext
        ctx.font = '600 14px monospace';
        ctx.fillStyle = '#64748B';
        ctx.fillText(m.sub, mx + 24, my + 84);
      });

      // ==========================================
      // 8. SIGNATURE ADVANTAGE BANNER (Golden Yellow Gradient)
      // ==========================================
      const superY = markersY + (markerH * 2) + 32;
      const superW = radarBoxW;
      const superH = 112;

      const superGrad = ctx.createLinearGradient(cardX + 40, superY, cardX + 40 + superW, superY);
      superGrad.addColorStop(0, '#FFE600');
      superGrad.addColorStop(1, '#FBBF24');

      ctx.fillStyle = superGrad;
      drawRoundedRect(ctx, cardX + 40, superY, superW, superH, 18);
      ctx.fill();

      // Top Tag
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 15px monospace';
      ctx.fillText('⚡ SIGNATURE STRATEGIC ADVANTAGE', cardX + 68, superY + 36);

      // Advantage Text
      ctx.font = '900 25px system-ui, -apple-system, sans-serif';
      const advantageText = `"${archetype.superpowers[0] || 'Uncompromising strategic discipline and vision'}"`;
      drawWrappedText(ctx, advantageText, cardX + 68, superY + 74, superW - 140, 32, 2);

      // Bullseye Target Graphic on Right
      const targetCX = cardX + 40 + superW - 65;
      const targetCY = superY + 56;
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(targetCX, targetCY, 38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(targetCX, targetCY, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(targetCX, targetCY, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();

      // Target Arrow
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(targetCX + 28, targetCY - 28);
      ctx.lineTo(targetCX + 4, targetCY - 4);
      ctx.stroke();

      // ==========================================
      // 9. WHY THIS PERSONALITY TYPE IS KICKASS (Sleek Dark Gradient Box)
      // ==========================================
      const kickassY = superY + superH + 18;
      const kickassW = radarBoxW;
      const kickassH = 310;

      const kickassGrad = ctx.createLinearGradient(cardX + 40, kickassY, cardX + 40 + kickassW, kickassY + kickassH);
      kickassGrad.addColorStop(0, '#0F172A');
      kickassGrad.addColorStop(1, '#020617');

      ctx.fillStyle = kickassGrad;
      drawRoundedRect(ctx, cardX + 40, kickassY, kickassW, kickassH, 20);
      ctx.fill();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, cardX + 40, kickassY, kickassW, kickassH, 20);
      ctx.stroke();

      // Header Tag
      ctx.fillStyle = '#FFE600';
      ctx.font = '900 19px monospace';
      ctx.fillText(`🔥 WHY ${archetype.code} IS ABSOLUTELY KICKASS:`, cardX + 68, kickassY + 44);

      // Tagline Subtitle
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 15px monospace';
      ctx.fillText(`// ${kickassInfo.tagline.toUpperCase()}`, cardX + 68, kickassY + 72);

      // Description Text
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '500 20px system-ui, -apple-system, sans-serif';
      drawWrappedText(ctx, kickassInfo.description, cardX + 68, kickassY + 118, kickassW - 140, 32, 5);

      // Glowing Chess King Hologram on Right
      const chessX = cardX + 40 + kickassW - 75;
      const chessY = kickassY + 160;
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Base
      ctx.moveTo(chessX - 35, chessY + 70);
      ctx.lineTo(chessX + 35, chessY + 70);
      ctx.lineTo(chessX + 25, chessY + 50);
      ctx.lineTo(chessX - 25, chessY + 50);
      ctx.closePath();
      // Stem
      ctx.moveTo(chessX - 18, chessY + 50);
      ctx.quadraticCurveTo(chessX - 8, chessY, chessX - 16, chessY - 30);
      ctx.lineTo(chessX + 16, chessY - 30);
      ctx.quadraticCurveTo(chessX + 8, chessY, chessX + 18, chessY + 50);
      // Crown
      ctx.moveTo(chessX - 22, chessY - 30);
      ctx.lineTo(chessX + 22, chessY - 30);
      ctx.lineTo(chessX + 26, chessY - 50);
      ctx.lineTo(chessX, chessY - 40);
      ctx.lineTo(chessX - 26, chessY - 50);
      ctx.closePath();
      ctx.stroke();

      // Cross on Crown
      ctx.beginPath();
      ctx.moveTo(chessX, chessY - 40);
      ctx.lineTo(chessX, chessY - 62);
      ctx.moveTo(chessX - 8, chessY - 54);
      ctx.lineTo(chessX + 8, chessY - 54);
      ctx.stroke();
      ctx.restore();

      // ==========================================
      // 10. REFINED STORY FOOTER
      // ==========================================
      const footerY = cardY + cardH + 42;
      ctx.font = '800 16px monospace';
      ctx.fillStyle = '#60A5FA';
      ctx.textAlign = 'center';
      ctx.fillText(`—  ${houseMotto}  —`, 540, footerY);
      ctx.textAlign = 'left';

      resolve(canvas);
    });
  };

  const handleDownloadStory = async () => {
    setIsExporting(true);
    try {
      const canvas = await drawStoryCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `OmniPsyche-Story-${archetype.code}-${vector.identityVariant}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating story image', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    setIsExporting(true);
    try {
      const canvas = await drawStoryCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch (clipErr) {
          handleDownloadStory();
        }
      });
    } catch (err) {
      console.error('Copy image failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    setIsExporting(true);
    try {
      const canvas = await drawStoryCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File(
          [blob], 
          `OmniPsyche-Story-${archetype.code}.png`, 
          { type: 'image/png' }
        );

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `OmniPsyche: I am ${archetype.name} (${archetype.code})`,
            text: `My 7-layer psychometric vector: ${archetype.title}. Verified on OmniPsyche.`,
            files: [file]
          });
        } else {
          handleDownloadStory();
        }
      });
    } catch (err) {
      console.error('Native share error', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060B18]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#0F172A] w-full max-w-5xl max-h-[96vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 border-b border-slate-700 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FFE600] text-[#0F172A] rounded-xl flex items-center justify-center font-display font-black text-base shrink-0 shadow-sm">
              <Instagram size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FFE600] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-mono font-black">
                  INSTAGRAM STORY STUDIO // 9:16 HD
                </span>
                <span className="hidden sm:inline font-mono text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  1080 × 1920 CANVAS
                </span>
              </div>
              <h2 className="font-display font-black text-base sm:text-lg text-white tracking-tight">
                High-Resolution Story Card
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors shrink-0"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Layout (Live 9:16 Preview + Direct Actions) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Direct Export Actions & Details */}
          <div className="md:col-span-5 space-y-4 font-mono text-xs order-2 md:order-1">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-sm text-white flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#FFE600]" />
                  9:16 STORY READY
                </span>
                <span className="bg-[#FFE600] px-2 py-0.5 rounded text-[10px] font-black text-[#0F172A]">
                  1080×1920 HD
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans font-medium">
                High-resolution story card formatted with your massive 6-axis psychometric spider graph, trait legend, 4 key cognitive markers, and custom personality hype.
              </p>
            </div>

            {/* Export Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleDownloadStory}
                disabled={isExporting}
                className="w-full bg-[#FFE600] hover:bg-[#FACC15] text-[#0F172A] py-3.5 px-4 rounded-xl font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-transform min-h-[48px]"
              >
                <Download size={18} />
                <span>{isExporting ? 'RENDERING 1080×1920 HD...' : 'DOWNLOAD STORY PNG'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleNativeShare}
                  disabled={isExporting}
                  className="bg-slate-700 hover:bg-slate-600 text-white py-2.5 px-3 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] border border-slate-600 transition-colors"
                >
                  <Share2 size={15} />
                  <span>SHARE</span>
                </button>

                <button
                  onClick={handleCopyImage}
                  disabled={isExporting}
                  className="bg-white hover:bg-slate-100 text-[#0F172A] py-2.5 px-3 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] shadow-sm transition-colors"
                >
                  {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                  <span>{copied ? 'COPIED!' : 'COPY IMAGE'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Scaled 9:16 Preview Card Matching image.png */}
          <div className="md:col-span-7 flex justify-center py-2 order-1 md:order-2">
            <div
              className="w-[310px] sm:w-[350px] aspect-[9/16] bg-[#060B18] text-[#0F172A] rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden flex flex-col justify-between p-2.5 sm:p-3 select-none"
            >
              {/* Top Story Header Pill */}
              <div 
                className="relative z-10 px-2 py-1 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center justify-between"
              >
                <span className="text-[7.5px] font-mono font-black text-slate-200 tracking-tight">
                  OMNIPSYCHE // UNIFIED PSYCHOMETRIC GRAPH
                </span>
                <span 
                  className="px-1.5 py-0.5 text-[7px] font-mono font-black bg-[#FFE600] text-[#0F172A] rounded"
                >
                  ★ VERIFIED
                </span>
              </div>

              {/* Main White Card Shell */}
              <div className="relative z-10 bg-white rounded-xl my-1 flex-1 flex flex-col justify-between overflow-hidden shadow-lg p-2 space-y-1.5">
                {/* House & Typology Header Bar */}
                <div 
                  className="rounded-lg px-2.5 py-1.5 flex items-center justify-between text-white shadow-sm"
                  style={{ background: 'linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-700 border border-white/40 flex items-center justify-center">
                      <Compass size={12} className="text-white" />
                    </div>
                    <span className="text-[8px] font-mono font-black tracking-wider">
                      HOUSE // {archetype.house.toUpperCase()}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 bg-[#060B18] text-[#FFE600] text-[9px] font-mono font-black rounded border border-slate-800">
                    {archetype.code}-{vector.identityVariant.substring(0, 1).toUpperCase()}
                  </span>
                </div>

                {/* Hero Title & Crest Row */}
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="font-display font-black text-base leading-tight text-[#0F172A]">
                      {archetype.name}
                    </h3>
                    <p className="text-[9px] font-bold text-blue-600">
                      "{archetype.title}"
                    </p>
                  </div>

                  {/* 3D Shield Icon Representation */}
                  <div className="w-8 h-9 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 rounded-b-lg border border-slate-400 flex items-center justify-center shadow-md">
                    <div className="w-4 h-4 rounded-full bg-sky-400/80 flex items-center justify-center text-[8px] text-white font-black">
                      ✦
                    </div>
                  </div>
                </div>

                {/* MASSIVE SPIDER GRAPH SECTION WITH SIDE LEGEND */}
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-[7.5px] font-mono font-black text-slate-700 pb-1">
                    <div>
                      <span>HEXACO PI-R PSYCHOMETRIC SPECTRUM</span>
                      <span className="block text-[6.5px] text-slate-500 font-bold">(6-AXIS RADAR)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    {/* SVG Radar Chart (Significantly Larger) */}
                    <div className="flex-1 flex justify-center py-1">
                      <svg viewBox="0 0 200 180" className="w-[155px] h-[130px] overflow-visible">
                        {/* Dot Matrix on Left */}
                        {[0, 1, 2].map((col) =>
                          [0, 1, 2, 3, 4].map((row) => (
                            <circle
                              key={`dot-${col}-${row}`}
                              cx={15 + col * 7}
                              cy={45 + row * 18}
                              r="1"
                              fill="#CBD5E1"
                            />
                          ))
                        )}

                        {/* Concentric rings */}
                        {[0.33, 0.66, 1.0].map((ring, rIdx) => {
                          const points = hexacoData.map((_, i) => {
                            const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
                            const r = 68 * ring;
                            const x = 100 + r * Math.cos(angle);
                            const y = 90 + r * Math.sin(angle);
                            return `${x},${y}`;
                          }).join(' ');
                          return (
                            <polygon
                              key={rIdx}
                              points={points}
                              fill="none"
                              stroke={ring === 1.0 ? '#94A3B8' : '#E2E8F0'}
                              strokeWidth={ring === 1.0 ? 1.5 : 1}
                            />
                          );
                        })}

                        {/* Radial axis lines */}
                        {hexacoData.map((_, i) => {
                          const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
                          const x2 = 100 + 68 * Math.cos(angle);
                          const y2 = 90 + 68 * Math.sin(angle);
                          return (
                            <line
                              key={i}
                              x1="100"
                              y1="90"
                              x2={x2}
                              y2={y2}
                              stroke="#E2E8F0"
                              strokeWidth="1.2"
                            />
                          );
                        })}

                        {/* Value Polygon */}
                        <polygon
                          points={hexacoData.map((t, i) => {
                            const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
                            const normalized = Math.max(0.18, t.val / 100);
                            const r = 68 * normalized;
                            const x = 100 + r * Math.cos(angle);
                            const y = 90 + r * Math.sin(angle);
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="rgba(59, 130, 246, 0.35)"
                          stroke="#2563EB"
                          strokeWidth="2.5"
                        />

                        {/* Point Circles and Percentage Labels */}
                        {hexacoData.map((t, i) => {
                          const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
                          const normalized = Math.max(0.18, t.val / 100);
                          const r = 68 * normalized;
                          const px = 100 + r * Math.cos(angle);
                          const py = 90 + r * Math.sin(angle);

                          const lx = 100 + 82 * Math.cos(angle);
                          const ly = 90 + 82 * Math.sin(angle);

                          return (
                            <g key={i}>
                              <circle cx={px} cy={py} r="3" fill="#FFE600" stroke="#0F172A" strokeWidth="1.2" />
                              <text
                                x={lx}
                                y={ly + 3}
                                textAnchor="middle"
                                fontSize="7"
                                fontWeight="900"
                                fontFamily="monospace"
                                fill="#0F172A"
                              >
                                {t.short}: {t.val}%
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Side Legend Matching image.png */}
                    <div className="w-[85px] space-y-1 text-[6.5px] font-sans font-semibold text-slate-700 shrink-0">
                      {hexacoData.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span 
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[5.5px] font-black text-white shrink-0 font-mono"
                            style={{ backgroundColor: t.color }}
                          >
                            {t.short}
                          </span>
                          <span className="truncate">{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4 KEY MARKERS GRID WITH COLORED LEFT BARS */}
                <div className="grid grid-cols-2 gap-1.5 text-[7px] font-mono">
                  {/* EQ */}
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 border-l-4 border-l-[#FFE600]">
                    <span className="text-slate-500 block font-bold text-[6px]">⚡ EQ & STAMINA</span>
                    <span className="font-black text-[9px] text-[#0F172A] block">{vector.traitEq.score}% EQ</span>
                    <span className="text-[6.5px] text-slate-600 block">Emotional Agility</span>
                  </div>

                  {/* Attachment */}
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 border-l-4 border-l-[#EF4444]">
                    <span className="text-slate-500 block font-bold text-[6px]">🛡️ ATTACHMENT</span>
                    <span className="font-black text-[9px] text-[#0F172A] block truncate">{vector.attachment.style}</span>
                    <span className="text-[6px] text-slate-600 block truncate">Anx: {vector.attachment.anxiety}% | Avoid: {vector.attachment.avoidance}%</span>
                  </div>

                  {/* RIASEC */}
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 border-l-4 border-l-[#6366F1]">
                    <span className="text-slate-500 block font-bold text-[6px]">🎯 RIASEC CODE</span>
                    <span className="font-black text-[9px] text-[#0F172A] block">Holland: {vector.riasec.hollandCode}</span>
                    <span className="text-[6.5px] text-slate-600 block truncate">{safePrimaryDomain}</span>
                  </div>

                  {/* Grit */}
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 border-l-4 border-l-[#06B6D4]">
                    <span className="text-slate-500 block font-bold text-[6px]">💎 DUCKWORTH GRIT</span>
                    <span className="font-black text-[9px] text-[#0F172A] block">{vector.grit.score} / 5.0</span>
                    <span className="text-[6.5px] text-slate-600 block">Perseverance Baseline</span>
                  </div>
                </div>

                {/* SIGNATURE ADVANTAGE BANNER */}
                <div 
                  className="p-2 rounded-lg text-[#0F172A] relative overflow-hidden"
                  style={{ background: 'linear-gradient(90deg, #FFE600 0%, #FBBF24 100%)' }}
                >
                  <span className="text-[6.5px] font-mono font-black block tracking-tight">
                    ⚡ SIGNATURE STRATEGIC ADVANTAGE
                  </span>
                  <p className="font-display font-black text-[8.5px] leading-tight mt-0.5 line-clamp-1 pr-6">
                    "{archetype.superpowers[0] || 'High-Throughput Project Orchestration'}"
                  </p>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                    <Target size={20} />
                  </div>
                </div>

                {/* WHY THIS PERSONALITY TYPE IS KICKASS (DARK BOX) */}
                <div className="p-2 bg-gradient-to-br from-slate-900 to-[#020617] rounded-lg text-white space-y-0.5 border border-slate-800">
                  <div className="text-[#FFE600] font-mono font-black text-[7px] flex items-center justify-between">
                    <span>🔥 WHY {archetype.code} IS ABSOLUTELY KICKASS:</span>
                  </div>
                  <span className="text-[6px] font-mono text-slate-400 font-bold block">
                    // {kickassInfo.tagline.toUpperCase()}
                  </span>
                  <p className="line-clamp-3 text-slate-200 font-sans font-medium text-[6.5px] leading-relaxed pt-0.5">
                    {kickassInfo.description}
                  </p>
                </div>
              </div>

              {/* Story Motto Footer */}
              <div className="relative z-10 pt-1 text-center text-[7px] font-mono font-black text-blue-400">
                — {houseMotto} —
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Render Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

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
  Compass, 
  Target,
  Zap,
  Flame,
  ShieldCheck,
  Award
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

  const isAssertive = vector.identityVariant === 'Assertive' || vector.identityVariant === 'A';
  const kickassInfo = getKickassProfile(archetype.code, isAssertive);
  const houseMotto = HOUSE_MOTTOS[archetype.house] || 'OWN IT. LEAD IT. NAVIGATE EVERYTHING.';

  // HEXACO Traits for Spider Graph
  const hexacoData = [
    { label: 'Honesty-Humility', short: 'H', val: vector.hexaco.honestyHumility, color: '#8B5CF6' },
    { label: 'Emotionality', short: 'E', val: vector.hexaco.emotionality, color: '#6366F1' },
    { label: 'eXtraversion', short: 'X', val: vector.hexaco.extraversion, color: '#0EA5E9' },
    { label: 'Agreeableness', short: 'A', val: vector.hexaco.agreeableness, color: '#F59E0B' },
    { label: 'Conscientiousness', short: 'C', val: vector.hexaco.conscientiousness, color: '#10B981' },
    { label: 'Openness', short: 'O', val: vector.hexaco.openness, color: '#EC4899' },
  ];

  const safePrimaryDomain = vector.riasec?.primaryDomain || 'Strategic & Analytical';

  // Helper for Canvas text wrapping
  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 4
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

  // Helper for drawing sharp brutal boxes with optional black shadow offset
  const drawBrutalBox = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    fillColor: string,
    hasShadow: boolean = true,
    shadowOffset: number = 8,
    strokeColor: string = '#0F172A',
    strokeWidth: number = 5
  ) => {
    if (hasShadow) {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(x + shadowOffset, y + shadowOffset, w, h);
    }
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, w, h);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(x, y, w, h);
  };

  // High-Resolution 1080x1920 Neo-Brutalist Canvas Generator
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

      // 1. Background Fill (Off-white Brutal Canvas)
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, 1080, 1920);

      // Subtle brutal dot grid
      ctx.fillStyle = '#CBD5E1';
      for (let x = 30; x < 1080; x += 40) {
        for (let y = 30; y < 1920; y += 40) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Top Header Bar
      const topBarX = 54;
      const topBarY = 50;
      const topBarW = 972;
      const topBarH = 76;

      drawBrutalBox(ctx, topBarX, topBarY, topBarW, topBarH, '#0F172A', true, 6);

      ctx.font = '900 24px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('OMNIPSYCHE // UNIFIED PSYCHOMETRIC GRAPH', topBarX + 24, topBarY + 48);

      // Verified Pill on Right
      const pillW = 190;
      const pillH = 50;
      const pillX = topBarX + topBarW - pillW - 14;
      const pillY = topBarY + 13;
      drawBrutalBox(ctx, pillX, pillY, pillW, pillH, '#FFE600', false, 0, '#0F172A', 3);
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 20px monospace';
      ctx.fillText('★ VERIFIED', pillX + 28, pillY + 33);

      // 3. Main Story Card Container (White Brutalist Frame)
      const cardX = 54;
      const cardY = 150;
      const cardW = 972;
      const cardH = 1680;

      drawBrutalBox(ctx, cardX, cardY, cardW, cardH, '#FFFFFF', true, 12, '#0F172A', 6);

      // 4. House & Code Banner
      const houseH = 110;
      drawBrutalBox(ctx, cardX, cardY, cardW, houseH, '#0F172A', false, 0, '#0F172A', 6);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 32px monospace';
      ctx.fillText(`HOUSE // ${archetype.house.toUpperCase()}`, cardX + 32, cardY + 68);

      // Archetype Code Pill on Right
      const fullCode = `${archetype.code}-${vector.identityVariant.substring(0, 1).toUpperCase()}`;
      const codePillW = 240;
      const codePillH = 68;
      const codePillX = cardX + cardW - codePillW - 24;
      const codePillY = cardY + 21;

      drawBrutalBox(ctx, codePillX, codePillY, codePillW, codePillH, '#FFE600', false, 0, '#0F172A', 4);
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 34px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(fullCode, codePillX + codePillW / 2, codePillY + 46);
      ctx.textAlign = 'left';

      // 5. Hero Archetype Title & Moniker
      const heroY = cardY + houseH + 40;

      ctx.font = '900 62px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(archetype.name.toUpperCase(), cardX + 36, heroY + 48);

      ctx.font = '900 28px monospace';
      ctx.fillStyle = '#4F46E5';
      ctx.fillText(`"${archetype.title.toUpperCase()}"`, cardX + 36, heroY + 92);

      // 6. HEXACO 6-Axis Spider Graph Box
      const radarBoxY = heroY + 120;
      const radarBoxW = cardW - 72;
      const radarBoxH = 460;
      const radarBoxX = cardX + 36;

      drawBrutalBox(ctx, radarBoxX, radarBoxY, radarBoxW, radarBoxH, '#F8FAFC', true, 6, '#0F172A', 4);

      // Header Tag inside Radar Box
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 22px monospace';
      ctx.fillText('HEXACO PI-R PSYCHOMETRIC SPECTRUM', radarBoxX + 28, radarBoxY + 42);
      ctx.fillStyle = '#64748B';
      ctx.font = '700 16px monospace';
      ctx.fillText('(6-AXIS RADAR METRICS)', radarBoxX + 28, radarBoxY + 68);

      // Large Radar Geometry
      const radarCenterX = radarBoxX + 340;
      const radarCenterY = radarBoxY + 260;
      const radarRadius = 155;

      // Draw Rings
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
        ctx.strokeStyle = ringPct === 1.0 ? '#0F172A' : '#CBD5E1';
        ctx.lineWidth = ringPct === 1.0 ? 3 : 1.5;
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
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw Trait Polygon
      ctx.beginPath();
      hexacoData.forEach((trait, i) => {
        const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
        const normalized = Math.max(0.2, trait.val / 100);
        const px = radarCenterX + radarRadius * normalized * Math.cos(angle);
        const py = radarCenterY + radarRadius * normalized * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 230, 0, 0.45)';
      ctx.fill();
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw Trait Data Point Circles & Labels
      hexacoData.forEach((trait, i) => {
        const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
        const normalized = Math.max(0.2, trait.val / 100);
        const px = radarCenterX + radarRadius * normalized * Math.cos(angle);
        const py = radarCenterY + radarRadius * normalized * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE600';
        ctx.fill();
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 3;
        ctx.stroke();

        const labelDist = radarRadius + 34;
        const lx = radarCenterX + labelDist * Math.cos(angle);
        const ly = radarCenterY + labelDist * Math.sin(angle);

        ctx.font = '900 17px monospace';
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        ctx.fillText(`${trait.short}: ${trait.val}%`, lx, ly + 6);
      });
      ctx.textAlign = 'left';

      // Radar Side Legend
      const legendX = radarBoxX + radarBoxW - 270;
      const legendY = radarBoxY + 110;
      const legendRowH = 52;

      hexacoData.forEach((trait, idx) => {
        const rowY = legendY + idx * legendRowH;

        // Trait Badge
        drawBrutalBox(ctx, legendX, rowY, 32, 32, trait.color, false, 0, '#0F172A', 2);
        ctx.font = '900 14px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(trait.short, legendX + 16, rowY + 22);
        ctx.textAlign = 'left';

        // Trait Name & Value
        ctx.font = '800 17px monospace';
        ctx.fillStyle = '#0F172A';
        ctx.fillText(trait.label, legendX + 44, rowY + 22);
      });

      // 7. Key Psychometric Markers (4 Cards)
      const markersY = radarBoxY + radarBoxH + 24;
      const markerW = (radarBoxW - 20) / 2;
      const markerH = 110;

      const markers = [
        { 
          label: '⚡ EQ & STAMINA', 
          val: `${vector.traitEq.score}% EQ`, 
          sub: 'Emotional Agility',
          accentColor: '#FFE600'
        },
        { 
          label: '🛡️ ATTACHMENT STYLE', 
          val: vector.attachment.style, 
          sub: `Anx: ${vector.attachment.anxiety}% | Avoid: ${vector.attachment.avoidance}%`,
          accentColor: '#EF4444'
        },
        { 
          label: '🎯 RIASEC CODE', 
          val: `Holland: ${vector.riasec.hollandCode}`, 
          sub: safePrimaryDomain,
          accentColor: '#6366F1'
        },
        { 
          label: '💎 DUCKWORTH GRIT', 
          val: `${vector.grit.score} / 5.0`, 
          sub: 'Perseverance Baseline',
          accentColor: '#06B6D4'
        }
      ];

      markers.forEach((m, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const mx = radarBoxX + col * (markerW + 20);
        const my = markersY + row * (markerH + 16);

        drawBrutalBox(ctx, mx, my, markerW, markerH, '#FFFFFF', true, 5, '#0F172A', 3);

        // Colored Tab on left
        ctx.fillStyle = m.accentColor;
        ctx.fillRect(mx, my, 12, markerH);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0F172A';
        ctx.strokeRect(mx, my, 12, markerH);

        // Label
        ctx.font = '900 14px monospace';
        ctx.fillStyle = '#64748B';
        ctx.fillText(m.label, mx + 26, my + 30);

        // Value
        ctx.font = '900 24px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.fillText(m.val, mx + 26, my + 64);

        // Subtext
        ctx.font = '700 14px monospace';
        ctx.fillStyle = '#64748B';
        ctx.fillText(m.sub, mx + 26, my + 90);
      });

      // 8. Signature Advantage Banner
      const superY = markersY + (markerH * 2) + 32;
      const superW = radarBoxW;
      const superH = 114;

      drawBrutalBox(ctx, radarBoxX, superY, superW, superH, '#FFE600', true, 6, '#0F172A', 4);

      ctx.fillStyle = '#0F172A';
      ctx.font = '900 16px monospace';
      ctx.fillText('⚡ SIGNATURE STRATEGIC ADVANTAGE', radarBoxX + 28, superY + 36);

      ctx.font = '900 24px system-ui, -apple-system, sans-serif';
      const advantageText = `"${archetype.superpowers[0] || 'Uncompromising strategic discipline and vision'}"`;
      drawWrappedText(ctx, advantageText, radarBoxX + 28, superY + 74, superW - 60, 30, 2);

      // 9. Why Personality Type is Kickass Box
      const kickassY = superY + superH + 20;
      const kickassW = radarBoxW;
      const kickassH = 290;

      drawBrutalBox(ctx, radarBoxX, kickassY, kickassW, kickassH, '#0F172A', true, 6, '#0F172A', 4);

      ctx.fillStyle = '#FFE600';
      ctx.font = '900 20px monospace';
      ctx.fillText(`🔥 WHY ${archetype.code} IS ABSOLUTELY KICKASS:`, radarBoxX + 28, kickassY + 44);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 15px monospace';
      ctx.fillText(`// ${kickassInfo.tagline.toUpperCase()}`, radarBoxX + 28, kickassY + 74);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '500 20px system-ui, -apple-system, sans-serif';
      drawWrappedText(ctx, kickassInfo.description, radarBoxX + 28, kickassY + 118, kickassW - 56, 32, 4);

      // 10. Footer Motto
      const footerY = cardY + cardH + 42;
      ctx.font = '900 18px monospace';
      ctx.fillStyle = '#0F172A';
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
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl max-h-[96vh] brutal-border brutal-shadow-2xl flex flex-col overflow-hidden text-[#0F172A]">
        {/* Brutalist Header Bar */}
        <div className="p-3 sm:p-4 bg-white border-b-2 border-[#0F172A] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FFE600] text-[#0F172A] brutal-border flex items-center justify-center font-display font-black text-base shrink-0">
              <Instagram size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="brutal-badge bg-[#0F172A] text-[#FFE600] text-[10px] font-mono font-bold">
                  INSTAGRAM STORY STUDIO // 9:16 HD
                </span>
                <span className="hidden sm:inline font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 brutal-border">
                  1080 × 1920 CANVAS
                </span>
              </div>
              <h2 className="font-display font-black text-base sm:text-xl text-[#0F172A] tracking-tight uppercase">
                Story Card Generator
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 bg-white hover:bg-slate-100 brutal-border text-[#0F172A] transition-colors shrink-0"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Layout (Live 9:16 Preview + Direct Actions) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#FDFBF7]">
          {/* Left Column: Direct Export Actions & Details */}
          <div className="md:col-span-5 space-y-4 font-mono text-xs order-2 md:order-1">
            <div className="bg-white p-4 brutal-border brutal-shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                <span className="font-display font-black text-sm text-[#0F172A] flex items-center gap-1.5 uppercase">
                  <Sparkles size={16} className="text-amber-500" />
                  9:16 STORY READY
                </span>
                <span className="bg-[#FFE600] px-2 py-0.5 brutal-border text-[10px] font-black text-[#0F172A]">
                  1080×1920 HD
                </span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed font-mono">
                High-resolution story card formatted with your 6-axis psychometric spider graph, trait legend, 4 key cognitive markers, and custom personality hype.
              </p>

              <div className="p-2.5 bg-indigo-50 brutal-border border-indigo-200 text-[11px] text-indigo-950 space-y-1">
                <span className="font-black block uppercase">INCLUDED IN STORY GRAPH:</span>
                <ul className="space-y-0.5 list-disc list-inside">
                  <li>6-Axis HEXACO Radar Spectrum</li>
                  <li>Emotional Agility (EQ) & Duckworth Grit</li>
                  <li>ECR-R Attachment & Holland RIASEC</li>
                  <li>Custom Personality Hype Analysis</li>
                </ul>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleDownloadStory}
                disabled={isExporting}
                className="w-full brutal-btn bg-[#FFE600] text-[#0F172A] py-3.5 px-4 font-mono font-black text-xs flex items-center justify-center gap-2 brutal-shadow hover:-translate-y-0.5 transition-transform min-h-[48px]"
              >
                <Download size={18} />
                <span>{isExporting ? 'RENDERING 1080×1920 HD...' : 'DOWNLOAD STORY PNG'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleNativeShare}
                  disabled={isExporting}
                  className="brutal-btn bg-[#0F172A] text-white py-2.5 px-3 font-mono text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <Share2 size={15} />
                  <span>SHARE</span>
                </button>

                <button
                  onClick={handleCopyImage}
                  disabled={isExporting}
                  className="brutal-btn bg-white hover:bg-slate-100 text-[#0F172A] py-2.5 px-3 font-mono text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                  <span>{copied ? 'COPIED!' : 'COPY IMAGE'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Scaled 9:16 Preview Card */}
          <div className="md:col-span-7 flex justify-center py-2 order-1 md:order-2">
            <div
              className="w-[310px] sm:w-[350px] aspect-[9/16] bg-[#0F172A] text-[#0F172A] brutal-border brutal-shadow-xl relative overflow-hidden flex flex-col justify-between p-2.5 sm:p-3 select-none"
            >
              {/* Top Story Header Pill */}
              <div 
                className="relative z-10 px-2 py-1 bg-white brutal-border flex items-center justify-between"
              >
                <span className="text-[7.5px] font-mono font-black text-[#0F172A] tracking-tight">
                  OMNIPSYCHE // UNIFIED PSYCHOMETRIC GRAPH
                </span>
                <span 
                  className="px-1.5 py-0.5 text-[7px] font-mono font-black bg-[#FFE600] text-[#0F172A] brutal-border"
                >
                  ★ VERIFIED
                </span>
              </div>

              {/* Main White Card Shell */}
              <div className="relative z-10 bg-white brutal-border brutal-shadow my-1 flex-1 flex flex-col justify-between overflow-hidden p-2 space-y-1.5">
                {/* House & Typology Header Bar */}
                <div 
                  className="px-2.5 py-1.5 flex items-center justify-between text-white brutal-border bg-[#0F172A]"
                >
                  <div className="flex items-center gap-1.5">
                    <Compass size={12} className="text-[#FFE600]" />
                    <span className="text-[8px] font-mono font-black tracking-wider text-white">
                      HOUSE // {archetype.house.toUpperCase()}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 bg-[#FFE600] text-[#0F172A] text-[9px] font-mono font-black brutal-border">
                    {archetype.code}-{vector.identityVariant.substring(0, 1).toUpperCase()}
                  </span>
                </div>

                {/* Hero Title & Crest Row */}
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="font-display font-black text-base leading-tight text-[#0F172A] uppercase">
                      {archetype.name}
                    </h3>
                    <p className="text-[9px] font-mono font-bold text-indigo-700">
                      "{archetype.title}"
                    </p>
                  </div>

                  <div className="w-8 h-8 bg-[#FFE600] brutal-border flex items-center justify-center font-black text-xs text-[#0F172A]">
                    Ψ
                  </div>
                </div>

                {/* SPIDER GRAPH SECTION WITH SIDE LEGEND */}
                <div className="p-2 bg-[#F8FAFC] brutal-border">
                  <div className="flex items-center justify-between text-[7.5px] font-mono font-black text-slate-700 pb-1">
                    <div>
                      <span>HEXACO PI-R PSYCHOMETRIC SPECTRUM</span>
                      <span className="block text-[6.5px] text-slate-500 font-bold">(6-AXIS RADAR)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    {/* SVG Radar Chart */}
                    <div className="flex-1 flex justify-center py-1">
                      <svg viewBox="0 0 200 180" className="w-[155px] h-[130px] overflow-visible">
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
                              stroke={ring === 1.0 ? '#0F172A' : '#CBD5E1'}
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
                              stroke="#CBD5E1"
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
                          fill="rgba(255, 230, 0, 0.45)"
                          stroke="#0F172A"
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

                    {/* Side Legend */}
                    <div className="w-[85px] space-y-1 text-[6.5px] font-mono font-bold text-slate-700 shrink-0">
                      {hexacoData.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span 
                            className="w-3.5 h-3.5 brutal-border flex items-center justify-center text-[5.5px] font-black text-white shrink-0 font-mono"
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
                  <div className="p-1.5 bg-white brutal-border border-l-4 border-l-[#FFE600]">
                    <span className="text-slate-500 block font-bold text-[6px]">⚡ EQ & STAMINA</span>
                    <span className="font-black text-[9px] text-[#0F172A] block">{vector.traitEq.score}% EQ</span>
                    <span className="text-[6.5px] text-slate-600 block">Emotional Agility</span>
                  </div>

                  {/* Attachment */}
                  <div className="p-1.5 bg-white brutal-border border-l-4 border-l-[#EF4444]">
                    <span className="text-slate-500 block font-bold text-[6px]">🛡️ ATTACHMENT</span>
                    <span className="font-black text-[9px] text-[#0F172A] block truncate">{vector.attachment.style}</span>
                    <span className="text-[6px] text-slate-600 block truncate">Anx: {vector.attachment.anxiety}% | Avoid: {vector.attachment.avoidance}%</span>
                  </div>

                  {/* RIASEC */}
                  <div className="p-1.5 bg-white brutal-border border-l-4 border-l-[#6366F1]">
                    <span className="text-slate-500 block font-bold text-[6px]">🎯 RIASEC CODE</span>
                    <span className="font-black text-[9px] text-[#0F172A] block">Holland: {vector.riasec.hollandCode}</span>
                    <span className="text-[6.5px] text-slate-600 block truncate">{safePrimaryDomain}</span>
                  </div>

                  {/* Grit */}
                  <div className="p-1.5 bg-white brutal-border border-l-4 border-l-[#06B6D4]">
                    <span className="text-slate-500 block font-bold text-[6px]">💎 DUCKWORTH GRIT</span>
                    <span className="font-black text-[9px] text-[#0F172A] block">{vector.grit.score} / 5.0</span>
                    <span className="text-[6.5px] text-slate-600 block">Perseverance Baseline</span>
                  </div>
                </div>

                {/* SIGNATURE ADVANTAGE BANNER */}
                <div 
                  className="p-2 bg-[#FFE600] brutal-border text-[#0F172A] relative overflow-hidden"
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
                <div className="p-2 bg-[#0F172A] text-white brutal-border space-y-0.5">
                  <div className="text-[#FFE600] font-mono font-black text-[7px] flex items-center justify-between">
                    <span>🔥 WHY {archetype.code} IS ABSOLUTELY KICKASS:</span>
                  </div>
                  <span className="text-[6px] font-mono text-slate-400 font-bold block">
                    // {kickassInfo.tagline.toUpperCase()}
                  </span>
                  <p className="line-clamp-3 text-slate-200 font-mono text-[6.5px] leading-relaxed pt-0.5">
                    {kickassInfo.description}
                  </p>
                </div>
              </div>

              {/* Story Motto Footer */}
              <div className="relative z-10 text-center text-[7px] font-mono font-black text-[#FFE600] bg-[#0F172A] py-0.5">
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

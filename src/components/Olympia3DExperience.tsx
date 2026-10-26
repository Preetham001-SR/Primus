"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  x: number; // 3D coordinates in scene space
  y: number;
  z: number;
  description: string;
  features: string[];
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "clubhouse",
    title: "Central Clubhouse & Dining Lounge",
    subtitle: "Heart of Social Life & Hospitality",
    tag: "Hospitality",
    x: 0,
    y: 35,
    z: 20,
    description: "Multi-level social center featuring a fine-dining restaurant with geriatric-curated nutrition, library, indoor games, and a temperature-controlled hydrotherapy pool.",
    features: [
      "Nutritious chef-prepared dining",
      "Library & reading lounge",
      "Hydrotherapy & indoor heated pool",
      "Cultural amphitheater"
    ]
  },
  {
    id: "residences",
    title: "Wing A: 1 & 2 BHK Senior Residences",
    subtitle: "Ergonomically Crafted Homes",
    tag: "Architecture",
    x: -85,
    y: 60,
    z: -30,
    description: "Intelligently designed elder-friendly apartments featuring zero-threshold floors, arthritis-friendly lever handles, motion-sensor night lights, and emergency pull-cords in every room.",
    features: [
      "Zero-threshold non-slip flooring",
      "Wide doorways (wheelchair ready)",
      "Emergency panic pull-cords",
      "Spacious sunlit balconies"
    ]
  },
  {
    id: "medical",
    title: "24x7 Healthcare & Emergency Hub",
    subtitle: "Proactive Medical Care",
    tag: "Healthcare",
    x: 95,
    y: 30,
    z: -20,
    description: "Fully equipped on-site medical facility with full-time geriatric nurses, 24x7 on-call physicians, ICU ambulance tie-up, and telemedicine consultation suites.",
    features: [
      "24x7 emergency response system",
      "On-site geriatric nurses & doctor",
      "Electronic health records tracking",
      "Physiotherapy & rehabilitation gym"
    ]
  },
  {
    id: "promenade",
    title: "Ayurvedic Garden & Walking Promenade",
    subtitle: "Outdoor Wellness & Nature",
    tag: "Wellness",
    x: -20,
    y: 10,
    z: 85,
    description: "Gentle, slip-resistant walking circuits with shaded pergolas, resting benches every 30 meters, reflexology gravel paths, and therapeutic herbal gardens.",
    features: [
      "Continuous handrails & resting alcoves",
      "Acupressure reflexology pathway",
      "Fragrant sensory floral gardens",
      "Morning yoga & meditation deck"
    ]
  }
];

type LightingMode = "golden" | "day" | "twilight";

interface ProjectedHotspot {
  id: string;
  x: number;
  y: number;
  radius: number;
  spot: Hotspot;
}

export default function Olympia3DExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(20);
  const [lighting, setLighting] = useState<LightingMode>("golden");
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [activePreset, setActivePreset] = useState<string>("overview");
  const [isInteracting, setIsInteracting] = useState(false);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);

  // Rotation angles (radians) & camera states
  const rotationRef = useRef({ rotX: 0.38, rotY: 0.72 });
  const targetRotationRef = useRef({ rotX: 0.38, rotY: 0.72 });
  const zoomRef = useRef(1.0);
  const targetZoomRef = useRef(1.0);
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const startPosRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);
  const projectedHotspotsRef = useRef<ProjectedHotspot[]>([]);

  // Simulated 3D assets loading
  useEffect(() => {
    const timer1 = setTimeout(() => setLoadProgress(55), 250);
    const timer2 = setTimeout(() => setLoadProgress(85), 550);
    const timer3 = setTimeout(() => {
      setLoadProgress(100);
      setLoading(false);
    }, 850);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Camera presets
  const applyPreset = useCallback((preset: string) => {
    setActivePreset(preset);
    if (preset === "overview") {
      targetRotationRef.current = { rotX: 0.38, rotY: 0.72 };
      targetZoomRef.current = 1.0;
      setSelectedHotspot(null);
    } else if (preset === "clubhouse") {
      targetRotationRef.current = { rotX: 0.32, rotY: 0.15 };
      targetZoomRef.current = 1.35;
      setSelectedHotspot(HOTSPOTS.find((h) => h.id === "clubhouse") || null);
    } else if (preset === "residences") {
      targetRotationRef.current = { rotX: 0.42, rotY: 1.25 };
      targetZoomRef.current = 1.3;
      setSelectedHotspot(HOTSPOTS.find((h) => h.id === "residences") || null);
    } else if (preset === "promenade") {
      targetRotationRef.current = { rotX: 0.28, rotY: -0.45 };
      targetZoomRef.current = 1.25;
      setSelectedHotspot(HOTSPOTS.find((h) => h.id === "promenade") || null);
    }
  }, []);

  // WebGL / High-DPI Canvas 3D rendering pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || 900;
    let height = canvas.parentElement?.clientHeight || 540;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // 3D perspective projection
    const project = (x: number, y: number, z: number, rx: number, ry: number, zoom: number) => {
      // Y-axis rotation
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // X-axis rotation
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      // Camera distance and perspective factor
      const fov = 480 * zoom;
      const distance = 420;
      const factor = fov / (distance + z2);

      return {
        screenX: width / 2 + x1 * factor,
        screenY: height / 2 - y2 * factor + 35,
        depth: z2,
        scale: factor
      };
    };

    // Stored stars for Twilight mode
    const stars = Array.from({ length: 40 }).map((_, i) => ({
      x: (i * 37) % 900,
      y: (i * 19) % 200,
      r: (i % 3) * 0.6 + 0.6,
      opacity: (i % 5) * 0.15 + 0.3
    }));

    // Render loop
    let tick = 0;
    const render = () => {
      tick += 0.015;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Smooth camera interpolation
      const damping = 0.09;
      rotationRef.current.rotX += (targetRotationRef.current.rotX - rotationRef.current.rotX) * damping;
      rotationRef.current.rotY += (targetRotationRef.current.rotY - rotationRef.current.rotY) * damping;
      zoomRef.current += (targetZoomRef.current - zoomRef.current) * damping;

      const rx = rotationRef.current.rotX;
      const ry = rotationRef.current.rotY;
      const zoom = zoomRef.current;

      ctx.clearRect(0, 0, width, height);

      // Sky Gradient
      const isNight = lighting === "twilight";
      const isGold = lighting === "golden";

      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      if (isGold) {
        skyGradient.addColorStop(0, "#f8eedf");
        skyGradient.addColorStop(0.35, "#fdf6ed");
        skyGradient.addColorStop(0.75, "#fbf9f6");
        skyGradient.addColorStop(1, "#f4ece1");
      } else if (lighting === "day") {
        skyGradient.addColorStop(0, "#e3f0fb");
        skyGradient.addColorStop(0.5, "#f1f7fc");
        skyGradient.addColorStop(1, "#faf8f5");
      } else {
        skyGradient.addColorStop(0, "#161928");
        skyGradient.addColorStop(0.5, "#251c30");
        skyGradient.addColorStop(1, "#17141b");
      }
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw stars in Twilight mode
      if (isNight) {
        stars.forEach((s) => {
          const starX = (s.x / 900) * width;
          const starY = (s.y / 200) * (height * 0.45);
          ctx.beginPath();
          ctx.arc(starX, starY, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 235, 200, ${s.opacity})`;
          ctx.fill();
        });
      }

      // Ground plane grid (Landscaped campus)
      const groundSize = 260;
      const groundCorners = [
        project(-groundSize, -15, -groundSize, rx, ry, zoom),
        project(groundSize, -15, -groundSize, rx, ry, zoom),
        project(groundSize, -15, groundSize, rx, ry, zoom),
        project(-groundSize, -15, groundSize, rx, ry, zoom)
      ];

      ctx.beginPath();
      ctx.moveTo(groundCorners[0].screenX, groundCorners[0].screenY);
      for (let i = 1; i < groundCorners.length; i++) {
        ctx.lineTo(groundCorners[i].screenX, groundCorners[i].screenY);
      }
      ctx.closePath();

      const groundColor = isNight ? "#212724" : isGold ? "#dde7db" : "#d7e6d5";
      ctx.fillStyle = groundColor;
      ctx.fill();
      ctx.strokeStyle = isNight ? "rgba(197, 168, 128, 0.25)" : "rgba(130, 26, 82, 0.18)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Reflexology / Water pool feature
      const waterCenter = project(35, -14, 40, rx, ry, zoom);
      ctx.beginPath();
      ctx.ellipse(
        waterCenter.screenX,
        waterCenter.screenY,
        72 * waterCenter.scale,
        36 * waterCenter.scale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = isNight ? "#192e3a" : "#cce4eb";
      ctx.fill();
      ctx.strokeStyle = isNight ? "#2e5264" : "#89b9c6";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Architectural blocks (3D Buildings)
      interface Block {
        x: number;
        y: number;
        z: number;
        w: number;
        h: number;
        d: number;
        color: string;
        roofColor: string;
        accentColor: string;
      }

      const blocks: Block[] = [
        // Central Clubhouse (Wing Hub)
        {
          x: 0,
          y: -15,
          z: 15,
          w: 80,
          h: 48,
          d: 65,
          color: isNight ? "#2a2736" : "#f6ede4",
          roofColor: isNight ? "#421c2e" : "#821a52",
          accentColor: isNight ? "#ffd699" : "#c5a880"
        },
        // Residential Tower Wing A
        {
          x: -95,
          y: -15,
          z: -25,
          w: 70,
          h: 92,
          d: 60,
          color: isNight ? "#242531" : "#faf7f0",
          roofColor: isNight ? "#381c2f" : "#681340",
          accentColor: isNight ? "#ffe0aa" : "#821a52"
        },
        // Residential Tower Wing B
        {
          x: -125,
          y: -15,
          z: 50,
          w: 60,
          h: 76,
          d: 55,
          color: isNight ? "#23242e" : "#fbf8f3",
          roofColor: isNight ? "#351a2d" : "#7c1c5f",
          accentColor: isNight ? "#ffebbb" : "#821a52"
        },
        // Healthcare & Emergency Wing
        {
          x: 95,
          y: -15,
          z: -20,
          w: 65,
          h: 50,
          d: 55,
          color: isNight ? "#252b33" : "#eff5f7",
          roofColor: isNight ? "#1f4a47" : "#2f6f5e",
          accentColor: isNight ? "#8be9db" : "#2f6f5e"
        },
        // Garden Pergola
        {
          x: 20,
          y: -15,
          z: 95,
          w: 40,
          h: 22,
          d: 40,
          color: isNight ? "#382e2c" : "#e6ded3",
          roofColor: isNight ? "#705336" : "#c5a880",
          accentColor: isNight ? "#ffd9aa" : "#9e7f53"
        }
      ];

      // Sort blocks back-to-front by projected depth
      const sortedBlocks = blocks
        .map((b) => {
          const centerProj = project(b.x, b.y + b.h / 2, b.z, rx, ry, zoom);
          return { block: b, depth: centerProj.depth };
        })
        .sort((a, b) => b.depth - a.depth);

      sortedBlocks.forEach(({ block }) => {
        const { x, y, z, w, h, d, color, roofColor, accentColor } = block;
        const hw = w / 2;
        const hd = d / 2;

        const v = [
          project(x - hw, y, z - hd, rx, ry, zoom), // 0: bottom front-left
          project(x + hw, y, z - hd, rx, ry, zoom), // 1: bottom front-right
          project(x + hw, y, z + hd, rx, ry, zoom), // 2: bottom back-right
          project(x - hw, y, z + hd, rx, ry, zoom), // 3: bottom back-left
          project(x - hw, y + h, z - hd, rx, ry, zoom), // 4: top front-left
          project(x + hw, y + h, z - hd, rx, ry, zoom), // 5: top front-right
          project(x + hw, y + h, z + hd, rx, ry, zoom), // 6: top back-right
          project(x - hw, y + h, z + hd, rx, ry, zoom) // 7: top back-left
        ];

        const drawQuad = (p1: any, p2: any, p3: any, p4: any, fill: string, stroke = "rgba(0,0,0,0.06)") => {
          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.lineTo(p2.screenX, p2.screenY);
          ctx.lineTo(p3.screenX, p3.screenY);
          ctx.lineTo(p4.screenX, p4.screenY);
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 1;
          ctx.stroke();
        };

        // Draw side walls
        drawQuad(v[0], v[1], v[5], v[4], color);
        drawQuad(v[1], v[2], v[6], v[5], isNight ? "#1c1c24" : "#e6e0d5");
        drawQuad(v[3], v[0], v[4], v[7], isNight ? "#2b2a38" : "#f1ece2");

        // Roof
        drawQuad(v[4], v[5], v[6], v[7], roofColor, "rgba(255,255,255,0.25)");

        // Windows / Architectural Balconies
        const windowFloors = Math.floor(h / 14);
        for (let fl = 1; fl < windowFloors; fl++) {
          const flY = y + fl * 14;
          const leftP = project(x - hw * 0.82, flY, z - hd - 1, rx, ry, zoom);
          const rightP = project(x + hw * 0.82, flY, z - hd - 1, rx, ry, zoom);

          ctx.beginPath();
          ctx.moveTo(leftP.screenX, leftP.screenY);
          ctx.lineTo(rightP.screenX, rightP.screenY);
          ctx.strokeStyle = isNight ? accentColor : "rgba(130, 26, 82, 0.4)";
          ctx.lineWidth = isNight ? 2.5 : 1.5;
          ctx.stroke();

          if (isNight) {
            ctx.shadowColor = accentColor;
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Landscaped Trees & Palm Silhouettes
      const trees = [
        { x: -50, z: -10, r: 13 },
        { x: -35, z: 45, r: 15 },
        { x: 45, z: -40, r: 14 },
        { x: 65, z: 60, r: 16 },
        { x: -70, z: 95, r: 13 },
        { x: 110, z: 35, r: 12 }
      ];

      trees.forEach((t) => {
        const tp = project(t.x, -15, t.z, rx, ry, zoom);
        const topP = project(t.x, 8, t.z, rx, ry, zoom);

        ctx.beginPath();
        ctx.moveTo(tp.screenX, tp.screenY);
        ctx.lineTo(topP.screenX, topP.screenY);
        ctx.strokeStyle = isNight ? "#2f221a" : "#7d5d42";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(topP.screenX, topP.screenY, t.r * tp.scale, 0, Math.PI * 2);
        ctx.fillStyle = isNight ? "#1b2c21" : "#5b8a69";
        ctx.fill();
        ctx.strokeStyle = isNight ? "#2c4835" : "#42674e";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Project & Render 3D Interactive Hotspot Pins
      const currentProjectedHotspots: ProjectedHotspot[] = [];

      HOTSPOTS.forEach((spot) => {
        const p = project(spot.x, spot.y, spot.z, rx, ry, zoom);
        const isSelected = selectedHotspot?.id === spot.id;
        const isHovered = hoveredHotspotId === spot.id;

        currentProjectedHotspots.push({
          id: spot.id,
          x: p.screenX,
          y: p.screenY,
          radius: 26,
          spot
        });

        // Pulsing glow
        const pulse = (Math.sin(tick * 3 + spot.x) + 1) / 2;
        const radius = isSelected ? 12 : isHovered ? 11 : 9;

        // Hotspot Stem line down to ground
        const groundPin = project(spot.x, -14, spot.z, rx, ry, zoom);
        ctx.beginPath();
        ctx.setLineDash([2, 3]);
        ctx.moveTo(p.screenX, p.screenY);
        ctx.lineTo(groundPin.screenX, groundPin.screenY);
        ctx.strokeStyle = isSelected ? "#821a52" : "rgba(130, 26, 82, 0.4)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.setLineDash([]);

        // Ground anchor dot
        ctx.beginPath();
        ctx.arc(groundPin.screenX, groundPin.screenY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#821a52";
        ctx.fill();

        // Pulsing outer halo
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, radius + pulse * 7, 0, Math.PI * 2);
        ctx.fillStyle = isSelected
          ? "rgba(130, 26, 82, 0.3)"
          : isHovered
          ? "rgba(197, 168, 128, 0.4)"
          : "rgba(197, 168, 128, 0.2)";
        ctx.fill();

        // Main pin circle
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#821a52" : isHovered ? "#fbf2f7" : "#ffffff";
        ctx.fill();
        ctx.strokeStyle = isSelected ? "#c5a880" : "#821a52";
        ctx.lineWidth = isSelected ? 3 : 2.2;
        ctx.stroke();

        // Inner marker dot
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#ffffff" : "#821a52";
        ctx.fill();

        // Floating label pill above pin
        ctx.font = "bold 11px Montserrat, sans-serif";
        const tagText = spot.tag;
        const tagWidth = ctx.measureText(tagText).width + 14;

        ctx.fillStyle = isSelected
          ? "#821a52"
          : isHovered
          ? "#681340"
          : "rgba(255, 255, 255, 0.95)";
        ctx.strokeStyle = isSelected ? "#c5a880" : "#e8e1d7";
        ctx.lineWidth = 1;
        const tagX = p.screenX - tagWidth / 2;
        const tagY = p.screenY - 26;

        ctx.beginPath();
        ctx.roundRect(tagX, tagY, tagWidth, 19, 9);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSelected || isHovered ? "#ffffff" : "#821a52";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tagText, p.screenX, tagY + 9.5);
      });

      projectedHotspotsRef.current = currentProjectedHotspots;
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [lighting, selectedHotspot, hoveredHotspotId]);

  // Pointer & Touch handlers with Raycast Hit-Testing
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    setIsInteracting(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;
      dragDistanceRef.current += Math.hypot(deltaX, deltaY);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      targetRotationRef.current.rotY += deltaX * 0.008;
      targetRotationRef.current.rotX = Math.max(
        0.15,
        Math.min(0.75, targetRotationRef.current.rotX + deltaY * 0.005)
      );
    } else {
      // Hover detection on pins
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const hovered = projectedHotspotsRef.current.find(
        (h) => Math.hypot(h.x - mouseX, h.y - mouseY) <= h.radius
      );
      setHoveredHotspotId(hovered ? hovered.id : null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const wasDragging = dragDistanceRef.current > 5;
    isDraggingRef.current = false;
    setIsInteracting(false);

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if already released
    }

    // If it was a clean click/tap on a hotspot pin
    if (!wasDragging) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const clicked = projectedHotspotsRef.current.find(
        (h) => Math.hypot(h.x - clickX, h.y - clickY) <= h.radius + 6
      );

      if (clicked) {
        setSelectedHotspot(clicked.spot);
        if (clicked.id === "clubhouse") {
          targetRotationRef.current = { rotX: 0.32, rotY: 0.15 };
          targetZoomRef.current = 1.35;
          setActivePreset("clubhouse");
        } else if (clicked.id === "residences") {
          targetRotationRef.current = { rotX: 0.42, rotY: 1.25 };
          targetZoomRef.current = 1.3;
          setActivePreset("residences");
        } else if (clicked.id === "medical") {
          targetRotationRef.current = { rotX: 0.35, rotY: 0.55 };
          targetZoomRef.current = 1.3;
          setActivePreset("");
        } else if (clicked.id === "promenade") {
          targetRotationRef.current = { rotX: 0.28, rotY: -0.45 };
          targetZoomRef.current = 1.25;
          setActivePreset("promenade");
        }
      }
    }
  };

  // Zoom controls
  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in") {
      targetZoomRef.current = Math.min(1.8, targetZoomRef.current + 0.2);
    } else {
      targetZoomRef.current = Math.max(0.75, targetZoomRef.current - 0.2);
    }
  };

  return (
    <div
      ref={containerRef}
      className="olympia-3d-experience"
      id="experience-3d"
      aria-label="Interactive 3D Architectural Campus Model of Primus Olympia"
    >
      {/* 3D Header Bar */}
      <div className="experience-topbar">
        <div className="experience-title">
          <span className="live-badge">
            <span className="live-dot" /> 3D VIRTUAL CAMPUS
          </span>
          <h3>Explore Primus Olympia</h3>
          <p className="experience-sub">Drag to rotate 360° · Click any pin on the campus to inspect amenities</p>
        </div>

        {/* Lighting controls (Time of day) */}
        <div className="lighting-toggle" role="radiogroup" aria-label="Lighting atmosphere">
          <button
            type="button"
            className={`lighting-btn ${lighting === "golden" ? "active" : ""}`}
            onClick={() => setLighting("golden")}
            aria-pressed={lighting === "golden"}
            title="Golden Hour Sunset"
          >
            🌅 Golden Hour
          </button>
          <button
            type="button"
            className={`lighting-btn ${lighting === "day" ? "active" : ""}`}
            onClick={() => setLighting("day")}
            aria-pressed={lighting === "day"}
            title="Daylight Brilliance"
          >
            ☀️ Daylight
          </button>
          <button
            type="button"
            className={`lighting-btn ${lighting === "twilight" ? "active" : ""}`}
            onClick={() => setLighting("twilight")}
            aria-pressed={lighting === "twilight"}
            title="Twilight Starlight"
          >
            🌙 Twilight
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Container */}
      <div className="canvas-wrapper">
        {loading && (
          <div className="canvas-loader" role="status" aria-live="polite">
            <div className="loader-spinner" />
            <span className="loader-text">Loading 3D Architectural Model…</span>
            <div className="loader-bar">
              <div className="loader-fill" style={{ width: `${loadProgress}%` }} />
            </div>
            <span className="loader-pct">{loadProgress}%</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`three-d-canvas ${isInteracting ? "dragging" : ""} ${hoveredHotspotId ? "hovering-pin" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          tabIndex={0}
          role="region"
          aria-label="3D model interactive viewport"
        />

        {/* Floating Zoom & Reset HUD */}
        <div className="viewport-hud">
          <button
            type="button"
            className="hud-btn"
            onClick={() => handleZoom("in")}
            aria-label="Zoom in on 3D view"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={() => handleZoom("out")}
            aria-label="Zoom out on 3D view"
            title="Zoom Out"
          >
            −
          </button>
          <button
            type="button"
            className="hud-btn hud-reset"
            onClick={() => applyPreset("overview")}
            aria-label="Reset camera orientation"
            title="Reset View"
          >
            ↺
          </button>
        </div>

        {/* Camera Preset Quick Pills */}
        <div className="camera-presets" role="tablist" aria-label="Camera viewpoints">
          <button
            type="button"
            className={`preset-pill ${activePreset === "overview" ? "active" : ""}`}
            onClick={() => applyPreset("overview")}
            role="tab"
            aria-selected={activePreset === "overview"}
          >
            Campus Overview
          </button>
          <button
            type="button"
            className={`preset-pill ${activePreset === "clubhouse" ? "active" : ""}`}
            onClick={() => applyPreset("clubhouse")}
            role="tab"
            aria-selected={activePreset === "clubhouse"}
          >
            Clubhouse & Dining
          </button>
          <button
            type="button"
            className={`preset-pill ${activePreset === "residences" ? "active" : ""}`}
            onClick={() => applyPreset("residences")}
            role="tab"
            aria-selected={activePreset === "residences"}
          >
            1 & 2 BHK Residences
          </button>
          <button
            type="button"
            className={`preset-pill ${activePreset === "promenade" ? "active" : ""}`}
            onClick={() => applyPreset("promenade")}
            role="tab"
            aria-selected={activePreset === "promenade"}
          >
            Healing Gardens
          </button>
        </div>
      </div>

      {/* Interactive Detail Drawer for Selected Hotspot */}
      {selectedHotspot && (
        <div className="hotspot-detail-card" role="region" aria-label={selectedHotspot.title}>
          <div className="hotspot-header">
            <span className="hotspot-tag">{selectedHotspot.tag}</span>
            <button
              type="button"
              className="hotspot-close"
              onClick={() => setSelectedHotspot(null)}
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
          <h4>{selectedHotspot.title}</h4>
          <p className="hotspot-sub">{selectedHotspot.subtitle}</p>
          <p className="hotspot-desc">{selectedHotspot.description}</p>
          <ul className="hotspot-features">
            {selectedHotspot.features.map((feat, idx) => (
              <li key={idx}>
                <span className="check-icon">✓</span> {feat}
              </li>
            ))}
          </ul>
          <a href="#booking" className="hotspot-cta">
            Book Site Visit to Experience This in Person →
          </a>
        </div>
      )}
    </div>
  );
}

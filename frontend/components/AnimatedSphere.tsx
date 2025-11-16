import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedSphereProps {
  voiceMode?: boolean;
  audioLevel?: number;
  size?: 'small' | 'medium' | 'large';
}

export const AnimatedSphere: React.FC<AnimatedSphereProps> = ({ 
  voiceMode = false, 
  audioLevel = 0,
  size = 'large'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ✅ These are now refs instead of states to avoid infinite re-renders
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0, z: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  // UI states (safe to re-render)
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Size configurations
  const sizeConfig = {
    small: { canvas: 200, radius: 70, particles: 30 },
    medium: { canvas: 400, radius: 100, particles: 40 },
    large: { canvas: 500, radius: 120, particles: 50 }
  };

  const config = sizeConfig[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = config.canvas * dpr;
    canvas.height = config.canvas * dpr;
    canvas.style.width = `${config.canvas}px`;
    canvas.style.height = `${config.canvas}px`;
    ctx.scale(dpr, dpr);

    // Neural node setup
    class NeuralNode {
      constructor(
        public x: number,
        public y: number,
        public z: number,
        public originalX = x,
        public originalY = y,
        public originalZ = z
      ) {}
    }

    const nodes: NeuralNode[] = [];
    const numNodes = 80;
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numNodes; i++) {
      const y = 1 - (i / (numNodes - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      nodes.push(new NeuralNode(x, y, z));
    }

    const connections: Array<[number, number]> = [];
    const maxDistance = 0.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance < maxDistance) connections.push([i, j]);
      }
    }

    let time = 0;
    const drawSphere = () => {
      ctx.clearRect(0, 0, config.canvas, config.canvas);

      const centerX = config.canvas / 2;
      const centerY = config.canvas / 2;
      const baseRadius = voiceMode ? config.radius + audioLevel * 30 : config.radius;

      const rotation = rotationRef.current;
      const target = targetRotationRef.current;
      const velocity = velocityRef.current;

      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (!isDragging && !voiceMode) {
        const friction = 0.95;
        velocity.x *= friction;
        velocity.y *= friction;
        target.x += velocity.x * deltaTime * 0.001;
        target.y += velocity.y * deltaTime * 0.001;
      }

      const lerpFactor = 0.1;
      rotation.x += (target.x - rotation.x) * lerpFactor;
      rotation.y += (target.y - rotation.y) * lerpFactor;

      // Calculate rotation values
      const rotX = rotation.x + Math.sin(time * 0.0005) * 0.05;
      const rotY = rotation.y + time * 0.0003;
      const rotZ = rotation.z;

      const projectedNodes = nodes.map((node, i) => {
        let { x, y, z } = node;

        // 3D rotations
        let tempX = x * Math.cos(rotZ) - y * Math.sin(rotZ);
        let tempY = x * Math.sin(rotZ) + y * Math.cos(rotZ);
        x = tempX; y = tempY;

        tempX = x * Math.cos(rotY) - z * Math.sin(rotY);
        let tempZ = x * Math.sin(rotY) + z * Math.cos(rotY);
        x = tempX; z = tempZ;

        tempY = y * Math.cos(rotX) - z * Math.sin(rotX);
        tempZ = y * Math.sin(rotX) + z * Math.cos(rotX);
        y = tempY; z = tempZ;

        const waveOffset = Math.sin(time * 0.002 + i * 0.1) * 0.05;
        const scale = Math.max(1, baseRadius * (1 + waveOffset));
        const safeAudio = Math.max(0, Math.min(1, audioLevel || 0));
        const audioReactivity = voiceMode ? Math.abs(Math.sin(time * 0.005 + i * 0.2)) * safeAudio * 0.3 : 0;

        return {
          x: centerX + x * scale,
          y: centerY + y * scale,
          z,
          depth: z,
          audioReactivity
        };
      });

      const sortedIndices = projectedNodes
        .map((_, i) => i)
        .sort((a, b) => projectedNodes[a].depth - projectedNodes[b].depth);

      const highlightIntensity = isHovering ? 1.3 : 1;

      // Connections
      connections.forEach(([i, j]) => {
        const n1 = projectedNodes[i], n2 = projectedNodes[j];
        if (n1.depth > -0.5 && n2.depth > -0.5) {
          const avgDepth = (n1.depth + n2.depth) / 2;
          const opacity = Math.max(0.1, (avgDepth + 1) * 0.3) * highlightIntensity;
          const hue = (time * 0.1 + i * 10) % 60 + 240;

          const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
          grad.addColorStop(0, `hsla(${hue}, 80%, 65%, ${opacity * 0.4})`);
          grad.addColorStop(0.5, `hsla(${hue + 20}, 75%, 60%, ${opacity * 0.6})`);
          grad.addColorStop(1, `hsla(${hue}, 80%, 65%, ${opacity * 0.4})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      sortedIndices.forEach(i => {
        const node = projectedNodes[i];
        const depth = node.depth;
        const baseSize = 3;
        const depthScale = Math.max(0.1, (depth + 1.5) / 2.5);
        const nodeSize = Math.max(1, baseSize * depthScale);
        const pulse = Math.max(1, nodeSize + node.audioReactivity * 3);
        const opacity = Math.max(0.3, depthScale);
        const hue = (time * 0.1 + depth * 50 + i * 5) % 60 + 240;

        const outerRadius = Math.max(1, pulse * 4 * highlightIntensity);
        const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, outerRadius);
        glowGrad.addColorStop(0, `hsla(${hue}, 85%, 70%, ${opacity * 0.6})`);
        glowGrad.addColorStop(0.6, `hsla(${hue}, 75%, 60%, ${opacity * 0.2})`);
        glowGrad.addColorStop(1, `hsla(${hue}, 70%, 55%, 0)`);

        ctx.globalAlpha = opacity;
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, outerRadius, 0, Math.PI * 2);
        ctx.fill();

        const coreRadius = Math.max(0.5, pulse);
        const coreGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, coreRadius);
        coreGrad.addColorStop(0, `hsla(${hue}, 100%, 95%, ${opacity})`);
        coreGrad.addColorStop(0.5, `hsla(${hue}, 90%, 75%, ${opacity * 0.8})`);
        coreGrad.addColorStop(1, `hsla(${hue}, 85%, 65%, ${opacity * 0.4})`);

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, coreRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      time++;
      animationFrameRef.current = requestAnimationFrame(drawSphere);
    };

    drawSphere();

    return () => cancelAnimationFrame(animationFrameRef.current!);
  }, [isDragging, isHovering, voiceMode, audioLevel, config]);

  // ✅ Handlers using refs
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (voiceMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    if (isDragging) {
      const deltaX = x - lastMousePos.x;
      const deltaY = y - lastMousePos.y;
      const sensitivity = 2.0;
      velocityRef.current.x = deltaY * sensitivity;
      velocityRef.current.y = deltaX * sensitivity;
      targetRotationRef.current.x += deltaY * sensitivity;
      targetRotationRef.current.y += deltaX * sensitivity;
      setLastMousePos({ x, y });
    } else {
      targetRotationRef.current = { x: -y * 0.5, y: x * 0.5, z: 0 };
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (voiceMode) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setLastMousePos({ x, y });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseEnter = () => !voiceMode && setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsDragging(false);
  };

  return (
    <motion.div
      className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{ width: config.canvas, height: config.canvas }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full opacity-40 blur-3xl"
          style={{
            width: `${config.canvas * 0.8}px`,
            height: `${config.canvas * 0.8}px`,
            background: 'radial-gradient(circle, rgba(123, 97, 255, 0.6), rgba(59, 130, 246, 0.4), rgba(219, 39, 119, 0.2), transparent)'
          }}
        />
      </div>

      <canvas ref={canvasRef} className="relative z-10" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="rounded-full"
          style={{
            width: `${config.canvas * 0.6}px`,
            height: `${config.canvas * 0.6}px`,
            background: 'radial-gradient(circle, rgba(123, 97, 255, 0.3), rgba(59, 130, 246, 0.15), transparent)',
            filter: 'blur(40px)'
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="rounded-full"
          style={{
            width: `${config.canvas * 0.7}px`,
            height: `${config.canvas * 0.7}px`,
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25), rgba(123, 97, 255, 0.1), transparent)',
            filter: 'blur(50px)'
          }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

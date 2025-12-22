import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'three/examples/jsm/utils/BufferGeometryUtils';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Terminal, Cpu, Network, Award, Code2, Zap, GitBranch, Database, BarChart3, Globe, Layers, ArrowUpRight, Users, Trophy, Settings, Gamepad2, Layout } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- HOOKS ---
const useScramble = (text, speed = 40) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < i) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (i >= text.length) clearInterval(interval);
      i += 1 / 2;
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayText;
};

// --- COMPONENTS ---

// 1. MAGNETIC CURSOR & OPACITY GLINT
const Magnetic = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const center = { x: left + width / 2, y: top + height / 2 };
    const distance = { x: e.clientX - center.x, y: e.clientY - center.y };

    // Magnetic pull strength
    x.set(distance.x * 0.2);
    y.set(distance.y * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn("relative transition-colors duration-300", className)}
    >
      {children}
    </motion.div>
  );
};

const GlintCard = ({ children, className, hoverEffect = true }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const background = useMotionTemplate`radial-gradient(
    600px circle at ${mouseX}px ${mouseY}px,
    rgba(16, 185, 129, 0.06),
    transparent 80%
  )`;

  const border = useMotionTemplate`radial-gradient(
    300px circle at ${mouseX}px ${mouseY}px,
    rgba(16, 185, 129, 0.2), // Emerald-500
    transparent 80%
  )`;

  return (
    <div
      className={cn("group relative rounded-xl border border-white/5 bg-slate-900/50 backdrop-blur-md overflow-hidden", className)}
      onMouseMove={handleMouseMove}
    >
      {hoverEffect && (
        <>
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: border,
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: background,
            }}
          />
        </>
      )}
      <div className="relative h-full">{children}</div>
    </div>
  );
};

// 2. THREE.JS PARTICLE FIELD
const Particles = (props) => {
  const ref = useRef();
  const { mouse, viewport } = useThree();

  // Generate particles
  const points = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const { clock } = state;
    // Rotate slowly
    ref.current.rotation.x = clock.getElapsedTime() * 0.05;
    ref.current.rotation.y = clock.getElapsedTime() * 0.03;

    // Optional: Mouse influence could be done here by modifying geometry positions
    // but usually shader or rotation is enough for "Ambient" feel.
    // We'll stick to rotation + noise drift for now per requirements request "drift toward cursor"
    // is complex in JS-only points without specialized shaders, but let's try a simple lerp on group.

    // Magnetic drift
    const x = (mouse.x * viewport.width) / 50;
    const y = (mouse.y * viewport.height) / 50;
    ref.current.position.x += (x - ref.current.position.x) * 0.05;
    ref.current.position.y += (y - ref.current.position.y) * 0.05;
  });

  return (
    <group ref={ref} {...props}>
      <Points positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#10b981"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  )
}

// 3. SECTIONS

const Hero = () => {
  return (
    <div className="relative h-screen w-full flex flex-col justify-center px-6 sm:px-12 md:px-24 pointer-events-none">
      <div className="z-10 max-w-4xl pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px w-12 bg-emerald-500/50" />
          <span className="text-emerald-400 font-mono text-sm tracking-widest uppercase">Creative Technologist</span>
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8">
          <span className="block text-slate-400 text-3xl md:text-5xl font-light mb-4 text-scramble">
            <DecodedText text="Hello, I am" />
          </span>
          <DecodedText text="Ganti Venkata" />
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            <DecodedText text="Sai Prudhvi Raj" />
          </span>
        </h1>

        <p className="text-slate-400 md:text-xl max-w-xl leading-relaxed mb-10">
          <DecodedText text="Technologist | Photographer | Creative Problem-Solver" />
        </p>

        <div className="flex gap-4">
          <Magnetic>
            <button className="px-8 py-3 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-all flex items-center gap-2">
              View Work <ArrowUpRight size={18} />
            </button>
          </Magnetic>
          <Magnetic>
            <button className="px-8 py-3 rounded-full border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all">
              Contact
            </button>
          </Magnetic>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 hidden md:block animate-pulse">
        <div className="font-mono text-xs text-slate-600 flex flex-col items-end gap-1">
          <span>SYSTEM_READY</span>
          <span>V.1.0.4</span>
        </div>
      </div>
    </div>
  )
}

const DecodedText = ({ text }) => {
  const display = useScramble(text);
  return <span>{display}</span>;
}

const Experience = () => {
  return (
    <section className="py-24 px-6 md:px-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
          <Terminal className="text-emerald-500" />
          <DecodedText text="Achievements_Log" />
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-emerald-500/30 to-transparent" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
        {/* Large Cell: Hack Club Chief */}
        <GlintCard className="md:col-span-2 md:row-span-2 p-8 flex flex-col justify-between group">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">First Year</span>
              <Users className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Hack Club Chief</h3>
            <p className="text-emerald-400 font-medium mb-4">Alliance University</p>
            <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
              <li>Leading a community of student developers.</li>
              <li>Organizing hackathons and technical workshops.</li>
              <li>Foster innovation and peer-to-peer learning.</li>
            </ul>
          </div>

          {/* Visual: Community / Network Node */}
          <div className="mt-6 rounded-lg bg-slate-950/80 p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-hidden relative min-h-[100px] flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <div className="flex gap-4 items-center opacity-70">
              <div className="w-8 h-8 rounded-full border border-emerald-500/50 flex items-center justify-center bg-emerald-500/10"><Terminal size={14} /></div>
              <div className="h-px w-10 bg-emerald-500/30"></div>
              <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]"><Zap size={18} className="text-white" /></div>
              <div className="h-px w-10 bg-emerald-500/30"></div>
              <div className="w-8 h-8 rounded-full border border-emerald-500/50 flex items-center justify-center bg-emerald-500/10"><Code2 size={14} /></div>
            </div>
          </div>
        </GlintCard>

        {/* Medium Cell: Ideation Challenge Winner */}
        <GlintCard className="md:col-span-2 p-8 flex flex-col text-left">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">Ideation Challenge Winner</h3>
              <p className="text-slate-400 text-sm mt-1">Founders Vault / Excellencia</p>
            </div>
            <Trophy className="text-yellow-400" />
          </div>

          <div className="flex-1 flex items-end mt-4">
            <div className="w-full">
              <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
                <span>PROJECT</span>
                <span className="text-emerald-400">1st Place</span>
              </div>
              <div className="text-sm text-slate-300 font-medium">
                Autonomous Smart Car & Traffic Management System.
              </div>
            </div>
          </div>
        </GlintCard>

        {/* Small Cell: SIH Hackathon */}
        <GlintCard className="md:col-span-1 p-6 flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
            <Award className="text-blue-400" />
          </div>
          <h4 className="font-bold text-white text-sm">SIH Internal</h4>
          <span className="text-xs text-emerald-400 mt-2 font-mono">2nd Place Secured</span>
        </GlintCard>

        {/* Hardware / Drone Engineer */}
        <GlintCard className="md:col-span-1 p-6 flex flex-col justify-between">
          <Settings className="text-cyan-400 mb-2" />
          <div>
            <h4 className="font-bold text-white text-md">Drone Engineer</h4>
            <p className="text-xs text-slate-400 mt-1">Certified UAV Pilot & Technician</p>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
            />
          </div>
        </GlintCard>
      </div>
    </section>
  )
}

const HardwareSchematic = () => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-24 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <Cpu className="text-cyan-400" />
            <DecodedText text="Hardware_Architecture" />
          </h2>
          <p className="text-slate-400 max-w-xl">
            Bridging the gap between software logic and physical engineering through UAV development and custom PC architectures.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="border border-slate-800 bg-slate-900/50 p-8 rounded-xl backdrop-blur-sm relative">
            <h3 className="text-xl font-mono text-cyan-400 mb-6">UAV_FLIGHT_CONTROLLER_V2</h3>
            {/* SVG Blueprint Animation */}
            <svg viewBox="0 0 400 300" className="w-full h-auto drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <motion.path
                d="M50,150 L150,50 L350,50 L350,250 L150,250 L50,150 Z"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.circle cx="150" cy="50" r="4" fill="#22d3ee" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 2.5 }} />
              <motion.circle cx="350" cy="50" r="4" fill="#22d3ee" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 2.6 }} />
              <motion.circle cx="350" cy="250" r="4" fill="#22d3ee" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 2.7 }} />
              <motion.circle cx="150" cy="250" r="4" fill="#22d3ee" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 2.8 }} />
              <motion.circle cx="50" cy="150" r="4" fill="#22d3ee" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 2.9 }} />

              {/* Internal layout */}
              <motion.rect x="160" y="80" width="100" height="100" stroke="#22d3ee" fill="none" strokeWidth="1"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1, duration: 2 }}
              />
              <motion.text x="170" y="130" fill="#22d3ee" fontSize="12" fontFamily="monospace" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 3 }}>
                STM32 CORE
              </motion.text>
            </svg>

            <div className="absolute top-4 right-4 text-[10px] text-slate-500 font-mono">
              CAD_VIEW_01
            </div>
          </div>

          <div className="space-y-6">
            <GlintCard className="p-6">
              <div className="flex items-center gap-4 mb-2">
                <Zap className="text-yellow-400" />
                <h4 className="font-bold">Power Systems Integration</h4>
              </div>
              <p className="text-sm text-slate-400">Custom PCB design for power distribution in autonomous drone swarms.</p>
            </GlintCard>
            <GlintCard className="p-6">
              <div className="flex items-center gap-4 mb-2">
                <Database className="text-emerald-400" />
                <h4 className="font-bold">Telemetry Data Link</h4>
              </div>
              <p className="text-sm text-slate-400">Real-time flight data transmission using LoRa modules and React dashboards.</p>
            </GlintCard>
          </div>
        </div>
      </div>
    </section>
  )
}

const Projects = () => {
  const projects = [
    {
      title: "Ping Pong Python",
      desc: "Classic arcade physics engineered from scratch using Pygame. Implements collision detection and game loop architecture.",
      tech: ["Python", "Pygame", "OOP"],
      icon: Gamepad2
    },
    {
      title: "Squad Site",
      desc: "A responsive static web platform showcasing clean UI/UX principles and semantic HTML5 architecture.",
      tech: ["HTML5", "CSS3", "Responsive"],
      icon: Layout
    },
    {
      title: "JS Game Suite",
      desc: "Collection of interactive browser-based games including 'Number Guesser' and 'RPS' demonstrating DOM manipulation mastery.",
      tech: ["JavaScript", "DOM", "Logic"],
      icon: Terminal
    }
  ];

  return (
    <section className="py-24 px-6 md:px-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
          <Code2 className="text-emerald-500" />
          <DecodedText text="Project_Directory" />
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-emerald-500/30 to-transparent" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <GlintCard key={i} className="p-6 flex flex-col hover:bg-slate-900/80 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-slate-800/50 text-cyan-400">
                <project.icon size={24} />
              </div>
              <ArrowUpRight className="text-slate-600" size={20} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-1">{project.desc}</p>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, j) => (
                <span key={j} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </GlintCard>
        ))}
      </div>
    </section>
  )
}

const Skills = () => {
  const skills = [
    { name: "Python", level: "95%", status: "Core Language", icon: Terminal },
    { name: "C++", level: "90%", status: "System Level", icon: Code2 },
    { name: "React", level: "85%", status: "Frontend", icon: Globe },
    { name: "Node.js", level: "80%", status: "Backend", icon: Database },
    { name: "Arduino", level: "88%", status: "Embedded", icon: Cpu },
    { name: "Hardware", level: "85%", status: "Prototyping", icon: Settings },
    { name: "Git", level: "95%", status: "Version Control", icon: GitBranch },
    { name: "JavaScript", level: "90%", status: "Web Logic", icon: Layers },
  ];

  return (
    <section className="py-24 px-6 md:px-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
          <Layers className="text-emerald-500" />
          <DecodedText text="Skill_Matrix" />
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {skills.map((skill, index) => (
          <GlintCard key={index} className="p-4 flex flex-col items-center justify-center gap-3 min-h-[140px] group cursor-default">
            <skill.icon className="h-8 w-8 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <h4 className="font-bold text-lg">{skill.name}</h4>

            {/* Tooltip-like info on hover */}
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 text-center">
              <span className="text-emerald-400 font-bold text-2xl">{skill.level}</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">{skill.status}</span>
            </div>
          </GlintCard>
        ))}
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 bg-slate-950 text-center relative z-10">
      <p className="text-slate-500 text-sm">
        Built by Prudhvi Raj. &copy; {new Date().getFullYear()} <br />
        <span className="text-xs opacity-50 font-mono">React • Three.js • Tailwind</span>
      </p>
    </footer>
  )
}

// MAIN APP
function App() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-emerald-500/30 font-sans relative">
      {/* Film Grain Overlay */}
      <div className="film-grain"></div>

      {/* 3D Background - Fixed */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }} gl={{ antialias: false }}>
          <Suspense fallback={null}>
            <Particles />
          </Suspense>
        </Canvas>
      </div>

      {/* Content - Scrollable */}
      <div className="relative z-10">
        <Hero />
        <Experience />
        <HardwareSchematic />
        <Projects />
        <Skills />
        <Footer />
      </div>
    </div>
  )
}

export default App;

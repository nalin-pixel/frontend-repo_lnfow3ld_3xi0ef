import React from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Github, Linkedin, Dribbble, PlayCircle, Star, BadgeCheck, PenTool, Scissors, Camera, Palette } from 'lucide-react'

function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {children}
    </section>
  )
}

export default function App() {
  const skills = [
    { icon: Camera, title: 'Video Editing', desc: 'Cuts, transitions, color grading, motion graphics' },
    { icon: Palette, title: 'Graphic Design', desc: 'Clean, modern visual style with strong composition' },
    { icon: PenTool, title: 'Creativity', desc: 'Fresh ideas and thoughtful storytelling' },
    { icon: BadgeCheck, title: 'Consistency', desc: 'Disciplined like sports training—results over talk' },
  ]

  const scrollTo = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white selection:bg-fuchsia-500/30">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#0b0b12]/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo('#home')} className="flex items-center gap-2 group">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-fuchsia-500 via-violet-500 to-cyan-400 grid place-items-center">✨</span>
            <span className="font-semibold tracking-wide text-white/90 group-hover:text-white transition-colors">Artha HW</span>
          </button>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {[
              { label: 'About', href: '#about' },
              { label: 'Skills', href: '#skills' },
            ].map((n) => (
              <button key={n.href} onClick={() => scrollTo(n.href)} className="text-white/70 hover:text-white transition-colors">
                {n.label}
              </button>
            ))}
          </nav>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero with Spline */}
      <Section id="home" className="relative h-[90vh] pt-16">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        {/* Gradient overlay to improve contrast, but allow interaction */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b0b12]/40 via-[#0b0b12]/40 to-[#0b0b12]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
            {/* Intro Text */}
            <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <p className="text-sm uppercase tracking-widest text-fuchsia-300/90">Portfolio</p>
                <h1 className="mt-3 text-4xl sm:text-6xl font-extrabold leading-tight">
                  Hi, I’m <span className="bg-gradient-to-tr from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">Artha Handi Wijaya</span>
                </h1>
                <p className="mt-4 text-white/80 text-lg">
                  Sports lover (especially basketball). Video editor and graphic designer. Accounting graduate from SMKS PASUNDAN SUBANG. Taller than 170 cm—and my age? A secret. Dreaming big and working bigger.
                </p>
                <p className="mt-3 text-white/60 italic">“It's okay to aim high, but your actions must match your words.”</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a href="#skills" onClick={(e) => { e.preventDefault(); scrollTo('#skills') }} className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold px-5 py-3 rounded-xl shadow-lg shadow-fuchsia-500/10">
                    Explore Skills <ArrowRight size={18} />
                  </a>
                  <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('#about') }} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl">
                    About Me
                  </a>
                </div>
              </motion.div>
            </div>
            {/* Profile Photo */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="justify-self-center">
              <div className="relative h-56 w-56 sm:h-64 sm:w-64 rounded-3xl overflow-hidden border border-white/10 shadow-xl shadow-fuchsia-500/10">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrMwuUgJILFp3x2kBrcXmLzPUCi0i3aFKXlIUtC2iHMSVJNAWPYSiYKfs&s=10"
                  alt="Artha Handi Wijaya portrait"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* About */}
      <Section id="about" className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.12),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.12),transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">About Me</h2>
              <p className="text-white/80">
                On court I love basketball; off court I cut videos, design bold visuals, and bring stories to life. Accounting taught me structure; creativity brings the color.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/80">Height: 170cm+</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/80">Age: Unknown</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/80">Dream: Get Rich</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Discipline', value: 92 },
                { label: 'Creativity', value: 94 },
                { label: 'Editing', value: 90 },
                { label: 'Design', value: 88 },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">{s.label}</span>
                    <span className="text-fuchsia-300">{s.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.value}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" className="relative py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold">Core Skills</h2>
            <p className="text-white/70 mt-2">Precision from accounting, flair from design.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((sk, i) => (
              <motion.div key={sk.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-fuchsia-400/40 transition relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-2xl group-hover:bg-cyan-400/10 transition" />
                <sk.icon className="text-fuchsia-300" />
                <h3 className="mt-3 font-semibold text-lg">{sk.title}</h3>
                <p className="text-white/70 mt-2 text-sm">{sk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <div className="py-10 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} Artha Handi Wijaya
      </div>
    </div>
  )
}

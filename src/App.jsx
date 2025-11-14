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
  const socials = [
    { href: 'mailto:artha@example.com', label: 'Email', icon: Mail },
    { href: 'https://github.com/', label: 'GitHub', icon: Github },
    { href: 'https://www.linkedin.com/', label: 'LinkedIn', icon: Linkedin },
    { href: 'https://dribbble.com/', label: 'Dribbble', icon: Dribbble },
  ]

  const skills = [
    { icon: Camera, title: 'Video Editing', desc: 'Cuts, transitions, color grading, motion graphics' },
    { icon: Palette, title: 'Graphic Design', desc: 'Branding, posters, social content, thumbnails' },
    { icon: PenTool, title: 'Creativity', desc: 'Anime-inspired aesthetics with clean modern taste' },
    { icon: BadgeCheck, title: 'Consistency', desc: 'Disciplined like sports training—results over talk' },
  ]

  const showcases = [
    {
      title: 'Basketball Hype Reel',
      tag: 'Video Edit',
      thumb: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop',
    },
    {
      title: 'Neon Anime Poster',
      tag: 'Graphic Design',
      thumb: 'https://images.unsplash.com/photo-1608889175123-8ee362201f8c?q=80&w=1600&auto=format&fit=crop',
    },
    {
      title: 'Channel Intro Motion',
      tag: 'Motion Graphics',
      thumb: 'https://images.unsplash.com/photo-1542759564-7ccbb6ac4508?q=80&w=1600&auto=format&fit=crop',
    },
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
              { label: 'Showcase', href: '#showcase' },
              { label: 'Contact', href: '#contact' },
            ].map((n) => (
              <button key={n.href} onClick={() => scrollTo(n.href)} className="text-white/70 hover:text-white transition-colors">
                {n.label}
              </button>
            ))}
          </nav>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact') }} className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
            <Mail size={16} /> Hire Me
          </a>
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
                <a href="#showcase" onClick={(e) => { e.preventDefault(); scrollTo('#showcase') }} className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold px-5 py-3 rounded-xl shadow-lg shadow-fuchsia-500/10">
                  See My Work <ArrowRight size={18} />
                </a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact') }} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl">
                  Contact Me <Mail size={18} />
                </a>
              </div>
              <div className="mt-6 flex items-center gap-4">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                    <s.icon size={18} /> <span className="hidden sm:inline">{s.label}</span>
                  </a>
                ))}
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
                I move through life like a shonen protagonist—anime spirit, modern style. On court I love basketball; off court I cut videos, design bold visuals, and bring stories to life. Accounting taught me structure; creativity brings the color.
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
            <p className="text-white/70 mt-2">Anime meets modern UI. Precision from accounting, flair from design.</p>
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

      {/* Showcase */}
      <Section id="showcase" className="relative py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Showcase</h2>
              <p className="text-white/70 mt-2">Selected edits and designs.</p>
            </div>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact') }} className="hidden sm:inline-flex items-center gap-2 text-fuchsia-300 hover:text-cyan-300">
              Let’s collaborate <ArrowRight size={18} />
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {showcases.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                <div className="relative aspect-video overflow-hidden">
                  <img src={item.thumb} alt={item.title} className="h-full w-full object-cover transform group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-transparent opacity-80" />
                  <button className="absolute bottom-3 left-3 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm">
                    <PlayCircle size={16} /> Preview
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Star size={14} className="text-fuchsia-300" /> {item.tag}
                  </div>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" className="relative py-24">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-3xl sm:text-4xl font-bold">Let’s work together</h2>
            <p className="text-white/70 mt-2">Tell me about your project—edits, designs, or a full visual package.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 grid sm:grid-cols-2 gap-4">
              <input className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40" placeholder="Your name" />
              <input className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40" placeholder="Email or Instagram" />
              <textarea rows="4" className="sm:col-span-2 rounded-lg bg-white/10 border border-white/10 px-4 py-3 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40" placeholder="What do you need?" />
              <button className="sm:col-span-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-semibold px-5 py-3 rounded-xl shadow-lg shadow-fuchsia-500/10">
                Send Message <ArrowRight size={18} />
              </button>
            </form>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-white/70">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  <s.icon size={18} /> {s.label}
                </a>
              ))}
            </div>
          </div>
          <p className="text-center text-white/40 text-sm mt-8">© {new Date().getFullYear()} Artha Handi Wijaya • Built with passion and anime vibes</p>
        </div>
      </Section>
    </div>
  )
}

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUp, BadgeCheck, PenTool, Camera, Palette, Menu, X } from 'lucide-react'

function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {children}
    </section>
  )
}

export default function App() {
  const [active, setActive] = useState('#home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [flames, setFlames] = useState([]) // { id, x, y }

  const skills = [
    { icon: Camera, title: 'Video Editing', desc: 'Cuts, transitions, color grading, motion graphics' },
    { icon: Palette, title: 'Graphic Design', desc: 'Clean, modern visual style with strong composition' },
    { icon: PenTool, title: 'Creativity', desc: 'Fresh ideas' },
    { icon: BadgeCheck, title: 'Consistency', desc: 'Disciplined like sports training—results over talk' },
  ]

  const links = useMemo(() => ([
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
  ]), [])

  const scrollTo = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Blue "fire" burst state handler
  const triggerFlame = (x, y) => {
    const id = Math.random().toString(36).slice(2)
    setFlames((prev) => [...prev, { id, x, y }])
    setTimeout(() => setFlames((prev) => prev.filter((f) => f.id !== id)), 800)
  }

  // Global click listener: every click anywhere creates a blue flame at the cursor
  useEffect(() => {
    const handleClick = (e) => {
      // Ignore non-primary clicks
      if (e.button !== 0) return
      triggerFlame(e.clientX, e.clientY)
    }
    window.addEventListener('click', handleClick, { passive: true })
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const onNavClick = (e, href) => {
    e.preventDefault()
    e.stopPropagation() // avoid double flame; global handler will already fire
    setActive(href)
    scrollTo(href)
    setMenuOpen(false)
  }

  // Track active section on scroll
  useEffect(() => {
    const handler = () => {
      const sections = links.map((l) => document.querySelector(l.href)).filter(Boolean)
      const y = window.scrollY + 100
      let current = '#home'
      for (const sec of sections) {
        if (sec.offsetTop <= y) current = `#${sec.id}`
      }
      setActive(current)
    }
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [links])

  // Persisted first-time animation for About metrics
  const metricsRef = useRef(null)
  const [aboutSeen, setAboutSeen] = useState(false)
  useEffect(() => {
    if (!metricsRef.current || aboutSeen) return
    const el = metricsRef.current
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setAboutSeen(true)
            obs.disconnect()
            break
          }
        }
      },
      { root: null, threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [aboutSeen])

  return (
    <div
      className="min-h-screen text-white selection:bg-emerald-500/30"
      style={{
        backgroundImage:
          "url('https://www.shutterstock.com/image-vector/animestyle-lightning-effect-background-green_169-600nw-2506552939.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for readability */}
      <div className="min-h-screen bg-black/60">
        {/* Navbar */}
        <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button onClick={() => scrollTo('#home')} className="group">
              <span className="font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 group-hover:to-lime-300 transition-colors">
                Artha HW
              </span>
            </button>

            {/* Top-right Menu */}
            <nav className="hidden md:flex items-center gap-2 text-sm">
              {links.map((n) => (
                <button
                  key={n.href}
                  onClick={(e) => onNavClick(e, n.href)}
                  className={`relative px-3 py-2 rounded-lg transition-colors ${active === n.href ? 'text-white' : 'text-white/80 hover:text-white'}`}
                >
                  <span>{n.label}</span>
                  {active === n.href && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 -z-10 rounded-lg"
                      style={{
                        background:
                          'radial-gradient(120% 180% at 50% 0%, rgba(96,165,250,0.25) 0%, rgba(56,189,248,0.18) 35%, rgba(14,165,233,0.08) 70%, rgba(0,0,0,0) 100%)',
                        boxShadow: '0 0 25px rgba(56,189,248,0.25), inset 0 0 15px rgba(59,130,246,0.15)'
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Mobile menu button (top-right) */}
            <div className="md:hidden flex items-center">
              <button
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((s) => !s)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur-xl"
              >
                <div className="px-4 py-3 flex flex-col gap-2">
                  {links.map((n) => (
                    <button
                      key={n.href}
                      onClick={(e) => onNavClick(e, n.href)}
                      className={`text-left px-3 py-2 rounded-lg ${active === n.href ? 'bg-white/10 text-white' : 'text-white/85 hover:bg-white/5'}`}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Blue fire click effects */}
        <div className="pointer-events-none fixed inset-0 z-40">
          <AnimatePresence>
            {flames.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0.5, scale: 0.2, x: f.x - 50, y: f.y - 50 }}
                animate={{ opacity: 0, scale: 2.2, x: f.x - 100, y: f.y - 100 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{
                  background:
                    'conic-gradient(from 180deg at 50% 50%, rgba(59,130,246,0.55), rgba(56,189,248,0.55), rgba(14,165,233,0.45), rgba(59,130,246,0.0))',
                  boxShadow: '0 0 60px 10px rgba(56,189,248,0.35)'
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Hero */}
        <Section id="home" className="relative h-[90vh] pt-16">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
              {/* Intro Text */}
              <div className="max-w-2xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <h1 className="mt-3 text-4xl sm:text-6xl font-extrabold leading-tight">
                    Hi, I’m{' '}
                    <span className="bg-gradient-to-tr from-green-400 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
                      Artha Handi Wijaya
                    </span>
                  </h1>
                  <p className="mt-4 text-white/85 text-lg">
                    Sports lover (especially basketball). Video editor and graphic designer. Accounting graduate. Taller than 170 cm — age 18+. Dreaming big and working bigger.
                  </p>
                  <p className="mt-3 text-white/80 italic">
                    “Boleh meninggi tapi sesuai aksi”
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                      href="#skills"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavClick(e, '#skills')
                      }}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-300 text-black font-semibold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/10"
                    >
                      Explore Skills <ArrowRight size={18} />
                    </a>
                    <a
                      href="#about"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavClick(e, '#about')
                      }}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl"
                    >
                      About Me
                    </a>
                  </div>
                </motion.div>
              </div>
              {/* Profile Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="justify-self-center"
              >
                <div className="relative h-56 w-56 sm:h-64 sm:w-64 rounded-3xl overflow-hidden border border-white/10 shadow-xl shadow-emerald-500/10">
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
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-10"
            >
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                  About Me
                </h2>
                <p className="text-white/85">
                  On court I love basketball; off court I cut videos, design bold visuals, and bring stories to life. Accounting taught me structure; creativity brings the color.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/85">Height: 170cm+</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/85">Age: 18+</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/85">Birthday: July 5th</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/85">Dream: Get Rich</span>
                </div>
              </div>
              <div ref={metricsRef} className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Discipline', value: 92 },
                  { label: 'Creativity', value: 94 },
                  { label: 'Editing', value: 78 },
                  { label: 'Design', value: 79 },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/85">{s.label}</span>
                      <span className="text-emerald-300">{s.value}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-300 transition-[width] duration-700 ease-out"
                        style={{ width: aboutSeen ? `${s.value}%` : '0%' }}
                      />
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
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Core Skills
              </h2>
              <p className="text-white/80 mt-2">Precision from accounting, flair from design.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((sk, i) => (
                <motion.div
                  key={sk.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-lime-400/10 transition" />
                  <sk.icon className="text-emerald-300" />
                  <h3 className="mt-3 font-semibold text-lg">{sk.title}</h3>
                  <p className="text-white/75 mt-2 text-sm">{sk.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Back to Top Button */}
        <button
          aria-label="Back to top"
          onClick={() => scrollTo('#home')}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 text-black shadow-lg shadow-emerald-500/20 flex items-center justify-center hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          <ArrowUp size={20} />
        </button>

        {/* Footer */}
        <div className="py-10 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} Artha Handi Wijaya
        </div>
      </div>
    </div>
  )
}

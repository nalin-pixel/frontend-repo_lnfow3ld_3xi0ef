import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUp, BadgeCheck, PenTool, Camera, Palette, Menu, X, Heart } from 'lucide-react'

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

  // Like state (lifetime via backend)
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [hearts, setHearts] = useState([]) // { id }
  const lastHeartAt = useRef(0) // simple cooldown to avoid heart spam

  // Backend base URL
  const backendBase = useMemo(() => {
    const env = import.meta?.env?.VITE_BACKEND_URL
    if (env && typeof env === 'string' && env.trim()) return env.replace(/\/$/, '')
    // Hosted fallback: swap -3000 subdomain marker to -8000
    try {
      const origin = window.location.origin
      if (origin.includes('-3000.')) {
        return origin.replace('-3000.', '-8000.')
      }
      // Local dev fallback: switch port 3000 -> 8000
      const u = new URL(origin)
      if (u.port === '3000') {
        u.port = '8000'
        return u.origin
      }
      return origin
    } catch {
      return ''
    }
  }, [])

  // Peeking image state
  const [peek, setPeek] = useState(null) // { id, side: 'left'|'right', top: number }
  const peekTimer = useRef(null)
  const peekInterval = useRef(null)

  // Typing effect for motto
  const mottoFull = 'Boleh meninggi tapi sesuai aksi'
  const [motto, setMotto] = useState('')
  const [phase, setPhase] = useState('typing') // typing | pausing | deleting
  const [cursorVisible, setCursorVisible] = useState(true)

  // Photo hologram + 3D tilt
  const photoRef = useRef(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 })

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

  // Like button behavior
  const likeBtnRef = useRef(null)
  const spawnHeartBurst = () => {
    const now = Date.now()
    if (now - lastHeartAt.current < 180) return // cooldown ~180ms
    lastHeartAt.current = now
    const id = Math.random().toString(36).slice(2)
    setHearts((prev) => {
      const next = [...prev, { id }]
      // keep only a small number of hearts in DOM
      return next.slice(-6)
    })
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id))
    }, 900)
  }

  // Helper: trigger peeking image
  const triggerPeek = () => {
    // Random side and vertical position
    const side = Math.random() > 0.5 ? 'left' : 'right'
    const top = 15 + Math.random() * 60 // 15% - 75% viewport height
    const id = Math.random().toString(36).slice(2)

    setPeek({ id, side, top })

    // Auto hide after 2.4s
    if (peekTimer.current) clearTimeout(peekTimer.current)
    peekTimer.current = setTimeout(() => setPeek((p) => (p && p.id === id ? null : p)), 2400)
  }

  // Start interval + initial peek on mount
  useEffect(() => {
    // Initial peek at page load
    triggerPeek()

    // Every 10 seconds
    peekInterval.current = setInterval(() => {
      triggerPeek()
    }, 10000)

    return () => {
      if (peekTimer.current) clearTimeout(peekTimer.current)
      if (peekInterval.current) clearInterval(peekInterval.current)
    }
  }, [])

  // Initialize liked from localStorage and fetch current likes
  useEffect(() => {
    try {
      const stored = localStorage.getItem('liked-global')
      if (stored === 'true') setLiked(true)
    } catch {}

    const fetchLikes = async () => {
      try {
        const res = await fetch(`${backendBase}/likes`)
        if (!res.ok) throw new Error('Failed to fetch likes')
        const data = await res.json()
        if (typeof data?.count === 'number') setLikes(data.count)
      } catch (e) {
        // Silently ignore; keep local state
      }
    }
    fetchLikes()

    // Polling to stay in sync across visitors
    const interval = setInterval(fetchLikes, 5000)
    return () => clearInterval(interval)
  }, [backendBase])

  const handleLike = async (e) => {
    e.stopPropagation() // prevent global flame on like button
    if (!liked) {
      // Try to increment on backend
      try {
        const res = await fetch(`${backendBase}/likes/increment`, { method: 'POST' })
        if (res.ok) {
          const data = await res.json()
          if (typeof data?.count === 'number') setLikes(data.count)
          setLiked(true)
          try { localStorage.setItem('liked-global', 'true') } catch {}
        } else {
          // Fallback: optimistic local increment
          setLikes((c) => c + 1)
          setLiked(true)
        }
      } catch {
        // Network error fallback
        setLikes((c) => c + 1)
        setLiked(true)
      }
      spawnHeartBurst()
      triggerPeek() // also peek on first like
    } else {
      // Already liked: only show heart animation, don't change count
      spawnHeartBurst()
      triggerPeek() // peek on subsequent likes as well
    }
  }

  // Typing effect logic
  useEffect(() => {
    let t
    if (phase === 'typing') {
      if (motto.length < mottoFull.length) {
        t = setTimeout(() => setMotto(mottoFull.slice(0, motto.length + 1)), 60)
      } else {
        setPhase('pausing')
      }
    } else if (phase === 'pausing') {
      t = setTimeout(() => setPhase('deleting'), 1200)
    } else if (phase === 'deleting') {
      if (motto.length > 0) {
        t = setTimeout(() => setMotto(mottoFull.slice(0, motto.length - 1)), 40)
      } else {
        setPhase('typing')
      }
    }
    return () => t && clearTimeout(t)
  }, [phase, motto, mottoFull])

  useEffect(() => {
    const c = setInterval(() => setCursorVisible((v) => !v), 500)
    return () => clearInterval(c)
  }, [])

  // 3D tilt handlers (mouse & touch)
  const updateTiltFromPoint = (clientX, clientY) => {
    const el = photoRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (clientX - rect.left) / rect.width // 0..1
    const py = (clientY - rect.top) / rect.height // 0..1
    const rx = (py - 0.5) * -14 // rotateX
    const ry = (px - 0.5) * 18 // rotateY
    setTilt({ rx, ry, scale: 1.04 })
  }

  const handleMouseMove = (e) => updateTiltFromPoint(e.clientX, e.clientY)
  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0, scale: 1 })
  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) updateTiltFromPoint(e.touches[0].clientX, e.touches[0].clientY)
  }
  const handleTouchEnd = () => setTilt({ rx: 0, ry: 0, scale: 1 })

  // Looping animations for skill icons (varied per index)
  const iconLoopForIndex = (i) => {
    const patterns = [
      { y: [0, -4, 0] },
      { rotate: [0, -6, 0, 6, 0] },
      { scale: [1, 1.08, 1] },
      { x: [0, 4, 0, -4, 0] },
    ]
    return patterns[i % patterns.length]
  }

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
      {/* SVG filter to knock out white backgrounds from the peeking image */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="removeWhite" colorInterpolationFilters="sRGB">
          {/* Convert to luminance in red channel */}
          <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" result="lum" />
          {/* Invert luminance to get dark areas opaque, light areas transparent */}
          <feComponentTransfer>
            <feFuncR type="table" tableValues="1 0" />
            <feFuncG type="table" tableValues="1 0" />
            <feFuncB type="table" tableValues="1 0" />
            <feFuncA type="table" tableValues="0 1" />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Overlay for readability */}
      <div className="min-h-screen bg-black/60">
        {/* Navbar */}
        <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button onClick={() => scrollTo('#home')} className="group">
              <span className="font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 group-hover:to-lime-300 transition-colors">
                Artha Handi Wijaya
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

        {/* Peeking image */}
        <div className="pointer-events-none fixed inset-0 z-40">
          <AnimatePresence>
            {peek && (
              <motion.img
                key={peek.id}
                src="https://freepngimg.com/thumb/artwork/92738-pepe-emote-frog-amphibian-the-twitch.png"
                alt="Peeking graphic"
                initial={{ x: peek.side === 'left' ? '-110%' : '110%', opacity: 0, rotate: 0, scale: 1 }}
                animate={{
                  x: peek.side === 'left' ? '-6%' : '6%',
                  opacity: 1,
                  rotate: [0, -2, 2, 0],
                  scale: [1, 1.02, 1]
                }}
                exit={{ x: peek.side === 'left' ? '-120%' : '120%', opacity: 0 }}
                transition={{
                  x: { type: 'spring', stiffness: 260, damping: 24 },
                  opacity: { duration: 0.2 },
                  rotate: { duration: 1.2, repeat: Infinity, repeatType: 'mirror' },
                  scale: { duration: 1.6, repeat: Infinity, repeatType: 'mirror' }
                }}
                className={`absolute ${peek.side === 'left' ? 'left-0' : 'right-0'} w-[120px] sm:w-[160px]`}
                style={{
                  top: `${peek.top}vh`,
                  transformOrigin: peek.side === 'left' ? 'left center' : 'right center',
                  filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))'
                }}
              />
            )}
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
                    Sports lover (especially basketball). Video editor and graphic designer. Accounting graduate. Taller than 170 cm — age 18+. Dreaming big and working bigger. I also enjoy gaming, especially the FPS genre.
                  </p>
                  <p className="mt-3 text-white/80 italic">
                    {motto}
                    <span className={`inline-block w-[10px] ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>|</span>
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

                    {/* Like Button */}
                    <div className="relative">
                      <button
                        ref={likeBtnRef}
                        onClick={handleLike}
                        className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border transition shadow-lg ${
                          liked
                            ? 'bg-rose-500/20 border-rose-400/30 text-rose-300'
                            : 'bg-white/10 border-white/15 text-white hover:bg-white/15'
                        }`}
                        aria-pressed={liked}
                        aria-label="Like"
                      >
                        <span className={`grid place-items-center h-5 w-5 rounded ${liked ? 'text-rose-400' : 'text-white'}`}>
                          <Heart
                            size={18}
                            className={liked ? 'scale-110' : ''}
                            strokeWidth={2}
                            fill={liked ? 'currentColor' : 'none'}
                          />
                        </span>
                        <span className="text-sm font-medium">{likes}</span>
                      </button>

                      {/* Flying heart animation container */}
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <AnimatePresence>
                          {hearts.map((h) => (
                            <motion.div
                              key={h.id}
                              initial={{ opacity: 0, y: 8, scale: 0.6, rotate: -10 }}
                              animate={{ opacity: 1, y: -40, scale: 1, rotate: 0 }}
                              exit={{ opacity: 0, y: -60, scale: 0.9, rotate: 10 }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="text-rose-400"
                            >
                              <Heart size={18} fill="currentColor" stroke="none" />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* Profile Photo with hologram + 3D tilt */}
              <motion.div
                ref={photoRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.scale})`,
                  transition: 'transform 180ms ease-out',
                }}
                className="justify-self-center relative"
              >
                <div className="relative h-56 w-56 sm:h-64 sm:w-64 rounded-3xl overflow-hidden border border-white/10 shadow-xl shadow-emerald-500/10">
                  {/* Photo */}
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrMwuUgJILFp3x2kBrcXmLzPUCi0i3aFKXlIUtC2iHMSVJNAWPYSiYKfs&s=10"
                    alt="Artha Handi Wijaya portrait"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />

                  {/* Hologram color layers */}
                  <div className="absolute inset-0 mix-blend-screen opacity-60" style={{
                    background: 'linear-gradient(130deg, rgba(56,189,248,0.25), rgba(34,197,94,0.18), rgba(147,51,234,0.18))'
                  }} />

                  {/* Scanning shine */}
                  <motion.div
                    className="absolute -inset-y-10 -left-1/2 w-1/2 rotate-12"
                    animate={{ x: ['-120%', '220%'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                    style={{
                      background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0) 90%)'
                    }}
                  />

                  {/* Grid lines */}
                  <div
                    className="absolute inset-0 opacity-[0.18]"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      mixBlendMode: 'overlay'
                    }}
                  />

                  {/* Glow ring */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                  <div className="pointer-events-none absolute -inset-6 rounded-[32px]" style={{ boxShadow: '0 0 80px rgba(56,189,248,0.25), 0 0 60px rgba(34,197,94,0.18)' }} />
                </div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* About */}
        <Section id="about" className="relative py-24">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              ref={metricsRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4"
            >
              <div className="space-y-4 col-span-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                  About Me
                </h2>
                <p className="text-white/85">
                  On court I love basketball; off court I cut videos, design bold visuals, and bring stories to life. Accounting taught me structure; creativity brings the color. In my free time, I also enjoy gaming—especially FPS titles.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/85">Height: 170cm+</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/85">Age: 18+</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/85">Birthday: July 5th</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/85">Dream: Get Rich</span>
                </div>
              </div>

              {[
                { label: 'Discipline', value: 92 },
                { label: 'Creativity', value: 94 },
                { label: 'Editing', value: 78 },
                { label: 'Design', value: 79 },
                { label: 'Communication', value: 60 },
                { label: 'Socializing', value: 40 },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/85 text-sm">{s.label}</span>
                    <span className="text-emerald-300 text-sm">{s.value}%</span>
                  </div>
                  <div className="h-[6px] w-full rounded-full bg-white/10 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-lime-300 to-green-500 transition-[width] duration-700 ease-out"
                      style={{ width: aboutSeen ? `${s.value}%` : '0%', boxShadow: '0 0 12px rgba(52,211,153,0.45)' }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Gaming card placed at bottom, spans two columns, single large bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/90 text-lg font-semibold">Gaming</span>
                  <span className="text-emerald-300 text-lg font-semibold">Unlimited</span>
                </div>
                <div className="h-4 w-full rounded-full bg-white/10 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-lime-300 to-green-500"
                    style={{ width: aboutSeen ? '100%' : '0%', transition: 'width 900ms ease-out', boxShadow: '0 0 14px rgba(52,211,153,0.5)' }}
                  />
                </div>
              </motion.div>
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
                  <motion.div
                    animate={iconLoopForIndex(i)}
                    transition={{ duration: 2 + (i % 4) * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-block"
                  >
                    <sk.icon className="text-emerald-300" />
                  </motion.div>
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

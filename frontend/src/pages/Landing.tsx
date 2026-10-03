import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  MapPin,
  ArrowRight,
  Terminal,
  Palette,
  Brain,
  TrendingUp,
  Megaphone,
  Heart,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  BadgeCheck,
} from "lucide-react"

// ─── Animated Counter ──────────────────────────────────────────────────────

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOut * end))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }
    window.requestAnimationFrame(step)
  }, [end, duration])

  return <>{count.toLocaleString()}{suffix}</>
}

// ─── Categories Data ───────────────────────────────────────────────────────

const CATEGORIES = [
  { icon: Terminal, title: "Software Engineering", desc: "Full-stack, distributed infrastructure, and web platform teams.", roles: "420+", salary: "$132,000", color: "primary" },
  { icon: Palette, title: "Product & Design", desc: "Design systems, interaction design, UX research, and product strategy.", roles: "180+", salary: "$118,000", color: "secondary" },
  { icon: Brain, title: "Data Science & AI", desc: "Large language models, reinforcement learning, analytics & big data.", roles: "290+", salary: "$138,000", color: "tertiary" },
  { icon: TrendingUp, title: "Finance & Fintech", desc: "Quantitative trading, risk analysis, payment infrastructure.", roles: "140+", salary: "$125,000", color: "primary" },
  { icon: Megaphone, title: "Product Marketing", desc: "Go-to-market execution, developer advocacy, and brand positioning.", roles: "95+", salary: "$98,000", color: "secondary" },
  { icon: Heart, title: "Healthcare & Biotech", desc: "Computational biology, clinical analytics, and health-tech.", roles: "80+", salary: "$110,000", color: "tertiary" },
]

const COMPANIES = [
  { name: "Stripe", tag: "Fintech" },
  { name: "Google", tag: "Cloud & AI" },
  { name: "Meta", tag: "Networks" },
  { name: "Figma", tag: "Design" },
  { name: "Linear", tag: "Systems" },
  { name: "Datadog", tag: "Infra" },
  { name: "Airbnb", tag: "Consumer" },
  { name: "Notion", tag: "Workspace" },
]

const TESTIMONIALS = [
  {
    quote: "Ascent completely bypassed the resume black hole. The recruiter reviewed my verified course repo on Monday, and I had my final round by Friday afternoon.",
    name: "Maya Lin",
    school: "Stanford '24 • Software Engineer",
    landed: "Landed role @ Stripe",
    color: "text-primary",
  },
  {
    quote: "The design challenge flow here is so much more respectful of student time. Linear reached out directly because of my portfolio tagged on my dashboard.",
    name: "David Kim",
    school: "Michigan '24 • Product Designer",
    landed: "Landed role @ Linear",
    color: "text-secondary",
  },
  {
    quote: "I found my AI research internship in two clicks. Seeing response rates and timeline estimates directly in the pipeline helped me manage finals without anxiety.",
    name: "Priya Rao",
    school: "MIT '25 • AI Research Intern",
    landed: "Landed role @ Datadog",
    color: "text-tertiary",
  },
]

// ─── Landing Page ──────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set("keyword", keyword)
    if (location) params.set("location", location)
    navigate(`/jobs?${params}`)
  }

  return (
    <div className="flex flex-col w-full">
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-[hsl(var(--surface-lowest))] py-16 lg:py-24">
        {/* Ambient glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center">
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/70 backdrop-blur-md shadow-md shadow-black/40 mb-8 hover:bg-accent transition-colors cursor-pointer group">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-label-sm text-primary font-semibold tracking-wide uppercase">Launching Fall 2025 Cohort</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-label-sm text-muted-foreground group-hover:text-foreground transition-colors">Over 45,000+ Verified Campus Jobs</span>
            <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Headline */}
          <h1 className="font-heading text-display-hero-mobile md:text-display-hero lg:text-[56px] lg:leading-[64px] font-bold text-foreground tracking-tight max-w-4xl mx-auto">
            Launch Your Career{" "}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-secondary to-primary-container bg-clip-text text-transparent">
              Before You Graduate.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto mt-4 mb-10">
            Ascent directly bridges premier university talent with engineering, design, and product leadership at hyper-growth tech, quantitative finance, and top venture-backed firms.
          </p>

          {/* Search Console */}
          <div className="w-full max-w-4xl bg-[hsl(var(--surface-low))]/90 backdrop-blur-xl rounded-2xl p-2 shadow-xl shadow-black/60 transition-all duration-300">
            <form className="flex flex-col lg:flex-row items-stretch gap-2" onSubmit={handleSearch}>
              {/* Role input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[hsl(var(--surface-lowest))] rounded-xl">
                <Search className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex flex-col text-left flex-1 min-w-0">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Target Position</span>
                  <input
                    className="bg-transparent text-body-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none w-full truncate"
                    placeholder="e.g. Software Engineer, Product Designer"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>

              {/* Location input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[hsl(var(--surface-lowest))] rounded-xl">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                <div className="flex flex-col text-left flex-1 min-w-0">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Location or Mode</span>
                  <input
                    className="bg-transparent text-body-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none w-full truncate"
                    placeholder="San Francisco, New York, or Remote"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[hsl(var(--primary-container))] to-[hsl(var(--secondary-container))] text-white rounded-xl font-semibold text-label-md shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
                type="submit"
              >
                <span>Find Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick filter pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 px-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-label-sm text-muted-foreground font-medium mr-1">Trending:</span>
                {["🎓 Internships", "⚡ New Grad 2025", "🌐 Remote Only", "💼 Product Management"].map((label) => (
                  <button
                    key={label}
                    onClick={() => setKeyword(label.split(" ").slice(1).join(" "))}
                    className="px-3 py-1 rounded-full bg-muted hover:bg-accent text-foreground text-label-sm transition-all shadow-sm"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Link to="/jobs" className="text-label-sm text-primary hover:text-foreground transition-colors flex items-center gap-0.5">
                <span>Advanced Filters</span>
              </Link>
            </div>
          </div>

          {/* Stats ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-12">
            {[
              { icon: BadgeCheck, value: 98, suffix: "%", label: "Placement Rate" },
              { icon: TrendingUp, value: 115, suffix: "k", prefix: "$", label: "Avg Starting Salary" },
              { icon: Shield, value: 500, suffix: "+", label: "Top Tier Employers" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-center sm:justify-start gap-4 p-4 bg-card/60 backdrop-blur-md rounded-xl shadow-md border border-border/30">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block font-heading text-headline-md font-bold text-foreground leading-tight">
                    {stat.prefix || ""}<AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-label-sm text-muted-foreground">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COMPANIES ──────────────────────────────────────────── */}
      <section className="w-full bg-[hsl(var(--surface-low))] py-8 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-center text-label-sm uppercase tracking-widest text-muted-foreground font-semibold mb-6">
            Trusted by university recruiters at world-class companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 opacity-85">
            {COMPANIES.map((c) => (
              <div key={c.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-accent transition-colors shadow-sm border border-border/20">
                <span className="font-heading text-headline-sm font-bold tracking-tight text-foreground">{c.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase font-bold">{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ─────────────────────────────────────────────── */}
      <section className="w-full py-16 bg-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-label-sm text-primary uppercase tracking-wider font-semibold block mb-1">Curated Pathways</span>
              <h2 className="font-heading text-headline-lg font-bold text-foreground">Explore In-Demand Disciplines</h2>
            </div>
            <Link to="/jobs" className="inline-flex items-center gap-1 text-label-md text-secondary hover:text-foreground transition-colors">
              <span>View all 34 industry disciplines</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.title}
                to="/jobs"
                className="group relative bg-card p-6 rounded-2xl shadow-md hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-border/20"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${cat.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${cat.color}/20 text-${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-muted text-foreground text-label-sm font-semibold">{cat.roles} roles</span>
                </div>
                <h3 className={`font-heading text-headline-sm font-bold text-foreground group-hover:text-${cat.color} transition-colors`}>{cat.title}</h3>
                <p className="text-body-sm text-muted-foreground mt-1 mb-4">{cat.desc}</p>
                <div className="flex items-center justify-between pt-1 text-muted-foreground text-label-sm">
                  <span>Avg starting: {cat.salary}</span>
                  <ArrowRight className={`w-4 h-4 text-${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="w-full py-16 bg-[hsl(var(--surface-low))] relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-label-sm text-primary uppercase tracking-widest font-semibold block mb-1">Streamlined Execution</span>
            <h2 className="font-heading text-headline-lg font-bold text-foreground">Designed for velocity, not red tape.</h2>
            <p className="text-body-md text-muted-foreground mt-2">Say goodbye to outdated 10-page application forms. Ascent syncs directly with verified academic credentials.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                badge: "Verified Sync",
                title: "Build Your Student Profile",
                desc: "Connect your university credentials, verified coursework, GitHub repos, and target compensation preferences.",
                color: "primary",
                snippet: { icon: CheckCircle2, text: "GPA 3.92 • Stanford CS", sub: "Verified by University Registrar" },
              },
              {
                step: "02",
                badge: "Zero Friction",
                title: "1-Click Fast Apply",
                desc: "Send structured, tailored packets directly to verified hiring managers with a single keystroke.",
                color: "secondary",
                snippet: { icon: Zap, text: "Package Dispatched", sub: "Latency < 80ms" },
              },
              {
                step: "03",
                badge: "Kanban Sync",
                title: "Real-Time Status Tracking",
                desc: "Monitor live recruiter reviews, coding challenges, interview schedules, and official offers in your unified dashboard.",
                color: "tertiary",
                snippet: { icon: Star, text: "Offer Stage — Stripe", sub: null, progress: true },
              },
            ].map((item) => (
              <div key={item.step} className="bg-card p-8 rounded-2xl shadow-lg relative flex flex-col justify-between border border-border/20">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-heading text-headline-md font-bold text-${item.color}`}>{item.step}</span>
                    <span className={`px-2.5 py-1 rounded-full bg-${item.color}/20 text-${item.color} text-label-sm font-semibold`}>{item.badge}</span>
                  </div>
                  <h3 className="font-heading text-headline-sm font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-body-sm text-muted-foreground">{item.desc}</p>
                </div>
                {/* Visual snippet */}
                <div className="mt-6 p-3 bg-[hsl(var(--surface-lowest))] rounded-xl flex items-center gap-3 shadow-sm border border-border/10">
                  {item.snippet.progress ? (
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-foreground font-semibold">{item.snippet.text}</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary w-full h-full rounded-full" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <item.snippet.icon className={`w-5 h-5 text-${item.color} flex-shrink-0`} />
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] text-foreground font-semibold">{item.snippet.text}</span>
                        {item.snippet.sub && <span className="text-[10px] text-muted-foreground">{item.snippet.sub}</span>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="w-full py-16 bg-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-label-sm text-primary uppercase tracking-wider font-semibold block mb-1">Alumni Trajectories</span>
              <h2 className="font-heading text-headline-lg font-bold text-foreground">Hear from students who crossed the finish line.</h2>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BadgeCheck className="w-4 h-4 text-primary" />
              <span className="text-label-sm">100% Verified University Offers</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-card p-6 rounded-2xl shadow-md flex flex-col justify-between border border-border/20">
                <div>
                  <div className={`flex items-center gap-1 ${t.color} mb-4`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-body-md text-foreground mb-6 leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-label-md font-bold text-foreground">{t.name}</span>
                    <span className="text-label-sm text-muted-foreground">{t.school}</span>
                    <span className={`text-[11px] ${t.color} font-semibold`}>{t.landed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="w-full py-16 bg-[hsl(var(--surface-lowest))] relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-to-b from-card to-accent p-10 lg:p-16 overflow-hidden shadow-2xl shadow-black/80 border border-border/10">
            {/* Background glow */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/25 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
              <span className="px-4 py-1 rounded-full bg-primary/20 text-primary text-label-sm font-bold tracking-wider uppercase mb-6 shadow-sm">
                Zero Platform Fees for Students
              </span>
              <h2 className="font-heading text-display-hero-mobile md:text-display-hero lg:text-[44px] lg:leading-[52px] font-bold text-foreground tracking-tight mb-4">
                Ready to kickstart your career journey?
              </h2>
              <p className="text-body-lg text-muted-foreground mb-10 max-w-xl">
                Join over 120,000 university seniors and graduate students securing early offers at the world's most innovative organizations.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[hsl(var(--primary-container))] to-[hsl(var(--secondary-container))] text-white rounded-xl font-semibold text-label-md shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Get Started as Student
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 bg-muted hover:bg-accent text-foreground rounded-xl font-semibold text-label-md transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Hire Campus Talent
                </Link>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground text-label-sm mt-8">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-primary" /> FERPA Compliant
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4 text-primary" /> .edu Direct Authentication
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

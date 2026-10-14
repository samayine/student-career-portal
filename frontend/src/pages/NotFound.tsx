import { Link, useLocation } from "react-router-dom"
import { ArrowLeft, Search, Compass, Briefcase, LayoutDashboard } from "lucide-react"

export default function NotFound() {
  const location = useLocation()

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden">
      {/* Atmospheric radial backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-12 left-1/4 w-[300px] h-[300px] bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-[720px] mx-auto flex flex-col items-center text-center relative z-10">
        {/* System Diagnostic Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border/20 shadow-sm backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-status-rejected animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-tight">HTTP_404_ROUTE_NOT_FOUND</span>
          <span className="text-muted-foreground/40 font-mono text-xs">/</span>
          <span className="font-mono text-xs text-primary truncate max-w-[200px] sm:max-w-none">
            {location.pathname}
          </span>
        </div>

        {/* 404 Graphic Stack */}
        <div className="relative flex items-center justify-center my-4 w-full max-w-[500px]">
          {/* Orbital Rings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-30 -z-10" fill="none" viewBox="0 0 500 240">
            <ellipse cx="250" cy="120" rx="220" ry="90" stroke="currentColor" strokeDasharray="6 6" strokeWidth="1" className="text-border" />
            <ellipse cx="250" cy="120" rx="150" ry="60" stroke="currentColor" strokeWidth="1.25" className="text-primary/50" />
            <circle cx="80" cy="90" r="3" fill="currentColor" className="text-primary animate-pulse" />
            <circle cx="420" cy="150" r="3" fill="currentColor" className="text-secondary" />
          </svg>

          {/* Huge Number */}
          <span className="font-heading font-extrabold text-[120px] sm:text-[160px] leading-none tracking-tighter bg-gradient-to-b from-foreground via-foreground/70 to-foreground/20 bg-clip-text text-transparent select-none">
            404
          </span>
        </div>

        {/* Headline & description */}
        <h1 className="font-heading text-display-xs sm:text-display-sm font-bold text-foreground tracking-tight mt-2">
          Off the Career Grid
        </h1>
        <p className="text-body-lg text-muted-foreground max-w-lg mt-3 leading-relaxed">
          The requisition or page you are navigating to has either expired, been relocated, or is no longer accessible on this route.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-container text-white text-label-md font-semibold hover:bg-primary-container/90 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            to="/jobs"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border/20 text-foreground text-label-md font-semibold hover:bg-accent transition-all shadow-sm"
          >
            <Search className="w-4 h-4 text-primary" /> Browse Job Explorer
          </Link>
        </div>

        {/* Helpful Shortcut Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-12 text-left">
          <Link
            to="/jobs"
            className="p-4 rounded-xl bg-card border border-border/20 hover:border-primary/40 transition-all group"
          >
            <Compass className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-heading text-label-md font-semibold text-foreground">Explore Roles</p>
            <p className="text-body-xs text-muted-foreground mt-0.5">Browse active internships and full-time listings.</p>
          </Link>

          <Link
            to="/dashboard"
            className="p-4 rounded-xl bg-card border border-border/20 hover:border-primary/40 transition-all group"
          >
            <LayoutDashboard className="w-5 h-5 text-secondary mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-heading text-label-md font-semibold text-foreground">My Pipeline</p>
            <p className="text-body-xs text-muted-foreground mt-0.5">Track your submitted job applications.</p>
          </Link>

          <Link
            to="/post-job"
            className="p-4 rounded-xl bg-card border border-border/20 hover:border-primary/40 transition-all group"
          >
            <Briefcase className="w-5 h-5 text-accent-foreground mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-heading text-label-md font-semibold text-foreground">Post a Requisition</p>
            <p className="text-body-xs text-muted-foreground mt-0.5">Hire qualified graduate and intern talent.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

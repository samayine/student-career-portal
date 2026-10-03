import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Plus,
  Menu,
  X,
  Settings,
  ChevronDown,
  Bell,
} from "lucide-react"

export default function Navbar() {
  const { user, logout, isLoading } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    setDropdownOpen(false)
    window.location.href = "/login"
  }

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)

  const navLinkClass = (path: string) =>
    `px-4 py-1.5 text-label-md font-medium transition-all rounded-lg ${
      isActive(path)
        ? "bg-primary-container text-white"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--surface-lowest))]/80 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-16 max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => { setMobileOpen(false); window.scrollTo(0, 0) }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-container to-secondary-container rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-headline-sm font-bold tracking-tight text-foreground">Ascent</span>
          </Link>
          <span className="text-label-sm px-2 py-0.5 rounded bg-primary/20 text-primary uppercase font-bold tracking-wider hidden sm:inline">
            Careers
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/" className={navLinkClass("/")}>Home</Link>
          <Link to="/jobs" className={navLinkClass("/jobs")}>Explore Jobs</Link>
          {user && (
            <Link to="/dashboard" className={navLinkClass("/dashboard")}>
              {user.role === "employer" ? "Employer Dashboard" : "Student Dashboard"}
            </Link>
          )}
          {user?.role === "employer" && (
            <Link to="/post-job" className={navLinkClass("/post-job")}>Post Job</Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          {user && (
            <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors hidden sm:flex">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-primary-container text-white text-[10px] font-bold">
                3
              </span>
            </button>
          )}

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {!isLoading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-muted/40 hover:bg-muted border border-border/30 hover:border-border transition-all cursor-pointer focus:outline-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-label-md font-semibold text-foreground leading-tight">{user.first_name}</span>
                      <span className="text-label-sm text-muted-foreground capitalize leading-tight">{user.role}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground hidden lg:block transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-card border border-border/30 rounded-xl shadow-elevation-3 py-1.5 z-50 animate-slide-down backdrop-blur-xl">
                      <div className="px-3 py-2 border-b border-border/20 lg:hidden">
                        <p className="text-sm font-medium text-foreground">{user.first_name} {user.last_name}</p>
                        <p className="text-label-sm text-muted-foreground capitalize">{user.role}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 text-body-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/settings" className="flex items-center gap-2.5 px-3 py-2.5 text-body-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <div className="border-t border-border/20 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-body-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <button className="px-4 py-2 rounded-lg text-label-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                      Log in
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container text-white text-label-md font-semibold shadow-sm hover:shadow-glow-sm transition-all">
                      Sign up
                    </button>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/20 bg-card px-4 py-4 space-y-1 animate-slide-down">
          <Link to="/jobs" onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive("/jobs") ? "bg-primary-container text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}>
            <Briefcase className="w-4 h-4" /> Find Jobs
          </Link>
          {user && (
            <Link to="/dashboard" onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive("/dashboard") ? "bg-primary-container text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
          {user?.role === "employer" && (
            <Link to="/post-job" onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive("/post-job") ? "bg-primary-container text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}>
              <Plus className="w-4 h-4" /> Post a Job
            </Link>
          )}

          <div className="border-t border-border/20 pt-3 mt-2">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 px-3 py-2 text-sm">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white text-xs font-bold">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                  <span className="font-semibold text-foreground">{user.first_name} {user.last_name}</span>
                  <span className="text-label-sm text-muted-foreground capitalize">({user.role})</span>
                </div>
                <Link to="/settings" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 px-1">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <button className="w-full py-2.5 rounded-xl border border-border/30 text-foreground text-sm font-medium hover:bg-muted transition-colors">Log in</button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-white text-sm font-medium">Sign up</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Plus,
  Menu,
  X,
  User,
  Settings,
  ChevronDown,
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

  // Returns true if the current path starts with the given prefix
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)

  const navLinkClass = (path: string) =>
    `relative flex items-center gap-1.5 text-sm font-medium pb-0.5 transition-colors duration-200
     after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full
     after:transition-transform after:duration-200 after:origin-left
     ${
      isActive(path)
        ? "text-foreground after:bg-foreground after:scale-x-100"
        : "text-muted-foreground hover:text-foreground after:bg-foreground after:scale-x-0 hover:after:scale-x-100"
    }`

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight flex items-center gap-2 shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          Career<span className="text-blue-600">Portal</span>
        </Link>

        {/* Desktop nav links — free-standing with underline indicator */}
        <div className="hidden md:flex items-center gap-7">
          <Link to="/jobs" className={navLinkClass("/jobs")}>
            Find Jobs
          </Link>
          {user && (
            <Link to="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>
          )}
          {user?.role === "employer" && (
            <Link to="/post-job" className={navLinkClass("/post-job")}>
              Post a Job
            </Link>
          )}
        </div>

        {/* Desktop auth — right */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-2">
                {user.role === "employer" && (
                  <Link to="/post-job">
                    <Button
                      size="sm"
                      className="gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Post Job
                    </Button>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-muted/40 hover:bg-muted border border-border/60 hover:border-border transition-all duration-200 cursor-pointer focus:outline-none"
                    title="Account Options"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-xs font-semibold leading-tight">{user.first_name}</span>
                      <span className="text-[10px] text-muted-foreground capitalize leading-tight">{user.role}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-muted-foreground hidden lg:block transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 border-b lg:hidden">
                        <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className="border-t my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="rounded-full px-4 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-sm hover:shadow-md transition-all"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            to="/jobs"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive("/jobs")
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Find Jobs
          </Link>
          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive("/dashboard")
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
          {user?.role === "employer" && (
            <Link
              to="/post-job"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive("/post-job")
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Plus className="w-4 h-4" /> Post a Job
            </Link>
          )}

          <div className="border-t pt-3 mt-2">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 px-3 py-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">{user.first_name} {user.last_name}</span>
                  <span className="text-xs text-muted-foreground capitalize">({user.role})</span>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 px-1">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full rounded-full" size="sm">Log in</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button
                    className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0"
                    size="sm"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

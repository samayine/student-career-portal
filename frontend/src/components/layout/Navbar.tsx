import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
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
} from "lucide-react"

export default function Navbar() {
  const { user, logout, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setMobileOpen(false)
  }

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-foreground font-semibold"
      : "text-muted-foreground hover:text-foreground"

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          Career<span className="text-blue-600">Portal</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/jobs"
            className={`text-sm transition-colors ${isActive("/jobs")}`}
          >
            Find Jobs
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`text-sm transition-colors ${isActive("/dashboard")}`}
            >
              Dashboard
            </Link>
          )}
          {user?.role === "employer" && (
            <Link
              to="/post-job"
              className={`text-sm transition-colors ${isActive("/post-job")}`}
            >
              Post a Job
            </Link>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                  <span className="font-medium">{user.first_name}</span>
                  <span className="text-muted-foreground text-xs capitalize px-1.5 py-0.5 bg-background rounded-full border">
                    {user.role}
                  </span>
                </div>
                {user.role === "employer" && (
                  <Link to="/post-job">
                    <Button size="sm" className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Post Job
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5 text-muted-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
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
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          <Link
            to="/jobs"
            className="flex items-center gap-2.5 text-sm font-medium py-2"
            onClick={() => setMobileOpen(false)}
          >
            <Briefcase className="w-4 h-4 text-muted-foreground" /> Find Jobs
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 text-sm font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Dashboard
            </Link>
          )}
          {user?.role === "employer" && (
            <Link
              to="/post-job"
              className="flex items-center gap-2.5 text-sm font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              <Plus className="w-4 h-4 text-muted-foreground" /> Post a Job
            </Link>
          )}

          <div className="border-t pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{user.first_name} {user.last_name}</span>
                  <span className="text-xs text-muted-foreground capitalize">({user.role})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">Log in</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button className="w-full" size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

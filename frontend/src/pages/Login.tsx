import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { authApi } from "@/api/auth"
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || "/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Branded Panel ─── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary-container))] via-[hsl(var(--secondary-container))] to-[hsl(245,50%,15%)]">
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.3)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(45,212,191,0.2)_0%,transparent_50%)]" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-headline-md text-white font-bold tracking-tight">Ascent</span>
          </div>

          <h2 className="font-heading text-display-sm text-white font-bold tracking-tight leading-tight mb-4">
            Where students<br />meet opportunity.
          </h2>
          <p className="text-body-lg text-white/70 max-w-sm">
            Connect with top employers, track your applications, and launch your career — all in one place.
          </p>

          {/* Floating stat bubbles */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            {[
              { label: "Jobs", value: "12K+" },
              { label: "Companies", value: "500+" },
              { label: "Placement", value: "95%" },
            ].map((stat) => (
              <div key={stat.label} className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <p className="font-heading text-headline-sm text-white font-bold">{stat.value}</p>
                <p className="text-label-sm text-white/60 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary-container/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-heading text-headline-sm text-foreground font-bold">Ascent</span>
          </div>

          <h1 className="font-heading text-headline-lg text-foreground font-bold tracking-tight">Welcome back</h1>
          <p className="text-body-md text-muted-foreground mt-1 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-status-rejected/10 border border-status-rejected/20 text-status-rejected text-body-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-label-md font-semibold text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/20 bg-[hsl(var(--surface-lowest))] text-body-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-label-md font-semibold text-foreground">Password</label>
                <Link to="#" className="text-label-sm text-primary hover:underline underline-offset-4 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-border/20 bg-[hsl(var(--surface-lowest))] text-body-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border accent-primary" />
              <label htmlFor="remember" className="text-body-sm text-muted-foreground">Remember me</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary-container hover:bg-primary-container/90 text-white text-label-md font-semibold rounded-xl transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border/20" />
            <span className="text-label-sm text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border/20" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                window.location.href = authApi.getOAuthUrl("google", "student")
              }}
              className="flex-1 h-11 flex items-center justify-center gap-2 bg-muted hover:bg-accent text-foreground text-label-md font-medium rounded-xl border border-border/20 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = authApi.getOAuthUrl("github", "student")
              }}
              className="flex-1 h-11 flex items-center justify-center gap-2 bg-muted hover:bg-accent text-foreground text-label-md font-medium rounded-xl border border-border/20 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          {/* Footer link */}
          <p className="text-center text-body-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

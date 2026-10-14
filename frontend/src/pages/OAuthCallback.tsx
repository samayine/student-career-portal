import { useEffect, useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Sparkles, AlertCircle, ArrowLeft } from "lucide-react"

export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get("token")
    const errorParam = searchParams.get("error")

    if (errorParam) {
      setError(
        errorParam === "google_token_exchange_failed"
          ? "Failed to exchange token with Google."
          : errorParam === "github_token_exchange_failed"
          ? "Failed to exchange token with GitHub."
          : `Authentication failed: ${errorParam.replace(/_/g, " ")}`
      )
      return
    }

    if (token) {
      loginWithToken(token)
        .then(() => {
          navigate("/dashboard", { replace: true })
        })
        .catch((err) => {
          setError(err?.message || "Failed to establish user session")
        })
    } else {
      setError("No authentication token provided by identity provider.")
    }
  }, [searchParams, loginWithToken, navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border/20 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl pointer-events-none" />

        {error ? (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-status-rejected/15 border border-status-rejected/25 text-status-rejected flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="font-heading text-headline-sm font-bold text-foreground">
              Sign In Unsuccessful
            </h2>
            <p className="text-body-sm text-muted-foreground">{error}</p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white text-label-md font-semibold hover:bg-primary-container/90 transition-all shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-7 h-7 text-white animate-pulse" />
            </div>
            <h2 className="font-heading text-headline-sm font-bold text-foreground">
              Authenticating...
            </h2>
            <p className="text-body-sm text-muted-foreground">
              Setting up your secure session with Ascent Career Hub.
            </p>
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-4" />
          </div>
        )}
      </div>
    </div>
  )
}

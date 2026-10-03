import { Link } from "react-router-dom"
import { Mail } from "lucide-react"

const FOOTER_LINKS = {
  Product: [
    { label: "Find Jobs", to: "/jobs" },
    { label: "Internships", to: "/jobs" },
    { label: "Salary Insights", to: "/jobs" },
    { label: "Career Path", to: "/dashboard" },
  ],
  Employers: [
    { label: "Post a Job", to: "/post-job" },
    { label: "ATS Kanban", to: "/dashboard" },
    { label: "Talent Search", to: "/jobs" },
    { label: "Pricing", to: "/" },
  ],
  Resources: [
    { label: "Resume Guide", to: "/" },
    { label: "Interview Prep", to: "/" },
    { label: "College Partners", to: "/" },
  ],
  "Legal & Security": [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "FERPA Compliance", to: "/" },
  ],
}

export default function Footer() {
  return (
    <footer className="w-full bg-[hsl(var(--surface-lowest))] mt-0">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-2">
              <span className="text-label-md text-foreground font-semibold uppercase tracking-wider mb-1">{category}</span>
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-body-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border/20">
          <span className="text-body-sm text-muted-foreground">
            © {new Date().getFullYear()} Ascent Career Technologies Inc. Built for university talent.
          </span>
          <div className="flex items-center gap-5 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors" aria-label="GitHub">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="#" className="hover:text-foreground transition-colors" aria-label="X">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-foreground transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Link } from "react-router-dom"
import { Globe, X, ExternalLink } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Copyright */}
          <div className="text-sm text-slate-400 text-center md:text-left">
            &copy; {currentYear} Student Career Portal. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/terms" className="hover:text-slate-100 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-slate-100 transition-colors">
              Privacy Policy
            </Link>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4 text-slate-500">
            <a href="#" className="hover:text-slate-200 transition-colors">
              <X className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-slate-200 transition-colors">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-slate-200 transition-colors">
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}

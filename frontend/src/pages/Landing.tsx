import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, GraduationCap, Building2 } from "lucide-react"

export default function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 py-24 lg:py-32 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-8">
          Welcome to the future of student careers
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl text-balance mb-6">
          Launch your career before you even <span className="text-blue-600">graduate</span>.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-balance">
          Connect with top employers, find internships, and land your first full-time role. Built exclusively for students.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/jobs">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Browse Jobs
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 space-y-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">For Students</h3>
              <p className="text-muted-foreground">Build a professional profile, discover tailored opportunities, and track all your applications in one place.</p>
            </div>
            
            <div className="flex flex-col items-center p-6 space-y-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">For Employers</h3>
              <p className="text-muted-foreground">Post jobs, manage applicants, and discover top emerging talent straight from universities.</p>
            </div>
            
            <div className="flex flex-col items-center p-6 space-y-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold">Premium Opportunities</h3>
              <p className="text-muted-foreground">Access exclusive internships, co-ops, and entry-level positions from verified partner companies.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

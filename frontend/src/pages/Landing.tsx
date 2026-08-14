import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, GraduationCap, Building2, TrendingUp, CheckCircle2, Search, Send, Zap } from "lucide-react"

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count.toLocaleString()}{suffix}</>
}

export default function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden flex-1 py-24 lg:py-32 flex flex-col items-center justify-center text-center px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full w-full bg-background -z-10" />
        <div className="absolute top-0 -translate-y-12 right-1/4 w-96 h-96 bg-blue-500/20 blur-[128px] rounded-full -z-10" />
        <div className="absolute bottom-0 translate-y-1/3 left-1/4 w-96 h-96 bg-indigo-500/20 blur-[128px] rounded-full -z-10" />

        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse" />
          Welcome to the future of student careers
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl text-balance mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          Launch your career before you even <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">graduate</span>.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-balance animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Connect with top employers, find internships, and land your first full-time role. Built exclusively for students to jumpstart their professional journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-200">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 rounded-full text-base">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/jobs">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-full text-base border-border hover:bg-muted">
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-8 border-t border-border/50 animate-in fade-in duration-1000 delay-300">
          {[
            { label: "Active Jobs", value: 2000, suffix: "+" },
            { label: "Partner Companies", value: 500, suffix: "+" },
            { label: "Students Placed", value: 10, suffix: "k+" },
            { label: "Success Rate", value: 94, suffix: "%" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-3xl font-black text-foreground">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Your journey from student to professional in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 -z-10" />
            
            {[
              {
                icon: <Search className="w-6 h-6 text-blue-600" />,
                title: "1. Discover",
                desc: "Browse hundreds of curated internships and entry-level roles tailored for students.",
                color: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
              },
              {
                icon: <Send className="w-6 h-6 text-indigo-600" />,
                title: "2. Apply",
                desc: "Apply with a single click using your unified student profile and saved default resume.",
                color: "bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800"
              },
              {
                icon: <Zap className="w-6 h-6 text-purple-600" />,
                title: "3. Get Hired",
                desc: "Connect directly with employers, schedule interviews, and land your dream job.",
                color: "bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800"
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center mb-6 shadow-sm ${step.color}`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-8 space-y-4 rounded-3xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">For Students</h3>
              <p className="text-muted-foreground leading-relaxed">Build a professional profile, discover tailored opportunities, and track all your applications in one seamless dashboard.</p>
            </div>
            
            <div className="flex flex-col items-center p-8 space-y-4 rounded-3xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">For Employers</h3>
              <p className="text-muted-foreground leading-relaxed">Post jobs, manage applicants efficiently, and discover top emerging talent straight from leading universities.</p>
            </div>
            
            <div className="flex flex-col items-center p-8 space-y-4 rounded-3xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold">Premium Growth</h3>
              <p className="text-muted-foreground leading-relaxed">Access exclusive internships, co-ops, and entry-level positions from verified partner companies to accelerate your career.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to jumpstart your career?</h2>
          <p className="text-blue-100 text-lg mb-10">Join thousands of students who have already found their dream internships and entry-level roles through our platform.</p>
          <Link to="/register">
            <Button size="lg" className="h-14 px-10 rounded-full text-lg font-bold bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-800 border-0 shadow-lg hover:shadow-xl transition-all">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

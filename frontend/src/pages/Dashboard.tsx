import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { jobsApi, applicationsApi, savedJobsApi, type JobListItem, type ApplicationWithJob } from "@/api/jobs"
import {
  Briefcase,
  Users,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  ChevronRight,
  Building2,
  Bookmark,
  TrendingUp,
  FileText,
  Upload,
  GraduationCap,
  Sparkles,
} from "lucide-react"
import { JobCard } from "./Jobs"

// ─── Helpers ───────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  applied: {
    label: "Applied",
    color: "text-status-applied",
    bg: "bg-status-applied/10 border-status-applied/25",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  reviewed: {
    label: "Under Review",
    color: "text-status-reviewed",
    bg: "bg-status-reviewed/10 border-status-reviewed/25",
    icon: <Eye className="w-3.5 h-3.5" />,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "text-status-shortlisted",
    bg: "bg-status-shortlisted/10 border-status-shortlisted/25",
    icon: <Star className="w-3.5 h-3.5" />,
  },
  rejected: {
    label: "Not Selected",
    color: "text-status-rejected",
    bg: "bg-status-rejected/10 border-status-rejected/25",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  accepted: {
    label: "Accepted 🎉",
    color: "text-status-accepted",
    bg: "bg-status-accepted/10 border-status-accepted/25",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
}

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  internship: "Internship",
  contract: "Contract",
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

// ─── Student Profile Tab ─────────────────────────────────────────────────────

import { usersApi, type ProfileUpdateData } from "@/api/users"
import { uploadsApi } from "@/api/jobs"

function StudentProfileTab() {
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [form, setForm] = useState<ProfileUpdateData>({
    bio: "",
    education: "",
    skills: "",
    default_resume_url: "",
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  useEffect(() => {
    if (!token) return
    usersApi.getMyProfile(token)
      .then((user) => {
        if (user.profile) {
          setForm({
            bio: user.profile.bio || "",
            education: user.profile.education || "",
            skills: user.profile.skills || "",
            default_resume_url: user.profile.default_resume_url || "",
          })
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [token])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setIsSaving(true)
    
    try {
      let finalResumeUrl = form.default_resume_url
      if (resumeFile) {
        const { url } = await uploadsApi.upload(resumeFile, token)
        finalResumeUrl = url
      }
      
      const updated = await usersApi.updateMyProfile({ ...form, default_resume_url: finalResumeUrl }, token)
      setForm(p => ({ ...p, default_resume_url: updated.default_resume_url || "" }))
      setResumeFile(null)
      alert("Profile updated successfully!")
    } catch (err: any) {
      alert(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border/20 rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-border/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-headline-sm font-bold text-foreground">My Profile</h2>
          <p className="text-label-sm text-muted-foreground">Keep your profile updated for best results</p>
        </div>
      </div>
      <form onSubmit={handleSave} className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-label-md font-semibold text-foreground">Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-border/20 bg-[hsl(var(--surface-lowest))] text-body-md text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50 transition-all"
            placeholder="Tell us a little about yourself..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-label-md font-semibold text-foreground">Education</label>
          <input
            type="text"
            value={form.education}
            onChange={e => setForm(p => ({ ...p, education: e.target.value }))}
            className="w-full h-11 px-4 rounded-xl border border-border/20 bg-[hsl(var(--surface-lowest))] text-body-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50 transition-all"
            placeholder="e.g. B.S. Computer Science, University of Technology"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-label-md font-semibold text-foreground">Skills</label>
          <input
            type="text"
            value={form.skills}
            onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
            className="w-full h-11 px-4 rounded-xl border border-border/20 bg-[hsl(var(--surface-lowest))] text-body-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50 transition-all"
            placeholder="e.g. Python, React, TypeScript"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-label-md font-semibold text-foreground">Default Resume (PDF)</label>
          <div className="flex flex-col gap-3">
            {form.default_resume_url && !resumeFile && (
               <a href={`http://localhost:8000${form.default_resume_url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary text-label-md hover:underline underline-offset-4">
                 <FileText className="w-4 h-4" />
                 View Current Resume
               </a>
            )}
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border/30 bg-[hsl(var(--surface-lowest))] cursor-pointer hover:border-primary/40 transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-body-sm text-muted-foreground">{resumeFile ? resumeFile.name : "Choose a PDF file..."}</span>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="sr-only"
              />
            </label>
          </div>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-primary-container hover:bg-primary-container/90 text-white font-semibold text-label-md rounded-xl transition-all disabled:opacity-50 shadow-sm"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Student Dashboard ─────────────────────────────────────────────────────

function StudentDashboard() {
  const { token } = useAuth()
  const [applications, setApplications] = useState<ApplicationWithJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"applications" | "saved" | "profile">("applications")
  const [savedJobs, setSavedJobs] = useState<JobListItem[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!token) return
    applicationsApi
      .getMyApplications(token)
      .then(setApplications)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [token])

  useEffect(() => {
    if (!token) return
    savedJobsApi.list(token)
      .then((jobs) => {
        setSavedJobs(jobs)
        setSavedIds(new Set(jobs.map((j) => j.id)))
      })
      .catch(console.error)
  }, [token])

  const handleToggleSave = async (jobId: string, save: boolean) => {
    if (!token) return
    setSavedIds((prev) => {
      const next = new Set(prev)
      save ? next.add(jobId) : next.delete(jobId)
      return next
    })
    if (!save) setSavedJobs((prev) => prev.filter((j) => j.id !== jobId))
    try {
      if (save) {
        await savedJobsApi.save(jobId, token)
        const fresh = await savedJobsApi.list(token)
        setSavedJobs(fresh)
        setSavedIds(new Set(fresh.map((j) => j.id)))
      } else {
        await savedJobsApi.unsave(jobId, token)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const stats = {
    total: applications.length,
    active: applications.filter((a) => ["applied", "reviewed", "shortlisted"].includes(a.status)).length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  }

  const tabs = [
    { key: "applications" as const, label: "Applications", icon: Briefcase },
    { key: "saved" as const, label: "Saved", icon: Bookmark, count: savedJobs.length },
    { key: "profile" as const, label: "Profile", icon: GraduationCap },
  ]

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Applied", value: stats.total, icon: Briefcase, accent: "from-primary/20 to-primary/5", iconColor: "text-primary", borderColor: "border-primary/20" },
          { label: "In Progress", value: stats.active, icon: TrendingUp, accent: "from-secondary/20 to-secondary/5", iconColor: "text-secondary", borderColor: "border-secondary/20" },
          { label: "Accepted", value: stats.accepted, icon: CheckCircle2, accent: "from-status-accepted/20 to-status-accepted/5", iconColor: "text-status-accepted", borderColor: "border-status-accepted/20" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.accent} rounded-2xl p-5 border ${stat.borderColor} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              <span className="text-label-sm text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="font-heading text-display-sm font-bold text-foreground tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="bg-card rounded-xl p-1.5 border border-border/20 shadow-sm flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-label-md font-semibold transition-all flex-1 justify-center ${
              activeTab === tab.key
                ? "bg-primary-container text-white shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-label-sm px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-white/25"
                  : "bg-primary/15 text-primary"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "profile" ? (
        <StudentProfileTab />
      ) : activeTab === "saved" ? (
        <div className="space-y-4">
          {savedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-border/20 rounded-2xl bg-card shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Bookmark className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-headline-sm font-semibold mb-1 text-foreground">No saved jobs</h3>
              <p className="text-body-sm text-muted-foreground mb-5 max-w-xs">
                Bookmark jobs you&apos;re interested in to find them here later.
              </p>
              <Link to="/jobs">
                <button className="px-5 py-2 bg-primary-container hover:bg-primary-container/90 text-white text-label-md font-semibold rounded-xl transition-all shadow-sm">
                  Browse Jobs
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedIds.has(job.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Applications list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-headline-sm font-bold text-foreground">My Applications</h2>
              <Link to="/jobs">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-muted hover:bg-accent text-foreground text-label-md font-semibold rounded-xl transition-all">
                  <Plus className="w-3.5 h-3.5" /> Browse Jobs
                </button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-card border border-border/20 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-border/20 rounded-2xl bg-card shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Briefcase className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-headline-sm font-semibold mb-1 text-foreground">No applications yet</h3>
                <p className="text-body-sm text-muted-foreground mb-5 max-w-xs">
                  Start applying to jobs to track your progress here.
                </p>
                <Link to="/jobs">
                  <button className="px-5 py-2 bg-primary-container hover:bg-primary-container/90 text-white text-label-md font-semibold rounded-xl transition-all shadow-sm">
                    Browse Jobs
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => {
                  const cfg = STATUS_CONFIG[app.status]
                  const initials = app.job.company.name.slice(0, 2).toUpperCase()
                  return (
                    <div
                      key={app.id}
                      className="bg-card border border-border/20 rounded-2xl p-4 flex items-center gap-4 hover:border-primary/30 hover:shadow-card-hover transition-all duration-200 group"
                    >
                      {/* Logo */}
                      {app.job.company.logo_url ? (
                        <img
                          src={app.job.company.logo_url}
                          alt={app.job.company.name}
                          className="w-10 h-10 rounded-xl object-cover border border-border/20 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {initials}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-headline-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">{app.job.title}</p>
                        <p className="text-body-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {app.job.company.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`flex items-center gap-1.5 text-label-sm font-semibold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                        <span className="text-label-sm text-muted-foreground hidden sm:block">
                          {timeAgo(app.applied_at)}
                        </span>
                        <Link to={`/jobs/${app.job_id}`}>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Employer Dashboard ────────────────────────────────────────────────────

function EmployerDashboard() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState<JobListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load only jobs posted by the employer
    if (!token) return
    jobsApi
      .list({ limit: 50, posted_by_me: true }, token)
      .then(setJobs)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [token])

  const totalApplicants = jobs.reduce((sum, j) => sum + j.application_count, 0)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Active Postings", value: jobs.filter(j => j.status === "active").length, icon: Briefcase, accent: "from-primary/20 to-primary/5", iconColor: "text-primary", borderColor: "border-primary/20" },
          { label: "Total Applicants", value: totalApplicants, icon: Users, accent: "from-secondary/20 to-secondary/5", iconColor: "text-secondary", borderColor: "border-secondary/20" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.accent} rounded-2xl p-5 border ${stat.borderColor} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              <span className="text-label-sm text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="font-heading text-display-sm font-bold text-foreground tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Posted jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-headline-sm font-bold text-foreground">Your Job Postings</h2>
          <Link to="/post-job">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:bg-primary-container/90 text-white text-label-md font-semibold rounded-xl transition-all shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Post a Job
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-card border border-border/20 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-border/20 rounded-2xl bg-card shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Briefcase className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-headline-sm font-semibold mb-1 text-foreground">No job postings yet</h3>
            <p className="text-body-sm text-muted-foreground mb-5 max-w-xs">
              Create your first job posting to start receiving applications.
            </p>
            <Link to="/post-job">
              <button className="px-5 py-2 bg-primary-container hover:bg-primary-container/90 text-white text-label-md font-semibold rounded-xl transition-all shadow-sm">
                Post a Job
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-card border border-border/20 rounded-2xl p-4 flex items-center gap-4 hover:border-primary/30 hover:shadow-card-hover transition-all duration-200 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-headline-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">{job.title}</p>
                  <p className="text-body-sm text-muted-foreground">
                    {JOB_TYPE_LABELS[job.job_type]}
                    {job.location && ` · ${job.location}`}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {job.application_count}
                  </div>
                  <span className={`text-label-sm font-semibold px-3 py-1 rounded-full border ${
                    job.status === "active"
                      ? "bg-status-accepted/10 text-status-accepted border-status-accepted/25"
                      : "bg-muted text-muted-foreground border-border/20"
                  }`}>
                    {job.status === "active" ? "Active" : "Closed"}
                  </span>
                  <Link to={`/employer/jobs/${job.id}`}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Dashboard Page ────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background pt-16">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Welcome header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-label-sm text-secondary uppercase tracking-wider font-semibold">
                {user?.role === "employer" ? "Employer" : "Student"} Command Center
              </span>
            </div>
            <h1 className="font-heading text-headline-lg text-foreground tracking-tight">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-body-md text-muted-foreground mt-0.5">
              {user?.role === "employer"
                ? "Manage your postings and review applicants."
                : "Track your applications and discover new opportunities."}
            </p>
          </div>
        </div>

        {user?.role === "student" ? (
          <StudentDashboard />
        ) : user?.role === "employer" ? (
          <EmployerDashboard />
        ) : (
          <p className="text-muted-foreground">Select a role to continue.</p>
        )}
      </div>
    </div>
  )
}

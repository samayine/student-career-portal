import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { jobsApi, applicationsApi, savedJobsApi, type JobListItem, type ApplicationWithJob } from "@/api/jobs"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { JobCard } from "./Jobs"

// ─── Helpers ───────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  applied: {
    label: "Applied",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  reviewed: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    icon: <Eye className="w-3.5 h-3.5" />,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    icon: <Star className="w-3.5 h-3.5" />,
  },
  rejected: {
    label: "Not Selected",
    color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  accepted: {
    label: "Accepted 🎉",
    color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
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
    return <div className="py-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="bg-card border rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">My Profile</h2>
      <form onSubmit={handleSave} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 rounded-xl border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us a little about yourself..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Education</label>
          <input
            type="text"
            value={form.education}
            onChange={e => setForm(p => ({ ...p, education: e.target.value }))}
            className="w-full h-10 px-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. B.S. Computer Science, University of Technology"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Skills</label>
          <input
            type="text"
            value={form.skills}
            onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
            className="w-full h-10 px-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Python, React, TypeScript"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Default Resume (PDF)</label>
          <div className="flex flex-col gap-2">
            {form.default_resume_url && !resumeFile && (
               <a href={`http://localhost:8000${form.default_resume_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                 View Current Resume
               </a>
            )}
            <input 
              type="file" 
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
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

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 border-b">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "applications"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("applications")}
        >
          My Applications
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "saved"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          <span className="flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5" />
            Saved Jobs
            {savedJobs.length > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {savedJobs.length}
              </span>
            )}
          </span>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "profile"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
      </div>

      {activeTab === "profile" ? (
        <StudentProfileTab />
      ) : activeTab === "saved" ? (
        <div className="space-y-4">
          {savedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-2xl bg-card">
              <Bookmark className="w-10 h-10 text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">No saved jobs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bookmark jobs you&apos;re interested in to find them here later.
              </p>
              <Link to="/jobs"><Button size="sm">Browse Jobs</Button></Link>
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
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Applied", value: stats.total, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { label: "In Progress", value: stats.active, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
              { label: "Accepted", value: stats.accepted, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 text-center`}>
                <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Applications list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">My Applications</h2>
              <Link to="/jobs">
                <Button variant="outline" size="sm">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Browse Jobs
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border rounded-2xl bg-card">
                <Briefcase className="w-10 h-10 text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-1">No applications yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start applying to jobs to track your progress here.
                </p>
                <Link to="/jobs">
                  <Button size="sm">Browse Jobs</Button>
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
                      className="bg-card border rounded-2xl p-4 flex items-center gap-4 hover:border-blue-300 transition-colors"
                    >
                      {/* Logo */}
                      {app.job.company.logo_url ? (
                        <img
                          src={app.job.company.logo_url}
                          alt={app.job.company.name}
                          className="w-10 h-10 rounded-xl object-cover border flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {initials}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{app.job.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {app.job.company.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {timeAgo(app.applied_at)}
                        </span>
                        <Link to={`/jobs/${app.job_id}`}>
                          <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-foreground" />
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
          { label: "Active Postings", value: jobs.filter(j => j.status === "active").length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Total Applicants", value: totalApplicants, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 text-center`}>
            <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Posted jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Your Job Postings</h2>
          <Link to="/post-job">
            <Button size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Post a Job
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-2xl bg-card">
            <Briefcase className="w-10 h-10 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No job postings yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first job posting to start receiving applications.
            </p>
            <Link to="/post-job">
              <Button size="sm">Post a Job</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-card border rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{job.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {JOB_TYPE_LABELS[job.job_type]}
                    {job.location && ` · ${job.location}`}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {job.application_count}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    job.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {job.status === "active" ? "Active" : "Closed"}
                  </span>
                  <Link to={`/employer/jobs/${job.id}`}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-foreground" />
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
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">
            Welcome back, {user?.first_name}! 👋
          </h1>
          <p className="text-muted-foreground mt-1 capitalize">
            {user?.role} Dashboard
          </p>
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

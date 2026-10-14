import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { jobsApi, applicationsApi, uploadsApi, type Job } from "@/api/jobs"
import { usersApi } from "@/api/users"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Building2,
  DollarSign,
  Briefcase,
  Globe,
  Users,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Clock,
  Upload,
  Bookmark,
  Share2,
  ChevronRight,
  Sparkles,
} from "lucide-react"

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  internship: "Internship",
  contract: "Contract",
}

function formatSalary(min?: number | null, max?: number | null): string | null {
  if (!min && !max) return null
  const fmt = (n: number) => `$${n.toLocaleString()}`
  if (min && max) return `${fmt(min)} – ${fmt(max)} / yr`
  if (min) return `From ${fmt(min)} / yr`
  return `Up to ${fmt(max!)} / yr`
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  })
}

function daysUntil(dateStr?: string | null): string | null {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  if (diff < 0) return "Expired"
  if (diff === 0) return "Today"
  if (diff === 1) return "1 day left"
  return `${diff} days left`
}

// ─── Apply Modal ───────────────────────────────────────────────────────────

function ApplyModal({
  jobTitle,
  companyName,
  onClose,
  onSubmit,
  isLoading,
}: {
  jobTitle: string
  companyName: string
  onClose: () => void
  onSubmit: (coverLetter: string, resumeFile: File | null, defaultResumeUrl?: string | null) => void
  isLoading: boolean
}) {
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [defaultResumeUrl, setDefaultResumeUrl] = useState<string | null>(null)
  const [useDefaultResume, setUseDefaultResume] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    if (token) {
      usersApi.getMyProfile(token).then((user) => {
        if (user.profile?.default_resume_url) {
          setDefaultResumeUrl(user.profile.default_resume_url)
        }
      }).catch(() => {})
    }
  }, [token])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border/20 shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-heading text-headline-sm font-bold text-foreground">Apply for this position</h2>
            <p className="text-body-sm text-muted-foreground">{jobTitle} at {companyName}</p>
          </div>
        </div>

        <div className="space-y-5 mt-6">
          {/* Resume */}
          <div>
            <label className="block text-label-md font-semibold text-foreground mb-2">
              Resume (PDF) <span className="text-status-rejected">*</span>
            </label>

            {defaultResumeUrl && (
              <div className="mb-3 p-3 border border-border/20 rounded-xl bg-[hsl(var(--surface-lowest))]">
                <label className="flex items-center gap-2 cursor-pointer text-body-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={useDefaultResume}
                    onChange={(e) => setUseDefaultResume(e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  Use my default profile resume
                </label>
              </div>
            )}

            {!useDefaultResume && (
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border/30 bg-[hsl(var(--surface-lowest))] cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-body-sm text-muted-foreground">
                  {resumeFile ? resumeFile.name : "Choose a PDF file..."}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-label-md font-semibold text-foreground mb-2">
              Cover Letter <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a great fit for this role..."
              className="w-full h-40 px-4 py-3 rounded-xl border border-border/20 bg-[hsl(var(--surface-lowest))] text-body-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
          <button
            type="button"
            className="sm:w-1/3 px-4 py-2.5 rounded-xl text-label-md font-semibold bg-muted hover:bg-accent text-foreground border border-border/20 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="sm:w-2/3 px-4 py-2.5 rounded-xl text-label-md font-semibold bg-primary-container hover:bg-primary-container/90 text-white transition-colors disabled:opacity-50 shadow-sm"
            onClick={() => onSubmit(coverLetter, useDefaultResume ? null : resumeFile, useDefaultResume ? defaultResumeUrl : undefined)}
            disabled={isLoading || (!resumeFile && !useDefaultResume)}
          >
            {isLoading ? "Submitting Application..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Job Detail Page ───────────────────────────────────────────────────────

export default function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [applyError, setApplyError] = useState("")

  useEffect(() => {
    if (!id) return
    jobsApi.get(id)
      .then(setJob)
      .catch(() => setError("Job not found"))
      .finally(() => setIsLoading(false))
  }, [id])

  const handleApply = async (coverLetter: string, resumeFile: File | null, defaultUrl?: string | null) => {
    if (!token || !id) return
    setIsApplying(true)
    setApplyError("")
    try {
      let resume_url = defaultUrl;
      if (resumeFile) {
         const { url } = await uploadsApi.upload(resumeFile, token)
         resume_url = url;
      }
      await applicationsApi.apply(id, { cover_letter: coverLetter, resume_url }, token)
      setApplied(true)
      setShowApplyModal(false)
    } catch (e: any) {
      setApplyError(e.message || "Failed to apply")
    } finally {
      setIsApplying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center gap-4">
        <h2 className="font-heading text-headline-md font-semibold text-foreground">Job not found</h2>
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-accent text-foreground text-label-md font-semibold rounded-xl transition-colors border border-border/20"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>
      </div>
    )
  }

  const salary = formatSalary(job.salary_min, job.salary_max)
  const deadline = daysUntil(job.deadline)
  const initials = job.company.name.slice(0, 2).toUpperCase()

  return (
    <>
      {showApplyModal && (
        <ApplyModal
          jobTitle={job.title}
          companyName={job.company.name}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleApply}
          isLoading={isApplying}
        />
      )}

      <div className="min-h-[calc(100vh-4rem)] bg-background pt-16">
        <div className="relative max-w-[1200px] mx-auto px-6 py-8">
          {/* Background orbs */}
          <div className="absolute -top-24 -left-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-label-md text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link to="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{job.title}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            {/* ─── Main content ─── */}
            <div className="space-y-6">
              {/* Header card */}
              <div className="bg-card border border-border/20 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  {job.company.logo_url ? (
                    <img
                      src={job.company.logo_url}
                      alt={job.company.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-border/20 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h1 className="font-heading text-headline-lg font-bold text-foreground tracking-tight">{job.title}</h1>
                    <p className="text-body-md text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {job.company.name}
                    </p>
                  </div>
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-3 mt-5">
                  {(job.location || job.is_remote) && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[hsl(var(--surface-lowest))] border border-border/10 text-body-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.is_remote ? "Remote" : job.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[hsl(var(--surface-lowest))] border border-border/10 text-body-sm text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5" />
                    {JOB_TYPE_LABELS[job.job_type]}
                  </span>
                  {salary && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-accepted/10 border border-status-accepted/20 text-body-sm text-status-accepted font-medium">
                      <DollarSign className="w-3.5 h-3.5" />
                      {salary}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[hsl(var(--surface-lowest))] border border-border/10 text-body-sm text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {job.application_count} applicant{job.application_count !== 1 ? "s" : ""}
                  </span>
                  {deadline && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-body-sm font-medium ${
                      deadline === "Expired"
                        ? "bg-status-rejected/10 border-status-rejected/20 text-status-rejected"
                        : "bg-status-reviewed/10 border-status-reviewed/20 text-status-reviewed"
                    }`}>
                      <Calendar className="w-3.5 h-3.5" />
                      {deadline === "Expired" ? "Deadline passed" : deadline}
                    </span>
                  )}
                </div>

                {/* Actions row for mobile */}
                <div className="flex gap-3 mt-5 lg:hidden">
                  {user?.role === "student" && !applied ? (
                    <button
                      className="flex-1 px-4 py-2.5 bg-primary-container hover:bg-primary-container/90 text-white text-label-md font-semibold rounded-xl transition-all shadow-sm"
                      onClick={() => setShowApplyModal(true)}
                    >
                      Apply Now
                    </button>
                  ) : null}
                  <button className="px-3 py-2.5 bg-muted hover:bg-accent text-foreground rounded-xl border border-border/20 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-2.5 bg-muted hover:bg-accent text-foreground rounded-xl border border-border/20 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {applyError && (
                  <div className="mt-4 p-3 rounded-xl bg-status-rejected/10 border border-status-rejected/20 text-status-rejected text-body-sm">
                    {applyError}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-card border border-border/20 rounded-2xl p-6 shadow-sm">
                <h2 className="font-heading text-headline-sm font-bold text-foreground mb-4">About This Role</h2>
                <div className="space-y-3">
                  {job.description.split("\n").map((line, i) => (
                    <p key={i} className="text-body-md text-foreground/80 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="bg-card border border-border/20 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-heading text-headline-sm font-bold text-foreground mb-4">Requirements</h2>
                  <div className="space-y-2.5">
                    {job.requirements.split("\n").filter(Boolean).map((line, i) => (
                      <div key={i} className="flex items-start gap-3 text-body-md text-foreground/80">
                        <CheckCircle2 className="w-4.5 h-4.5 text-status-accepted flex-shrink-0 mt-0.5" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply CTA at bottom */}
              {user?.role === "student" && !applied && (
                <div className="bg-gradient-to-r from-primary-container/20 to-secondary-container/20 border border-primary-container/30 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-headline-sm font-bold text-foreground">Ready to apply?</h3>
                    <p className="text-body-sm text-muted-foreground mt-0.5">Submit your application and stand out from the crowd.</p>
                  </div>
                  <button
                    className="px-6 py-2.5 bg-primary-container hover:bg-primary-container/90 text-white text-label-md font-semibold rounded-xl transition-all shadow-sm flex-shrink-0"
                    onClick={() => setShowApplyModal(true)}
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>

            {/* ─── Sidebar ─── */}
            <div className="space-y-4">
              {/* Apply / Status card */}
              <div className="bg-card border border-border/20 rounded-2xl p-6 shadow-lg sticky top-20">
                {applied ? (
                  <div className="flex flex-col items-center text-center py-4">
                    <div className="w-14 h-14 rounded-2xl bg-status-accepted/15 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-status-accepted" />
                    </div>
                    <h3 className="font-heading text-headline-sm font-bold text-foreground">Application Sent!</h3>
                    <p className="text-body-sm text-muted-foreground mt-2 max-w-xs">
                      The employer will review your application and get back to you.
                    </p>
                    <Link to="/dashboard" className="mt-5 w-full">
                      <button className="w-full px-4 py-2.5 bg-muted hover:bg-accent text-foreground text-label-md font-semibold rounded-xl border border-border/20 transition-colors">
                        View My Applications
                      </button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Job Summary */}
                    <h3 className="font-heading text-headline-sm font-bold text-foreground mb-4">Job Summary</h3>
                    <div className="space-y-3 text-body-sm">
                      {salary && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" /> Salary</span>
                          <span className="font-semibold text-foreground">{salary}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4" /> Type</span>
                        <span className="font-semibold text-foreground">{JOB_TYPE_LABELS[job.job_type]}</span>
                      </div>
                      {(job.location || job.is_remote) && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</span>
                          <span className="font-semibold text-foreground">{job.is_remote ? "Remote" : job.location}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Applicants</span>
                        <span className="font-semibold text-foreground">{job.application_count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Posted</span>
                        <span className="font-semibold text-foreground">{formatDate(job.created_at)}</span>
                      </div>
                      {job.deadline && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Deadline</span>
                          <span className="font-semibold text-foreground">{formatDate(job.deadline)}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border/10 mt-5 pt-5 space-y-3">
                      {user?.role === "student" ? (
                        <button
                          className="w-full px-4 py-3 bg-primary-container hover:bg-primary-container/90 text-white text-label-md font-semibold rounded-xl transition-all shadow-sm"
                          onClick={() => setShowApplyModal(true)}
                        >
                          Apply Now
                        </button>
                      ) : user?.role === "employer" || user?.role === "admin" ? (
                        <p className="text-center text-body-sm text-muted-foreground py-2">
                          Switch to a student account to apply.
                        </p>
                      ) : (
                        <>
                          <Link to="/register">
                            <button className="w-full px-4 py-3 bg-primary-container hover:bg-primary-container/90 text-white text-label-md font-semibold rounded-xl transition-all shadow-sm">
                              Sign up to Apply
                            </button>
                          </Link>
                          <Link to="/login">
                            <button className="w-full px-4 py-2.5 bg-muted hover:bg-accent text-foreground text-label-md font-semibold rounded-xl border border-border/20 transition-colors">
                              Log in
                            </button>
                          </Link>
                        </>
                      )}
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-accent text-foreground text-label-sm font-medium rounded-xl border border-border/20 transition-colors">
                          <Bookmark className="w-4 h-4" /> Save
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-accent text-foreground text-label-sm font-medium rounded-xl border border-border/20 transition-colors">
                          <Share2 className="w-4 h-4" /> Share
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Company card */}
              <div className="bg-card border border-border/20 rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading text-headline-sm font-bold text-foreground mb-4">About the Company</h3>
                <div className="flex items-center gap-3 mb-4">
                  {job.company.logo_url ? (
                    <img src={job.company.logo_url} alt={job.company.name} className="w-12 h-12 rounded-xl object-cover border border-border/20" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-bold text-sm">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="font-heading text-headline-sm font-semibold text-foreground">{job.company.name}</p>
                    {job.company.industry && (
                      <span className="text-label-sm text-muted-foreground">{job.company.industry}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-body-sm text-muted-foreground">
                  {job.company.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> {job.company.location}
                    </p>
                  )}
                  {job.company.description && (
                    <p className="leading-relaxed pt-1 text-foreground/70">{job.company.description}</p>
                  )}
                  {job.company.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline underline-offset-4 pt-2"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Visit website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

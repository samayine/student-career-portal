import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { jobsApi, applicationsApi, type Job } from "@/api/jobs"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Briefcase,
  Wifi,
  Globe,
  Users,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Calendar,
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

// ─── Apply Modal ───────────────────────────────────────────────────────────

function ApplyModal({
  jobTitle,
  onClose,
  onSubmit,
  isLoading,
}: {
  jobTitle: string
  onClose: () => void
  onSubmit: (coverLetter: string) => void
  isLoading: boolean
}) {
  const [coverLetter, setCoverLetter] = useState("")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <h2 className="text-xl font-bold mb-1">Apply for this position</h2>
        <p className="text-muted-foreground text-sm mb-5">{jobTitle}</p>

        <label className="block text-sm font-medium mb-2">
          Cover Letter <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Tell the employer why you're a great fit for this role..."
          className="w-full h-36 px-3 py-2.5 rounded-xl border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-muted-foreground"
        />

        <div className="flex gap-3 mt-5">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => onSubmit(coverLetter)} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
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

  const handleApply = async (coverLetter: string) => {
    if (!token || !id) return
    setIsApplying(true)
    setApplyError("")
    try {
      await applicationsApi.apply(id, { cover_letter: coverLetter }, token)
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Job not found</h2>
        <Button variant="outline" onClick={() => navigate("/jobs")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
        </Button>
      </div>
    )
  }

  const salary = formatSalary(job.salary_min, job.salary_max)
  const initials = job.company.name.slice(0, 2).toUpperCase()

  return (
    <>
      {showApplyModal && (
        <ApplyModal
          jobTitle={job.title}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleApply}
          isLoading={isApplying}
        />
      )}

      <div className="min-h-[calc(100vh-4rem)] bg-muted/20 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Back */}
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Main content */}
            <div className="space-y-6">
              {/* Header card */}
              <div className="bg-card border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  {job.company.logo_url ? (
                    <img
                      src={job.company.logo_url}
                      alt={job.company.name}
                      className="w-16 h-16 rounded-2xl object-cover border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {initials}
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-extrabold">{job.title}</h1>
                    <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {job.company.name}
                    </p>
                  </div>
                </div>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-3 mt-5 text-sm">
                  {(job.location || job.is_remote) && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {job.is_remote ? "Remote" : job.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {JOB_TYPE_LABELS[job.job_type]}
                  </div>
                  {salary && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      {salary}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {job.application_count} applicant{job.application_count !== 1 ? "s" : ""}
                  </div>
                  {job.deadline && (
                    <div className="flex items-center gap-1.5 text-orange-600">
                      <Calendar className="w-4 h-4" />
                      Deadline: {formatDate(job.deadline)}
                    </div>
                  )}
                </div>

                {applyError && (
                  <div className="mt-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                    {applyError}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Job Description</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {job.description.split("\n").map((line, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-3 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="bg-card border rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-4">Requirements</h2>
                  <div className="space-y-2">
                    {job.requirements.split("\n").map((line, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Apply card */}
              <div className="bg-card border rounded-2xl p-6 sticky top-20">
                {applied ? (
                  <div className="flex flex-col items-center text-center py-2">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
                    <h3 className="font-bold text-lg">Application Sent!</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      The employer will review your application and get back to you.
                    </p>
                    <Link to="/dashboard" className="mt-4 w-full">
                      <Button variant="outline" className="w-full">View My Applications</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      Posted {formatDate(job.created_at)}
                    </p>
                    {user?.role === "student" ? (
                      <Button className="w-full" size="lg" onClick={() => setShowApplyModal(true)}>
                        Apply Now
                      </Button>
                    ) : user?.role === "employer" || user?.role === "admin" ? (
                      <p className="text-center text-sm text-muted-foreground">
                        Switch to a student account to apply.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <Link to="/register">
                          <Button className="w-full">Sign up to Apply</Button>
                        </Link>
                        <Link to="/login">
                          <Button variant="outline" className="w-full">Log in</Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Company card */}
              <div className="bg-card border rounded-2xl p-6">
                <h3 className="font-bold mb-3">About the Company</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{job.company.name}</p>
                  {job.company.industry && <p>{job.company.industry}</p>}
                  {job.company.location && (
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {job.company.location}
                    </p>
                  )}
                  {job.company.description && (
                    <p className="leading-relaxed pt-1">{job.company.description}</p>
                  )}
                  {job.company.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-blue-600 hover:underline pt-1"
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

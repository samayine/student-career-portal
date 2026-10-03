import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {
  jobsApi,
  applicationsApi,
  type Job,
  type ApplicationWithStudent,
  type ApplicationStatus,
} from "@/api/jobs"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Users,
  FileText,
  Download,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Star,
  ChevronDown,
  MapPin,
  Briefcase,
  ExternalLink,
} from "lucide-react"

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  applied: {
    label: "Applied",
    color: "text-status-applied",
    bg: "bg-status-applied/10 border-status-applied/25",
    icon: <Clock className="w-4 h-4" />,
  },
  reviewed: {
    label: "Reviewed",
    color: "text-status-reviewed",
    bg: "bg-status-reviewed/10 border-status-reviewed/25",
    icon: <Eye className="w-4 h-4" />,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "text-status-shortlisted",
    bg: "bg-status-shortlisted/10 border-status-shortlisted/25",
    icon: <Star className="w-4 h-4" />,
  },
  rejected: {
    label: "Rejected",
    color: "text-status-rejected",
    bg: "bg-status-rejected/10 border-status-rejected/25",
    icon: <XCircle className="w-4 h-4" />,
  },
  accepted: {
    label: "Accepted",
    color: "text-status-accepted",
    bg: "bg-status-accepted/10 border-status-accepted/25",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
}

export default function EmployerJobView() {
  const { id } = useParams<{ id: string }>()
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<ApplicationWithStudent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (!token || !id) return
    if (user?.role !== "employer" && user?.role !== "admin") {
      navigate("/")
      return
    }

    Promise.all([
      jobsApi.get(id),
      applicationsApi.listForJob(id, token),
    ])
      .then(([jobData, appsData]) => {
        setJob(jobData)
        setApplications(appsData)
      })
      .catch((e) => setError(e.message || "Failed to load job details"))
      .finally(() => setIsLoading(false))
  }, [id, token, user, navigate])

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    if (!token) return
    setUpdatingId(appId)
    try {
      const updatedApp = await applicationsApi.updateStatus(appId, newStatus, token)
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: updatedApp.status } : app))
      )
    } catch (e: any) {
      alert("Failed to update status: " + e.message)
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center gap-4">
        <h2 className="font-heading text-headline-md font-semibold text-foreground">Error Loading Job</h2>
        <p className="text-body-md text-muted-foreground">{error}</p>
        <Link to="/dashboard">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-accent text-foreground text-label-md rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </Link>
      </div>
    )
  }

  // Group applications by status for the status summary
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background pt-16">
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-label-md text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header Card */}
        <div className="bg-card border border-border/20 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-headline-lg font-bold text-foreground tracking-tight mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-body-sm text-muted-foreground">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-semibold border ${
                  job.status === "active"
                    ? "bg-status-accepted/10 text-status-accepted border-status-accepted/25"
                    : "bg-muted text-foreground border-border/20"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${job.status === "active" ? "bg-status-accepted animate-pulse" : "bg-muted-foreground"}`} />
                  {job.status === "active" ? "Active" : "Closed"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {applications.length} Applicant{applications.length !== 1 ? "s" : ""}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
               <button className="px-4 py-2 bg-muted hover:bg-accent text-foreground text-label-md font-semibold rounded-xl transition-all border border-border/20">
                 Edit Job
               </button>
               <button className="px-4 py-2 bg-status-rejected/10 hover:bg-status-rejected/20 text-status-rejected text-label-md font-semibold rounded-xl transition-all border border-status-rejected/20">
                 Close Job
               </button>
            </div>
          </div>

          {/* Pipeline summary */}
          {applications.length > 0 && (
            <div className="mt-6 pt-5 border-t border-border/10">
              <span className="text-label-sm text-muted-foreground uppercase tracking-wider mb-3 block">Pipeline Summary</span>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map((status) => {
                  const count = statusCounts[status] || 0
                  const cfg = STATUS_CONFIG[status]
                  return (
                    <div key={status} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${cfg.bg} ${cfg.color}`}>
                      {cfg.icon}
                      <span className="text-label-md font-semibold">{count}</span>
                      <span className="text-label-sm opacity-75">{cfg.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Applicants List */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-headline-sm font-bold text-foreground">Applicants</h2>
          <span className="text-label-sm text-muted-foreground">{applications.length} total</span>
        </div>

        {applications.length === 0 ? (
          <div className="bg-card border border-border/20 rounded-2xl p-12 flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-headline-sm font-semibold mb-2 text-foreground">No applicants yet</h3>
            <p className="text-body-sm text-muted-foreground max-w-xs">
              When students apply to this job, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const cfg = STATUS_CONFIG[app.status]
              return (
                <div key={app.id} className="bg-card border border-border/20 rounded-2xl p-6 shadow-sm hover:shadow-card-hover transition-all duration-200">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Applicant info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-bold text-sm">
                            {app.student.first_name[0]}{app.student.last_name[0]}
                          </div>
                          <div>
                            <h3 className="font-heading text-headline-sm font-bold text-foreground">
                              {app.student.first_name} {app.student.last_name}
                            </h3>
                            <span className="text-label-sm text-muted-foreground">
                              Applied {new Date(app.applied_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-body-sm text-muted-foreground mb-4">
                        <a href={`mailto:${app.student.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                          <Mail className="w-4 h-4" /> {app.student.email}
                        </a>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-label-md font-semibold text-foreground flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-muted-foreground" /> Cover Letter
                        </h4>
                        <div className="bg-[hsl(var(--surface-lowest))] rounded-xl p-4 text-body-sm text-foreground/80 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto border border-border/10">
                          {app.cover_letter || <span className="italic text-muted-foreground">No cover letter provided.</span>}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="lg:w-64 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 border-border/10">
                      
                      {/* Resume Download */}
                      <div>
                        <h4 className="text-label-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Resume</h4>
                        {app.resume_url ? (
                          <a
                            href={`http://localhost:8000${app.resume_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2.5 bg-[hsl(var(--surface-lowest))] border border-border/20 rounded-lg text-body-sm text-foreground hover:border-primary/30 hover:text-primary transition-all group"
                          >
                            <span className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              View PDF
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                          </a>
                        ) : (
                          <div className="text-body-sm text-muted-foreground italic px-2">No resume attached</div>
                        )}
                      </div>

                      {/* Status Dropdown */}
                      <div>
                        <h4 className="text-label-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Status</h4>
                        <div className="relative group">
                          <button
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-label-md font-semibold rounded-lg border transition-all ${cfg.bg} ${cfg.color} group-hover:shadow-sm`}
                            disabled={updatingId === app.id}
                          >
                            <span className="flex items-center gap-2">
                              {cfg.icon}
                              {updatingId === app.id ? "Updating..." : cfg.label}
                            </span>
                            <ChevronDown className="w-4 h-4 opacity-50" />
                          </button>
                          
                          {/* Dropdown menu (hover-based for simplicity) */}
                          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/20 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(app.id, status)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-body-sm hover:bg-muted/50 transition-colors ${
                                  status === app.status ? "bg-muted/30 font-semibold" : ""
                                }`}
                              >
                                <span className={STATUS_CONFIG[status].color}>{STATUS_CONFIG[status].icon}</span>
                                {STATUS_CONFIG[status].label}
                                {status === app.status && <span className="ml-auto text-label-sm text-primary">Current</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

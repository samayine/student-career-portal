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
} from "lucide-react"

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  applied: {
    label: "Applied",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    icon: <Clock className="w-4 h-4" />,
  },
  reviewed: {
    label: "Reviewed",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    icon: <Eye className="w-4 h-4" />,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    icon: <Star className="w-4 h-4" />,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    icon: <XCircle className="w-4 h-4" />,
  },
  accepted: {
    label: "Accepted",
    color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Error Loading Job</h2>
        <p className="text-muted-foreground text-sm">{error}</p>
        <Link to="/dashboard">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-card border rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold mb-1">{job.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                job.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-foreground"
              }`}>
                {job.status === "active" ? "Active" : "Closed"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {applications.length} Applicant{applications.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline">Edit Job</Button>
             <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
               Close Job
             </Button>
          </div>
        </div>

        {/* Applicants List */}
        <h2 className="text-lg font-bold mb-4">Applicants</h2>

        {applications.length === 0 ? (
          <div className="bg-card border rounded-2xl p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No applicants yet</h3>
            <p className="text-sm text-muted-foreground">
              When students apply to this job, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const cfg = STATUS_CONFIG[app.status]
              return (
                <div key={app.id} className="bg-card border rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Applicant info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold">
                          {app.student.first_name} {app.student.last_name}
                        </h3>
                        <span className="text-xs text-muted-foreground hidden lg:block">
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <a href={`mailto:${app.student.email}`} className="flex items-center gap-1.5 hover:text-blue-600">
                          <Mail className="w-4 h-4" /> {app.student.email}
                        </a>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-muted-foreground" /> Cover Letter
                        </h4>
                        <div className="bg-muted/50 rounded-xl p-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {app.cover_letter || <span className="italic text-muted-foreground">No cover letter provided.</span>}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="lg:w-64 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 border-border">
                      
                      {/* Resume Download */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Resume</h4>
                        {app.resume_url ? (
                          <a
                            href={`http://localhost:8000${app.resume_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" className="w-full flex items-center justify-between" size="sm">
                              <span>View PDF</span>
                              <Download className="w-4 h-4" />
                            </Button>
                          </a>
                        ) : (
                          <div className="text-sm text-muted-foreground italic px-2">No resume attached</div>
                        )}
                      </div>

                      {/* Status Dropdown */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Status</h4>
                        <div className="relative group">
                          <button
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${cfg.color} border-transparent group-hover:border-border`}
                            disabled={updatingId === app.id}
                          >
                            <span className="flex items-center gap-2">
                              {cfg.icon}
                              {updatingId === app.id ? "Updating..." : cfg.label}
                            </span>
                            <ChevronDown className="w-4 h-4 opacity-50" />
                          </button>
                          
                          {/* Dropdown menu (hover-based for simplicity) */}
                          <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(app.id, status)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${
                                  status === app.status ? "bg-muted/50 font-semibold" : ""
                                }`}
                              >
                                {STATUS_CONFIG[status].icon}
                                {STATUS_CONFIG[status].label}
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

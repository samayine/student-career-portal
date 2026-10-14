import { useState, useEffect, useCallback } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { jobsApi, savedJobsApi, type JobListItem, type JobType } from "@/api/jobs"
import { useAuth } from "@/contexts/AuthContext"
import {
  Search,
  MapPin,
  Building2,
  Wifi,
  DollarSign,
  Briefcase,
  X,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  LayoutGrid,
  List,
  ArrowUpDown,
  Users,
} from "lucide-react"

// ─── Helpers ───────────────────────────────────────────────────────────────

const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  internship: "Internship",
  contract: "Contract",
}

const JOB_TYPE_COLORS: Record<JobType, string> = {
  full_time: "bg-status-applied/10 text-status-applied border border-status-applied/25",
  part_time: "bg-status-shortlisted/10 text-status-shortlisted border border-status-shortlisted/25",
  internship: "bg-status-accepted/10 text-status-accepted border border-status-accepted/25",
  contract: "bg-status-reviewed/10 text-status-reviewed border border-status-reviewed/25",
}

function formatSalary(min?: number | null, max?: number | null): string | null {
  if (!min && !max) return null
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-card border border-border/20 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 bg-muted rounded-full w-20" />
        <div className="h-6 bg-muted rounded-full w-16" />
      </div>
    </div>
  )
}

// ─── Job Card ──────────────────────────────────────────────────────────────

function JobCard({ job, isSaved, onToggleSave }: {
  job: JobListItem
  isSaved?: boolean
  onToggleSave?: (jobId: string, save: boolean) => void
}) {
  const salary = formatSalary(job.salary_min, job.salary_max)
  const initials = job.company.name.slice(0, 2).toUpperCase()
  const { user } = useAuth()
  const isStudent = user?.role === "student"

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onToggleSave) onToggleSave(job.id, !isSaved)
  }

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group block bg-card border border-border/20 rounded-2xl p-6 hover:border-primary/40 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Company logo */}
        {job.company.logo_url ? (
          <img
            src={job.company.logo_url}
            alt={job.company.name}
            className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-border/20"
          />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
            {initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-headline-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {job.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground text-body-sm">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{job.company.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isStudent && onToggleSave && (
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-all ${
                isSaved
                  ? "text-primary bg-primary/15"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
              title={isSaved ? "Remove bookmark" : "Save job"}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
          <span className="text-label-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {timeAgo(job.created_at)}
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-4 text-body-sm text-muted-foreground">
        {(job.location || job.is_remote) && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {job.is_remote ? "Remote" : job.location}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            {salary}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {job.application_count} applicant{job.application_count !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
        <div className="flex flex-wrap gap-2">
          <span className={`text-label-sm font-semibold px-3 py-1 rounded-full ${JOB_TYPE_COLORS[job.job_type]}`}>
            {JOB_TYPE_LABELS[job.job_type]}
          </span>
          {job.is_remote && (
            <span className="text-label-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/25 flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              Remote
            </span>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  )
}

export { JobCard }

// ─── Jobs Page ─────────────────────────────────────────────────────────────

export default function Jobs() {
  const { user, token } = useAuth()
  const isStudent = user?.role === "student"
  const [jobs, setJobs] = useState<JobListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchParams] = useSearchParams()

  // Filter state
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [jobType, setJobType] = useState<JobType | "">(searchParams.get("job_type") as JobType || "")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [sortBy, setSortBy] = useState<string>("newest")

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await jobsApi.list({
        keyword: keyword || undefined,
        location: location || undefined,
        job_type: jobType || undefined,
        is_remote: remoteOnly || undefined,
      })
      setJobs(data)
    } catch (e: any) {
      setError(e.message || "Failed to load jobs")
    } finally {
      setIsLoading(false)
    }
  }, [keyword, location, jobType, remoteOnly])

  useEffect(() => {
    if (token && isStudent) {
      savedJobsApi.list(token)
        .then((saved) => setSavedIds(new Set(saved.map((j) => j.id))))
        .catch(() => {})
    }
  }, [token, isStudent])

  useEffect(() => {
    const timer = setTimeout(fetchJobs, 300)
    return () => clearTimeout(timer)
  }, [fetchJobs])

  const clearFilters = () => {
    setKeyword("")
    setLocation("")
    setJobType("")
    setRemoteOnly(false)
  }

  const handleToggleSave = async (jobId: string, save: boolean) => {
    if (!token) return
    setSavedIds((prev) => {
      const next = new Set(prev)
      save ? next.add(jobId) : next.delete(jobId)
      return next
    })
    try {
      if (save) await savedJobsApi.save(jobId, token)
      else await savedJobsApi.unsave(jobId, token)
    } catch {
      setSavedIds((prev) => {
        const next = new Set(prev)
        save ? next.delete(jobId) : next.add(jobId)
        return next
      })
    }
  }

  const hasFilters = keyword || location || jobType || remoteOnly

  // Sort jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === "salary") return (b.salary_max || 0) - (a.salary_max || 0)
    if (sortBy === "applicants") return b.application_count - a.application_count
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background pt-16">
      {/* Hero header with ambient glow */}
      <div className="relative w-full overflow-hidden pb-6">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 w-full pt-8">
          {/* Title + velocity metric */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-label-sm uppercase tracking-wider text-primary">Curated Student & New Grad Pipeline</span>
              </div>
              <h1 className="font-heading text-headline-lg text-foreground tracking-tight">Explore High-Signal Roles</h1>
              <p className="text-body-md text-muted-foreground mt-1">Vetted early-career opportunities across engineering, product, finance, and design.</p>
            </div>
            <div className="flex items-center gap-4 bg-card px-4 py-2.5 rounded-xl shadow-md border border-border/20 self-start md:self-auto">
              <div className="flex flex-col">
                <span className="text-label-sm text-muted-foreground">Avg. First Response</span>
                <span className="font-heading text-headline-sm text-primary font-bold tracking-tight">42 Hours</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col">
                <span className="text-label-sm text-muted-foreground">Direct Partner Roles</span>
                <span className="font-heading text-headline-sm text-secondary font-bold tracking-tight">84.2%</span>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-card rounded-xl p-2 shadow-xl border border-border/20 flex flex-col lg:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 bg-[hsl(var(--surface-lowest))] px-4 py-2.5 rounded-lg">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                className="w-full bg-transparent text-body-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                placeholder="Job title, company, or keywords"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center gap-3 bg-[hsl(var(--surface-lowest))] px-4 py-2.5 rounded-lg">
              <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                className="w-full bg-transparent text-body-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                placeholder="City, State, or Remote"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            {/* Sort */}
            <div className="flex items-center gap-3 bg-[hsl(var(--surface-lowest))] px-4 py-2.5 rounded-lg lg:w-52">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <select
                className="w-full bg-transparent text-label-md text-foreground focus:outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="salary">Highest Salary</option>
                <option value="applicants">Most Applicants</option>
              </select>
            </div>
            {/* View toggle */}
            <div className="flex items-center bg-[hsl(var(--surface-lowest))] p-1 rounded-lg self-end lg:self-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center justify-center p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-primary-container text-white" : "text-muted-foreground hover:text-foreground"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center justify-center p-2 rounded-md transition-all ${viewMode === "list" ? "bg-primary-container text-white" : "text-muted-foreground hover:text-foreground"}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-label-sm text-muted-foreground uppercase tracking-wider mr-1">Active Filters:</span>
                {keyword && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-label-sm shadow-sm">
                    <span>"{keyword}"</span>
                    <button onClick={() => setKeyword("")} className="hover:text-foreground transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-label-sm shadow-sm">
                    <span>📍 {location}</span>
                    <button onClick={() => setLocation("")} className="hover:text-foreground transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {jobType && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-label-sm shadow-sm">
                    <span>{JOB_TYPE_LABELS[jobType]}</span>
                    <button onClick={() => setJobType("")} className="hover:text-foreground transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {remoteOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-label-sm shadow-sm">
                    <span>Remote Only</span>
                    <button onClick={() => setRemoteOnly(false)} className="hover:text-foreground transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-label-sm text-secondary hover:text-primary transition-colors ml-2 underline underline-offset-4">
                  Reset all
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="text-label-md text-muted-foreground">
                  Showing <span className="font-bold text-foreground">{sortedJobs.length} matched roles</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content with sidebar */}
      <div className="max-w-[1200px] mx-auto px-6 w-full pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar filters */}
          <aside className="lg:col-span-3 flex flex-col gap-4 lg:sticky lg:top-20">
            <div className="bg-card rounded-xl p-5 shadow-lg border border-border/20 flex flex-col gap-6">
              {/* Remote toggle */}
              <div className="flex items-center justify-between bg-[hsl(var(--surface-low))] p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-accepted animate-pulse" />
                  <span className="text-label-md text-foreground font-semibold">Remote Only</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={remoteOnly} onChange={() => setRemoteOnly(!remoteOnly)} />
                  <div className="w-10 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container" />
                </label>
              </div>

              {/* Job Type */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-muted-foreground uppercase tracking-wider font-semibold">Job Type</span>
                  {jobType && <button onClick={() => setJobType("")} className="text-label-sm text-primary hover:text-foreground transition-colors">Clear</button>}
                </div>
                <div className="flex flex-col gap-2">
                  {(["full_time", "part_time", "internship", "contract"] as JobType[]).map((type) => (
                    <label key={type} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="jobType"
                          checked={jobType === type}
                          onChange={() => setJobType(jobType === type ? "" : type)}
                          className="w-4 h-4 accent-primary-container cursor-pointer"
                        />
                        <span className="text-body-md text-foreground group-hover:text-primary transition-colors">{JOB_TYPE_LABELS[type]}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Posted date filter */}
              <div className="flex flex-col gap-3">
                <span className="text-label-sm text-muted-foreground uppercase tracking-wider font-semibold">Posted</span>
                <div className="flex flex-col gap-2">
                  {["Any time", "Last 24h", "Last week", "Last month"].map((label) => (
                    <button key={label} className="text-left text-body-md text-foreground hover:text-primary px-2 py-1 rounded hover:bg-muted/50 transition-colors">
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job cards */}
          <div className="lg:col-span-9">
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-body-sm mb-6 border border-destructive/20">{error}</div>
            )}

            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "grid gap-4"}>
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : sortedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-headline-md font-semibold mb-2 text-foreground">No jobs found</h3>
                <p className="text-body-md text-muted-foreground max-w-sm">
                  {hasFilters
                    ? "Try adjusting your filters to see more results."
                    : "No job postings are available yet. Check back soon!"}
                </p>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-muted hover:bg-accent text-foreground text-label-md rounded-lg transition-colors">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "grid gap-4"}>
                {sortedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedIds.has(job.id)}
                    onToggleSave={isStudent ? handleToggleSave : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

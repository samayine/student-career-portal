import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { jobsApi, type JobListItem, type JobType } from "@/api/jobs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  MapPin,
  Building2,
  Clock,
  Wifi,
  DollarSign,
  Briefcase,
  SlidersHorizontal,
  X,
} from "lucide-react"

// ─── Helpers ───────────────────────────────────────────────────────────────

const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  internship: "Internship",
  contract: "Contract",
}

const JOB_TYPE_COLORS: Record<JobType, string> = {
  full_time: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  part_time: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  internship: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  contract: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
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
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-card border rounded-2xl p-6 animate-pulse">
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

function JobCard({ job }: { job: JobListItem }) {
  const salary = formatSalary(job.salary_min, job.salary_max)
  const initials = job.company.name.slice(0, 2).toUpperCase()

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group block bg-card border border-border rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Company logo / initials */}
        {job.company.logo_url ? (
          <img
            src={job.company.logo_url}
            alt={job.company.name}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors truncate">
            {job.title}
          </h3>
          <div className="flex items-center gap-1 mt-0.5 text-muted-foreground text-sm">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{job.company.name}</span>
          </div>
        </div>

        <span className="text-xs text-muted-foreground flex-shrink-0">
          {timeAgo(job.created_at)}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-sm text-muted-foreground">
        {(job.location || job.is_remote) && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {job.is_remote ? "Remote" : job.location}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            {salary}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5" />
          {job.application_count} applicant{job.application_count !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${JOB_TYPE_COLORS[job.job_type]}`}>
          {JOB_TYPE_LABELS[job.job_type]}
        </span>
        {job.is_remote && (
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            Remote
          </span>
        )}
      </div>
    </Link>
  )
}

// ─── Jobs Page ─────────────────────────────────────────────────────────────

export default function Jobs() {
  const [jobs, setJobs] = useState<JobListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Filter state
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState<JobType | "">("")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

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

  // Debounce keyword/location changes
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

  const hasFilters = keyword || location || jobType || remoteOnly

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20">
      {/* Hero search bar */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-blue-100 text-center mb-8">
            {isLoading ? "Loading..." : `${jobs.length} jobs available`}
          </p>

          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-white/10 rounded-xl text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              />
            </div>
            <div className="relative flex-1 hidden md:block">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-white/10 rounded-xl text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-11 px-4 bg-white/20 hover:bg-white/30 rounded-xl text-white flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="md:hidden">
                <label className="text-white/70 text-xs font-medium block mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/60" />
                  <input
                    type="text"
                    placeholder="City, country..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 bg-white/10 rounded-lg text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/70 text-xs font-medium block mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as JobType | "")}
                  className="w-full h-9 px-3 bg-white/10 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                >
                  <option value="" className="text-gray-800">All Types</option>
                  <option value="full_time" className="text-gray-800">Full Time</option>
                  <option value="part_time" className="text-gray-800">Part Time</option>
                  <option value="internship" className="text-gray-800">Internship</option>
                  <option value="contract" className="text-gray-800">Contract</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setRemoteOnly(!remoteOnly)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${remoteOnly ? "bg-blue-400" : "bg-white/20"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${remoteOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-white text-sm">Remote only</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {keyword && (
              <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2.5 py-1 rounded-full">
                "{keyword}"
                <button onClick={() => setKeyword("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2.5 py-1 rounded-full">
                📍 {location}
                <button onClick={() => setLocation("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {jobType && (
              <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2.5 py-1 rounded-full">
                {JOB_TYPE_LABELS[jobType]}
                <button onClick={() => setJobType("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {remoteOnly && (
              <span className="flex items-center gap-1 text-xs bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 px-2.5 py-1 rounded-full">
                Remote only
                <button onClick={() => setRemoteOnly(false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground underline">
              Clear all
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm mb-6">{error}</div>
        )}

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No jobs found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {hasFilters
                ? "Try adjusting your filters to see more results."
                : "No job postings are available yet. Check back soon!"}
            </p>
            {hasFilters && (
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

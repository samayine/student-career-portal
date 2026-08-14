import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { jobsApi, companiesApi, uploadsApi, type Company, type JobType } from "@/api/jobs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Briefcase,
  Building2,
  Plus,
  CheckCircle2,
} from "lucide-react"

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
]

// ─── Create Company Form ───────────────────────────────────────────────────

function CreateCompanyForm({ onCreated }: { onCreated: (c: Company) => void }) {
  const { token } = useAuth()
  const [form, setForm] = useState({
    name: "", description: "", website: "", location: "", industry: "",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setIsLoading(true)
    setError("")
    try {
      let logo_url = null;
      if (logoFile) {
        const { url } = await uploadsApi.upload(logoFile, token)
        logo_url = url;
      }
      const company = await companiesApi.create(
        { ...form, logo_url },
        token
      )
      onCreated(company)
    } catch (err: any) {
      setError(err.message || "Failed to create company")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card border rounded-2xl p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Create your company profile</h2>
          <p className="text-sm text-muted-foreground">Set up your company before posting jobs</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo">Company Logo</Label>
          <input 
            id="logo"
            type="file" 
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/40 dark:file:text-blue-300 dark:hover:file:bg-blue-900/60"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Company Name *</Label>
          <Input id="name" name="name" required value={form.name} onChange={handle} placeholder="Acme Corp" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" name="industry" value={form.industry} onChange={handle} placeholder="Technology, Finance, Healthcare..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={form.location} onChange={handle} placeholder="San Francisco, CA" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" type="url" value={form.website} onChange={handle} placeholder="https://acme.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">About the Company</Label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handle}
            rows={3}
            placeholder="Tell candidates about your company..."
            className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-muted-foreground"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Company Profile"}
        </Button>
      </form>
    </div>
  )
}

// ─── Post Job Form ─────────────────────────────────────────────────────────

function PostJobForm({ company }: { company: Company }) {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    is_remote: false,
    job_type: "full_time" as JobType,
    salary_min: "",
    salary_max: "",
    deadline: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setIsLoading(true)
    setError("")
    try {
      const job = await jobsApi.create(
        {
          title: form.title,
          description: form.description,
          requirements: form.requirements || undefined,
          location: form.location || undefined,
          is_remote: form.is_remote,
          job_type: form.job_type,
          salary_min: form.salary_min ? Number(form.salary_min) : undefined,
          salary_max: form.salary_max ? Number(form.salary_max) : undefined,
          deadline: form.deadline || undefined,
          company_id: company.id,
        },
        token
      )
      navigate(`/jobs/${job.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to post job")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Company banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 mb-6 flex items-center gap-3 text-white">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
          {company.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold">{company.name}</p>
          {company.industry && <p className="text-blue-100 text-sm">{company.industry}</p>}
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          Post a New Job
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        <form onSubmit={submit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title" name="title" required
              value={form.title} onChange={handle}
              placeholder="e.g. Frontend Engineer Intern"
            />
          </div>

          {/* Type + Remote */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_type">Job Type *</Label>
              <select
                id="job_type" name="job_type"
                value={form.job_type} onChange={handle}
                className="w-full h-10 px-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location" name="location"
                value={form.location} onChange={handle}
                placeholder="New York, NY"
                disabled={form.is_remote}
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              onClick={() => setForm((p) => ({ ...p, is_remote: !p.is_remote }))}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.is_remote ? "bg-blue-600" : "bg-muted-foreground/30"}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_remote ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm font-medium">This is a remote position</span>
          </label>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_min">Min Salary ($/yr)</Label>
              <Input
                id="salary_min" name="salary_min" type="number" min={0}
                value={form.salary_min} onChange={handle}
                placeholder="50000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_max">Max Salary ($/yr)</Label>
              <Input
                id="salary_max" name="salary_max" type="number" min={0}
                value={form.salary_max} onChange={handle}
                placeholder="80000"
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              id="deadline" name="deadline" type="date"
              value={form.deadline} onChange={handle}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <textarea
              id="description" name="description" required
              value={form.description} onChange={handle}
              rows={6}
              placeholder="Describe the role, responsibilities, team, and what success looks like..."
              className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-muted-foreground"
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">
              Requirements <span className="text-muted-foreground font-normal">(one per line)</span>
            </Label>
            <textarea
              id="requirements" name="requirements"
              value={form.requirements} onChange={handle}
              rows={4}
              placeholder="Bachelor's degree in Computer Science&#10;1+ year of React experience&#10;Strong communication skills"
              className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-muted-foreground"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Publishing..." : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Publish Job Posting
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

// ─── Post Job Page ─────────────────────────────────────────────────────────

export default function PostJob() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    companiesApi
      .getMyCompany(token)
      .then(setCompany)
      .catch(() => setCompany(null))
      .finally(() => setIsLoading(false))
  }, [token])

  if (user?.role !== "employer" && user?.role !== "admin") {
    navigate("/")
    return null
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold">Post a Job</h1>
          <p className="text-muted-foreground mt-1">Reach thousands of talented students</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : company ? (
          <PostJobForm company={company} />
        ) : (
          <CreateCompanyForm onCreated={setCompany} />
        )}
      </div>
    </div>
  )
}

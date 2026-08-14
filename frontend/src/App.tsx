import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import Navbar from "@/components/layout/Navbar"
import ProtectedRoute from "@/components/layout/ProtectedRoute"

import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Jobs from "@/pages/Jobs"
import JobDetail from "@/pages/JobDetail"
import Dashboard from "@/pages/Dashboard"
import PostJob from "@/pages/PostJob"
import EmployerJobView from "@/pages/EmployerJobView"
import Settings from "@/pages/Settings"

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />

              {/* Protected — any logged-in user */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Protected — employers only */}
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute role="employer">
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/jobs/:id"
                element={
                  <ProtectedRoute role="employer">
                    <EmployerJobView />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

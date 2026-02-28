import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Eagerly load core pages (always needed)
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

// Lazy load non-critical routes for smaller initial bundle
const Jobs = lazy(() => import("./components/Jobs"));
const Browse = lazy(() => import("./components/Browse"));
const Profile = lazy(() => import("./components/Profile"));
const JobDescription = lazy(() => import("./components/JobDescription"));
const Companies = lazy(() => import("./components/admin/Companies"));
const CompanyCreate = lazy(() => import("./components/admin/CompanyCreate"));
const CompanySetup = lazy(() => import("./components/admin/CompanySetup"));
const AdminJobs = lazy(() => import("./components/admin/AdminJobs"));
const PostJob = lazy(() => import("./components/admin/PostJob"));
const Applicants = lazy(() => import("./components/admin/Applicants"));
const AIChatWidget = lazy(() => import("./components/AIChatWidget"));
const SkillGapAnalyzer = lazy(() => import("./components/SkillGap/SkillGapAnalyzer"));

// Minimal fallback to avoid layout shift
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/job/:id",
    element: <JobDescription />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/skill-gap",
    element: <SkillGapAnalyzer />,
  },
  // Admin routes
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <div>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={appRouter} />
        <AIChatWidget />
      </Suspense>
    </div>
  );
}

export default App;

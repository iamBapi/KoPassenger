import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AppShell } from "./components/Layout/AppShell.jsx";
import { Signup } from "./pages/Signup.jsx";
import { Login } from "./pages/Login.jsx";
import { ForgotPassword } from "./pages/ForgotPassword.jsx";
import { ResetPassword } from "./pages/ResetPassword.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Settings } from "./pages/Settings.jsx";
import { FindRide } from "./pages/FindRide.jsx";
import { PostRide } from "./pages/PostRide.jsx";
import { MyRequests } from "./pages/MyRequests.jsx";
import { MyRides } from "./pages/MyRides.jsx";
import { MyFixedRides } from "./pages/MyFixedRides.jsx";
import { RideHistory } from "./pages/RideHistory.jsx";
import { PublicProfile } from "./pages/PublicProfile.jsx";
import { Landing } from "./pages/Landing.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Chat } from "./pages/Chat.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function AuthPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
    </div>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-brand-50 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      {children}
    </div>
  );
}

/**
 * Wraps auth pages (login/signup).
 * If already logged in → send them to redirectTo (query param) or /dashboard.
 */
function GuestOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") || "/dashboard";

  if (loading) return <AuthPageSpinner />;
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;
  return <AuthLayout>{children}</AuthLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
      <ThemeProvider>
        <Toaster richColors position="top-center" />
        <Routes>
          {/* Public auth pages */}
          <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
          <Route path="/signup" element={<GuestOnlyRoute><Signup /></GuestOnlyRoute>} />
          <Route path="/forgot-password" element={<GuestOnlyRoute><ForgotPassword /></GuestOnlyRoute>} />
          <Route path="/reset-password" element={<GuestOnlyRoute><ResetPassword /></GuestOnlyRoute>} />

          {/* Protected pages — all share the AppShell layout */}
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/find-ride" element={<FindRide />} />
            <Route path="/post-ride" element={<PostRide />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/my-rides" element={<MyRides />} />
            <Route path="/my-fixed-rides" element={<MyFixedRides />} />
            <Route path="/history" element={<RideHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chat" element={<Chat />} />
          </Route>

          {/* Public landing page */}
          <Route path="/" element={<Landing />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

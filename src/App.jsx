import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Dashboard from './components/pages/Dashboard';
import StudyPlanner from './components/pages/StudyPlanner';
import PomodoroTimer from './components/pages/PomodoroTimer';
import GPATracker from './components/pages/GPATracker';
import ExamPrepSystem from './components/pages/ExamPrepSystem';
import WeeklyReview from './components/pages/WeeklyReview';
import Calendar from './components/pages/Calendar';
import Settings from './components/pages/Settings';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <Router>
          <Routes>
            {/* Auth Routes (public) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/planner"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudyPlanner />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pomodoro"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PomodoroTimer />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/gpa"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GPATracker />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam-prep"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ExamPrepSystem />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/weekly-review"
              element={
                <ProtectedRoute>
                  <Layout>
                    <WeeklyReview />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Calendar />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

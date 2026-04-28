import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/pages/Dashboard';
import StudyPlanner from './components/pages/StudyPlanner';
import PomodoroTimer from './components/pages/PomodoroTimer';
import GPATracker from './components/pages/GPATracker';
import ExamPrepSystem from './components/pages/ExamPrepSystem';
import WeeklyReview from './components/pages/WeeklyReview';
import Calendar from './components/pages/Calendar';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/planner" element={<Layout><StudyPlanner /></Layout>} />
          <Route path="/pomodoro" element={<Layout><PomodoroTimer /></Layout>} />
          <Route path="/gpa" element={<Layout><GPATracker /></Layout>} />
          <Route path="/exam-prep" element={<Layout><ExamPrepSystem /></Layout>} />
          <Route path="/weekly-review" element={<Layout><WeeklyReview /></Layout>} />
          <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

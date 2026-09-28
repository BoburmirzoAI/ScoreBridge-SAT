import { Route, Routes } from 'react-router-dom';
import { Shell } from './layout/Shell';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Homework from './pages/Homework';
import Solve from './pages/Solve';
import Result from './pages/Result';
import Rankings from './pages/Rankings';
import Attendance from './pages/Attendance';
import MockExams from './pages/MockExams';
import Profile from './pages/Profile';
import DesignSystem from './pages/DesignSystem';

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/homework" element={<Homework />} />
        <Route path="/homework/:id/solve" element={<Solve />} />
        <Route path="/homework/:id/result" element={<Result />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/mock-exams" element={<MockExams />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

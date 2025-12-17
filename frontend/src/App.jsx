import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import StudentPollPage from './pages/StudentPollPage';
import TeacherPollPage from './pages/TeacherPollPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/student" element={<StudentPage />} />
      <Route path="/teacher" element={<TeacherPage />} />
      <Route path="/student/poll/:pollCode" element={<StudentPollPage />} />
      <Route path="/teacher/poll/:pollCode" element={<TeacherPollPage />} />
    </Routes>
  );
}

export default App;

// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import CoursesList from "./CoursesList";
import CourseDetails from "./CourseDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./AdminDashboard";
import LessonViewer from "./LessonViewer";
import Navbar from "./components/Navbar";   


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/courses" element={<CoursesList />} />
      <Route path="/courses/:id" element={<CourseDetails />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
    <Route
  path="/courses/:courseId/lessons/:lessonId"
  element={
    <ProtectedRoute>
      <LessonViewer />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default App;

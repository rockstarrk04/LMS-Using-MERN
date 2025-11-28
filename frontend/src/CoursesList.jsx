import { useEffect, useState, useContext } from "react";
import { API_BASE_URL } from "./api/client";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`);
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Error loading courses", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!user || user.role !== "student") {
      alert("You must be logged in as a student to enroll.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to enroll");
      } else {
        alert("Enrolled successfully!");
      }
    } catch (err) {
      console.error("Enroll error", err);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Courses</h1>
          <Link
            to="/"
            className="text-sm text-slate-300 hover:text-white underline"
          >
            Back Home
          </Link>
        </div>

        {courses.length === 0 ? (
          <p className="text-slate-400 text-sm">No courses available yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-slate-800 rounded-xl p-4 shadow-md"
              >
                <h2 className="text-lg font-semibold mb-1">
                  <Link
                    to={`/courses/${course._id}`}
                    className="hover:underline"
                  >
                    {course.title}
                  </Link>
                </h2>
                <p className="text-xs text-slate-400 mb-2">
                  {course.category} • {course.level}
                </p>
                <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                  {course.description}
                </p>
                {course.instructor && (
                  <p className="text-xs text-slate-500 mb-3">
                    Instructor: {course.instructor.name}
                  </p>
                )}

                <div className="flex gap-2">
                  <Link
                    to={`/courses/${course._id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs"
                  >
                    View details
                  </Link>

                  {user && user.role === "student" && (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursesList;

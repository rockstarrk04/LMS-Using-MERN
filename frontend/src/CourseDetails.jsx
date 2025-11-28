import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "./api/client";
import { AuthContext } from "./context/AuthContext";

function CourseDetails() {
  const { id } = useParams(); // course id from URL
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/courses/${id}`),
          fetch(`${API_BASE_URL}/courses/${id}/lessons`),
        ]);

        const courseData = await courseRes.json();
        const lessonsData = await lessonsRes.json();

        if (!courseRes.ok) {
          setError(courseData.message || "Failed to load course");
        } else {
          setCourse(courseData.course);
        }

        if (lessonsRes.ok) {
          setLessons(lessonsData.lessons || []);
        }
      } catch (err) {
        setError("Something went wrong loading the course");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      alert("Only students can enroll in courses.");
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${id}/enroll`, {
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
      alert("Something went wrong while enrolling");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading course...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <p className="mb-3">{error || "Course not found"}</p>
        <Link
          to="/courses"
          className="text-sm text-blue-400 hover:underline"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-white mb-3"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
          <p className="text-sm text-slate-300 mb-2">{course.description}</p>
          <p className="text-xs text-slate-400 mb-1">
            Category: {course.category || "General"} • Level: {course.level}
          </p>
          {course.instructor && (
            <p className="text-xs text-slate-400">
              Instructor: {course.instructor.name}
            </p>
          )}

          <div className="mt-4 flex gap-3">
            {user && user.role === "student" && (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium disabled:opacity-60"
              >
                {enrolling ? "Enrolling..." : "Enroll in course"}
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Lessons</h2>
          {lessons.length === 0 ? (
            <p className="text-sm text-slate-400">No lessons added yet.</p>
          ) : (
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li
                  key={lesson._id}
                  className="bg-slate-900 rounded-lg p-3 text-sm"
                >
                  <p className="font-semibold mb-1">
                    {lesson.order ? `${lesson.order}. ` : ""}
                    {lesson.title}
                  </p>
                  {lesson.description && (
                    <p className="text-xs text-slate-400 mb-1">
                      {lesson.description}
                    </p>
                  )}
                  {lesson.videoUrl && (
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Watch video
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;

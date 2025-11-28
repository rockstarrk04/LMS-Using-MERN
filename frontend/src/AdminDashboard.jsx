// src/AdminDashboard.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { API_BASE_URL } from "./api/client";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/admin/courses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usersData = await usersRes.json();
        const coursesData = await coursesRes.json();

        if (usersRes.ok) setUsers(usersData.users || []);
        if (coursesRes.ok) setCourses(coursesData.courses || []);
      } catch (err) {
        console.error("Admin load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, token, navigate]);

  const toggleBlock = async (userId, block) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/block`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ block }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to update user");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBlocked: block } : u
        )
      );
    } catch (err) {
      console.error("toggleBlock error", err);
      alert("Something went wrong");
    }
  };

  if (!user || user.role !== "admin") return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        <section className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Users</h2>
          {users.length === 0 ? (
            <p className="text-sm text-slate-400">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2 pr-2">Name</th>
                    <th className="text-left py-2 pr-2">Email</th>
                    <th className="text-left py-2 pr-2">Role</th>
                    <th className="text-left py-2 pr-2">Status</th>
                    <th className="text-left py-2 pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-slate-800 hover:bg-slate-900/60"
                    >
                      <td className="py-2 pr-2">{u.name}</td>
                      <td className="py-2 pr-2 text-slate-300">
                        {u.email}
                      </td>
                      <td className="py-2 pr-2 text-xs uppercase">
                        {u.role}
                      </td>
                      <td className="py-2 pr-2 text-xs">
                        {u.isBlocked ? (
                          <span className="text-red-400">Blocked</span>
                        ) : (
                          <span className="text-emerald-400">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-2">
                        {u.role === "admin" ? (
                          <span className="text-xs text-slate-500">
                            (admin)
                          </span>
                        ) : u.isBlocked ? (
                          <button
                            onClick={() => toggleBlock(u._id, false)}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleBlock(u._id, true)}
                            className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-xs"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Courses</h2>
          {courses.length === 0 ? (
            <p className="text-sm text-slate-400">No courses found.</p>
          ) : (
            <div className="space-y-2">
              {courses.map((c) => (
                <div
                  key={c._id}
                  className="bg-slate-900 rounded-lg p-3 text-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-slate-400">
                      {c.category || "Uncategorized"} • {c.level} •{" "}
                      {c.instructor
                        ? `Instructor: ${c.instructor.name}`
                        : "No instructor"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;

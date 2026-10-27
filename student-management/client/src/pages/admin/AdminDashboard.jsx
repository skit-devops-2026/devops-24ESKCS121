import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  RefreshCw,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function AdminDashboard({ user, token }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  // Common API request helper
  const request = useCallback(
    async (path, options = {}) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "The request could not be completed.");
      }

      return data;
    },
    [token],
  );

  // Fetch teachers without changing loading state synchronously.
  const fetchTeachers = useCallback(async () => {
    const data = await request("/admin/teachers");

    return Array.isArray(data) ? data : data.teachers || [];
  }, [request]);

  // Initial teacher load.
  useEffect(() => {
    let cancelled = false;

    fetchTeachers()
      .then((data) => {
        if (!cancelled) {
          setTeachers(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Unable to load teachers.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchTeachers]);

  // Refresh teachers when the Admin clicks Refresh.
  async function loadTeachers() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchTeachers();
      setTeachers(data);
    } catch (err) {
      setError(err.message || "Unable to load teachers.");
    } finally {
      setLoading(false);
    }
  }

  // Approve or reject a pending teacher.
  async function updateTeacher(id, action) {
    const actionLabel = action === "approve" ? "approve" : "reject";

    if (
      action === "reject" &&
      !window.confirm("Are you sure you want to reject this teacher?")
    ) {
      return;
    }

    setBusyId(id);
    setError("");
    setMessage("");

    try {
      await request(`/admin/teachers/${id}/${action}`, {
        method: "PATCH",
      });

      setMessage(
        action === "approve"
          ? "Teacher approved successfully."
          : "Teacher rejected successfully.",
      );

      const data = await fetchTeachers();
      setTeachers(data);
    } catch (err) {
      setError(err.message || `Unable to ${actionLabel} teacher.`);
    } finally {
      setBusyId(null);
    }
  }

  // Delete a teacher account.
  async function deleteTeacher(teacher) {
    const id = teacher._id || teacher.id;

    if (!id) {
      setError("Unable to identify this teacher account.");
      return;
    }

    if (
      !window.confirm(
        `Delete the teacher account for ${teacher.name}? This cannot be undone.`,
      )
    ) {
      return;
    }

    setBusyId(id);
    setError("");
    setMessage("");

    try {
      await request(`/admin/teachers/${id}`, {
        method: "DELETE",
      });

      setMessage("Teacher account deleted successfully.");

      const data = await fetchTeachers();
      setTeachers(data);
    } catch (err) {
      setError(err.message || "Unable to delete teacher.");
    } finally {
      setBusyId(null);
    }
  }

  const pendingCount = teachers.filter(
    (teacher) => teacher.approvalStatus === "pending",
  ).length;

  const approvedCount = teachers.filter(
    (teacher) => teacher.approvalStatus === "approved",
  ).length;

  const visibleTeachers = teachers.filter((teacher) => {
    if (filter === "pending") {
      return teacher.approvalStatus === "pending";
    }

    if (filter === "approved") {
      return teacher.approvalStatus === "approved";
    }

    if (filter === "rejected") {
      return teacher.approvalStatus === "rejected";
    }

    return true;
  });

  return (
    <section className="admin-dashboard">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">STUDYSPHERE ADMINISTRATION</p>

          <h1>Welcome, {user?.name || "Admin"}!</h1>

          <p>Manage teacher registrations and approval requests.</p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadTeachers}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="admin-stats">
        <article className="admin-stat-card">
          <BookOpen size={23} />

          <div>
            <p>Total teachers</p>
            <strong>{teachers.length}</strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <Clock size={23} />

          <div>
            <p>Pending requests</p>
            <strong>{pendingCount}</strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <CheckCircle size={23} />

          <div>
            <p>Approved teachers</p>
            <strong>{approvedCount}</strong>
          </div>
        </article>
      </div>

      {error && (
        <p className="admin-alert admin-alert-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="admin-alert admin-alert-success" role="status">
          {message}
        </p>
      )}

      <div className="admin-section-heading">
        <div>
          <h2>Teacher management</h2>
          <p>Review applications and manage teacher accounts.</p>
        </div>

        <label>
          <span className="sr-only">Filter teachers</span>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All teachers</option>
            <option value="pending">Pending requests</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="admin-empty-state">Loading teachers...</p>
      ) : visibleTeachers.length === 0 ? (
        <div className="admin-empty-state">
          <GraduationCap size={32} />

          <h3>No teachers found</h3>

          <p>There are no teachers in this category right now.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleTeachers.map((teacher) => {
                const id = teacher._id || teacher.id;
                const isBusy = busyId === id;

                return (
                  <tr key={id}>
                    <td>
                      <strong>{teacher.name}</strong>

                      <span className="admin-teacher-email">
                        {teacher.email}
                      </span>

                      <span className="admin-teacher-college">
                        {teacher.college}
                      </span>
                    </td>

                    <td>{teacher.department || "—"}</td>

                    <td>{teacher.designation || "—"}</td>

                    <td>
                      <span
                        className={`admin-status admin-status-${teacher.approvalStatus}`}
                      >
                        {teacher.approvalStatus || "unknown"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-actions">
                        {teacher.approvalStatus === "pending" && (
                          <>
                            <button
                              type="button"
                              className="admin-action-approve"
                              disabled={isBusy}
                              onClick={() => updateTeacher(id, "approve")}
                              title="Approve teacher"
                            >
                              <UserCheck size={15} />
                              Approve
                            </button>

                            <button
                              type="button"
                              className="admin-action-reject"
                              disabled={isBusy}
                              onClick={() => updateTeacher(id, "reject")}
                              title="Reject teacher"
                            >
                              <UserX size={15} />
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          className="admin-action-delete"
                          disabled={isBusy}
                          onClick={() => deleteTeacher(teacher)}
                          title="Delete teacher"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

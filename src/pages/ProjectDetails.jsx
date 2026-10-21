import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else {
        setProject(data);
      }

      setLoading(false);
    }

    fetchProject();
  }, [id]);

  async function handleDelete() {
    if (!user || !project || user.id !== project.user_id || deleting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    setDeleting(true);

    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id)
      .eq("user_id", user.id)
      .select("id");

    if (error) {
      console.error("Error deleting project:", error.message);
      alert("Failed to delete project: " + error.message);
      setDeleting(false);
      return;
    }

    if (!data || data.length === 0) {
      alert("Project was not deleted.");
      setDeleting(false);
      return;
    }

    navigate("/projects");
  }

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <article className="post">
      <header>
        <div className="title">
          <h2>{project.title}</h2>
          <p>Project Details</p>
        </div>
      </header>

      {project.image_url && (
        <img
          src={project.image_url}
          alt={project.title}
          style={{ maxWidth: "100%" }}
        />
      )}

      <p>{project.description}</p>

      <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
      
{user?.id === project.user_id && (
  <ul className="actions">
    <li>
      <Link
        to={`/projects/${project.id}/edit`}
        className="button"
      >
        Edit Project
      </Link>
    </li>

    <li>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete Project"}
      </button>
    </li>
  </ul>
)}

    </article>
  );
}

export default ProjectDetails;

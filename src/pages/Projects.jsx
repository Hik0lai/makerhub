
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchProjects() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          profiles (
            display_name
          )
        `)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setError(error.message);
      } else {
        setProjects(data || []);
      }

      setLoading(false);
    }

    fetchProjects();

    return () => {
      active = false;
    };
  }, []);

  function getShortDescription(description) {
    if (!description) return "";

    const maxLength = 180;

    if (description.length <= maxLength) {
      return description;
    }

    return description.slice(0, maxLength).trimEnd() + "...";
  }

  return (
    <article className="post">
      <header>
        <div className="title">
          <h2>Projects Catalog</h2>
          <p>Explore DIY projects shared by the community</p>
        </div>
      </header>

      <ul className="actions">
        <li>
          <Link
            to="/projects/create"
            className="button large"
          >
            Create New Project
          </Link>
        </li>
      </ul>

      {loading && <p>Loading projects...</p>}

      {error && <p>Error: {error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p>No projects found yet.</p>
      )}

      {!loading &&
        !error &&
        projects.map((project) => (
          <div
            key={project.id}
            style={{ marginBottom: "35px" }}
          >
            <h3>
              <Link to={`/projects/${project.id}`}>
                {project.title}
              </Link>
            </h3>

            <p>
              <strong>Created by:</strong>{" "}
              {project.profiles?.display_name || "Unknown"}
              {" | "}
              <strong>Created on:</strong>{" "}
              {new Date(
                project.created_at
              ).toLocaleDateString()}
            </p>

            {project.image_url && (
              <Link to={`/projects/${project.id}`}>
                <img
                  src={project.image_url}
                  alt={project.title}
                  style={{
                    display: "block",
                    width: "100%",
                    maxWidth: "600px",
                    maxHeight: "280px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginBottom: "20px",
                  }}
                />
              </Link>
            )}

            <p>
              {getShortDescription(project.description)}
            </p>

            <ul className="actions">
              <li>
                <Link
                  to={`/projects/${project.id}`}
                  className="button"
                >
                  View Details
                </Link>
              </li>
            </ul>

            <hr />
          </div>
        ))}
    </article>
  );
}

export default Projects;

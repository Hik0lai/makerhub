
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setProjects(data);
      }

      setLoading(false);
    }

    fetchProjects();
  }, []);

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
          <Link to="/projects/create" className="button large">
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
          <div key={project.id}>
            <h3>
              <Link to={`/projects/${project.id}`}>
                {project.title}
              </Link>
            </h3>

            <p>{project.description}</p>

            {project.image_url && (
              <img
                src={project.image_url}
                alt={project.title}
                style={{ maxWidth: "100%" }}
              />
            )}

            <hr />
          </div>
        ))}
    </article>
  );
}

export default Projects;

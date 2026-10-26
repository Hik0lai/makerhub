
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Projects() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesError, setLikesError] = useState(null);
  const [updatingProjectId, setUpdatingProjectId] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchProjects() {
      setLoading(true);
      setError(null);
      setLikesError(null);

      const [projectsResult, likesResult] = await Promise.all([
        supabase
          .from("projects")
          .select("*, profiles(display_name)")
          .order("created_at", { ascending: false }),

        supabase
          .from("project_likes")
          .select("project_id, user_id"),
      ]);

      if (!active) return;

      if (projectsResult.error) {
        setError(projectsResult.error.message);
      } else if (likesResult.error) {
        setError(likesResult.error.message);
      } else {
        setProjects(projectsResult.data || []);
        setLikes(likesResult.data || []);
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

  function getLikesCount(projectId) {
    return likes.filter(
      (like) => like.project_id === projectId
    ).length;
  }

  function hasLiked(projectId) {
    if (!user) return false;

    return likes.some(
      (like) =>
        like.project_id === projectId &&
        like.user_id === user.id
    );
  }

  async function handleToggleLike(projectId) {
    if (!user || updatingProjectId !== null) return;

    setUpdatingProjectId(projectId);
    setLikesError(null);

    const alreadyLiked = hasLiked(projectId);

    if (alreadyLiked) {
      const { data, error } = await supabase
        .from("project_likes")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .select("project_id, user_id");

      if (error) {
        setLikesError(error.message);
      } else if (!data || data.length === 0) {
        setLikesError("Like was not removed.");
      } else {
        setLikes((previous) =>
          previous.filter(
            (like) =>
              !(
                like.project_id === projectId &&
                like.user_id === user.id
              )
          )
        );
      }
    } else {
      const { error } = await supabase
        .from("project_likes")
        .insert({
          project_id: projectId,
          user_id: user.id,
        });

      if (error) {
        setLikesError(error.message);
      } else {
        setLikes((previous) => [
          ...previous,
          {
            project_id: projectId,
            user_id: user.id,
          },
        ]);
      }
    }

    setUpdatingProjectId(null);
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

      {likesError && (
        <p style={{ color: "red" }}>
          Error: {likesError}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p>No projects found yet.</p>
      )}

      {!loading &&
        !error &&
        projects.map((project) => {
          const likesCount = getLikesCount(project.id);
          const isLiked = hasLiked(project.id);

          return (
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "20px",
                  flexWrap: "nowrap",
                  marginBottom: "25px",
                }}
              >
                <span style={{ whiteSpace: "nowrap" }}>
                  {likesCount}{" "}
                  {likesCount === 1 ? "like" : "likes"}
                </span>

                {user ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleLike(project.id)
                    }
                    disabled={updatingProjectId !== null}
                    style={{
                      borderRadius: "25px",
                      padding: "0 24px",
                      width: "auto",
                      minWidth: "110px",
                      flexShrink: 0,
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {updatingProjectId === project.id
                      ? "Updating..."
                      : isLiked
                        ? "Unlike ♥"
                        : "Like ♡"}
                  </button>
                ) : (
                  <span>
                    <Link to="/login">Login</Link>{" "}
                    to like
                  </span>
                )}
              </div>

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
          );
        })}
    </article>
  );
}

export default Projects;

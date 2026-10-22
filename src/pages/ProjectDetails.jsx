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
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchComments() {
      setCommentsLoading(true);
      setCommentsError(null);

      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setCommentsError(error.message);
      } else {
        setComments(data);
      }

      setCommentsLoading(false);
    }

    fetchComments();

    return () => {
      active = false;
    };
  }, [id]);

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

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (!user || !commentText.trim() || submittingComment) {
      return;
    }

    setSubmittingComment(true);
    setCommentsError(null);

    const { data, error } = await supabase
      .from("comments")
      .insert({
        project_id: id,
        user_id: user.id,
        content: commentText.trim(),
      })
      .select()
      .single();

    setSubmittingComment(false);

    if (error) {
      setCommentsError(error.message);
      return;
    }

    setComments((previousComments) => [data, ...previousComments]);
    setCommentText("");
  }

  async function handleDeleteComment(commentId) {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) return;

    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id)
      .select("id");

    if (error) {
      alert("Failed to delete comment: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert("Comment was not deleted.");
      return;
    }

    setComments((previousComments) =>
      previousComments.filter((comment) => comment.id !== commentId),
    );
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
            <Link to={`/projects/${project.id}/edit`} className="button">
              Edit Project
            </Link>
          </li>

          <li>
            <button type="button" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete Project"}
            </button>
          </li>
        </ul>
      )}

      <section>
        <h3>Comments</h3>

        {user ? (
          <form onSubmit={handleCommentSubmit}>
            <div className="field">
              <label htmlFor="comment">Write a comment</label>
              <textarea
                id="comment"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                maxLength={1000}
                rows={3}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <p>
            Please <Link to="/login">login</Link> to leave a comment.
          </p>
        )}

        {commentsLoading && <p>Loading comments...</p>}

        {commentsError && <p>Error: {commentsError}</p>}

        {!commentsLoading && !commentsError && comments.length === 0 && (
          <p>No comments yet. Be the first to comment!</p>
        )}

        {!commentsLoading &&
          !commentsError &&
          comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.content}</p>

              <small>{new Date(comment.created_at).toLocaleString()}</small>

              {user?.id === comment.user_id && (
                <div>
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete Comment
                  </button>
                </div>
              )}

              <hr />
            </div>
          ))}
      </section>
    </article>
  );
}

export default ProjectDetails;

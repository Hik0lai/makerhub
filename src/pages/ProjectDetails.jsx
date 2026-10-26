
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesLoading, setLikesLoading] = useState(true);
  const [likesError, setLikesError] = useState(null);
  const [updatingLike, setUpdatingLike] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Load project and author
  useEffect(() => {
    let active = true;

    async function fetchProject() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("projects")
        .select("*, profiles(display_name)")
        .eq("id", id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setError(error.message);
      } else {
        setProject(data);
      }

      setLoading(false);
    }

    fetchProject();

    return () => {
      active = false;
    };
  }, [id]);

  // Load likes
  useEffect(() => {
    let active = true;

    async function fetchLikes() {
      setLikesLoading(true);
      setLikesError(null);
      setIsLiked(false);

      const { data, error } = await supabase
        .from("project_likes")
        .select("user_id")
        .eq("project_id", id);

      if (!active) return;

      if (error) {
        setLikesError(error.message);
      } else {
        setLikesCount(data.length);
        setIsLiked(
          user
            ? data.some((like) => like.user_id === user.id)
            : false
        );
      }

      setLikesLoading(false);
    }

    fetchLikes();

    return () => {
      active = false;
    };
  }, [id, user?.id]);

  // Load comments with author names
  useEffect(() => {
    let active = true;

    async function fetchComments() {
      setCommentsLoading(true);
      setCommentsError(null);

      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles(display_name)")
        .eq("project_id", id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setCommentsError(error.message);
      } else {
        setComments(data || []);
      }

      setCommentsLoading(false);
    }

    fetchComments();

    return () => {
      active = false;
    };
  }, [id]);

  // Delete project
  async function handleDelete() {
    if (!user || !project || user.id !== project.user_id || deleting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
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

  // Add comment
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
      .select("*, profiles(display_name)")
      .single();

    setSubmittingComment(false);

    if (error) {
      setCommentsError(error.message);
      return;
    }

    setComments((previous) => [data, ...previous]);
    setCommentText("");
  }

  // Delete comment
  async function handleDeleteComment(commentId) {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
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

    setComments((previous) =>
      previous.filter((comment) => comment.id !== commentId)
    );
  }

  // Like or unlike project
  async function handleToggleLike() {
    if (!user || likesLoading || updatingLike || likesError) {
      return;
    }

    setUpdatingLike(true);
    setLikesError(null);

    if (isLiked) {
      const { data, error } = await supabase
        .from("project_likes")
        .delete()
        .eq("project_id", id)
        .eq("user_id", user.id)
        .select("user_id");

      if (error) {
        setLikesError(error.message);
      } else if (!data || data.length === 0) {
        setLikesError("Like was not removed.");
      } else {
        setIsLiked(false);
        setLikesCount((count) => Math.max(0, count - 1));
      }
    } else {
      const { error } = await supabase
        .from("project_likes")
        .insert({
          project_id: id,
          user_id: user.id,
        });

      if (error) {
        setLikesError(error.message);
      } else {
        setIsLiked(true);
        setLikesCount((count) => count + 1);
      }
    }

    setUpdatingLike(false);
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

      <p>
        <strong>Created by:</strong>{" "}
        {project.profiles?.display_name || "Unknown"}
        {" | "}
        <strong>Created on:</strong>{" "}
        {new Date(project.created_at).toLocaleDateString()}
      </p>

      {/* Project likes */}
      <section style={{ marginBottom: "30px" }}>
        <h3>Project Likes</h3>

        {likesLoading ? (
          <p>Loading likes...</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "20px",
              flexWrap: "nowrap",
              marginBottom: "20px",
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              {likesCount}{" "}
              {likesCount === 1 ? "like" : "likes"}
            </span>

            {user ? (
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={updatingLike || Boolean(likesError)}
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
                {updatingLike
                  ? "Updating..."
                  : isLiked
                    ? "Unlike ♥"
                    : "Like ♡"}
              </button>
            ) : (
              <span>
                Please <Link to="/login">login</Link> to like this project.
              </span>
            )}
          </div>
        )}

        {likesError && (
          <p style={{ color: "red" }}>
            Error: {likesError}
          </p>
        )}
      </section>

      {/* Edit and delete project */}
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

      {/* Comments */}
      <section>
        <h3>Comments</h3>

        {user ? (
          <form onSubmit={handleCommentSubmit}>
            <div className="field">
              <label htmlFor="comment">Write a comment</label>
              <textarea
                id="comment"
                value={commentText}
                onChange={(event) =>
                  setCommentText(event.target.value)
                }
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

        {commentsError && (
          <p style={{ color: "red" }}>
            Error: {commentsError}
          </p>
        )}

        {!commentsLoading &&
          !commentsError &&
          comments.length === 0 && (
            <p>No comments yet. Be the first to comment!</p>
          )}

        {!commentsLoading &&
          !commentsError &&
          comments.map((comment) => (
            <div key={comment.id}>
              <p style={{ marginBottom: "5px" }}>
                <strong>
                  {comment.profiles?.display_name || "Unknown"}
                </strong>
                {" · "}
                <small>
                  {new Date(comment.created_at).toLocaleString()}
                </small>
              </p>

              <p>{comment.content}</p>

              {user?.id === comment.user_id && (
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteComment(comment.id)
                    }
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

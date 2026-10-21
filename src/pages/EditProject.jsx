import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchProject() {
      setLoading(true);
      setError(null);
      setIsOwner(false);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setError(error.message);
      } else if (!data) {
        setError("Project not found.");
      } else {
        setTitle(data.title);
        setDescription(data.description);
        setImageUrl(data.image_url || "");
        setIsOwner(user?.id === data.user_id);
      }

      setLoading(false);
    }

    fetchProject();

    return () => {
      active = false;
    };
  }, [id, user?.id]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user || !isOwner || saving) return;

    if (!title.trim() || !description.trim()) {
      alert("Title and description are required.");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("projects")
      .update({
        title: title.trim(),
        description: description.trim(),
        image_url: imageUrl.trim() || null,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error("Error updating project:", error.message);
      alert("Failed to update project: " + error.message);
      return;
    }

    console.log("Project updated:", data);
    navigate(`/projects/${id}`);
  }

  if (loading) return <p>Loading project...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!isOwner) {
    return <p>You are not authorized to edit this project.</p>;
  }

  return (
    <article className="post">
      <header>
        <div className="title">
          <h2>Edit Project</h2>
          <p>Update your DIY project</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows="6"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </article>
  );
}

export default EditProject;

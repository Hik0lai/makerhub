import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function CreateProject() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')

 async function handleSubmit(event) {
  event.preventDefault()

  if (!user) {
    alert('You must be logged in to create a project.')
    return
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl.trim() || null,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error.message)
    alert('Failed to create project: ' + error.message)
    return
  }

  console.log('Project created:', data)
  alert('Project created successfully!')
}

  return (
    <section>
      <h2>Create New Project</h2>
      <p>Share your DIY project with the MakerHub community.</p>

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
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </div>

        <button type="submit">Create Project</button>
      </form>
    </section>
  )
}

export default CreateProject
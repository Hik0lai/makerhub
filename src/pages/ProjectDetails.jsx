
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ProjectDetails() {
  const { id } = useParams()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProject() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        setError(error.message)
      } else {
        setProject(data)
      }

      setLoading(false)
    }

    fetchProject()
  }, [id])

  if (loading) {
    return <p>Loading project...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!project) {
    return <p>Project not found.</p>
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
          style={{ maxWidth: '100%' }}
        />
      )}

      <p>{project.description}</p>

      <p>
        Created: {new Date(project.created_at).toLocaleDateString()}
      </p>
    </article>
  )
}

export default ProjectDetails

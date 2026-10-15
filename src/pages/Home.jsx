
import { Link } from 'react-router-dom'
function Home() {
  return (
    <article className="post">
      <header>
        <div className="title">
          <h2>Welcome to MakerHub</h2>
          <p>Share your DIY projects with the community</p>
        </div>
      </header>

        <Link to="/projects" className="image featured">
        <img src="/images/makerhub_main_pic.jpg" alt="DIY project" />
        </Link>

      <p>
        Discover DIY projects about electronics, 3D printing,
        CNC machines, programming and much more.
      </p>

      <footer>
        <ul className="actions">
          <li>
           <Link to="/projects" className="button large">
            Explore Projects
            </Link>
          </li>
        </ul>
      </footer>
    </article>
  )
}

export default Home

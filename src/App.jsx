import Header from './components/Header/Header'

function App() {
  return (
    <div id="wrapper">
      <Header/>

      <div id="main">
        <article className="post">
          <header>
            <div className="title">
              <h2>Welcome to MakerHub</h2>
              <p>Share your DIY projects with the community</p>
            </div>
          </header>

          <a href="/projects" className="image featured">
            <img src="/images/pic01.jpg" alt="DIY project" />
          </a>

          <p>
            Discover DIY projects about electronics, 3D printing,
            CNC machines, programming and much more.
          </p>

          <footer>
            <ul className="actions">
              <li>
                <a href="/projects" className="button large">
                  Explore Projects
                </a>
              </li>
            </ul>
          </footer>
        </article>
      </div>
    </div>
  )
}

export default App

import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <div id="wrapper">
      <Header />

      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/projects" element={<Projects />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
          <Route
            path="/projects/create"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

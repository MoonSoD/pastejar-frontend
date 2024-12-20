import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem("auth")
    localStorage.removeItem("username")
    navigate("/login")
  }

  return (
    <div className="navbar bg-primary text-primary-content w-full">
      <button className="btn btn-ghost text-xl">PasteJar</button>
      <div className="navbar-start w-full flex justify-between">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/pastes">
              Pastes
            </Link>
          </li>
          <li>
            <Link to="/tags">
              Tags
            </Link>
          </li>
        </ul>
        <button 
          onClick={logout} 
          className="btn btn-warning"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
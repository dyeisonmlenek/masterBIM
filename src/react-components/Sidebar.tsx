import * as React from "react";
import * as Router from "react-router-dom";
import logoUrl from "../../assets/aeropixel-branco-laranja.png";

export function Sidebar() {
  return (
    <aside id="sidebar">
      <img id="company-logo" src={logoUrl} alt="Aeropixel" />
      <ul id="nav-buttons">
        <Router.Link to="/">
          <li><span className="material-icons-round">apartment</span>Projetos</li>
        </Router.Link>
        <Router.Link to="/users">
          <li><span className="material-icons-round">people</span>Usuários</li>
        </Router.Link>
      </ul>
    </aside>
  )
}
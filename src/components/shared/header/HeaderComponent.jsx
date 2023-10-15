import logo from '../../../assets/logo.png';
import {useNavigate} from "react-router-dom";
import {dataG} from "../../../App";
import {SearchModules} from "./SearchModules";
import {Notifications} from "./Notifications";

const toggle = () => document.body.classList.toggle('toggle-sidebar');

export const HeaderComponent = () => {

    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const cerrarSesion = () => {
        localStorage.clear();
        navigate('/');
    }


    return (
        <header id="header" className="header fixed-top d-flex align-items-center">

            <div className="d-flex align-items-center justify-content-between">
                <img src={logo} alt="" width="50" height="50"/>
                <i className="bi bi-list toggle-sidebar-btn" onClick={toggle}></i>
            </div>
            <SearchModules/>
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">

                    <li className="nav-item d-block d-lg-none">
                        <a className="nav-link nav-icon search-bar-toggle " href="#">
                            <i className="bi bi-search"></i>
                        </a>
                    </li>

                    <Notifications/>

                    <li className="nav-item dropdown pe-3">
                        <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#"
                           data-bs-toggle="dropdown">
                            <span
                                className="d-none d-md-block dropdown-toggle ps-2">{dataG.username || usuario.username}</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{dataG.username || usuario.username}</h6>
                                <span>{dataG.perfil || usuario.perfil}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li>
                                <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                                    <i className="bi bi-person"></i>
                                    <span>Mi Perfil</span>
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li>
                                <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                                    <i className="bi bi-gear"></i>
                                    <span>Configuración de la cuenta</span>
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li>
                                <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                                    <i className="bi bi-question-circle"></i>
                                    <span>Ayuda</span>
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li>
                                <a className="dropdown-item d-flex align-items-center" href="#" onClick={cerrarSesion}>
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Cerrar Sesión</span>
                                </a>
                            </li>
                        </ul>
                    </li>

                </ul>
            </nav>
        </header>
    );
}
import logo from '../../../assets/logo.png';
import {useNavigate} from "react-router-dom";
import {dataG} from "../../../App";

const toggle = () => document.body.classList.toggle('toggle-sidebar');

export const HeaderComponent = () => {

    const navigate = useNavigate();


    const cerrarSesion = () => {
        localStorage.clear();
        navigate('/');
    }

    return(
        <header id="header" className="header fixed-top d-flex align-items-center">

            <div className="d-flex align-items-center justify-content-between">

                    <img src={logo} alt="" width="80" height="60"/>

                <i className="bi bi-list toggle-sidebar-btn" onClick={toggle}></i>
            </div>
            <div className="search-bar">
                <form className="search-form d-flex align-items-center" method="POST" action="#">
                    <input type="text" name="query" placeholder="Buscar" title="Enter search keyword" />
                        <button type="submit" title="Buscar"><i className="bi bi-search"></i></button>
                </form>
            </div>

            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">

                    <li className="nav-item d-block d-lg-none">
                        <a className="nav-link nav-icon search-bar-toggle " href="#">
                            <i className="bi bi-search"></i>
                        </a>
                    </li>

                    <li className="nav-item dropdown">

                        <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                            <i className="bi bi-bell"></i>
                            <span className="badge bg-primary badge-number">1</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                            <li className="dropdown-header">
                                Tienes 1 notificación
                                <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">Ver todos</span></a>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li className="notification-item">
                                <i className="bi bi-exclamation-circle text-warning"></i>
                                <div>
                                    <h4>Lorem Ipsum</h4>
                                    <p>Quae dolorem earum veritatis oditseno</p>
                                    <p>30 min. ago</p>
                                </div>
                            </li>

                            <li>
                                <hr className="dropdown-divider"/>
                            </li>
                            <li className="dropdown-footer">
                                <a href="#">Mostrar todas las notificaciones</a>
                            </li>

                        </ul>
                    </li>


                    <li className="nav-item dropdown pe-3">
                        <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#"
                           data-bs-toggle="dropdown">
                                <span className="d-none d-md-block dropdown-toggle ps-2">{dataG.username}</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{dataG.username}</h6>
                                <span>{dataG.perfil}</span>
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
import React from 'react';
import { Link } from 'react-router-dom';
import {dataG} from "../../../App";


function renderSubMenu({IdModulo,Nombre,subMenus}) {
    if (subMenus && subMenus.length > 0) {
        return (
            <ul id={`${Nombre}-${IdModulo}-nav`} className="nav-content collapse" data-bs-parent="#sidebar-nav">
                {subMenus.map((subMenuItem) => {
                    return(
                    <li key={subMenuItem.IdModulo}>
                        <Link to={subMenuItem.Mapeo}
                              state={ subMenuItem.Mapeo === '/compraVenta' ?  {
                                cliente: {},
                                clienteActivo: true,
                            } : {
                                  cliente: {},
                                  clienteActivo: false,
                              }
                        } >
                            <i className={subMenuItem.Icono}></i><span>{subMenuItem.Nombre}</span>
                        </Link>
                    </li>);
                }
                )}
            </ul>
        );
    } else {
        return null;
    }
}

function renderMenu(menu) {
    return (
        <li className="nav-item" key={menu.IdModulo}>
            <a
                className="nav-link collapsed"
                data-bs-target={`#${menu.Nombre}-${menu.IdModulo}-nav`}
                data-bs-toggle="collapse"
                href="#"
            >
                <i className={menu.Icono}></i><span>{menu.Nombre}</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            {renderSubMenu(menu)}
        </li>
    );
}

function MenuComponent() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    return (
            <ul className="sidebar-nav" id="sidebar-nav">

                <li className="nav-item">
                    <Link className="nav-link " to="/inicio">
                        <i className="bi bi-grid"></i>
                        <span>Inicio</span>
                    </Link>
                </li>
                {
                    dataG.menus.length!== 0
                    ? dataG.menus.map((menu) => renderMenu(menu))
                    : usuario.menus.map((menu) => renderMenu(menu))
                }
            </ul>
    );
}

export default MenuComponent;

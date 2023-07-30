import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

export const AsideComponent = () => {
    return (
           <aside id="sidebar" className="sidebar">

               <ul className="sidebar-nav" id="sidebar-nav">

                   <li className="nav-item">
                       <Link className="nav-link " to="/">
                           <i className="bi bi-grid"></i>
                           <span>Inicio</span>
                       </Link>
                   </li>

                   <li className="nav-item">
                       <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
                           <i className="bi bi-menu-button-wide"></i><span>Administración</span><i className="bi bi-chevron-down ms-auto"></i>
                       </a>
                       <ul id="components-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                           <li>
                               <Link to="/administracion/usuarios">
                                   <i className="bi bi-circle"></i><span>Administración</span>
                               </Link>
                           </li>
                       </ul>
                   </li>

                   <li className="nav-item">
                       <a className="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" href="#">
                           <i className="bi bi-journal-text"></i><span>Operación</span><i className="bi bi-chevron-down ms-auto"></i>
                       </a>
                       <ul id="forms-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                           <li>
                               <Link to="/altaClientes">
                                   <i className="bi bi-circle"></i><span>Alta Clientes</span>
                               </Link>
                           </li>
                           <li>
                               <Link
                                   to="/compraVenta"
                                   state={{state: {
                                           cliente: {},
                                           clienteActivo: true
                                       }}}
                               >
                                   <i className="bi bi-circle"></i><span>Compra/Venta</span>
                               </Link>
                           </li>
                           <li>
                               <Link to="/caja">
                                   <i className="bi bi-circle"></i><span>Caja</span>
                               </Link>
                           </li>
                       </ul>
                   </li>

                   <li className="nav-item">
                       <a className="nav-link collapsed" data-bs-target="#charts-nav" data-bs-toggle="collapse" href="#">
                           <i className="bi bi-bar-chart"></i><span>Estadistico</span><i className="bi bi-chevron-down ms-auto"></i>
                       </a>
                       <ul id="charts-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                           <li>
                               <Link to="/estadistico">
                                   <i className="bi bi-circle"></i><span>Reportes</span>
                               </Link>
                           </li>
                       </ul>
                   </li>

                   <li className="nav-item">
                       <a className="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse"
                          href="#">
                           <i className="bi bi-layout-text-window-reverse"></i><span>PLD</span><i
                           className="bi bi-chevron-down ms-auto"></i>
                       </a>
                       <ul id="tables-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                           <li>
                               <Link to="/consultaClientes">
                                   <i className="bi bi-circle"></i><span>Consulta Clientes</span>
                               </Link>
                           </li>
                       </ul>
                   </li>

               </ul>
           </aside>
    );
}
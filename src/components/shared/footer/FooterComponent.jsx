import {dataG} from "../../../App";
import {year} from "../../../utils";
import {onscroll,backtotop} from "../../../js/main";

export const FooterComponent = () =>{

    const usuario = JSON.parse(localStorage.getItem("usuario_data"));

    return (
        <>
            <footer id="footer" className="footer">
                <div className="copyright">
                    <h6>{dataG.sucursal || usuario.sucursal} - <strong>{dataG.nombre_sucursal || usuario.nombre_sucursal}</strong></h6>
                    <p>{dataG.direccion || usuario.direccion}</p>
                    &copy; Copyright <strong><span>Sistema de Gestión de Divisas</span></strong>. Todos los derechos reservados.
                </div>
                <div className="credits">
                    Grocerys Centro Cambiario - {year}
                </div>
            </footer>

            <a href="#" onScroll={onscroll(document, backtotop)} className="back-to-top d-flex align-items-center justify-content-center"><i
                className="bi bi-arrow-up-short"></i></a>
        </>
    );

}
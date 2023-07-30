import {onscroll, select} from "../../../js/selectores";
import {dataG} from "../../../App";
import {year} from "../../../utils/utils";

/**
 * Back to top button
 */
let backtotop = select('.back-to-top')

const toggleBacktotop = () => {

    if(backtotop == null) return;

    if (window.scrollY > 100) {
        backtotop.classList.add('active')
    } else {
        backtotop.classList.remove('active')
    }
}



export const FooterComponent = () =>{
    return (
        <>
            <footer id="footer" className="footer">
                <div className="copyright">
                    <h6>{dataG.sucursal} - <strong>{dataG.nombre_sucursal}</strong></h6>
                    <p>{dataG.direccion}</p>
                    &copy; Copyright <strong><span>Sistema de Gestión de Divisas</span></strong>. Todos los derechos reservados.
                </div>
                <div className="credits">
                    Grocerys Centro de Cambio - {year}
                </div>
            </footer>

            <a href="#" onScroll={onscroll(document, toggleBacktotop)} className="back-to-top d-flex align-items-center justify-content-center"><i
                className="bi bi-arrow-up-short"></i></a>
        </>
    );

}
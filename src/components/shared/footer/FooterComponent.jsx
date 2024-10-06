import {dataG} from "../../../App";
import {perfiles, getElementosFecha} from "../../../utils";
import {onscroll,backtotop} from "../../../js/main";
import {useEffect, useState} from "react";
import {obtenTitulo} from "../../../services/reportes-services";

export const FooterComponent = () =>{

    const [dataEmpresa, setDataEmpresa] = useState({})

    useEffect(() => {

        const informacion = async ()=>{
            const dataE = await obtenTitulo();
            setDataEmpresa({
                nombre: dataE.result_set[0].Nombre,
                registro: dataE.result_set[0].Registro,
            })

        }
        informacion();
    }, []);

    const usuario = JSON.parse(localStorage.getItem("usuario_data"));

    return (
        <>
            <footer id="footer" className="footer">
                <div className="copyright">
                    {
                        !perfiles.includes(dataG.perfil) ?
                            (<h6>{dataG.sucursal || usuario.sucursal} - <strong>{dataG.nombre_sucursal || usuario.nombre_sucursal}</strong></h6>)
                            : <h6><strong>Oficina Central</strong></h6>
                    }
                    <p>{dataG.direccion || usuario.direccion}</p>
                    <div className="credits">
                        <p>
                            <strong>Reg. CNBV: {dataEmpresa.registro}</strong>
                            <br/>
                            {dataEmpresa.nombre}
                        </p>
                    </div>
                    &copy; Copyright. Todos los derechos reservados 2023 - {getElementosFecha().year}
                    <p className="text-center"><strong>Versión 2.2.2</strong></p>
                </div>
            </footer>

            <a href="#" onScroll={onscroll(document, backtotop)} className="back-to-top d-flex align-items-center justify-content-center"><i
                className="bi bi-arrow-up-short"></i></a>
        </>
    );

}
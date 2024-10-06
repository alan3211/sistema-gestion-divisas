import {useLocation} from "react-router-dom";
import logo from "../../assets/logoF.png";
import {getElementosFecha} from "../../utils";
import {CambiarPassword} from "./CambiarPassword";


export const ValidaContraseña = () =>{

    const { state } = useLocation();

    return(<main>
        <div className="container">
            <section className="error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1 className="mb-3 text-warning">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                </h1>
                <h2 className="text-center">Alerta</h2>
                <h2>Estimado usuario, hemos detectado que este es su primer acceso al sistema. Por motivos de seguridad, es necesario que cambie su contraseña.</h2>
                <div className="row">
                    <div className="col-md-12">
                        <CambiarPassword noPassActual={true} options={state.user}/>
                    </div>
                </div>

                <div className="logo-container">
                    <img src={logo} alt="Imagen centrada" className="img-fluid" />
                </div>
                <div className="credits">
                    <strong>Grocerys Centro Cambiario - {getElementosFecha().year}</strong>
                </div>
            </section>

        </div>
    </main>);
}
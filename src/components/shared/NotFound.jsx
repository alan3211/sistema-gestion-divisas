import logo from "../../assets/logoF.png";
import {getElementosFecha} from "../../utils";
import {useNavigate} from "react-router-dom";

export const NotFound = () => {

    const navigator = useNavigate();
    const regresar = () => {
        localStorage.clear();
        navigator('/');
    }

    return(<main>
        <div className="container">

            <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1>404</h1>
                <h2>La página que estas buscando no existe.</h2>
                <button className="btn" onClick={regresar}>Regresar al inicio</button>
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
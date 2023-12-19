import logo from "../../assets/logoF.png";
import {year} from "../../utils";
import {useNavigate} from "react-router-dom";
export const NotAuthenticated =  () => {
        const navigator = useNavigate();
        const regresar = () => {
            localStorage.clear();
            navigator('/');
        }

        return(<main>
            <div className="container">

                <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                    <h1 className="mb-3 text-warning">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                    </h1>
                    <h2 className="text-center">Acceso no autorizado</h2>
                    <h2>Para ingresar a esta página es necesario que inicies sesión.</h2>
                    <button className="btn" onClick={regresar}>Regresar al inicio</button>
                    <div className="logo-container">
                        <img src={logo} alt="Imagen centrada" className="img-fluid" />
                    </div>
                    <div className="credits">
                        <strong>Grocerys Centro Cambiario - {year}</strong>
                    </div>
                </section>

            </div>
        </main>);
}
import logo from "../../assets/logoF.png";
import {useNavigate} from "react-router-dom";
import {year} from "../../utils";
import {useEffect} from "react";

export const HealthComponent = () => {

    const navigate = useNavigate();

    const mensaje = "La aplicación esta funcionando correctamente."

    const regresar = ()=>{
        navigate("/")
    }


    useEffect(() => {
        // Verificar si el localStorage está vacío
        const localStorageIsEmpty = Object.keys(localStorage).length === 0;
        // Si está vacío, redirigir a "/"
        if (localStorageIsEmpty) {
            navigate("/")
        }
    }, [Object.keys(localStorage).length]);


    return (<main>
        <div className="container">

            <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1><i className="bx bx-like"></i></h1>
                <h2>{mensaje}</h2>
                <button className="btn" onClick={regresar}>Regresar al inicio</button>
                <div className="logo-container">
                    <img src={logo} alt="Imagen centrada" className="img-fluid" />
                </div>
                <div className="credits">
                    <strong>Grocerys Centro Cambiario - {year}</strong>


                </div>
            </section>

        </div>
    </main>)
}
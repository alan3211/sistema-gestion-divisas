import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import {useState} from "react";
import {year} from "../../utils/utils";

export const LoginComponent = ({onLogin,isLoggedIn}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => onLogin(username, password);

    if (isLoggedIn) {
        navigate('/inicio');
    }


    return(
        <main>
            <div className="container">

                <section
                    className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div
                                className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <div className="d-flex justify-content-center py-4">
                                    <img src={logo} alt="Grocerys Centro Cambiario" width="200" height="200"/>
                                </div>

                                <div className="card mb-3">

                                    <div className="card-body">

                                        <div className="pt-4 pb-2">
                                            <h5 className="card-title text-center pb-0 fs-4">Grocerys Centro Cambiario</h5>
                                        </div>

                                        <form className="row g-3 needs-validation" noValidate>

                                            <div className="col-12">
                                                <label htmlFor="username" className="form-label">Usuario</label>
                                                <div className="input-group has-validation">
                                                    <span className="input-group-text" id="inputGroupPrepend"><i className="bi bi-person-circle"></i></span>
                                                    <input type="text" name="username" className="form-control"
                                                           id="username"
                                                           value={username} onChange={(e) => setUsername(e.target.value)}
                                                           required/>
                                                    <div className="invalid-feedback">Ingresa tu nombre de usuario.</div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="password" className="form-label">Contraseña</label>
                                                <input type="password" name="password" className="form-control"
                                                       id="password"
                                                       value={password}
                                                       onChange={(e) => setPassword(e.target.value)}
                                                       required/>
                                                    <div className="invalid-feedback">Ingresa tu contraseña</div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" name="remember"
                                                           value="true" id="rememberMe"/>
                                                        <label className="form-check-label" htmlFor="rememberMe">
                                                            Recuerdame
                                                        </label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary w-100" type="button" onClick={handleLogin}>Iniciar Sesión</button>
                                            </div>
                                        </form>

                                    </div>
                                </div>

                                <div className="credits">
                                    Grocerys Centro de Cambio - {year}
                                </div>

                            </div>
                        </div>
                    </div>

                </section>

            </div>
        </main>
    );
}
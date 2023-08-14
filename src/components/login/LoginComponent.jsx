import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import {validarAlfaNumerico, year} from "../../utils";
import {useForm} from "react-hook-form";
import CryptoJS from "crypto-js";
import {getUser} from "../../services";
import {toast} from "react-toastify";
import {dataG} from "../../App";

export const LoginComponent = ({isLoggedIn,setIsLoggedIn}) => {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState:{errors},
        reset,
    } = useForm();

    const handleLogin = handleSubmit(async(data) =>{
        const jsonDataString = JSON.stringify(data);
        console.log(jsonDataString)
        // Clave de cifrado
        const key = CryptoJS.enc.Utf8.parse('KtsmylMOoT735gRWHUFj7alBJypXlVNw');
        const iv = CryptoJS.lib.WordArray.random(16);

        const pad = "aqswedrftgyhujio";

        const encryptedData = CryptoJS.AES.encrypt(pad.concat(jsonDataString), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        // Datos cifrados en base64
        const encryptedBase64 = encryptedData.toString();
        console.log('JSON cifrado:', encryptedBase64);

        const usuarioData = await getUser(encryptedBase64);
        localStorage.setItem('datos', JSON.stringify(usuarioData));
        if (usuarioData.usuario) {
            dataG.sucursal = parseInt(usuarioData.sucursal);
            dataG.username = usuarioData.nombre;
            dataG.perfil = usuarioData.perfil;
            dataG.usuario = usuarioData.usuario;
            dataG.direccion = usuarioData.direccion;
            dataG.nombre_sucursal = usuarioData.nombre_sucursal;
            dataG.limite_diario = usuarioData.limite_diario;
            dataG.limite_mensual = usuarioData.limite_mensual;
            setIsLoggedIn(true);
        } else {
            reset()
            toast.warn('El usuario ingresado no existe.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
        }
    });

    if (isLoggedIn) {
        navigate('/inicio');
    }

    return(
        <main>
            <div className="container">
                <section
                    className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div
                                className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <div className="d-flex justify-content-center">
                                    <img src={logo} alt="Grocerys Centro Cambiario" width="350" height="350"/>
                                </div>

                                <div className="card border-0 shadow-lg" style={{ maxWidth: "600px" }}>
                                    <div className="card-body p-4">
                                        <h2 className="card-title text-center mb-2">¡Bienvenido!</h2>

                                        <form onSubmit={handleLogin}>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text text-blue"><i className="bi bi-person-fill"></i></span>
                                                <input
                                                    {...register("usuario",{
                                                        required:{
                                                            value:true,
                                                            message:'El campo usuario no puede ser vacio.'
                                                        },
                                                        minLength:{
                                                            value:2,
                                                            message:'El campo usuario como mínimo debe de tener al menos 2 caracteres.'
                                                        },
                                                        maxLength:{
                                                            value:30,
                                                            message:'El campo usuario como máximo debe de tener no mas de 30 caracteres.'
                                                        },
                                                        validate: (value) => validarAlfaNumerico("usuario",value)
                                                    })}
                                                    type="text"
                                                    className={`form-control ${!!errors.usuario ? 'invalid-input':''}`}
                                                    id="usuario"
                                                    name="usuario"
                                                    placeholder="Ingresa el usuario"
                                                />
                                                {
                                                    errors.usuario && <div className="invalid-feedback-custom">{errors.usuario.message}</div>
                                                }
                                            </div>

                                            <div className="input-group mb-3">
                                                <span className="input-group-text text-blue"><i className="bi bi-lock-fill"></i></span>
                                                <input
                                                    {...register("password",{
                                                        required:{
                                                            value:true,
                                                            message:'El campo contraseña no puede ser vacio.'
                                                        },
                                                        minLength:{
                                                            value:5,
                                                            message:'El campo contraseña como mínimo debe de tener al menos 5 caracteres.'
                                                        }
                                                    })}
                                                    type="password"
                                                    className={`form-control ${!!errors.password ? 'invalid-input':''}`}
                                                    id="password"
                                                    name="password"
                                                    placeholder="Ingresa la contraseña"
                                                />
                                                {
                                                    errors.password && <div className="invalid-feedback-custom">{errors.password.message}</div>
                                                }
                                            </div>

                                            <div className="mb-3 d-flex align-items-center justify-content-between">
                                                <div className="form-check">
                                                    <input
                                                        {...register("rememberMe")}
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="remember"
                                                        id="rememberMe"
                                                    />
                                                    <label className="form-check-label" htmlFor="rememberMe">
                                                        Recuérdame
                                                    </label>
                                                </div>
                                            </div>

                                            <button className="btn btn-primary w-100" type="submit">
                                                Iniciar Sesión
                                            </button>
                                        </form>
                                    </div>
                                </div>


                                <div className="credits text-blue">
                                    Grocerys Centro Cambiario - {year}
                                </div>

                            </div>
                        </div>
                    </div>

                </section>

            </div>
        </main>
    );
}
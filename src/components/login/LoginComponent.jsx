import logo from '../../assets/logo.png';
import {encryptRequest, OPTIONS, recordValues, validarAlfaNumerico, year} from "../../utils";
import {useForm} from "react-hook-form";
import {getUser} from "../../services";
import {toast, ToastContainer} from "react-toastify";
import {dataG} from "../../App";
import jwt_decode from 'jwt-decode';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const LoginComponent = () => {

    const navigator = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors},
        reset,
        watch,
    } = useForm();

    const handleLogin = handleSubmit(async(data) =>{
        const encryptedBase64 = encryptRequest(data);
        const datos = await getUser(encryptedBase64);
        if(!datos.hasOwnProperty('resultSize')){
            localStorage.setItem("token",datos.token); // Se guarda el token
            localStorage.setItem("refresh_token",datos.refresh_token); // Se guarda el refresh
            const decodedToken = jwt_decode(datos.token);
            if (decodedToken.usuario) {
                dataG.sucursal = parseInt(decodedToken.sucursal);
                dataG.username = decodedToken.nombre;
                dataG.perfil = decodedToken.perfil;
                dataG.usuario = decodedToken.usuario;
                dataG.direccion = decodedToken.direccion;
                dataG.nombre_sucursal = decodedToken.nombre_sucursal;
                dataG.limite_diario = decodedToken.limite_diario;
                dataG.limite_mensual = decodedToken.limite_mensual;
                dataG.menus = decodedToken.menus;
                localStorage.setItem("usuario_data",JSON.stringify(dataG));
                navigator("/inicio");
            }
        }else {
            if(datos.resultSize === 0){
                reset()
                toast.warn('El usuario ingresado no existe.', OPTIONS);
            }
        }

    });


    return(
        <main>
            <div className="container">
                <section
                    className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div
                                className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <div className="d-flex justify-content-center m-5 p-5">
                                    <img src={logo} alt="Grocerys Centro Cambiario"/>
                                </div>

                                <div className="card border-0 shadow-lg" style={{ maxWidth: "600px" }}>
                                    <div className="card-body p-4">
                                        <h5 className="text-blue text-center mb-4"><strong>¡Bienvenido!</strong></h5>

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
                                                    placeholder="Usuario"
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
                                                    placeholder="Contraseña"
                                                />
                                                {
                                                    errors.password && <div className="invalid-feedback-custom">{errors.password.message}</div>
                                                }
                                            </div>

                                            <button className="btn btn-primary w-100" type="submit">
                                                <i className="bi bi-box-arrow-in-right"></i> <strong>INICIAR SESIÓN</strong>
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
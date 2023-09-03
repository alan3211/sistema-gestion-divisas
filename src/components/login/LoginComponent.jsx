import logo from '../../assets/logo.png';
import {encryptRequest, recordValues, validarAlfaNumerico, year} from "../../utils";
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
                navigator("/inicio");
            }
        }else {
            if(datos.resultSize === 0){
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
        }

    });

    useEffect(() => {
        setValue("usuario",localStorage.getItem('usuario') || '')
        setValue("rememberMe",localStorage.getItem('rememberMe') || false)
    }, []);


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
                                                        onChange={()=> recordValues(watch())}
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
            <ToastContainer/>
        </main>
    );
}
import {useForm} from "react-hook-form";
import {dataG} from "../../../App";
import {encryptRequest, validarAlfaNumerico, validarNombreApellido} from "../../../utils";
import {useCatalogo} from "../../../hook/useCatalogo";
import {toast} from "react-toastify";
import {accionesUsuario} from "../../../services/administracion-services";

export const AgregaUsuario = () => {

    const catalogo = useCatalogo([21,17]);
    const {register, handleSubmit, formState: {errors}, reset, watch} = useForm();
    const altaDelUsuario = handleSubmit(async (data) => {
        data.tipo_operacion = 1;
        data.usuario_alta = dataG.usuario;
        data.activo = 1;
        const encryptedData = encryptRequest(data);

        const response = await accionesUsuario(encryptedData);

        if (response !== '') {
            toast.success(response, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
            reset();
        }


    });

    return (
        <div className="container justify-content-center align-items-center mt-4">
            <form
                className="text-center mb-4"
                onSubmit={altaDelUsuario}
                noValidate
            >
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <input
                            {...register("usuario", {
                                required: {
                                    value: true,
                                    message: 'El campo Usuario no puede ser vacio.'
                                },
                                minLength: {
                                    value: 2,
                                    message: 'El campo Usuario como mínimo debe de tener al menos 2 caracteres.'
                                },
                                maxLength: {
                                    value: 30,
                                    message: 'El campo Usuario como máximo debe de tener no mas de 30 caracteres.'
                                },
                                validate: (value) => validarAlfaNumerico("Usuario", value)
                            })}
                            type="text"
                            className={`form-control ${!!errors?.usuario ? 'invalid-input' : ''}`}
                            id="usuario"
                            name="usuario"
                            placeholder="Ingresa el usuario"
                        />
                        <label htmlFor="usuario">USUARIO DE SISTEMA</label>
                        {
                            errors?.usuario && <div className="invalid-feedback-custom">{errors?.usuario.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <input
                            {...register("nombre_usuario", {
                                required: {
                                    value: true,
                                    message: 'El campo Nombre Usuario no puede ser vacio.'
                                },
                                minLength: {
                                    value: 2,
                                    message: 'El campo Nombre Usuario como mínimo debe de tener al menos 2 caracteres.'
                                },
                                maxLength: {
                                    value: 30,
                                    message: 'El campo Nombre Usuario como máximo debe de tener no mas de 30 caracteres.'
                                },
                                validate: (value) => validarAlfaNumerico("Nombre Usuario", value)
                            })}
                            type="text"
                            className={`form-control ${!!errors?.nombre_usuario ? 'invalid-input' : ''}`}
                            id="nombre_usuario"
                            name="nombre_usuario"
                            placeholder="Ingresa el nombre completo del usuario"
                        />
                        <label htmlFor="nombre_usuario">NOMBRE DE USUARIO</label>
                        {
                            errors?.nombre_usuario &&
                            <div className="invalid-feedback-custom">{errors?.nombre_usuario.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <input
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: 'El campo contraseña no puede ser vacio.'
                                },
                                minLength: {
                                    value: 5,
                                    message: 'El campo contraseña como mínimo debe de tener al menos 5 caracteres.'
                                }
                            })}
                            type="password"
                            className={`form-control ${!!errors.password ? 'invalid-input' : ''}`}
                            id="password"
                            name="password"
                            placeholder="Ingresa la contraseña"
                        />
                        <label htmlFor="password">CONTRASEÑA</label>
                        {
                            errors.password && <div className="invalid-feedback-custom">{errors.password.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <select
                            {...register("perfil",{
                                required:{
                                    value:true,
                                    message:'Debes de seleccionar al menos un perfil.'
                                }
                            })}
                            className={`form-select ${!!errors?.perfil ? 'invalid-input':''}`}
                            id="perfil"
                            name="perfil"
                            aria-label="Perfil"
                        >
                            <option value="0">SELECCIONA UNA OPCIÓN</option>
                            {
                                catalogo[0]?.map((ele) => (
                                    <option key={ele.id + '-' + ele.descripcion}
                                            value={ele.id}>
                                        {ele.descripcion}
                                    </option>
                                ))
                            }
                        </select>
                        <label htmlFor="perfil">PERFIL</label>
                        {
                            errors?.perfil && <div className="invalid-feedback-custom">{errors?.perfil.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <select
                            {...register("sucursal",{
                                required:{
                                    value:true,
                                    message:'Debes de seleccionar al menos una sucursal.'
                                }
                            })}
                            className={`form-select ${!!errors?.perfil ? 'invalid-input':''}`}
                            id="sucursal"
                            name="sucursal"
                            aria-label="Sucursal"
                        >
                            <option value="0">SELECCIONA UNA OPCIÓN</option>
                            {
                                catalogo[1]?.map((ele) => (
                                    <option key={ele.id + '-' + ele.descripcion}
                                            value={ele.id}>
                                        {ele.descripcion}
                                    </option>
                                ))
                            }
                        </select>
                        <label htmlFor="sucursal">SUCURSAL</label>
                        {
                            errors?.sucursal && <div className="invalid-feedback-custom">{errors?.sucursal.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <button
                        type="submit"
                        className="m-2 btn btn-primary"
                    >
                        <i className="bi bi-person-add me-2"></i>
                      REGISTRAR USUARIO DE SISTEMA
                    </button>
                </div>
            </form>
        </div>
    );
}
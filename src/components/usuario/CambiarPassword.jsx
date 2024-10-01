import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../utils";
import {useForm} from "react-hook-form";
import {dataG} from "../../App";
import {toast} from "react-toastify";
import {changePass} from "../../services/perfil-usuario-services";
import {useNavigate} from "react-router-dom";

export const CambiarPassword = ({noPassActual,options}) => {

    const navigate = useNavigate();
    const {register,handleSubmit,formState:{errors},reset,watch} =  useForm();

    const onSubmitChangePass = handleSubmit(async(data)=>{
        console.log("DATOS LOGIN",options)
        console.log("Data",data);
        data.sucursal = dataG.sucursal;
        data.usuario = dataG.usuario;

        if(noPassActual){
            data.password='12345678';
            data.sucursal=options.sucursal;
            data.usuario=options.usuario;
        }

        const encryptedData = encryptRequest(data);

        const response = await changePass(encryptedData);
        if (response.result_set[0].Mensaje !== '') {
            toast.success(response.result_set[0].Mensaje, OPTIONS);
            localStorage.clear();
            navigate('/');
        }else{
            toast.error(response.result_set[0].Mensaje, OPTIONS);
        }
        reset();


    });

    return (
        <>

            <div className="text-center  mt-3">
                <div className="row mb-3">
                    { !noPassActual && <div className="col-md-12 mx-auto">
                        <div className="form-floating">
                            <input
                                {...register("contrasena_actual", {
                                    required: {
                                        value: true,
                                        message: 'El campo Contraseña Actual no puede ser vacio.'
                                    },
                                    validate: (value) => validarAlfaNumerico("Contraseña Actual", value)
                                })}
                                type="password"
                                className={`form-control ${!!errors?.contrasena_actual ? 'invalid-input' : ''}`}
                                id="contrasena_actual"
                                name="contrasena_actual"
                                placeholder="Ingresa la contraseña actual"
                                autoComplete="off"
                            />
                            <label htmlFor="contrasena_actual">CONTRASEÑA ACTUAL</label>
                            {
                                errors?.contrasena_actual &&
                                <div className="invalid-feedback-custom">{errors?.contrasena_actual.message}</div>
                            }
                        </div>
                    </div>}
                </div>
                <div className="row mb-3">
                    <div className="col-md-12 mx-auto">
                        <div className="form-floating">
                            <input
                                {...register("contrasena_nueva", {
                                    required: {
                                        value: true,
                                        message: 'El campo Contraseña Nueva no puede ser vacio.'
                                    },
                                    minLength:{
                                        value:8,
                                        message:'El campo contraseña nueva como mínimo debe de tener al menos 8 caracteres.'
                                    },
                                    maxLength:{
                                        value:8,
                                        message:'El campo contraseña nueva como máximo debe de tener 8 caracteres.'
                                    },
                                    validate: (value) => validarAlfaNumerico("Contraseña Nueva", value)
                                })}
                                type="password"
                                className={`form-control ${!!errors?.contrasena_nueva ? 'invalid-input' : ''}`}
                                id="contrasena_nueva"
                                name="contrasena_nueva"
                                placeholder="Ingresa la contraseña actual"
                                autoComplete="off"
                            />
                            <label htmlFor="contrasena_nueva">CONTRASEÑA NUEVA</label>
                            {
                                errors?.contrasena_nueva &&
                                <div className="invalid-feedback-custom">{errors?.contrasena_nueva.message}</div>
                            }
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-12 mx-auto">
                        <div className="form-floating">
                            <input
                                {...register("contrasena_confirma", {
                                    required: {
                                        value: true,
                                        message: 'El campo Contraseña Confirma no puede ser vacio.'
                                    },
                                    validate: (value) => watch("contrasena_nueva") === value || "Las contraseñas no coinciden",
                                })}
                                type="password"
                                className={`form-control ${!!errors?.contrasena_confirma ? 'invalid-input' : ''}`}
                                id="contrasena_confirma"
                                name="contrasena_confirma"
                                placeholder="Confirma la contraseña nueva"
                                autoComplete="off"
                            />
                            <label htmlFor="contrasena_confirma">CONFIRMA CONTRASEÑA NUEVA</label>
                            {
                                errors?.contrasena_confirma &&
                                <div className="invalid-feedback-custom">{errors?.contrasena_confirma.message}</div>
                            }
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button type="button" className="btn btn-primary"
                            onClick={onSubmitChangePass}>
                        <i className="bi bi-lock-fill me-2"></i>
                        CAMBIAR CONTRASEÑA
                    </button>
                </div>
            </div>
        </>
    );
}
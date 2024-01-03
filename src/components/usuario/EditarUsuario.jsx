import {useForm} from "react-hook-form";
import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../utils";
import {toast} from "react-toastify";
import {updateNombreUsuario} from "../../services/perfil-usuario-services";
import {dataG} from "../../App";

export const EditarUsuario = () => {

    const {handleSubmit,register,formState:{errors},reset} =  useForm();

    const onSubmitEdit = handleSubmit(async (data) => {

        data.opcion = 2;
        data.usuario = dataG.usuario;
        data.sucursal= dataG.sucursal;

        const encryptedData =  encryptRequest(data);
        const response = await updateNombreUsuario(encryptedData);
        if (response.result_set[0].Mensaje !== '') {
            toast.success(response.result_set[0].Mensaje, OPTIONS);

        }else{
            toast.error(response.result_set[0].Mensaje, OPTIONS);
        }
        reset();
    });

    return (
        <>
            <div className="text-center mt-3">
                <div className="row mb-3">
                    <div className="col-md-6 mx-auto">
                        <div className="form-floating">
                            <input
                                {...register("nombre_completo", {
                                    required: {
                                        value: true,
                                        message: 'El campo Nombre Completo no puede ser vacio.'
                                    },
                                    minLength: {
                                        value: 2,
                                        message: 'El campo Nombre Completo como mínimo debe de tener al menos 2 caracteres.'
                                    },
                                    validate: (value) => validarAlfaNumerico("Nombre Completo", value)
                                })}
                                type="text"
                                className={`form-control ${!!errors?.nombre_completo ? 'invalid-input' : ''}`}
                                id="nombre_completo"
                                name="nombre_completo"
                                placeholder="Ingresa el nombre completo"
                                autoComplete="off"
                            />
                            <label htmlFor="nombre_completo">NOMBRE COMPLETO</label>
                            {
                                errors?.nombre_completo &&
                                <div className="invalid-feedback-custom">{errors?.nombre_completo.message}</div>
                            }
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <button type="button" className="btn btn-primary"
                            onClick={onSubmitEdit}>
                        <i className="bi bi-save me-2"></i>
                        GUARDAR CAMBIOS
                    </button>
                </div>
            </div>
        </>
    );
}
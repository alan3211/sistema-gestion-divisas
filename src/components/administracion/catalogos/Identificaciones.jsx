import {useForm} from "react-hook-form";
import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../../utils";
import {toast} from "react-toastify";
import {guardaCatalogo} from "../../../services";

export const Identificaciones = () => {

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();

    const onSubmitCatalogo = handleSubmit(async (data) => {

        data.tipo = 'identificacion';
        const encryptedData = encryptRequest(data);

        const response =  await guardaCatalogo(encryptedData);

        if (response !== '') {
            toast.success(response, OPTIONS);
            reset();
        }



    });


    return (
        <>
            <hr />
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    {...register("identificacion", {
                                        required: {
                                            value: true,
                                            message: 'El campo Identificación no puede ser vacío.'
                                        },
                                        minLength: {
                                            value: 2,
                                            message: 'El campo Identificación debe tener al menos 2 caracteres.'
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: 'El campo Identificación no debe tener más de 30 caracteres.'
                                        },
                                        validate: (value) => validarAlfaNumerico("Identificación", value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!errors?.identificacion ? 'is-invalid' : ''}`}
                                    id="identificacion"
                                    name="identificacion"
                                    placeholder="Ingresa el tipo de identificación"
                                    autoComplete="off"
                                />
                                <label htmlFor="identificacion">TIPO DE IDENTIFICACIÓN</label>
                                {
                                    errors?.identificacion &&
                                    <div className="invalid-feedback-custom">{errors?.identificacion.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <button type="button" className="m-2 btn btn-primary"
                                    onClick={onSubmitCatalogo}>
                              <span className="me-2">
                                GUARDAR
                                <span className="bi bi-save ms-2" role="status" aria-hidden="true"></span>
                              </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}
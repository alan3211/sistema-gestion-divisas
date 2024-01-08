import {useForm} from "react-hook-form";
import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../../utils";
import {guardaCatalogo} from "../../../services";
import {toast} from "react-toastify";

export const Zonas = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();

    const onSubmitCatalogo = handleSubmit(async (data) => {
        console.log("CATALOGO: ", data);
        data.tipo = 'zonas';
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
                                    {...register("descripcion", {
                                        required: {
                                            value: true,
                                            message: 'El campo Zona no puede ser vacío.'
                                        },
                                        minLength: {
                                            value: 2,
                                            message: 'El campo Zona debe tener al menos 2 caracteres.'
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: 'El campo Zona no debe tener más de 30 caracteres.'
                                        },
                                        validate: (value) => validarAlfaNumerico("Zona", value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!errors?.identificacion ? 'is-invalid' : ''}`}
                                    id="descripcion"
                                    name="descripcion"
                                    placeholder="Ingresa la nueva zona"
                                    autoComplete="off"
                                />
                                <label htmlFor="descripcion">ZONA</label>
                                {
                                    errors?.descripcion &&
                                    <div className="invalid-feedback-custom">{errors?.descripcion.message}</div>
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
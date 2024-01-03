import {useForm} from "react-hook-form";
import {encryptRequest, validarAlfaNumerico, validarMayus} from "../../../utils";
import {guardaCatalogo} from "../../../services";
import {toast} from "react-toastify";

export const Monedas = () => {

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();

    const onSubmitCatalogo = handleSubmit(async (data) => {
        console.log("CATALOGO: ", data);
        data.tipo = 'moneda';
        data.descripcion = data.descripcion.toUpperCase();
        const encryptedData = encryptRequest(data);

        const response =  await guardaCatalogo(encryptedData);

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
        <>
            <hr />
            <div className="row">
                <div className="col-md-4 mx-auto">
                    <div className="form-floating">
                        <input
                            {...register("id_moneda", {
                                required: {
                                    value: true,
                                    message: 'El campo ID Moneda no puede ser vacío.'
                                },
                                minLength: {
                                    value: 2,
                                    message: 'El campo ID Moneda debe tener al menos 2 caracteres.'
                                },
                                maxLength: {
                                    value: 30,
                                    message: 'El campo ID Moneda no debe tener más de 30 caracteres.'
                                },
                                validate: (value) => validarMayus("ID Moneda", value)
                            })}
                            type="text"
                            className={`form-control ${!!errors?.identificacion ? 'is-invalid' : ''}`}
                            id="id_moneda"
                            name="id_moneda"
                            placeholder="Ingresa el ID de la moneda"
                            autoComplete="off"
                        />
                        <label htmlFor="id_moneda">ID MONEDA</label>
                        {
                            errors?.id_moneda &&
                            <div className="invalid-feedback-custom">{errors?.id_moneda.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <div className="form-floating">
                        <input
                            {...register("descripcion", {
                                required: {
                                    value: true,
                                    message: 'El campo Descripción no puede ser vacío.'
                                },
                                minLength: {
                                    value: 2,
                                    message: 'El campo Descripción debe tener al menos 2 caracteres.'
                                },
                                maxLength: {
                                    value: 30,
                                    message: 'El campo Descripción no debe tener más de 30 caracteres.'
                                },
                                validate: (value) => validarAlfaNumerico("Descripción", value)
                            })}
                            type="text"
                            className={`form-control ${!!errors?.descripcion ? 'is-invalid' : ''}`}
                            id="descripcion"
                            name="descripcion"
                            placeholder="Ingresa la descripcion"
                            autoComplete="off"
                        />
                        <label htmlFor="descripcion">DESCRIPCIÓN</label>
                        {
                            errors?.descripcion &&
                            <div className="invalid-feedback-custom">{errors?.descripcion.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-4">
                    <button type="button" className="m-2 btn btn-primary"
                            onClick={onSubmitCatalogo}>
                              <span className="me-2">
                                GUARDAR
                                <span className="bi bi-save ms-2" role="status" aria-hidden="true"></span>
                              </span>
                    </button>
                </div>
            </div>
        </>
    );
}
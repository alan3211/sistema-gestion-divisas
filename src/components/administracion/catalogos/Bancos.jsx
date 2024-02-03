import {useForm} from "react-hook-form";
import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../../utils";
import {guardaCatalogo} from "../../../services";
import {toast} from "react-toastify";

export const Bancos = () => {

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors},
    } = useForm();

    const onSubmitCatalogo = handleSubmit(async (data) => {
        data.tipo = 'bancos';
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
            <form className="row">
                <div className="col-md-6 mx-auto">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    {...register("banco", {
                                        required: {
                                            value: true,
                                            message: 'El campo Banco no puede ser vacío.'
                                        },
                                        minLength: {
                                            value: 2,
                                            message: 'El campo Banco debe tener al menos 2 caracteres.'
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: 'El campo Banco no debe tener más de 30 caracteres.'
                                        },
                                        validate: (value) => validarAlfaNumerico("Banco", value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!errors?.banco ? 'is-invalid' : ''}`}
                                    id="banco"
                                    name="banco"
                                    placeholder="Ingresa un nuevo banco"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        setValue("banco", upperCaseValue);
                                    }}
                                />
                                <label htmlFor="banco">BANCO/CASA DE CAMBIO</label>
                                {
                                    errors?.banco &&
                                    <div className="invalid-feedback-custom">{errors?.banco.message}</div>
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
            </form>
        </>
    );
}
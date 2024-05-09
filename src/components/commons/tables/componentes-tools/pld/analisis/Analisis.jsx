/*Herramienta para realizar los analisis a los usuarios */
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";

import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../../../../../utils";
import {ModalGenericPLDTool} from "../../../../modals";
import {toast} from "react-toastify";
import {consultaAnalisis, guardaAnalisis} from "../../../../../../services/pld-services";


export const Analisis = ({item, index}) => {

    const [showModal, setShowModal] = useState(false);
    const [showButton, setShowButton] = useState(true);

    const {
        register,
        handleSubmit,
        formState: {errors}, reset
        , watch,setValue
    } = useForm();
    const [dataDenominacion, setDataDenominacion] = useState([]);

    const handleConfirmaValores = handleSubmit(async (data) => {
        const valores = {
            numero_usuario: item["No Usuario"],
            motivo: data.motivo
        }
        const encryptedData = encryptRequest(valores);
        const response = await guardaAnalisis(encryptedData);

        if (response.result_set[0].hasOwnProperty("Resultado")) {
            toast.success(response.result_set[0].Resultado, OPTIONS);
            setShowModal(false);
            reset();
        }
    });

    const options = {
        size:'lg',
        showModal,
        closeModal: () => setShowModal(false),
        title: `Analisis del usuario ${item["No Usuario"]} - ${item.Nombre} ${item["Apellido Paterno"]} ${item["Apellido Materno"]}`,
        icon: 'bi bi-exclamation-triangle-fill m-2 text-warning',
        subtitle:'Ingrese el motivo por el cual desea analizar al usuario.',
    };

    useEffect(() => {
        const validaAnalisis = async () => {

            const valores = {
                numero_usuario: item["No Usuario"]
            }
            const encryptedData =  encryptRequest(valores);
            const response = await consultaAnalisis(encryptedData);

            if(response.total_rows > 0) {
                setShowButton(false)
                setValue("motivo",response.result_set[0].Analisis)
            }else{
                setShowButton(true);
            }

        }
        validaAnalisis();
    }, [item["No Usuario"]]);

    return (
        <td key={index} className="text-center">
            <button className="btn btn-cotizar me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Analizar"
                    onClick={() =>  setShowModal(true)}>
                <i className="bi bi-eye"></i>
            </button>
            {
                showModal
                && (
                    <ModalGenericPLDTool options={options}>
                        <div className="row">
                            <div className='col-md-12'>
                                    <div className="form-floating">
                                    <textarea
                                        {...register("motivo", {
                                            required: {
                                                value: true,
                                                message: 'El campo Motivo no puede ser vacío.'
                                            },
                                            minLength: {
                                                value: 25,
                                                message: 'El campo Motivo como mínimo debe tener más de 25 caracteres.'
                                            },
                                            maxLength: {
                                                value: 200,
                                                message: 'El campo Motivo como máximo debe tener no más de 200 caracteres.'
                                            },
                                            validate: (value) => validarAlfaNumerico("Motivo", value)
                                        })}
                                        className={`form-control ${!!errors?.motivo ? 'is-invalid' : ''}`}
                                        id="motivo"
                                        name="motivo"
                                        placeholder="Ingresa el motivo"
                                        onChange={(e) => {
                                            const upperCaseValue = e.target.value.toUpperCase();
                                            e.target.value = upperCaseValue;
                                            setValue("motivo", upperCaseValue);
                                        }}
                                        style={{
                                            height: '300px',
                                            resize: 'none'
                                        }}
                                        disabled={!showButton}
                                    />
                                        <label htmlFor="motivo">MOTIVO</label>
                                        {
                                            errors?.motivo &&
                                            <div className="invalid-feedback-custom">{errors?.motivo.message}</div>
                                        }
                                    </div>
                                </div>
                            {showButton && (<div className="d-flex justify-content-center mt-3">
                                <button type="button" className='btn btn-success'
                                        onClick={handleConfirmaValores}>
                                    <i className='bi bi-save-fill m-2'></i>
                                    GUARDAR ANÁLISIS
                                </button>
                            </div>)}
                        </div>
                    </ModalGenericPLDTool>
                )
            }
        </td>
    );
}
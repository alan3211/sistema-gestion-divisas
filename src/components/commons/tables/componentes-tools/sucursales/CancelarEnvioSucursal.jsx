/*Herramienta para cancelar desde la sucursal*/
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest,
    FormatoMoneda,
    getDenominacion, obtenerObjetoDenominaciones,
    OPTIONS,
    validarAlfaNumerico
} from "../../../../../utils";
import {ModalAccionCancelarTool, ModalGenericTool} from "../../../modals";
import {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {dataG} from "../../../../../App";
import {cancelarEnvioSucursalOperativa, obtieneDenominacionesSolicitadas} from "../../../../../services/tools-services";
import {toast} from "react-toastify";
import {Denominacion, DenominacionTableCaja} from "../../../../operacion/denominacion";
import {ModalLoading} from "../../../modals/ModalLoading";
import {DenominacionContext} from "../../../../../context/denominacion/DenominacionContext";
import {realizarOperacionSucursal, realizarOperacionSucursalDP} from "../../../../../services/operacion-sucursal";

export const CancelarEnvioSucursal = ({item, index, refresh}) => {
    const {denominacionD} = useContext(DenominacionContext);
    const [showModal, setShowModal] = useState(false);
    const [guarda, setGuarda] = useState(false);
    const [showModalDotar, setShowModalDotar] = useState(false);
    const {register,
        handleSubmit,
        formState: {errors}, reset,
        setValue} = useForm();
    const showModalCancelar = () => {
        setShowModal(true);
    }

    const [habilita, setHabilita] = useState({
        recibe: true,
        entrega: true,
    });

    const [finalizaOperacion, setFinalizaOperacion] = useState(true);
    const [dataEnviada, setDataEnviada] = useState([]);

    const handleCancelarEnvio = async (data) => {
        data.id_operacion = item.ID;
        data.sucursal = item["Sucursal Envia"];
        data.usuario = dataG.usuario;

        const encryptedData = encryptRequest(data);
        const response = await cancelarEnvioSucursalOperativa(encryptedData);

        if (response.result_set[0].Mensaje !== '') {
            toast.success(response.result_set[0].Mensaje, OPTIONS);
            setShowModal(false);
            refresh();
            reset();
        }
    };

    const options = {
        showModal,
        closeModal: () => setShowModal(false),
        title: 'Cancelar Dotación',
        subtitle: 'Ingrese el motivo por el cual desea cancelar el envío de la sucursal.',
    };

    const optionsModal = {
        size: 'xl',
        showModal: showModalDotar,
        closeModal: () => setShowModalDotar(false),
        title: 'Solicitud de Dotación Parcial',
        icon: 'bi bi-cash m-2 text-success',
        subtitle: `La caja ${item['Usuario Envia']} requiere la cantidad de ${FormatoMoneda(parseFloat(item.Monto))} en la denominación ${item.Moneda}`
    };

    const optionsTable = {
        title: '',
        importe: parseFloat(item.Monto),
        sucursal: item['Sucursal Envia'],
        habilita,
        setHabilita,
        setFinalizaOperacion
    }

    const optionsLoad = {
        showModal: guarda,
        closeCustomModal: () => setGuarda(false),
        title: "Realizando la dotación parcial...",
    };

    const terminarDotacionParcial = async () => {
        setGuarda(true);

        const valores = {
            operacion: 'DOTACION PARCIAL',
            usuario: dataG.usuario,
            opcion:1,
            sucursal: item['Sucursal Envia'],
            ticket: item['No Movimiento'],
            noCliente: '0',
            traspaso: '',
        }

        let formValuesD=[];

        if(item["No Movimiento"].startsWith("DOTPAR")){
            let denominacionesDotacion = denominacionD.getValues();
            formValuesD = getDenominacion(item.Moneda, denominacionesDotacion)
        }else{
            formValuesD = getDenominacion(item.Moneda, dataEnviada)
        }

        eliminarDenominacionesConCantidadCero(formValuesD);
        const denominaciones = obtenerObjetoDenominaciones(formValuesD);
        denominaciones.divisa = item.Moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'DOTACION PARCIAL';

        valores.denominacion = [
            denominaciones,
        ]

        const encryptedData = encryptRequest(valores);

        const resultado = await realizarOperacionSucursalDP(encryptedData);

        if (resultado) {
            denominacionD.reset();
            setGuarda(false);
            toast.success(resultado, OPTIONS);
            setShowModalDotar(false);
            refresh();
        }
    };

    useEffect(() => {
        if(item["No Movimiento"].startsWith("DOTRAP")){
            setFinalizaOperacion(false)
        }
    }, [item["No Movimiento"]]);

    useEffect(() => {
        const getDenominacionesSolicitadas = async () => {
            const values = {
                ticket: item['No Movimiento']
            }
            const encryptedData =  encryptRequest(values);
            const response =  await obtieneDenominacionesSolicitadas(encryptedData);
            setDataEnviada(response.result_set)
        }

        getDenominacionesSolicitadas();
    }, [item['No Movimiento']]);

    return (
        <td key={index} className="text-center">
            {item.Estatus === 'Pendiente' &&
                (<button
                    className="btn btn-danger"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="CANCELAR"
                    disabled={item.Estatus !== 'Pendiente'}
                    onClick={showModalCancelar}
                >
                    <i className="bi bi-x-circle"></i>
                </button>)
            }
            {item.Estatus === 'Solicitado' &&
                (<>
                    <button
                        className="btn btn-success me-2"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="DOTAR"
                        disabled={item.Estatus !== 'Solicitado'}
                        onClick={() => setShowModalDotar(true)}
                    >
                        <i className="bi bi-cash-stack"></i>
                    </button>
                    <button
                        className="btn btn-danger"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="CANCELAR"
                        disabled={item.Estatus !== 'Solicitado'}
                        onClick={showModalCancelar}
                    >
                        <i className="bi bi-x-circle"></i>
                    </button>
                </>)
            }
            {
                showModal &&
                (
                    <ModalAccionCancelarTool options={options}>
                        <div>
                            <div className="col-md-12">
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
                                        placeholder="Ingresa el motivo de cancelación"
                                        onChange={(e) => {
                                            const upperCaseValue = e.target.value.toUpperCase();
                                            e.target.value = upperCaseValue;
                                            setValue("motivo", upperCaseValue);
                                        }}
                                        style={{
                                            minHeight: 'calc(100vh - 235px)',
                                            resize: 'none'
                                        }}
                                    />
                                    <label htmlFor="motivo">MOTIVO</label>
                                    {
                                        errors?.motivo &&
                                        <div className="invalid-feedback-custom">{errors?.motivo.message}</div>
                                    }
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                                <button type="button" className="btn btn-danger"
                                        onClick={handleSubmit(handleCancelarEnvio)}>
                                    <i className="bi bi-x-circle me-1"></i>
                                    CANCELAR ENVÍO
                                </button>
                            </div>
                        </div>
                    </ModalAccionCancelarTool>
                )
            }
            {
                showModalDotar &&
                (
                    <ModalGenericTool options={optionsModal}>
                        <>
                            {
                                item["No Movimiento"].startsWith("DOTPAR")
                                ?  <Denominacion type="SD" moneda={item.Moneda} options={optionsTable}/>
                                : <DenominacionTableCaja moneda={item.Moneda} monto={item.Monto} data={dataEnviada}/>
                            }
                            <div className="col-md-12 d-flex justify-content-center">
                                <button type="button" className="btn btn-primary"
                                        onClick={terminarDotacionParcial}
                                        disabled={finalizaOperacion}>
                                    <span className="bi bi-check-circle me-2" aria-hidden="true"></span>
                                    TERMINAR DOTACIÓN
                                </button>
                            </div>
                            {guarda && <ModalLoading options={optionsLoad}/>}
                        </>
                    </ModalGenericTool>
                )
            }
        </td>
    );
};
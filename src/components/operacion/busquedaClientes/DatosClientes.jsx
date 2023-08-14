import {useOperaCliente} from "../../../hook/useOperaCliente";
import {ModalDeliverComponent} from "../../commons/modals/ModalDeliverComponent";
import {useEffect, useState} from "react";
import {dataG} from "../../../App";
import {encryptRequest, formattedDate, hora} from "../../../utils/utils";
import {hacerOperacion} from "../../../services/operaciones-services";
import {CardLayout} from "../../commons";

export const DatosClientes = ({operacion, cliente}) => {

    const {showModal, setShowModal, selectedItem, closeModal} = useOperaCliente();
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [data, setData] = useState({});

    const configuration = {
        showModal,
        setShowModal,
        showCustomModal,
        setShowCustomModal,
        selectedItem,
        closeModal,
        title: '¿Desea realizar una cotización con este cliente?',
        operacion,
        data,
    }

    const getOperacion = async () => {
        const operacionEnvia = {
            cliente: cliente.cliente,
            tipo_operacion: operacion.tipo_operacion,
            sucursal: dataG.sucursal,
            nombre_operador: dataG.usuario,
            fecha_operacion: formattedDate,
            hora_operacion: hora,
            monto: parseInt(operacion.monto),
            divisa: operacion.moneda,
            tipo_cambio: operacion.tipo_cambio,
            cantidad_entregar: operacion.cantidad_entregada
        }

        const encryptedData = encryptRequest(operacionEnvia);

        const pre_operacion = await hacerOperacion(encryptedData);
        return pre_operacion;
    }


    const continuaOperacion = async () => {
        const datos = await getOperacion();
        setData(datos);
        setShowCustomModal(true);
    }

    return (
        <>
            <CardLayout title="Información de Clientes" icon="bi bi-person-fill me-2">
                <div className="row">
                    <div className="col-md-2">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="cliente"
                                value={cliente.cliente}
                                readOnly
                            />
                            <label htmlFor="cliente">Número de Cliente</label>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                value={cliente.nombre}
                                readOnly
                            />
                            <label htmlFor="nombre">Nombre</label>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="apellidoPaterno"
                                value={cliente.apellidoPaterno}
                                readOnly
                            />
                            <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="apellidoMaterno"
                                value={cliente.apellidoMaterno}
                                readOnly
                            />
                            <label htmlFor="apellidoMaterno">Apellido Materno</label>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="fechaNacimiento"
                                value={cliente.fechaNacimiento}
                                readOnly
                            />
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating m-2">
                            <button
                                type="button"
                                onClick={continuaOperacion}
                                className="m-2 btn btn-primary d-grid gap-2"
                            >
                                <span className="me-2">
                                    Continuar
                                      <span
                                          className="bi bi-arrow-right-circle-fill ms-2"
                                          role="status"
                                          aria-hidden="true">
                                      </span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </CardLayout>
            {
                showCustomModal && <ModalDeliverComponent configuration={configuration}/>
            }

        </>

    );
}
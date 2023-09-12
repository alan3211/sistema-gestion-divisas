import {useOperaCliente} from "../../../hook";
import {ModalDeliverComponent} from "../../commons/modals";
import {useContext, useState} from "react";
import {dataG} from "../../../App";
import {encryptRequest, formattedDate, hora} from "../../../utils";
import {hacerOperacion} from "../../../services";
import {CardLayout} from "../../commons";
import {DenominacionProvider} from "../../../context/denominacion/DenominacionProvider";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";

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
        operacion,
        data,
    }

    console.log("DATOS CLIENTE: ",cliente)

    const getOperacion = async () => {
        const operacionEnvia = {
            cliente: cliente.cliente,
            tipo_operacion: operacion.tipo_operacion,
            sucursal: dataG.sucursal || 0,
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
                                value={cliente.Cliente}
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
                                value={cliente.Nombre}
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
                                value={cliente.ApellidoPaterno}
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
                                value={cliente.ApellidoMaterno}
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
                                value={cliente.FechaNacimiento}
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
                                disabled={Object.keys(operacion).length === 0}
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
                showCustomModal &&
                (
                    <DenominacionProvider>
                        <ModalDeliverComponent configuration={configuration}/>
                    </DenominacionProvider>

                )
            }

        </>

    );
}
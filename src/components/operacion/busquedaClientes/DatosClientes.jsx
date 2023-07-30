import {TitleComponent} from "../../commons/TitleComponent";
import {useOperaCliente} from "../../../hook/useOperaCliente";
import {ModalDeliverComponent} from "../../commons/modals/ModalDeliverComponent";
import {useState} from "react";
import {dataG} from "../../../App";
import {formattedDate, hora} from "../../../utils/utils";
import {hacerOperacion} from "../../../services/operaciones-services";

export const DatosClientes = ({operacion,cliente}) => {

    const {showModal,setShowModal,selectedItem,closeModal} =  useOperaCliente();
    const [showCustomModal,setShowCustomModal] = useState(false);
    const [data,setData] = useState({});

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

    const getOperacion = async() =>{
        const operacionEnvia = {
            cliente: cliente.cliente,
            tipo_operacion: operacion.tipo_operacion,
            sucursal: dataG.sucursal,
            nombre_operador: dataG.usuario,
            fecha_operacion:formattedDate,
            hora_operacion: hora,
            monto: operacion.monto,
            divisa: operacion.moneda,
            tipo_cambio: operacion.tipo_cambio,
            cantidad_entregar: operacion.cantidad_entregada
        }
        const pre_operacion = await hacerOperacion(operacionEnvia);
        return pre_operacion;
    }


    const continuaOperacion = async() => {
        const datos = await getOperacion();
        setData(datos);
        setShowCustomModal(true);
    }

    return (
        <>
            <div className="card shadow">
                <div className="card-body">
                    <TitleComponent title="Información de Clientes" icon="ri-user-fill" />
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
                               <button className="btn btn-primary" onClick={continuaOperacion}>Continuar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                showCustomModal && <ModalDeliverComponent configuration={configuration} />
            }

        </>

    );
}
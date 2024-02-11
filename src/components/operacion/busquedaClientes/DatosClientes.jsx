import {useOperaCliente} from "../../../hook";
import {ModalDeliverComponent} from "../../commons/modals";
import {useContext, useState} from "react";
import {CardLayout} from "../../commons";
import {DenominacionProvider} from "../../../context/denominacion/DenominacionProvider";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {convertirFechaADD} from "../../../utils";

export const DatosClientes = ({operacion, cliente}) => {

    const {showModal, setShowModal, selectedItem, closeModal} = useOperaCliente();
    const [showCustomModal, setShowCustomModal] = useState(false);
    const {datos} = useContext(CompraVentaContext);

    console.log("DATOS!!!",datos)
    console.log("DATOS CLIENTE @@@!!!",cliente);
    console.log("DATOS OPERACION @@@!!!",operacion);
    datos.Cliente = cliente.Cliente || cliente.Usuario;


    const configuration = {
        showModal,
        setShowModal,
        showCustomModal,
        setShowCustomModal,
        selectedItem,
        closeModal,
        operacion,
        datos,
    }

    const continuaOperacion = async () => {
        setShowCustomModal(true);
    }

    const formatoFecha = () => {
        let fecha = '';
        if(cliente.hasOwnProperty('FechaNacimiento')){
            fecha = convertirFechaADD(cliente.FechaNacimiento);
        }else if(cliente.hasOwnProperty('Fecha Nacimiento')){
            fecha = convertirFechaADD(cliente['Fecha Nacimiento']);
        }
        return fecha;
    }

    return (
        <>
            <CardLayout title="Información de Usuarios" icon="bi bi-person-fill me-2">
                <div className="row">
                    <div className="col-md-2">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="cliente"
                                value={cliente.Cliente || cliente.Usuario}
                                autoComplete="off"
                                readOnly
                            />
                            <label htmlFor="cliente">NÚMERO USUARIO</label>
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
                                autoComplete="off"
                            />
                            <label htmlFor="nombre">NOMBRE(S)</label>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="apellidoPaterno"
                                value={cliente.ApellidoPaterno || cliente['Apellido Paterno']}
                                readOnly
                                autoComplete="off"
                            />
                            <label htmlFor="apellidoPaterno">APELLIDO PATERNO</label>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="apellidoMaterno"
                                value={cliente.ApellidoMaterno || cliente['Apellido Materno']}
                                readOnly
                                autoComplete="off"
                            />
                            <label htmlFor="apellidoMaterno">APELLIDO MATERNO</label>
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
                                value={formatoFecha()}
                                readOnly
                                autoComplete="off"
                            />
                            <label htmlFor="fechaNacimiento">FECHA NACIMIENTO</label>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-floating m-2">
                            <button
                                type="button"
                                onClick={continuaOperacion}
                                className="m-2 btn btn-primary d-grid gap-2"
                                disabled={Object.keys(operacion).length === 0}
                            >
                                <span className="me-2">
                                    <strong>CONTINUAR OPERACIÓN</strong>
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
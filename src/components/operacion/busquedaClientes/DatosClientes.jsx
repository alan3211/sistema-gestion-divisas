import {useOperaCliente, usePrinter} from "../../../hook";
import {ModalDeliverComponent} from "../../commons/modals";
import {useContext, useState} from "react";
import {CardLayout} from "../../commons";
import {DenominacionProvider} from "../../../context/denominacion/DenominacionProvider";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {convertirFechaADD, encryptRequest, OPTIONS} from "../../../utils";
import {dataG} from "../../../App";
import {buscaCliente} from "../../../services";
import {toast} from "react-toastify";

export const DatosClientes = ({operacion, cliente}) => {

    const {showModal, setShowModal, selectedItem, closeModal} = useOperaCliente();
    const [showCustomModal, setShowCustomModal] = useState(false);
    const {datos,setContinuaOperacion, busquedaCliente: {
        setShowCliente,
    }} = useContext(CompraVentaContext);

    const {abreCajon} = usePrinter();

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

        const valores = {
            tipo_busqueda: 1,
            limite_diario: dataG.limite_diario,
            limite_mensual:dataG.limite_mensual,
            nombre: '',
            apellido_paterno:'',
            apellido_materno:'',
            fecha_nacimiento:'',
            cliente: datos.Cliente,
            tipo_operacion: operacion.tipo_operacion,
            tipo_cambio: parseFloat(operacion.tipo_cambio)
        }

        if (operacion.tipo_operacion === '1') {
            valores.monto = parseInt(operacion.monto);
        } else {
            valores.monto = parseInt(operacion.cantidad_entregar)
        }

        const encryptedData = encryptRequest(valores);
        const dataClientes = await buscaCliente(encryptedData);
        console.log("UN REGISTRO", dataClientes);
        if (dataClientes.result_set[0].hasOwnProperty('Resultado')) {
            const mensaje = dataClientes.result_set[0].Resultado;
            if (mensaje.includes('excede')) {
                toast.warn(mensaje, OPTIONS);
            } else {
                toast.error(mensaje, OPTIONS);
            }
            setShowCliente(false);
            setContinuaOperacion(false);
        }else{
            // Abre el cajon para ingresar los billetes
            setShowCustomModal(true);
            abreCajon();
            console.log("ABRE CAJON CUANDO muestra el MODAL");
        }
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
                                    <strong>CONTINUAR OPERACIÓN COMPRA/VENTA</strong>
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
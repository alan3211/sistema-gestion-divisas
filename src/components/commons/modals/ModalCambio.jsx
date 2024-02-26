import {Button, Modal} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest, formattedDateWS,
    getDenominacion,
    obtenerObjetoDenominaciones, opciones, OPTIONS, redondearNumero, validarNumeros
} from "../../../utils";
import {dataG} from "../../../App";
import {guardaConfirmacionFactura, obtieneDenominaciones, realizarOperacion} from "../../../services";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Denominacion} from "../../operacion/denominacion";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {usePrinter} from "../../../hook";
import {ModalTicket} from "./ModalTicket";
import {ModalGenericTool} from "./ModalTools";
import {ModalLoading} from "./ModalLoading";
import {realizarOperacionSucursal, realizarSolicitudCambio} from "../../../services/operacion-sucursal";
import {useMovimientosDotaciones} from "../../../hook";
import {useForm} from "react-hook-form";


export const ModalCambio = ({cambio,showModalCambio,setShowModalCambio,operacion,data,habilita,setHabilita,operacionConCambio}) => {

    const navigator = useNavigate();
    const [guarda,setGuarda] = useState(false);
    const {denominacionC,denominacionD} = useContext(DenominacionContext);
    const {imprimir,imprimeTicketNuevamente} = usePrinter({"No Usuario": data.Cliente,
        "No Ticket": data.ticket});
    const [showModal,setShowModal] = useState(false)
    const solicitaDotacionFormulario =  useForm();
    const solicitaDotacionRapidaFormulario =  useForm();
    const [estadoDotacion,setEstadoDotacion] = useState(false);
    const [showModalFactura,setShowModalFactura] = useState(false)
    const {solicitudDotacionRapida, showDotacionRapida,
        OPTIONS_DOTACION_RAPIDA} =  useMovimientosDotaciones(
        {
            solicitaDotacionFormulario,
            solicitaDotacionRapidaFormulario,
            setEstadoDotacion,
        });

    const options = {
        title: '',
        importe: redondearNumero(cambio),
        habilita,
        setHabilita,
        reRender: guarda,
    }


    // Sección de dotación Rapida
    const handleDotacionRapida = async()=>{
        setGuarda(true);
        const moneda = operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda;

        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");

        const dataFormulario = {};

        dataFormulario.operacion = 'DOTACION RAPIDA';
        dataFormulario.usuario = dataG.usuario;
        dataFormulario.sucursal = dataG.sucursal;
        dataFormulario.ticket = `DOTRAP${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
        dataFormulario.noCliente='0';
        dataFormulario.traspaso='';
        dataFormulario.moneda=moneda;
        dataFormulario.monto= denominacionD.calculateGrandTotal();

        let denominacionesDotacion = denominacionD.getValues();
        const formValuesD = getDenominacion(moneda,denominacionesDotacion)
        eliminarDenominacionesConCantidadCero(formValuesD);
        const denominaciones = obtenerObjetoDenominaciones(formValuesD);
        denominaciones.divisa = moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'DOTACION RAPIDA';

        dataFormulario.denominacion = [
            denominaciones,
        ]

        console.log("DATA FORM")
        console.log(dataFormulario)
        const encryptedData = encryptRequest(dataFormulario);

        const resultado = await realizarOperacionSucursal(encryptedData);

        if(resultado){
            toast.success(`Se ha realizado la dotación rápida exitosamente.`,OPTIONS);
            OPTIONS_DOTACION_RAPIDA.closeModal();
            setGuarda(false);
            denominacionD.reset();
        }else{
            toast.error(`Hubo un problema al realizar la solicitud rápida.`,OPTIONS);
        }

    }

    const optionsLoad = {
        showModal:guarda,
        closeCustomModal: ()=> setGuarda(false),
        title:'Finalizando Operación...'
    }

    const optionsDotRap = {
        title: `Solicitando dotación parcial en (${operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda})`,
        habilita,
        setHabilita,
        tipo: 'SD',
    }

    const guardarCambio = async() => {
        setGuarda(true);

        console.log("data del cambio");
        console.log(data);

        let denominacionesCambio = denominacionC.getValues();

        const formValuesC = getDenominacion(operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda,denominacionesCambio);

        if(operacion.tipo_operacion === '1') {
            formValuesC.tipoOperacion = 'COMPRA';
        }else{
            formValuesC.tipoOperacion = 'VENTA';
        }

        formValuesC.divisa = operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda;
        formValuesC.movimiento = 'CAMBIO AL USUARIO';

        eliminarDenominacionesConCantidadCero(formValuesC);

        console.log("CAMBIO!: ",cambio);

        console.log("DATOS: ",data);

        const values = {
            cliente: data.Cliente,
            ticket: data.ticket,
            cantidad_entregar: parseFloat(cambio),
            monto: 0.0,
            divisa:operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda,
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            traspaso: '',
            diferencia: 0.0,
            denominacion:[
                obtenerObjetoDenominaciones(formValuesC),
            ]
        }
        await realizarOperacion(operacionConCambio);
        console.log("VALUES DEL CAMBIO: ",values);
        const encryptedData = encryptRequest(values);
        const resultado = await realizarOperacion(encryptedData);

        // Validar si tenemos que darle cambio
        if(resultado){
            setGuarda(false);
            setShowModalFactura(true);
        }
    }

    const imprimeTicket = () =>{
        imprimeTicketNuevamente(0)
    }

    const guardaFactura = async ()=> {

        const values = {
            ticket: data.ticket,
            resguardo: 'SI'
        }

        const encryptedData =  encryptRequest(values);

        const response = await guardaConfirmacionFactura(encryptedData)

        if(response.total_rows === 0){
            toast.error('Hubo un problema al resguardar la factura',OPTIONS);
        }else{
            imprimir(0);
            setShowModalFactura(false)
            setShowModal(true)
        }

    }

    return(
        <>
            <Modal fullscreen show={showModalCambio}>
                <Modal.Header>
                    <Modal.Title>
                        <h5 className="text-blue">
                            <i className="bx bx-money m-2"></i>
                            Entrega de Cambio ({operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda})
                        </h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row justify-content-center">
                        <div className="col-md-5 mb-3 d-flex">
                            <div className="form-floating flex-grow-1">
                                <input type="text"
                                       className={`form-control mb-1`}
                                       id="floatingCE"
                                       value={redondearNumero(cambio)}
                                       readOnly
                                       autoComplete="off"
                                />
                                <label htmlFor="floatingCE">CANTIDAD A ENTREGAR <i>({operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda})</i></label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <Denominacion type="C" moneda={operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda} options={options}/>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn btn-orange" onClick={solicitudDotacionRapida}>
                        <i className="bi bi-currency-exchange me-2"></i>
                        DOTACIÓN PARCIAL
                    </button>
                    <Button variant="primary" disabled={redondearNumero(denominacionC.calculateGrandTotal) != redondearNumero(cambio)} onClick={guardarCambio}>
                        <i className="bi bi-arrow-left-right me-2"></i>
                        ENTREGAR CAMBIO
                    </Button>
                </Modal.Footer>
            </Modal>

            {
                guarda && (
                    <ModalLoading options={optionsLoad}/>
                )
            }


            {
                showModal && (
                    <ModalTicket title="¿Se imprimió el ticket correctamente?"
                                  showModal={showModal}
                                  closeModalAndReturn={imprimeTicket}
                                  hacerOperacion={()=> {
                                      toast.success('Se ha entregado el cambio correspondiente.', OPTIONS);
                                      setShowModal(false)
                                      navigator('/inicio')
                                  }}
                                  icon="bi bi-exclamation-triangle-fill text-warning m-2"/>
                )
            }
            {
                showModalFactura && (
                    <ModalTicket title="¿El usuario requiere factura?"
                                 showModal={showModalFactura}
                                 closeModalAndReturn={()=>{
                                     imprimir(0);
                                     setShowModal(true)
                                 }}
                                 hacerOperacion={guardaFactura}
                                 icon="bi bi-exclamation-triangle-fill text-warning m-2"/>
                )
            }
            {
                showDotacionRapida && (
                    <ModalGenericTool options={OPTIONS_DOTACION_RAPIDA}>
                        { estadoDotacion && (<div className="row">
                            <Denominacion type="SD"
                                          moneda={operacion.tipo_operacion !== "1" ? `MXP` : operacion.moneda}
                                          options={optionsDotRap}/>
                            <div className="col-md-6 mx-auto">
                                <button type="button" className="m-2 btn btn-secondary" onClick={OPTIONS_DOTACION_RAPIDA.closeModal}>
                                      <span className="ms-2">
                                        <i className="bi bi-arrow-left me-2"></i>
                                        REGRESAR
                                      </span>
                                </button>

                                <button type="button" className="m-2 btn btn-primary" onClick={handleDotacionRapida}
                                        disabled={denominacionD.calculateGrandTotal() === 0}>
                                      <span className="me-2">
                                        GUARDAR
                                        <span className="bi bi-save ms-2" role="status" aria-hidden="true"></span>
                                      </span>
                                </button>
                            </div>
                        </div>)}
                    </ModalGenericTool>
                )
            }
        </>
    );
}
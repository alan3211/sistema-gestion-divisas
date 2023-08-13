import {Button, Modal} from "react-bootstrap";
import {DenominacionComponent} from "../../operacion/denominacion/DenominacionComponent";
import {useState} from "react";
import {useForm} from "../../../hook/useForm";
import {eliminarDenominacionesConCantidadCero, obtenerObjetoDenominaciones} from "../../../utils";
import {dataG} from "../../../App";
import {realizarOperacion} from "../../../services";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export const ModalCambio = ({cambio,showModalCambio,setShowModalCambio,operacion,data}) => {

    const [isOkRecibido,setIsOkRecibido] = useState(true);
    const navigator = useNavigate();

    const {formValues,handleInputChange} = useForm({
            denominacion_p1:{nombre:"0.10", cantidad:0},
            denominacion_p2:{nombre:"0.20", cantidad:0},
            denominacion_p5:{nombre:"0.50", cantidad:0},
            denominacion_1:{nombre:"1", cantidad:0},
            denominacion_2:{nombre:"2", cantidad:0},
            denominacion_5:{nombre:"5", cantidad:0},
            denominacion_10:{nombre:"10", cantidad:0},
            denominacion_20:{nombre:"20", cantidad:0},
            denominacion_50:{nombre:"50", cantidad:0},
            denominacion_100:{nombre:"100", cantidad:0},
            denominacion_200:{nombre:"200", cantidad:0},
            denominacion_500:{nombre:"500", cantidad:0},
            denominacion_1000:{nombre:"1000", cantidad:0},
    });

    const closeCustomModal = () => setShowModalCambio(false);

    const guardarCambio = async() => {

        if(operacion.tipo_operacion === '1') {
            formValues.tipoOperacion = 'COMPRA';
        }else{
            formValues.tipoOperacion = 'VENTA';
        }

        formValues.divisa = 'MXP';
        formValues.movimiento = 'CAMBIO CLIENTE';

        eliminarDenominacionesConCantidadCero(formValues);

        const values = {
            cliente: data.cliente,
            ticket: data.ticket,
            cantidad_entregar: parseInt(cambio),
            monto: parseFloat(cambio),
            divisa:'MXP',
            usuario: dataG.username,
            sucursal: dataG.sucursal,
            traspaso: '',
            diferencia:0.0,
            denominacion:[
                obtenerObjetoDenominaciones(formValues),
            ]
        }

        console.log("Antes de Enviar: ",values)

        const resultado = await realizarOperacion(values);

        // Validar si tenemos que darle cambio
        if(resultado){
            console.log(resultado);
            toast.success('Se ha entregado el cambio correspondiente.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
            navigator("/inicio");
        }
    }




    return(
        <>
            <Modal centered show={showModalCambio} onHide={closeCustomModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>
                            <i className="bx bx-money m-2"></i>
                            Entrega de Cambio
                        </h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row justify-content-center">
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="cantidad"><strong>Cantidad a entregar:</strong></label>
                                <input type="text" className="form-control" id="cantidad" value={cambio} readOnly />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <DenominacionComponent
                                    handleInputChange={handleInputChange}
                                    moneda="MXP"
                                    importe={cambio}
                                    setIsOkRecibido={setIsOkRecibido}
                                    type
                                    cambio
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    {
                        /*!isOkRecibido &&
                        <Button variant="secondary" disabled={isOkRecibido}>
                            Imprime Ticket
                        </Button>*/
                    }
                    <Button variant="primary" disabled={isOkRecibido} onClick={guardarCambio}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>



        </>
    );
}
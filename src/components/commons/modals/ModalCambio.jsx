import {Button, Modal} from "react-bootstrap";
import {DenominacionComponent} from "../../operacion/denominacion/DenominacionComponent";
import {useState} from "react";
import {useForm} from "../../../hook/useForm";
import {eliminarDenominacionesConCantidadCero, encryptRequest, obtenerObjetoDenominaciones} from "../../../utils";
import {dataG} from "../../../App";
import {realizarOperacion} from "../../../services";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Denominacion} from "../../operacion/denominacion/Denominacion";

export const ModalCambio = ({cambio,showModalCambio,setShowModalCambio,operacion,data,calculaValorMonto,habilita,setHabilita}) => {

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

    const options = {
        title: 'Cambio a entregar',
        importe: parseFloat(cambio),
        calculaValorMonto,
        habilita,
        setHabilita
    }

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
        const encryptedData = encryptRequest(values);

        const resultado = await realizarOperacion(encryptedData);

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
                                <label htmlFor="cantidad"><strong>Cantidad a entregar</strong></label>
                                <input type="text" className="form-control" id="cantidad" value={cambio} readOnly />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <Denominacion type="CH" moneda="MXP" options={options}/>
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
                    <Button variant="primary" disabled={habilita.recibe} onClick={guardarCambio}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>



        </>
    );
}
import {Button, Modal} from "react-bootstrap";
import {useContext} from "react";
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest,
    getDenominacion,
    obtenerObjetoDenominaciones
} from "../../../utils";
import {dataG} from "../../../App";
import {realizarOperacion} from "../../../services";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Denominacion} from "../../operacion/denominacion/Denominacion";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";

export const ModalCambio = ({cambio,showModalCambio,setShowModalCambio,operacion,data,habilita,setHabilita}) => {

    const navigator = useNavigate();
    const {denominacionC} = useContext(DenominacionContext);

    const options = {
        title: '',
        importe: parseFloat(cambio),
        habilita,
        setHabilita
    }

    const closeCustomModal = () => setShowModalCambio(false);

    const guardarCambio = async() => {

        let denominacionesCambio = denominacionC.getValues();

        const formValuesC = getDenominacion("MXP",denominacionesCambio);

        if(operacion.tipo_operacion === '1') {
            formValuesC.tipoOperacion = 'COMPRA';
        }else{
            formValuesC.tipoOperacion = 'VENTA';
        }

        formValuesC.divisa = 'MXP';
        formValuesC.movimiento = 'CAMBIO CLIENTE';

        eliminarDenominacionesConCantidadCero(formValuesC);

        const values = {
            cliente: data.cliente,
            ticket: data.ticket,
            cantidad_entregar: parseInt(cambio),
            monto: parseFloat(cambio),
            divisa:'MXP',
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            traspaso: '',
            diferencia: 0.0,
            denominacion:[
                obtenerObjetoDenominaciones(formValuesC),
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
                        <h5 className="text-blue">
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
                                <Denominacion type="C" moneda="MXP" options={options}/>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" disabled={habilita.recibe} onClick={guardarCambio}>
                        <i className="bi bi-save me-1"></i>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>



        </>
    );
}
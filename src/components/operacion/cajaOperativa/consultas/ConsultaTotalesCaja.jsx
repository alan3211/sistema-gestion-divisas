import {DENOMINACIONES, encryptRequest, FormatoMoneda} from "../../../../utils";
import {useEffect, useState} from "react";
import {ModalGenericTool} from "../../../commons/modals";
import {getDetalleDenominaciones} from "../../../../services/tools-services";
import {DenominacionTableCaja} from "../../denominacion";
import {dataG} from "../../../../App";

export const ConsultaTotalesCaja = ({data}) => {

    const [showModal, setShowModal] = useState(false);
    const [datos, setDatos] = useState([])

    const options = {
        size:'md',
        showModal,
        closeModal: () => setShowModal(false),
        title: 'Detalle de Denominaciones',
        icon: 'bi bi-currency-exchange m-2 text-success',
        subtitle: '',
    };

    const obtieneDetalleDenominaciones = async() => {
            const valores = {
                opcion: 1,
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
                moneda: data.Moneda,
                tipo_operacion: 'DOTACION CAJA',
            }
            const encryptedData = encryptRequest(valores);
            const data_denominacion = await getDetalleDenominaciones(encryptedData)
            setDatos(data_denominacion.result_set);
    }

    useEffect(() => {
        obtieneDetalleDenominaciones();
    }, [data.Moneda]);

    return (
        <>
            <div className="col-md-3">
                <div className="card info-card revenue-card">
                    <div className="card-body">
                        <h5 className="card-title">{data.Moneda} <span>| {DENOMINACIONES[data.Moneda]}</span></h5>

                        <div className="d-flex align-items-center">
                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                <i className="bi bi-currency-dollar"></i>
                            </div>
                            <div className="ps-3">
                                <h6>{FormatoMoneda(parseFloat(data.Monto))}</h6>
                                <span className="text-success small pt-1 fw-bold">
                                    {parseInt(data.Billetes)}
                                </span>
                                <span className="text-muted small pt-2 ps-1">
                                    <a
                                        onClick={()=> setShowModal(true)}
                                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                    {
                                         parseInt(data.Billetes) > 1 || parseInt(data.Billetes) === 0 ? 'billetes disponibles':'billete disponible'
                                    }
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    showModal
                        && (
                            <ModalGenericTool options={options}>
                                <div className="row">
                                    <div className="col-md-9 mx-auto">
                                        <DenominacionTableCaja data={datos} monto={data.Monto} moneda={data.Moneda}/>
                                    </div>
                                </div>
                            </ModalGenericTool>
                    )
                }
            </div>
        </>
    );
}
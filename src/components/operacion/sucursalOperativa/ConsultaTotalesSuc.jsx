import {DENOMINACIONES, encryptRequest, FormatoMoneda} from "../../../utils";
import {useEffect, useState} from "react";
import {dataG} from "../../../App";
import {getDetalleDenominaciones} from "../../../services/tools-services";
import {ModalGenericTool} from "../../commons/modals";
import {DenominacionTableCaja} from "../denominacion";

export const ConsultaTotalesSuc = ({data}) => {

    const [showModal, setShowModal] = useState(false);
    const [datos, setDatos] = useState([])
    const [selectedElemento, setSelectedElemento] = useState(null);

    const options = {
        size:'md',
        showModal,
        closeModal: () => setShowModal(false),
        title: 'Detalle de Denominaciones',
        icon: 'bi bi-currency-exchange m-2 text-success',
        subtitle: '',
    };

    const obtieneDetalleDenominaciones = async(elemento) => {
        const valores = {
            opcion: 2,
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            moneda: elemento.moneda,
            tipo_operacion: 'DOTACION CAJA',
        }
        const encryptedData = encryptRequest(valores);
        const data_denominacion = await getDetalleDenominaciones(encryptedData)
        setDatos(data_denominacion.result_set);
    }

    const handleElementoClick = (elemento) => {
        setSelectedElemento(elemento);
        setShowModal(true);
        obtieneDetalleDenominaciones(elemento);
    };

    return (
        <>
            <div className="p-3 d-flex">
                <div className="card info-card revenue-card">
                    <h5 className="card-title">
                        <i className="bi bi-cash ms-4 me-2"></i>
                        <strong>Disponible</strong>
                    </h5>
                    <div className="card-body">
                        {
                            data.map((elemento => {
                               return <>
                                   <h5 className="card-title">{elemento.moneda} <span>| {DENOMINACIONES[elemento.moneda]}</span></h5>
                                   <div className="d-flex align-items-center">
                                       <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                           <i className="bi bi-currency-dollar"></i>
                                       </div>
                                       <div className="ps-3">
                                           <h6>
                                               {FormatoMoneda(parseFloat(elemento.Total))}
                                           </h6>
                                           <span className="text-success small pt-1 fw-bold">
                                              {parseInt(elemento.Disponible)}
                                            </span>
                                           <a
                                               onClick={() => handleElementoClick(elemento)}
                                               style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                           >
                                           <span className="text-muted small pt-2 ms-1">
                                                {
                                                    parseInt(elemento.Disponible) > 1 || parseInt(elemento.Disponible) === 0 ? 'billetes disponibles':'billete disponible'
                                                }
                                           </span>
                                           </a>
                                       </div>
                                   </div>
                               </>
                            }))
                        }
                    </div>
                </div>
                {showModal && selectedElemento && (
                    <ModalGenericTool options={options}>
                        <div className="row">
                            <div className="col-md-9 mx-auto">
                                <DenominacionTableCaja
                                    data={datos}
                                    monto={selectedElemento.Total}
                                    moneda={selectedElemento.moneda}
                                />
                            </div>
                        </div>
                    </ModalGenericTool>
                )}
            </div>
        </>
    );
}
import {ModalGenericTool} from "../../commons/modals";
import {DenominacionTableCaja} from "../denominacion";
import {DENOMINACIONES, encryptRequest, FormatoMoneda} from "../../../utils";
import {getDetalleDenominaciones} from "../../../services/tools-services";
import {dataG} from "../../../App";
import {useState} from "react";

export const ConsultaTotalesCajeros = ({ data }) => {
    const [showModal, setShowModal] = useState(false);
    const [datos, setDatos] = useState([]);
    const [selectedElemento, setSelectedElemento] = useState(null);

    const options = {
        size: 'md',
        showModal,
        closeModal: () => setShowModal(false),
        title: 'Detalle de Denominaciones',
        icon: 'bi bi-currency-exchange m-2 text-success',
        subtitle: '',
    };

    const obtieneDetalleDenominaciones = async (elemento) => {
        const valores = {
            opcion: 1,
            usuario: elemento.Caja,
            sucursal: dataG.sucursal,
            moneda: elemento.Moneda,
            tipo_operacion: 'DOTACION CAJA',
        };
        console.log("DETALLE: ", valores)
        const encryptedData = encryptRequest(valores);
        const data_denominacion = await getDetalleDenominaciones(encryptedData);
        setDatos(data_denominacion.result_set);
    };

    const handleElementoClick = (elemento) => {
        setSelectedElemento(elemento);
        setShowModal(true);
        obtieneDetalleDenominaciones(elemento);
    };

    return (
        <>
            <div className="p-3 d-flex">
                {Object.keys(data).map((cajero, index) => (
                    <div className="card info-card revenue-card m-2" key={cajero}>
                        <h5 className="card-title">
                            <i className="bi bi-person-circle ms-4 me-2"></i>
                            <strong>Cajero {cajero}</strong>
                        </h5>
                        {data[cajero].map((elemento, elementoIndex) => (
                            <div className="card-body" key={`${cajero}-${elementoIndex}`}>
                                <h5 className="card-title">
                                    {elemento.Moneda} <span>| {DENOMINACIONES[elemento.Moneda]}</span>
                                </h5>
                                <div className="d-flex align-items-center">
                                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <i className="bi bi-currency-dollar"></i>
                                    </div>
                                    <div className="ps-3">
                                        <h6>{FormatoMoneda(parseFloat(elemento.Monto))}</h6>
                                        <span className="text-success small pt-1 fw-bold">
                                            {parseInt(elemento.Billetes)}
                                        </span>
                                        <a
                                            onClick={() => handleElementoClick(elemento)}
                                            style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                        >
                                            <span className="text-muted small pt-2 ms-1">
                                                {parseInt(elemento.Billetes) > 1 || parseInt(elemento.Billetes) === 0
                                                    ? 'billetes disponibles'
                                                    : 'billete disponible'}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                {showModal && selectedElemento && (
                    <ModalGenericTool options={options}>
                        <div className="row">
                            <div className="col-md-9 mx-auto">
                                <DenominacionTableCaja
                                    data={datos}
                                    monto={selectedElemento.Monto}
                                    moneda={selectedElemento.Moneda}
                                />
                            </div>
                        </div>
                    </ModalGenericTool>
                )}
            </div>
        </>
    );
};

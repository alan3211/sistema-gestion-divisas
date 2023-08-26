import {formattedDateDD, mensajeSinElementos} from "../../../utils";
import {MessageComponent} from "../../commons/";
import {useCaja} from "../../../hook/useCaja";
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const CuentaCajaComponent = () => {

    const {extractedData, getIconAndClass, getCurrencyIcon,catalogo} = useCaja();

    console.log(extractedData);

    if (extractedData.length === 0) {
        return (<div className="row d-flex justify-content-center">
            <div className="col-md-4">
                <MessageComponent estilos={mensajeSinElementos}>
                    No hay información de cierre de este usuario del día: <strong>{formattedDateDD}</strong>
                </MessageComponent>
            </div>
        </div>);
    } else {
        return (
            <>
                <Carousel prevLabel="<" nextLabel=">">
                    {Object.keys(extractedData).map((moneda, index) => (
                        <Carousel.Item key={index}>
                            <div className="carousel-content">
                                <h2>{moneda}</h2>
                                <table className="table table-bordered table-hover text-center">
                                    <thead className="table-dark">
                                    <tr>
                                        <th className="col-1">
                                            <i className="ri ri-coin-fill me-2"></i>
                                            Moneda
                                        </th>
                                        <th className="col-1">
                                            <i className="bi bi-currency-exchange me-2"></i>
                                            Denominación
                                        </th>
                                        <th className="col-1">
                                            <i className="bi bi-arrow-up-circle-fill me-2"></i>
                                            Entradas
                                        </th>
                                        <th className="col-1">
                                            <i className="bi bi-arrow-down-circle-fill me-2"></i>
                                            Salidas
                                        </th>
                                        <th className="col-1">
                                            <i className="bi bi-hash me-2"></i>
                                            No. de Billetes
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {extractedData[moneda].map((elemento, idx) => {
                                        const noBilletesValue = parseInt(elemento.no_billetes, 10);
                                        const {icon, iconClass} = getIconAndClass(noBilletesValue);

                                        return (
                                            <tr key={idx} data-index={idx}>
                                                <td>{elemento.moneda}</td>
                                                <td>
                                                    {getCurrencyIcon(elemento.moneda)}
                                                    {parseFloat(elemento.denominacion).toFixed(2)}
                                                </td>
                                                <td>
                                                    {parseFloat(elemento.entradas) !== 0 && (
                                                        <strong>
                                                            <i className="bi bi-arrow-up-circle-fill me-2 text-success"></i>
                                                        </strong>
                                                    )}
                                                    {(parseFloat(elemento.entradas) * parseFloat(elemento.denominacion)).toFixed(2)}
                                                </td>
                                                <td>
                                                    {parseFloat(elemento.salidas) !== 0 && (
                                                        <strong>
                                                            <i className="bi bi-arrow-down-circle-fill me-2 text-danger"></i>
                                                        </strong>
                                                    )}
                                                    {parseFloat(elemento.salidas).toFixed(2)}
                                                </td>
                                                <td>
                                                    <strong>
                                                        <i className={`bi bi-${icon} ${iconClass}`}></i>
                                                        {noBilletesValue}
                                                    </strong>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </>
        );
    }
}
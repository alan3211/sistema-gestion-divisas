import { FormatoMoneda } from "../../../../../utils";

export const IndicadoresDivisas = ({ item, index, columna }) => {
    const estatus = {
        1: { icono: 'ri ri-close-circle-line me-2', estilo: 'text-danger', title: 'Necesita dotación urgente' },
        0: { icono: 'bi bi-exclamation-triangle me-2', estilo: 'text-warning', title: 'Necesita dotación' },
        3: { icono: 'bi bi-arrow-left-right me-2', estilo: 'text-orange', title: 'Cuenta con excedente' },
        10: { icono: 'bi bi-arrow-left-right me-2', estilo: 'text-black', title: 'OK' },
    };

    // Determine which indicator to use
    const indicator = columna === 'Monto USD' ? item.indicadorUSD : item.indicadorMXP;

    // Get the corresponding status for the indicator
    const estadoActual = estatus[indicator] || { icono: 'ri ri-close-circle-line me-2', estilo: 'text-danger', title: '' };

    // Format the currency
    const formattedCurrency = FormatoMoneda(parseFloat(item[columna]));

    return (
        <td key={index} className={`${estadoActual.estilo} text-center`}
            data-bs-toggle="tooltip"
            data-bs-placement="top" title={estadoActual.title}>
            <p className={`${estadoActual.estilo} text-center`}>
                <strong>{formattedCurrency}</strong>
            </p>
        </td>
    );
};

export const ImpresionTicket = ({item, index, columna}) => {
    return (
        <td key={index} className="text-center btn-">
            <button className="btn btn-primary me-2" data-bs-toggle="tooltip" data-bs-placement="top"
                    title="ReImpresión">
                <i className="bi bi-printer-fill"></i>
            </button>
        </td>
    );
}
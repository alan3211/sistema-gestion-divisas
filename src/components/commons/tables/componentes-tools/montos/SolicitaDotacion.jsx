export const SolicitaDotacion = ({item,index,deps}) => {
    const onHandleSolicitud = async () => {
        deps.setDataItem(item);
        deps.setShowSolicitaDenominacion(true)
    }

    return (
        <td key={index} className="text-center">
            <button className="btn btn-primary btn-sm" data-bs-toggle="tooltip"
                    data-bs-placement="top" title="Solicitar Denominación"
                    onClick={onHandleSolicitud}>
                <i className="bi bi-clipboard-check"></i>
            </button>
        </td>
    );
}
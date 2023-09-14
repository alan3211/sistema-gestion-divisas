/*Herramienta para mostrar el estatus*/
export const EstatusTool = ({item, index, columna}) => {
    const estatus = {
        Pendiente: {icono: 'ri ri-hourglass-line me-2', estilo: 'btn-warning'},
        EnTraslado: {icono: 'bi bi-truck me-2', estilo: 'btn-dark'},
        Recibido: {icono: 'ri ri-checkbox-circle-line me-2', estilo: 'btn-success'},
        Aceptado: {icono: 'ri ri-checkbox-circle-line me-2', estilo: 'btn-success'},
    };

    const estadoActual = estatus[item[columna]] || {icono: 'ri ri-close-circle-line me-2', estilo: 'btn-danger'};

    return (
        <td key={index} className="text-center btn-">
            <div
                className={`text-white btn ${estadoActual.estilo} mb-2`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-original-title={item[columna]}
            >
        <span className="badge">
          <i className={estadoActual.icono}></i>
            {item[columna]}
        </span>
            </div>
        </td>
    );
};
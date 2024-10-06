/*Herramienta para seleccionar al cliente y enviar a la operacion*/
export const SeleccionarCliente = ({item, index, deps}) => {

    const {setDataClientes = undefined, setShowCliente = undefined,setMessageActive=undefined} = deps

    const hacerOperacion = (item) => {
        if (setDataClientes !== undefined && setShowCliente !== undefined) {
            setMessageActive(false);
            setDataClientes({
                headers: [],
                result_set: [item],
                total_rows: 1
            });
            setShowCliente(true);
        }
    }

    return (
        <td key={index} className="text-center">
            <button className="btn btn-cotizar"
                  onClick={() => hacerOperacion(item)}>
                <i className="ri-star-line me-2"></i>
                SELECCIONAR USUARIO
           </button>
        </td>
    );
}
import {useNavigate} from "react-router-dom";

/*Herramienta para seleccionar al cliente y enviar a la operacion*/
export const SeleccionarCliente = ({item, index, deps}) => {

    const {setDataClientes = undefined, setShowCliente = undefined} = deps

    const navigate = useNavigate();
    const hacerOperacion = (item) => {
        if (setDataClientes !== undefined && setShowCliente !== undefined) {
            setDataClientes({
                headers: [],
                result_set: [item],
                total_rows: 1
            });
            setShowCliente(true);
        }
        console.log("CLIENTE A ENVIAR DESDE -> CLIENTE COINCIDENCIA:", item)
        navigate("/compraVenta", {
            state: {
                cliente: item.Cliente,
                clienteActivo: true,
            },
        });
    }

    return (
        <td key={index} className="text-center">
            <span className="badge bg-primary m-2 p-2 cursor-pointer"
                  onClick={() => hacerOperacion(item)}>
                <i className="ri-star-line me-2"></i>
                Seleccionar
           </span>
        </td>
    );
}

/*Herramienta para seleccionar al cliente y enviar a la operacion*/
import {useEffect} from "react";

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
            <span className="badge bg-purple-800 m-2 p-2 cursor-pointer"
                  onClick={() => hacerOperacion(item)}>
                <i className="ri-star-line me-2"></i>
                SELECCIONAR USUARIO
           </span>
        </td>
    );
}
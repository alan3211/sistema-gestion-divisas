import {useState} from "react";
import {encryptRequest} from "../../../../../utils";
import {consultaDetalle} from "../../../../../services/tools-services";
import {ModalDetalleTool} from "../../../modals";
import {TableComponent} from "../../TableComponent";

/*Herramienta para visualizar los detalles de cada modulo mostrando un modal*/
export const Detalle = ({item, index, columna, params}) => {

    const [showModal, setShowModal] = useState(false);
    const [dataDetalle, setDataDetalle] = useState({})

    const showDetalle = () => {
        onDetalle();
    }

    const onDetalle = async () => {
        const values = {
            opcion: params.opcion,
            id_operacion: item.ID,
        }
        const encryptedData = encryptRequest(values);
        const response = await consultaDetalle(encryptedData);
        setDataDetalle(response);
        setShowModal(true);
    }

    const options = {
        showModal,
        closeCustomModal: () => setShowModal(false),
        title: 'Detalle',
    }


    return (
        <td key={index} className="text-center">
            <button className="btn btn-secondary me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Detalle"
                    onClick={showDetalle} disabled={item.Estatus === 'Pendiente'}>
                <i className="bi bi-folder"></i>
            </button>
            {showModal && <ModalDetalleTool options={options}>
                <TableComponent data={dataDetalle}/>
            </ModalDetalleTool>}
        </td>
    );
}
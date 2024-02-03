import {useState} from "react";
import {encryptRequest} from "../../../../../utils";
import {consultaDetalleDenominaciones} from "../../../../../services/tools-services";
import {ModalDetalleTool} from "../../../modals";
import {TableComponent} from "../../TableComponent";

export const DetalleDenominaciones = ({item, index, columna, params}) => {
    const [showModal, setShowModal] = useState(false);
    const [dataDetalle, setDataDetalle] = useState({})

    const showDetalle = () => {
        onDetalle();
    }

    const onDetalle = async () => {
        const values = {
            ticket: item['No Ticket'],
        }
        const encryptedData = encryptRequest(values);
        const response = await consultaDetalleDenominaciones(encryptedData);
        setDataDetalle(response);
        setShowModal(true);
    }

    const opciones = {
        showMostrar:true,
        excel:true,
        tableName:'Detalle de denominaciones',
        buscar: true,
        paginacion: true,
    }

    const options = {
        showModal,
        closeCustomModal: () => setShowModal(false),
        title: `Detalles de ${item['Operación']}`,
    }

    return (
        <td key={index} className="text-center">
            <button className="btn btn-secondary me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Detalle Denominaciones"
                    onClick={showDetalle} disabled={item.Estatus === 'Cotizado'}>
                <i className="bi bi-folder"></i>
            </button>
            {showModal && <ModalDetalleTool options={options}>
                <TableComponent data={dataDetalle} options={opciones} />
            </ModalDetalleTool>}
        </td>
    );
}
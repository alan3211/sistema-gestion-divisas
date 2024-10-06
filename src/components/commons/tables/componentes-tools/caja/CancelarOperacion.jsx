import {encryptRequest, obtenerObjetoDenominaciones, OPTIONS, validarAlfaNumerico} from "../../../../../utils";
import {accionesCaja, cancelarOperacionCaja, muestraDenominaciones} from "../../../../../services/tools-services";
import {ModalAccionesTool, ModalConfirm} from "../../../modals";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {dataG} from "../../../../../App";

export const CancelarOperacion = ({item, index, refresh}) => {

    const [showModal, setShowModal] = useState(false);
    const cancelarOperacion = async () => {
        
        const valores = {
            ticket: item["No Ticket"],
            usuario: dataG.usuario
        }

        const encryptedData = encryptRequest(valores);

        const {result_set} = await cancelarOperacionCaja(encryptedData);

        if(result_set[0].Mensaje.includes('correctamente')) {
            toast.success(result_set[0].Mensaje,OPTIONS);
            refresh();
        }else{
            toast.error(result_set[0].Mensaje,OPTIONS);
        }

        setShowModal(false)
    }

    return (
        <td key={index} className="text-center">
            <button className="btn btn-danger me-2" data-bs-toggle="tooltip" onClick={()=> setShowModal(true)}
                    data-bs-placement="top" title="Cancelar Operación" disabled={item.Estatus === 'Cotizado' || item.Estatus === 'Reverso Operación'}>
                <i className="bi bi-x-circle"></i>
            </button>
            {
                showModal
                && (
                    <ModalConfirm
                        showModal={showModal}
                        closeModal={() => setShowModal(false)}
                        icon="bi bi-exclamation-triangle-fill text-danger m-2"
                        hacerOperacion={cancelarOperacion}
                        title={`¿Está seguro de que desea cancelar la operación? Tenga en cuenta que esta acción es irreversible.`}
                        closeModalAndReturn={() => setShowModal(false)}
                    />

                )
            }
        </td>
    );
}
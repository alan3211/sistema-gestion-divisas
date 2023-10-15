import {usePrinter} from "../../../../../hook/usePrinter";
import {ModalTicket} from "../../../modals/ModalTicket";
import {useState} from "react";

export const ImpresionTicket = ({item, index, columna}) => {

    const {imprimir,imprimeTicketNuevamente} = usePrinter(item);
    const [showModal,setShowModal] = useState(false);

    const imprimeTicket = () =>{
        imprimeTicketNuevamente(2)
    }


    return (
        <td key={index} className="text-center btn-">
            <button className="btn btn-primary me-2"
                    disabled={item.Estatus === 'Cotizado'}
                    onClick={()=>{
                        imprimir(2);
                        setShowModal(true)
                    }}
                    data-bs-toggle="tooltip" data-bs-placement="top"
                    title="ReImpresión">
                <i className="bi bi-printer-fill"></i>
            </button>
            {
                showModal && (
                    <ModalTicket title="¿Se imprimió el ticket correctamente?"
                                 showModal={showModal}
                                 closeModalAndReturn={imprimeTicket}
                                 hacerOperacion={()=> {
                                     setShowModal(false)
                                 }}
                                 icon="bi bi-exclamation-triangle-fill text-warning m-2"/>
                )
            }
        </td>
    );
}
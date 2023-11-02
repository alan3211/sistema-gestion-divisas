import {useState} from "react";

export const useMovimientosDotaciones = ({solicitaDotacionFormulario,solicitaDotacionRapidaFormulario,setEstadoDotacion}) => {

    const [showDotacionRapida,setShowDotacionRapida] = useState(false);
    const [showCambioDeno,setCambioDeno] = useState(false);

    // Solicitud de Denominacion
    const solicitaCambio = () => {
        setCambioDeno(true);
    }

    // Solicitud de dotación rápida
    const solicitudDotacionRapida = () => {
        setShowDotacionRapida(true);
    }

    const OPTIONS_DOTACION_RAPIDA = {
        size: 'lg',
        showModal: () => setShowDotacionRapida(true),
        closeModal: () => {
            setShowDotacionRapida(false)
            solicitaDotacionRapidaFormulario.reset();
            setEstadoDotacion(false);
        },
        icon:'bi bi-currency-exchange text-warning me-2',
        title:'Solicita Dotación Rápida',
        subtitle:'Selecciona las denominaciones necesarias para concluir la operación.'
    }

    const OPTIONS_SOL_DENOMINACION = {
        size: 'lg',
        showModal: () => setCambioDeno(true),
        closeModal: () => {
            setCambioDeno(false)
            solicitaDotacionFormulario.reset();
            setEstadoDotacion(false);
        },
        icon:'bi bi-cash me-2 text-success',
        title:'Solicita Denominaciones',
        subtitle:'Selecciona una denominación para realizar el cambio correspondiente.'
    }


    return {
        solicitaCambio,
        solicitudDotacionRapida,
        showDotacionRapida,
        showCambioDeno,
        OPTIONS_DOTACION_RAPIDA,
        OPTIONS_SOL_DENOMINACION
    }

}
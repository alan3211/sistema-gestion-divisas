import {useState} from "react";

export const useMovimientosDotaciones = ({solicitaDotacionRapidaFormulario,setEstadoDotacion}) => {

    const [showDotacionRapida,setShowDotacionRapida] = useState(false);


    // Solicitud de dotación rápida
    const solicitudDotacionRapida = () => {
        setShowDotacionRapida(true);
        setEstadoDotacion(true);
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
        title:'Solicita Dotación Parcial',
        subtitle:'Selecciona las denominaciones necesarias para concluir la operación.'
    }



    return {
        solicitudDotacionRapida,
        showDotacionRapida,setShowDotacionRapida,
        OPTIONS_DOTACION_RAPIDA,
    }

}
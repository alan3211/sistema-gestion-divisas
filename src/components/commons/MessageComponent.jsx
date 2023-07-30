import {useEffect, useState} from "react";

export const MessageComponent = ({title,estilos:{estilo,icono},children}) => {

    const [showMessage, setShowMessage] = useState(true);

    /*useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
            setMessageActive(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!showMessage) {
        return null;
    }*/

    return (
        <>
            <div className={`alert ${estilo} alert-dismissible fade show`} role="alert">
                <i className={`${icono} me-1`}></i>
                    {children}
            </div>
        </>
    );
}
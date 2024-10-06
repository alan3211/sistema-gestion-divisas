export const MessageComponent = ({estilos:{estilo,icono},children}) => {

    return (
        <>
            <div className={`alert ${estilo} alert-dismissible fade show`} role="alert">
                <i className={`${icono} me-1`}></i>
                    {children}
            </div>
        </>
    );
}
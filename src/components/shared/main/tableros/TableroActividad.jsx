import { mensajeSinElementos } from "../../../../utils";
import { MessageComponent } from "../../../commons";

export const TableroActividad = ({ data, showDataActividad }) => {
    const maxElementsToShow = 3; // Número máximo de elementos antes de mostrar el scroll

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Actividad Reciente <span>| Hoy</span></h5>
                <div className="activity custom-scrollbar" style={{ overflowY: data.length > maxElementsToShow ? 'auto' : 'visible', maxHeight: '300px' }}>
                    {showDataActividad ? (
                        <>
                            {data.map((elemento, index) => {
                                return (
                                    <div key={index} className="activity-item d-flex">
                                        <div className="activite-label">{elemento.Hora}</div>
                                        <i className={`bi bi-circle-fill activity-badge text-success align-self-start`}></i>
                                        <div className="activity-content">{elemento.Descripcion}</div>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <MessageComponent estilos={mensajeSinElementos}>No hay actividad reciente.</MessageComponent>
                    )}
                </div>
            </div>
        </div>
    );
};

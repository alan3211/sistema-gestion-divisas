import {useEffect, useState} from "react";
import {dataG} from "../../../App";
import {encryptRequest, formatRelativeTime} from "../../../utils";
import {obtieneNotificaciones, updateNotificacion} from "../../../services/tools-services";
import {useNavigate} from "react-router-dom";

export const Notifications = () => {

    const [notifications, setNotifications] = useState([]);
    const navigator =  useNavigate();

    const handleNotificationClick = async(index,opcion) => {
        const values = {
            opcion:opcion,
            id_notificacion: index,
            id_perfil: dataG.id_perfil,
            usuario: dataG.usuario,
        }
        const encryptedData = encryptRequest(values);
        await updateNotificacion(encryptedData);
        getNotificaciones();
    };

    useEffect(() => {
        if(dataG.estatus === 0){
            navigator("/");
        }
    }, [dataG.estatus]);


    const getNotificaciones = async () =>{

        const valores = {
            sucursal: dataG.sucursal,
            usuario: dataG.usuario,
            id_perfil: dataG.id_perfil,
        }

        const encryptedData = encryptRequest(valores);

        const {result_set,total_rows} = await obtieneNotificaciones(encryptedData);

        if (total_rows === 0){
            setNotifications([]);
        }else{
            // Agrega la nueva notificación al estado
            console.log("Notificaciones!");
            console.log(result_set);
            setNotifications(result_set);
        }

    }

    useEffect(() => {
        getNotificaciones()
    }, []);

   useEffect(() => {
           const interval = setInterval(() => {
               getNotificaciones()
           }, 60000);

           return () => clearInterval(interval);
    }, [notifications]);

    return (
        <li className="nav-item dropdown">
            <a
                className="nav-link nav-icon"
                href="#"
                data-bs-toggle="dropdown"
                title="Notificaciones"
                role="button"
            >
                <i className={`bi bi-bell${notifications && notifications.length > 0 ? '-fill' : ''}`} title="Notificaciones"></i>
                { notifications && notifications.length > 0 && (
                    <span className="badge bg-primary badge-number" title="Número de notificaciones">{notifications.length}</span>
                )}
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header" style={{ width: '300px' }}>
                    { notifications && notifications.length > 0 ? (
                        <>
                            <i className="bi bi-bell-fill text-warning ms-2" style={{ marginRight: '5px' }}></i>
                            <strong>{`Tienes ${notifications.length} ${
                                notifications.length > 1 ? 'notificaciones' : 'notificación'
                            }`}</strong>
                        </>
                    ) : (
                        <>
                            <i className="bi bi-bell-slash text-warning me-3" style={{ marginRight: '5px' }}></i>
                            <strong>No hay notificaciones</strong>
                        </>
                    )}
                </li>
                {notifications && notifications.length > 0 && <li><hr className="dropdown-divider" /></li>}
                <div className="custom-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    { notifications && notifications.map((notification, index) => (
                        <li
                            key={index}
                            className="notification-item"
                            onClick={() => handleNotificationClick(notification.ID,1)}
                        >
                            <i className="bi bi-exclamation-circle-fill text-warning" title="Notificación importante"></i>
                            <div>
                                <p>
                                    <span className="fw-bolder" title="Fecha">{notification.Fecha}</span>
                                </p>
                                <h4>{notification.Caja}</h4>
                                <p>{notification.Mensaje}</p>
                                <p>
                                    <span className="text-blue" title="Hora">{formatRelativeTime(notification.Hora)}</span>
                                </p>
                            </div>
                        </li>
                    ))}
                </div>
                { notifications && notifications.length > 0 && <li><hr className="dropdown-divider" /></li>}
                { notifications && notifications.length > 0 && (
                    <li className="dropdown-footer">
                        <a
                            href="#"
                            onClick={() => setNotifications([])}
                            title="Marcar todas las notificaciones como leídas"
                        >
                    <span className="badge rounded-pill p-2 bg-blue"
                          onClick={() => handleNotificationClick(1,2)}>
                        <i className="bi bi-check"></i>
                        Marcar como leídas
                    </span>
                        </a>
                    </li>
                )}
            </ul>
        </li>

    );

}
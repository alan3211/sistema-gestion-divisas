import {useEffect, useState} from "react";
import {dataG} from "../../../App";
import {encryptRequest} from "../../../utils";

export const Notifications = () => {

    const [notifications, setNotifications] = useState([]);

    const handleNotificationClick = (index) => {
        // Copia el estado actual de notificaciones
        const updatedNotifications = [...notifications];

        // Elimina la notificación seleccionada
        updatedNotifications.splice(index, 1);

        // Actualiza el estado
        setNotifications(updatedNotifications);
    };

    const getNotificaciones = async () =>{

        const valores = {
            sucursal: dataG.sucursal,
            usuario: dataG.usuario,
        }

        const encryptedData = encryptRequest(valores);

        //const newNotification = await obtieneNotificaciones();

        const new1Notification = {
            title: 'Nueva notificación',
            message: 'Esto es una notificación de prueba',
            timestamp: new Date(),
        };

        // Agrega la nueva notificación al estado
       // setNotifications([newNotification, ...notifications]);

    }


    useEffect(() => {
        // Simula una notificación periódica
        const interval = setInterval(() => {
            getNotificaciones()
        }, 30000);

        return () => clearInterval(interval);
    }, [notifications]);


    return (
        <li className="nav-item dropdown">
            <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                <i className="bi bi-bell"></i>
                {notifications.length > 0 &&
                    <span className="badge bg-primary badge-number">{notifications.length}</span>}
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                    {notifications.length > 0 ? (
                        `Tienes ${notifications.length} notificaciones`
                    ) : (
                        'No tienes notificaciones'
                    )}
                    {notifications.length > 0 && (
                        <a href="#">
                            <span className="badge rounded-pill bg-primary p-2 ms-2">Ver todos</span>
                        </a>
                    )}
                </li>
                {
                    notifications.length > 0 && <li>
                        <hr className="dropdown-divider"/>
                    </li>}
                <div className="custom-scrollbar" style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {notifications.map((notification, index) => (
                        <li key={index} className="notification-item" onClick={() => handleNotificationClick(index)}>
                            <i className="bi bi-exclamation-circle text-warning"></i>
                            <div>
                                <h4>{notification.title}</h4>
                                <p>{notification.message}</p>
                                <p>{notification.timestamp.toLocaleTimeString()}</p>
                            </div>
                        </li>
                    ))}
                </div>
                {
                    notifications.length > 0 && <li>
                        <hr className="dropdown-divider"/>
                    </li>}
                {
                    notifications.length > 0 && <li className="dropdown-footer">
                        <a href="#" onClick={() => setNotifications([])}>
                            <span className="badge rounded-pill p-2 bg-blue">
                                 <i className="bi bi-check"></i>
                            Marcar como leídos
                            </span>
                        </a>
                    </li>
                }
            </ul>
        </li>
    );

}
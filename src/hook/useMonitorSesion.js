import {useAuth} from "./useAuth";
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {renovarToken, validaToken} from "../services/inicio-services";
import {toast} from "react-toastify";
import {TIME_OUT} from "../utils";

export const useMonitorSesion = ()=>{

    const {authenticated} = useAuth();
    const navigate = useNavigate();
    const [intervalId, setIntervalId] = useState(null);
    const [mensaje, setMensaje] = useState({
        mensaje: '',
        show: false,
    });

    const [countdown, setCountdown] = useState(60); // 60 segundos = 1 minuto
    const [modalVisible, setModalVisible] = useState(false);

    const startCountdown = useCallback(() => {
        setCountdown(60); // Reinicia el contador a 60 segundos cuando se muestra el modal
        const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        return () => {
            clearInterval(countdownInterval); // Limpia el intervalo cuando el modal se oculta
        };
    }, []);

    const renuevaSesion = async () => {
        try {
            const {token,refresh_token} = await renovarToken(localStorage.getItem('refresh_token'));
            if (token) {
                clearInterval(intervalId);
                // Actualizar el token de acceso almacenado con el nuevo valor
                localStorage.setItem('token', token);
                localStorage.setItem('refresh_token', refresh_token);
                // Cerrar el modal si está abierto
                setModalVisible(false);
                setMensaje({
                    mensaje: '',
                    show: false,
                })
                const id = setInterval(async () => {
                    try {
                        const response = await validaToken(localStorage.getItem('token'))
                        if (response.hasOwnProperty("error")) {
                            toast.warn(response.error, {
                                position: "top-center",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                theme: "light",
                            });
                            localStorage.clear();
                            navigate("/")
                        }else{
                            setMensaje({
                                mensaje: response.mensaje,
                                show: true,
                            })
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }, TIME_OUT);
                setIntervalId(id);
            } else {
                // Manejar el caso en el que no se pueda renovar el token
                // Puedes mostrar un mensaje de error o realizar alguna acción específica.
                console.error('Error al renovar el token');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (mensaje.show) {
            setModalVisible(true);
            const cleanup = startCountdown();
            return cleanup;
        } else {
            setModalVisible(false);
        }
    }, [mensaje.show, startCountdown]);

    useEffect(() => {
        // Limpia el intervalo cuando el componente se desmonta o cuando authenticated sea falso
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    useEffect(() => {
        if (authenticated) {
            const id = setInterval(async () => {
                try {
                    const response = await validaToken(localStorage.getItem('token'))
                    if (response.hasOwnProperty("error")) {
                        toast.warn(response.error, {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            theme: "light",
                        });
                        localStorage.clear();
                        navigate("/")
                    }else{
                        setMensaje({
                            mensaje: response.mensaje,
                            show: true,
                        })
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }, TIME_OUT);
            setIntervalId(id);
        } else {
            // Si authenticated es falso, detén el intervalo si está en funcionamiento
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [authenticated]);

    return {
        authenticated,
        modalVisible,
        mensaje,
        countdown,
        navigate,
        renuevaSesion
    }
}
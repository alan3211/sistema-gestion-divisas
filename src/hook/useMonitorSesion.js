import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { renovarToken, validaToken } from "../services/inicio-services";
import { toast } from "react-toastify";
import { encryptRequest, OPTIONS } from "../utils";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; // Asegúrate de instalar jwt-decode
import { dataG } from "../App";
import { finSesion } from "../services";

export const useMonitorSesion = () => {
    const { authenticated } = useAuth();
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [mensaje, setMensaje] = useState({
        mensaje: "",
        show: false,
    });
    const [seconds, setSeconds] = useState(1);
    const [tiempoRestante, setTiempoRestante] = useState(0);

    const decreaseTimer = () => {
        setSeconds((prevSeconds) => {
            if (prevSeconds > 0) {
                return prevSeconds - 1;
            } else {
                clearInterval(intervalId);
                return 59;
            }
        });
    };


    let intervalId;

    useEffect(() => {
        const initializeInterval = () => {
            intervalId = setInterval(() => {
                decreaseTimer();
            }, 1000);
        };

        // Inicializar el intervalo
        initializeInterval();

        return () => {
            clearInterval(intervalId);
        };
    }, [decreaseTimer]);

    const renuevaSesion = async () => {
        try {
            const { token, refresh_token } = await renovarToken(localStorage.getItem("refresh_token"));
            if (token) {
                setModalVisible(false);
                setTiempoRestante(0);
                setSeconds(59);
                localStorage.setItem("token", token);
                localStorage.setItem("refresh_token", refresh_token);
            } else {
                console.error("Error al renovar el token");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSessionExpiration = () => {
        localStorage.clear();
        if (dataG.estatus) {
            const encryptedData = encryptRequest({ usuario: dataG.usuario });
            finSesion(encryptedData);
        }
    };

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await validaToken(token);
                if (response.hasOwnProperty("error")) {
                    toast.warn(response.error, OPTIONS);
                    handleSessionExpiration();
                    navigate("/");
                } else {
                    if (token) {
                        try {
                            const decodedToken = jwt_decode(token);
                            const tiempoExpiracion = decodedToken.exp * 1000; // Convertir a milisegundos
                            const tiempoActual = Date.now();
                            const tiempoRestanteRes = tiempoExpiracion - tiempoActual;

                            console.log("Tiempo Restante MS: ",tiempoRestanteRes)
                            console.log("Tiempo Restante S: ",parseInt(tiempoRestanteRes / 1000))
                            // Actualizar el estado con el tiempo restante en segundos
                            setTiempoRestante(parseInt(tiempoRestanteRes / 1000));

                            // Mostrar el modal solo si faltan aproximadamente 1 minuto (60 segundos)
                            if (tiempoRestante <= 60) {
                                setModalVisible(true);
                            }else{
                                setTiempoRestante(0);
                            }
                        } catch (error) {
                            console.error("Error al decodificar el token:", error);
                            setTiempoRestante(0);
                        }
                    }

                    setMensaje({
                        mensaje: response.mensaje,
                        show: true,
                    });
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        if (authenticated) {
            // Iniciar intervalo para validar el token cada minuto
            const tokenValidationIntervalId = setInterval(validateToken, 60000);
            return () => clearInterval(tokenValidationIntervalId);
        }
    }, [authenticated]);

    return {
        authenticated,
        modalVisible,
        mensaje,
        seconds,
        setSeconds,
        tiempoRestante,
        navigate,
        renuevaSesion,
        handleSessionExpiration,
    };
};

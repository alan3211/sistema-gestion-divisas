import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { renovarToken, validaToken } from "../services/inicio-services";
import { toast } from "react-toastify";
import {encryptRequest, OPTIONS} from "../utils";
import { useCallback, useEffect, useState } from "react";
import {dataG} from "../App";
import {finSesion} from "../services";

export const useMonitorSesion = () => {
    const { authenticated } = useAuth();
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [mensaje, setMensaje] = useState({
        mensaje: "",
        show: false,
    });
    const [seconds, setSeconds] = useState(1);

    const handleMouseMove = useCallback(() => {
        setSeconds(1);
        clearInterval(intervalId);
        timeoutId = setTimeout(() => {
            intervalId = setInterval(decreaseTimer, 1000);
        }, 3000);
    }, []);

    const decreaseTimer = () => {
        setSeconds((prevSeconds) => {
            if (prevSeconds > 0) {
                return prevSeconds - 1;
            } else {
                setModalVisible(false);
                clearInterval(intervalId);
                return 0;
            }
        });
    };

    let intervalId;
    let timeoutId;

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        timeoutId = setTimeout(() => {
            intervalId = setInterval(decreaseTimer, 1000);
        }, 3000);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [handleMouseMove]);

    const renuevaSesion = async () => {
        try {
            const { token, refresh_token } = await renovarToken(localStorage.getItem("refresh_token"));
            if (token) {
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
        // Lógica adicional para manejar la expiración de la sesión
        localStorage.clear();
        if (dataG.estatus) {
            const encryptedData = encryptRequest({ usuario: dataG.usuario });
            finSesion(encryptedData);
        }
    };

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await validaToken(localStorage.getItem("token"));
                if (response.hasOwnProperty("error")) {
                    toast.warn(response.error, OPTIONS);
                    handleSessionExpiration();
                    navigate("/");
                } else {
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
            const intervalId = setInterval(validateToken, 3000);
            return () => clearInterval(intervalId);
        }
    }, [authenticated, navigate
    ]);

    return {
        authenticated,
        modalVisible,
        mensaje,
        countdown: seconds,
        navigate,
        renuevaSesion,
        handleSessionExpiration,
    };
};

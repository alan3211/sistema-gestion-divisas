import {useEffect, useState} from "react";
import jwt_decode from "jwt-decode";

export const useAuth = () =>{
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
    const token = localStorage.getItem('token');

        if (token) {

            try {
                const decodedToken = jwt_decode(token);
                const currentTime = Date.now() / 1000; // Tiempo actual en segundos

                // Verificar si el token no ha expirado
                if (decodedToken.exp > currentTime) {
                    setAuthenticated(true);
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
            }
        }
    }, []);

    return {authenticated,setAuthenticated};
}
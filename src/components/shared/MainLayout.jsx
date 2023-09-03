import {HeaderComponent} from "./header/HeaderComponent";
import {AsideComponent} from "./aside/AsideComponent";
import {FooterComponent} from "./footer/FooterComponent";
import {useAuth} from "../../hook/useAuth";
import {useEffect, useState} from "react";
import {validaToken} from "../../services/inicio-services";
import {TIME_OUT} from "../../utils";

export const MainLayout = ({children}) => {
    const authenticated = useAuth();

    const [intervalId, setIntervalId] = useState(null);

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
                    const response = await validaToken(localStorage.getItem('token'));
                    console.log(response);
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

    return(
        <>
            {
                authenticated &&
                (
                    <>
                        <HeaderComponent/>
                        <AsideComponent/>
                        {children}
                        <FooterComponent/>
                    </>
                )
            }
        </>
    );
}
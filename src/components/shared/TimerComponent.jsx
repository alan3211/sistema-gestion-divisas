import React, { useState, useEffect } from 'react';
import {TIME_OUT} from "../../utils";

const TimerComponent = () => {
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        let intervalId;
        let timeoutId;

        const handleMouseMove = () => {
            setSeconds(60);

            // Limpiamos el intervalo y el timeout si el ratón se mueve
            clearInterval(intervalId);
            clearTimeout(timeoutId);

            // Configuramos un nuevo timeout para iniciar el intervalo después de 3 segundos de inactividad
            timeoutId = setTimeout(() => {
                intervalId = setInterval(decreaseTimer, 1000);
            }, TIME_OUT);
        };

        const decreaseTimer = () => {
            setSeconds((prevSeconds) => {
                if (prevSeconds > 0) {
                    return prevSeconds - 1;
                } else {
                    clearInterval(intervalId);
                    return 0;
                }
            });
        };

        // Configuramos los eventos del mouse
        document.addEventListener('mousemove', handleMouseMove);

        // Iniciamos el intervalo inicialmente después de 3 segundos
        timeoutId = setTimeout(() => {
            intervalId = setInterval(decreaseTimer, 1000);
        }, TIME_OUT);

        // Limpieza al desmontar el componente
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div>
            <p>Contador: {seconds} segundos</p>
        </div>
    );
};

export default TimerComponent;

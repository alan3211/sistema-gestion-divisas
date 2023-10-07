import { useEffect, useState } from "react";
import { dataG } from "../../../../App";
import { encryptRequest } from "../../../../utils";
import { consultaCantidadDivisas, consultaMovimientos } from "../../../../services/operacion-caja";
import { ConsultaTotalesCaja } from "./ConsultaTotalesCaja";
import { TableComponent } from "../../../commons/tables";
import {TitleComponent} from "../../../commons";

export const ConsultaCaja = () => {
    const [datos, setDatos] = useState([]);
    const [datosMov, setDatosMov] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar la carga

    const options = {
        showMostrar: true,
        buscar: true,
        paginacion: true,
        tools: [
            { columna: "Denominaciones", tool: 'ver-denominaciones' },
            { columna: "Reimpresión ticket", tool: 'impresion-ticket' },
        ]
    }

    useEffect(() => {
        const getCantidadDivisas = async () => {
            const values = {
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
            }
            const encryptedData = encryptRequest(values);
            const result = await consultaCantidadDivisas(encryptedData);
            setDatos(result.result_set);
        }

        getCantidadDivisas();

    }, []);

    useEffect(() => {
        const getConsultaMovimientos = async () => {
            const values = {
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
            }
            const encryptedData = encryptRequest(values);
            const result = await consultaMovimientos(encryptedData);
            setDatosMov(result);
            setIsLoading(false);
        }

        getConsultaMovimientos();
    }, []);

    return (
        <>
            <div className="row justify-content-center">
                {
                    datos.map((element, index) => <ConsultaTotalesCaja key={index} data={element} />)
                }
            </div>
            <div className="row">
                {isLoading ? (
                    <p>Cargando...</p>
                ) : (
                    <>
                        <TitleComponent title="Movimientos del Día" icon="bi bi-calendar-date ms-3 me-2"/>
                        <TableComponent data={datosMov} options={options} />
                    </>
                )}
            </div>
        </>
    );
}

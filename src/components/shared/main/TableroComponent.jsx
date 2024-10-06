import { useEstadisticas } from "../../../hook/useEstadisticas";
import { useEffect, useState } from "react";
import { Ventas } from "./tableros/Ventas";
import { Compras } from "./tableros/Compras";
import { Usuarios } from "./tableros/Usuarios";
import { UltimosMovimientos } from "./tableros/UltimosMovimientos";
import {TipoCambioComponent} from "../../operacion/compraVenta";
import {dataG} from "../../../App";
import {CompraVentaProvider} from "../../../context/compraVenta/CompraVentaProvider";
import {TableroCoordinadorLogistico} from "./tableros/coordinadorLogistico/TableroCoordinadorLogistico";
import {TableroAdministrador} from "./tableros/administrador/TableroAdministrador";

export const TableroComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const estadistica = useEstadisticas([2, 3, 1, 4]);

    useEffect(() => {
        if (estadistica && estadistica.length !== 0) {
            setIsLoading(false);
        }
    }, [estadistica]);

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>Tablero</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active">Inicio</li>
                    </ol>
                </nav>
            </div>

            { (!isLoading && [0,6].includes(dataG.id_perfil)) ? (<TableroCoordinadorLogistico/>)
                : (!isLoading && [1].includes(dataG.id_perfil)) && (<TableroAdministrador/>)
            }
        </main>
    );
};

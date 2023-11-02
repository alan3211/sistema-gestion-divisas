import { useEstadisticas } from "../../../hook/useEstadisticas";
import { useEffect, useState } from "react";
import { Ventas } from "./tableros/Ventas";
import { Compras } from "./tableros/Compras";
import { Usuarios } from "./tableros/Usuarios";
import { UltimosMovimientos } from "./tableros/UltimosMovimientos";

export const TableroComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const estadistica = useEstadisticas([2, 3, 1, 4]);
    console.log(estadistica);

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

            {!isLoading && (
                <section className="section dashboard">
                    <div className="row justify-content-center">
                        <Ventas data={estadistica[0]?.result_set?.[0] || {}} />
                        <Compras data={estadistica[1]?.result_set?.[0] || {}} />
                        <Usuarios data={estadistica[2]?.result_set?.[0] ||{} } />
                        <UltimosMovimientos data={estadistica[3] || []} />
                    </div>
                </section>
            )}
        </main>
    );
};

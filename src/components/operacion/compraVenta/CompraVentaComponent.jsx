import {TipoCambioComponent} from "./TipoCambioComponent";
import {CalculadoraDivisasComponent} from "./CalculadoraDivisasComponent";
import {useEffect, useState} from "react";
import {BusquedaClientesComponent} from "../busquedaClientes/busquedaClientesComponent";
import { useLocation } from 'react-router-dom';


export const CompraVentaComponent = () =>{

    const [continuaOperacion,setContinuaOperacion] = useState(false);
    const location = useLocation();
    const { cliente={},clienteActivo } = location.state;
    const [operacion,setOperacion] = useState({});
    const [tipoDivisa,setTipoDivisa] =  useState([]);

    useEffect(() => {
        if (clienteActivo) {
            setContinuaOperacion(true);
        }
    }, [clienteActivo, cliente]);

    return (
            <main id="main" className="h-100">

            <div className="pagetitle">
                <h1>Operación</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active">Compra/Venta</li>
                    </ol>
                </nav>
            </div>

            <section className="section">
                <div className="row">
                    <div className="col-md-6">
                        <CalculadoraDivisasComponent tipoDivisa={tipoDivisa} setOperacion={setOperacion} setContinuaOperacion={setContinuaOperacion} />
                    </div>
                    <div className="col-md-6">
                        <TipoCambioComponent setTipoDivisa={setTipoDivisa} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {
                            continuaOperacion && <BusquedaClientesComponent operacion={operacion} cliente={cliente}/>
                        }
                    </div>
                </div>
            </section>
        </main>
    );
}
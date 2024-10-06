import {
    encryptRequest,
    formattedDateWS,
    opciones, OPTIONS
} from "../../../../../utils";
import {muestraDenominaciones} from "../../../../../services/tools-services";
import {dataG} from "../../../../../App";
import {entregaCaja} from "../../../../../services/operacion-caja";
import {toast} from "react-toastify";
import {ModalLoading} from "../../../modals";
import {useState} from "react";

export const VerDenominaciones =  ({item, index,deps}) => {

    const [guarda, setGuarda] = useState(false);

    const getDenominaciones = async () => {
        deps.setShowDetalle(false);
        if(deps.resetForm) deps.resetForm();
        deps.setMoneda(item.Moneda);
        const values = {
            usuario: item.Caja,
            fecha:item.Fecha,
            moneda:item.Moneda
        }
        const encryptedData = encryptRequest(values);
        const response = await muestraDenominaciones(encryptedData);
        deps.setShowDetalle(true);
        deps.setDataDenominacion(response);
    }

    const cierraCajaVacia = async () => {
        setGuarda(true);
        const usuario_traspaso = item['Caja'] || '';
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");

        const cierreCaja = {
            noCliente: '',
            ticket_notaCredito: '',
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            moneda: item["Moneda"],
            traspaso: usuario_traspaso,
            diferencias: 0,
        }
        cierreCaja.ticket = `CIERRE${dataG.sucursal}${dataG.usuario}${formattedDateWS()}${horaOperacion}`;
        let denominaciones = [];
        if(cierreCaja.moneda === 'USD'){
            denominaciones= [
                {nombre: '1', cantidad: 0},
                {nombre: '2', cantidad: 0},
                {nombre: '5', cantidad: 0},
                {nombre: '10', cantidad: 0},
                {nombre: '20', cantidad: 0},
                {nombre: '50', cantidad: 0},
                {nombre: '100', cantidad: 0},
            ]
        }else{
            denominaciones= [
                {nombre: '0.05', cantidad: 0},
                {nombre: '0.1', cantidad: 0},
                {nombre: '0.2', cantidad: 0},
                {nombre: '0.5', cantidad: 0},
                {nombre: '1', cantidad: 0},
                {nombre: '2', cantidad: 0},
                {nombre: '5', cantidad: 0},
                {nombre: '10', cantidad: 0},
                {nombre: '20', cantidad: 0},
                {nombre: '50', cantidad: 0},
                {nombre: '100', cantidad: 0},
                {nombre: '200', cantidad: 0},
                {nombre: '500', cantidad: 0},
                {nombre: '1000', cantidad: 0},
            ]
        }
        const denominacionesFinal = {}
        denominacionesFinal.divisa = cierreCaja.moneda;
        denominacionesFinal.tipoOperacion = '0';
        denominacionesFinal.movimiento = 'CIERRE';
        cierreCaja.diferencia = [];
        cierreCaja.denominacion = [
            {
                "divisa": cierreCaja.moneda,
                "tipoOperacion": "0",
                "movimiento": "CIERRE",
                "denominacion":denominaciones
            }
        ]

        cierreCaja.totalDiferenciaMonto = 0.0;
        cierreCaja.totalDiferenciaBilletes = 0.0;

        const encryptedData = encryptRequest(cierreCaja);
        const response = await entregaCaja(encryptedData);

        if (response !== '') {
            setGuarda(false);
            toast.success(response, OPTIONS);
        }
    };

    const optionsLoad = {
        showModal: guarda,
        title: "Guardando...",
    };

    return (
        <td key={index} className="text-center">
            {parseInt(item['No Billetes']) !== 0 &&(<button className="btn btn-secondary me-2" data-bs-toggle="tooltip"
                                                            disabled={parseInt(item['No Billetes']) === 0}
                                                            onClick={getDenominaciones}
                                                            data-bs-placement="top" title="Ver Denominaciones">
                <i className="bi bi-eye"></i>
            </button>)}
            {parseInt(item['No Billetes']) === 0 &&(<button className="btn btn-danger me-2" data-bs-toggle="tooltip"
                                                            onClick={cierraCajaVacia}
                                                            data-bs-placement="top" title="Cerrar Caja Vacia">
                <i className="ri ri-close-circle-fill"></i>
            </button>)}

            {guarda && <ModalLoading options={optionsLoad}/>}

        </td>
    );
}

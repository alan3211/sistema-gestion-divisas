import {encryptRequest, FormatoMoneda} from "../../../utils";
import {useSaldo} from "../../../hook";
import {useEffect, useState} from "react";
import {dataG} from "../../../App";
import {getResumenSucursales} from "../../../services/operacion-tesoreria";
import {TableComponent} from "../../commons/tables";
import {LoaderTable} from "../../commons/LoaderTable";
import {SyncLoader} from "react-spinners";
import {isNullOrUndef} from "chart.js/helpers";

export const ConsultaTesoreria = ({type}) => {

  const saldoGeneral = useSaldo(1);
  const [isLoading,setIsLoading] = useState(true);
  const [dataResumen,setDataResumen] = useState([]);
  const [saldoNuevo,setSaldoNuevo] = useState();

  const [showSucursal,setShowSucursal] = useState(false);
  const [dataSucursal,setDataSucursal] = useState([]);

    const getResumen = async () => {
        const valores = {
            usuario: dataG.usuario,
            sucursal:''
        }
        const encryptedData = encryptRequest(valores);
        const response =  await getResumenSucursales(encryptedData);
        console.log(response);
        setDataResumen(response)
        setIsLoading(false);
    }

    useEffect(() => {
        getResumen();
    }, []);

    useEffect(() => {
        console.log("SALDO ACTUAL: ", saldoGeneral);
        setSaldoNuevo(saldoGeneral !== undefined ? saldoGeneral : 0);
    }, [saldoGeneral]);

    const options = {
        showMostrar:true,
        excel:true,
        tableName:'Consulta Analisis de Fondos',
        buscar: true,
        paginacion: true,
        tools:[
            {columna:"Sucursal",tool:"ver-sucursales",deps:{setShowSucursal,setDataSucursal}},
            {columna:"Monto USD",tool:"indicadores-divisas"},
            {columna:"Monto MXP",tool:"indicadores-divisas"},
        ],
        filters:[
            {columna:"Monto USD",filter:'currency'},
            {columna:"Monto MXP",filter:'currency'},
            {columna:"Monto EUR",filter:'currency'},
            {columna:"Monto GBR",filter:'currency'}
        ],
        disabledColumns:['indicadorUSD','indicadorMXP'],
        disabledColumnsExcel:['indicadorUSD','indicadorMXP']
    }

    const optionsSuc = {
        showMostrar:true,
        excel:true,
        tableName:'Consulta Analisis de Fondos por Sucursal',
        buscar: true,
        paginacion: true,
        filters:[
            {columna:"Monto USD",filter:'currency'},
            {columna:"Monto MXP",filter:'currency'},
            {columna:"Monto EUR",filter:'currency'},
            {columna:"Monto GBR",filter:'currency'}
        ]
    }

    return(
        <div className="mt-3">
            {type !== 'logistica' && (<div className="container d-flex justify-content-center align-items-center">
                <h5 className="text-blue text-center">
                    <i className="bi bi-bank me-2"></i>
                    <span>Cuenta Bancaria (MXP):</span>
                    {isNullOrUndef(saldoNuevo) ? (
                        <strong className="ms-2">{FormatoMoneda(parseFloat(saldoNuevo), 'USD')}</strong>
                    ) : saldoNuevo !== 0 ? (
                        <strong className="ms-2">{FormatoMoneda(parseFloat(saldoNuevo), 'USD')}</strong>
                    ) : (
                        <strong className="ms-2"><SyncLoader color="#012970" size={5} /></strong>
                    )}
                </h5>
            </div>)}
            {
                !isLoading
                    ? <TableComponent data={dataResumen} options={options}/>
                    : <LoaderTable/>
            }
            {
                showSucursal && (
                    <div className="row">
                        <h5 className="text-blue text-center">
                            <i className="ri ri-store-3-fill me-2"></i>
                            <span>Detalle de Sucursal {dataSucursal.result_set[0].Sucursal}</span>
                        </h5>
                        <TableComponent data={dataSucursal} options={optionsSuc}/>
                    </div>
                )
            }
        </div>
    );
}
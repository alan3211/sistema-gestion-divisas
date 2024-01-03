import {encryptRequest, formattedDate, formattedDateDD, mensajeSinElementos, validarNumeros} from "../../../utils";
import {useFetchTipoCambio} from "../../../hook";
import {MessageComponent} from "../../commons";
import {useContext, useState} from "react";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {dataG} from "../../../App";
import {ModalGenericTool} from "../../commons/modals";
import {TableComponent} from "../../commons/tables";
import {consultaSucursalesTPCambio} from "../../../services";


export const TablaDivisasComponent = () => {

    const {setTipoDivisa} = useContext(CompraVentaContext);
    const {dataTipoCambio,headers} = useFetchTipoCambio();
    setTipoDivisa(dataTipoCambio);
    const [showDetailSuc,setShowDetailSuc] = useState(false);
    const [dataSucursales,setDataSucursales] = useState([]);

    const OPTIONS_SUCURSAL = {
        excel:true,
        buscar: true,
        //buscarFecha:true,
        paginacion: true,
        filters:[
            {columna:'Compra',filter:'currency'},
            {columna:'Venta',filter:'currency'}
        ],
        params:{divisa:'',fecha:''},
        deps:{
            funcion:consultaSucursalesTPCambio
        }
    }
    const consultaTipoCambioSucursales = async (divisa) => {
        const values = {
            divisa,
            fecha:formattedDate
        }
        setOptionsSucursal((prevOptions) => ({
            ...prevOptions,
            params: values
        }));
        const encryptedData = encryptRequest(values);

        const response =  await consultaSucursalesTPCambio(encryptedData);
        setDataSucursales(response);
        setShowDetailSuc(true);
    }


    const OPTIONS_TABLE_DIVISAS = {
        size: 'xl',
        showModal: () => setShowDetailSuc(true),
        closeModal: () => {
            setShowDetailSuc(false)
        },
        icon:'bi bi-currency-exchange me-2',
        title:'Detalle Tipo de Cambio',
        subtitle:''
    }

    const [optionsSucursal, setOptionsSucursal] = useState(OPTIONS_SUCURSAL);


    if(dataTipoCambio.length === 0){
        return (
            <MessageComponent estilos={mensajeSinElementos}>
                No hay información del tipo de cambio
                para el día: <strong>{formattedDateDD}</strong>
            </MessageComponent>
        );
    }else{
        return(
            <>
            <table className="table table-hover text-center">
                <thead>
                <tr>
                    {headers?.map(elemento => {
                        return <th scope="col">{elemento}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {dataTipoCambio.map((ele, index) => (
                    <tr key={index}>
                        <td>
                            <img src={ele.icon} width={30} height={30} className="m-2" alt={ele.Divisa}/>
                            {ele.Divisa}
                        </td>
                        <td>{ele.Compra}</td>
                        <td>{ele.Venta}</td>
                        <td> <i className="bi bi-sync text-success"></i> {ele["Hora Actualización"]}</td>
                        {
                            dataG.perfil === 'Coordinador Logística' &&
                            (
                                <td>
                                    <button className="btn btn-orange" onClick={()=>consultaTipoCambioSucursales(ele.Divisa)}>
                                        <i className="ri ri-store-3-fill"></i>
                                    </button>
                                </td>
                            )
                        }
                    </tr>
                ))}
                </tbody>
            </table>
                {
                    showDetailSuc && (
                        <ModalGenericTool options={OPTIONS_TABLE_DIVISAS}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <TableComponent data={dataSucursales} options={optionsSucursal} />
                                    </div>
                                </div>
                        </ModalGenericTool>
                    )
                }
            </>
        );
    }
}
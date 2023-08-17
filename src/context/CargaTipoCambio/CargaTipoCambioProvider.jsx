import {useState} from "react";
import {CargaTipoCambioContext} from "./CargaTipoCambioContext";
import {useForm} from "react-hook-form";
import {dataG} from "../../App";


export const CargaTipoCambioProvider = ({children}) => {

    const [showTab,setShowTab] = useState({
        tab1: true,
        tab2: false,
        tab3: false,
    });


    const {register, handleSubmit,formState:{errors}} = useForm({
        defaultValues:{
            sucursal: '',
            region: '',
            opcion: 0,
            usuario:dataG.usuario,
            tipoCambio:[
                {compra_EUR: 0.0,venta_EUR:0.0},
                {compra_GBR:0.0,venta_GBR:0.0},
                {compra_USD:0.0,venta_USD:0.0}
            ]
        }
    });
    const currencies = [
        {divisa: "USD"},
        {divisa: "EUR"},
        {divisa: "GBR"},
    ];

    const changePestania = (pestania) => {
        const showTabObj = {
            tab1: false,
            tab2: false,
            tab3: false,
        };

        switch (pestania) {
            case 0:
                showTabObj.tab1 = true;
                break;
            case 1:
                showTabObj.tab2 = true;
                break;
            default:
                showTabObj.tab3 = true;
        }

        setShowTab(showTabObj);
    }

    const cargaTipoCambio = {
        showTab,changePestania,register, handleSubmit,errors,currencies
    }


    return(
        <CargaTipoCambioContext.Provider value={cargaTipoCambio}>
            {children}
        </CargaTipoCambioContext.Provider>
    )
}
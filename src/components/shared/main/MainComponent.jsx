import {dataG} from "../../../App";
import {getValidaTipoCambioDia} from "../../../services/inicio-services";
import {toast} from "react-toastify";
import {useEffect} from "react";
import {TableroComponent} from "./TableroComponent";
import {LogoGrocerys} from "./LogoGrocerys";


export const MainComponent = () => {

    const formValue ={
        sucursal: dataG.sucursal,
        usuario: dataG.usuario
    };

    const validaTipoCambio = async() =>{
        console.log("Entre a tipo de cambio")
        formValue.id = 1;
        const {resultado} = await getValidaTipoCambioDia(formValue);
        if(resultado){
            toast.error(resultado, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
        }
    }

    const validaDotacion = async() =>{
        console.log("Entre a dotacion")
        formValue.id = 2;
        const {resultado} = await getValidaTipoCambioDia(formValue);
        if(resultado){
            toast.warn(resultado, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
        }

    }
    useEffect(()=>{
        validaTipoCambio();
        validaDotacion();
    },[]);

    if(dataG.perfil !== 'Administrador'){
        return <LogoGrocerys/>
    }else{
        return <TableroComponent/>
    }
}
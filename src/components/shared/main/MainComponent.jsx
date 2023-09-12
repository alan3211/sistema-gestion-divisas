import {dataG} from "../../../App";
import {getValidaTipoCambioDia} from "../../../services/inicio-services";
import {toast, ToastContainer} from "react-toastify";
import {useEffect} from "react";
import {TableroComponent} from "./TableroComponent";
import {LogoGrocerys} from "./LogoGrocerys";
import {encryptRequest} from "../../../utils";


export const MainComponent = () => {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const formValue ={
        sucursal: dataG.sucursal || usuario.sucursal,
        usuario: dataG.usuario || usuario.usuario
    };

    const validaTipoCambio = async() =>{
        console.log("Entre a tipo de cambio")
        formValue.id = 1;
        const encryptedData = encryptRequest(formValue);

        const {resultado} = await getValidaTipoCambioDia(encryptedData);
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
        const encryptedData = encryptRequest(formValue);
        const {resultado} = await getValidaTipoCambioDia(encryptedData);
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
    },);


    return(
        <>
            {
                (dataG.perfil || usuario.perfil) !== 'Administrador'
                    ? <LogoGrocerys/>
                    :  <TableroComponent/>
            }
        </>
    );
}
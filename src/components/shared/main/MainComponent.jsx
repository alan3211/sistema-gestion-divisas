import {dataG} from "../../../App";
import {getValidaTipoCambioDia} from "../../../services/inicio-services";
import {toast} from "react-toastify";
import {useEffect} from "react";
import {TableroComponent} from "./TableroComponent";
import {LogoGrocerys} from "./LogoGrocerys";
import {encryptRequest, OPTIONS} from "../../../utils";
import {useNavigate} from "react-router-dom";


export const MainComponent = () => {

    const usuario = JSON.parse(localStorage.getItem("usuario_data"));

    const formValue ={
        sucursal: dataG.sucursal || usuario.sucursal,
        usuario: dataG.usuario || usuario.usuario
    };

    const validaTipoCambio = async() =>{
        formValue.id = 1;
        const encryptedData = encryptRequest(formValue);
        const {resultado} = await getValidaTipoCambioDia(encryptedData);
        if(resultado){
            toast.error(resultado, OPTIONS);
        }
    }

    const validaDotacion = async() =>{
        formValue.id = 2;
        const encryptedData = encryptRequest(formValue);
        const {resultado} = await getValidaTipoCambioDia(encryptedData);
        if(resultado){
            toast.warn(resultado, OPTIONS);
        }

    }
    useEffect(()=>{
        validaTipoCambio();
        validaDotacion();
    },);

    const validaTableros = () => {
        if (
            [0,6].includes(dataG.id_perfil)
        ) {
            return true;
        }

        return false;
    }

    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el localStorage está vacío
        const localStorageIsEmpty = Object.keys(localStorage).length === 0;
        // Si está vacío, redirigir a "/"
        if (localStorageIsEmpty) {
            navigate("/")
        }
    }, [Object.keys(localStorage).length]);



    return(
        <>
            {
                !validaTableros()
                    ? <LogoGrocerys/>
                    :  <TableroComponent/>
            }
        </>
    );
}
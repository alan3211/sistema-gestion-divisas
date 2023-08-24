import {CuentaCajaComponent} from "./CuentaCajaComponent";
import {useEffect, useState} from "react";
import {getUsuariosSistema} from "../../../services/catalogos-services";
import {dataG} from "../../../App";

export const TraspasoComponent =  () => {

    const [usuariosCombo,setUsuariosCombo] = useState([]);
    const [valorInput, setValorInput] = useState('');

    const obtieneUsuarios = async () =>{
        const data_usuarios = await getUsuariosSistema(dataG.sucursal,dataG.usuario);
        setUsuariosCombo(data_usuarios);

    }

    // Evento para manejar cambios en el select
    const handleChange = (event) => {
        const valor = event.target.value;
        setValorInput(valor);
    };

    const realizarTraspaso = () => {
        console.log("Usuario seleccionado: " , valorInput );
    }

    useEffect(()=>{
        obtieneUsuarios();
    },[]);

    return (
        <>
           <div className="row">
               <div className="col-md-12 d-flex justify-content-center m-2">
                   <h5 className="card-title">
                       <strong>Entrega</strong>
                   </h5>
               </div>
           </div>
            <div className="row">
                <div className="col-md-12">

                    <form className="row g-3 d-flex justify-content-center needs-validation was-validated" noValidate>
                        <div className="col-md-4">
                            <div className="form-floating mb-3">
                                <select className="form-select "
                                        id="usuario"
                                        name="usuario"
                                        aria-label="A quién entrego:"
                                >
                                    <option value="">Selecciona una opción</option>
                                    {
                                        usuariosCombo.map((ele) => (
                                            <option key={ele.Usu + '-' + ele.Nombre}
                                                    value={ele.Usu}>
                                                {ele.Nombre}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="usuario">A quién entrego:</label>
                            </div>
                        </div>
                    </form>
                    <CuentaCajaComponent/>
                    <div className="row">
                        <div className="col-md-4">
                            <button className="btn btn-primary d-flex justify-content-center" onClick={realizarTraspaso}>
                                Finalizar Operación
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
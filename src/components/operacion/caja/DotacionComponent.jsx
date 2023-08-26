import {DenominacionComponent} from "../denominacion";
import {useContext, useEffect, useState} from "react";
import {
    eliminarDenominacionesConCantidadCero, encryptRequest,
    formattedDateWS, getDenominacion,
    obtenerObjetoDenominaciones,
    validarMoneda,
} from "../../../utils";

import {CajaContext} from "../../../context/caja/CajaContext";
import {useCatalogo} from "../../../hook/useCatalogo";
import {realizarOperacion} from "../../../services";
import {dataG} from "../../../App";
import {toast} from "react-toastify";
import {Denominacion} from "../denominacion/Denominacion";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";

export const DotacionComponent = () => {

    const {dotacion:{showDenominacion,setShowDenominacion,dotacionForm}} = useContext(CajaContext);
    const {denominacionD} = useContext(DenominacionContext);
    const catalogo = useCatalogo([15]);
    const [habilita,setHabilita] =  useState({
        recibe: true,
        entrega: true,
    });

    const options = {
        title: '',
        importe: parseFloat(dotacionForm.watch('cantidad_recibida')).toFixed(2),
        habilita,
        setHabilita,
    }

    const terminarDotacion = dotacionForm.handleSubmit(async (data)=>{
        console.log("Terminar Operacion");
        console.log(data);
        let denominacionesDotacion = denominacionD.getValues();

        const formValuesD = getDenominacion(data.moneda,denominacionesDotacion)

        console.log(formValuesD);
         eliminarDenominacionesConCantidadCero(formValuesD);
         const denominaciones = obtenerObjetoDenominaciones(formValuesD);
         denominaciones.divisa = data.moneda;
         denominaciones.tipoOperacion = '0';
         denominaciones.movimiento = 'DOTACION';

         const values = {
             cliente: '',
             ticket: `DOT${dataG.sucursal}${dataG.usuario}${formattedDateWS}`,
             divisa: data.moneda,
             usuario: dataG.usuario,
             sucursal: dataG.sucursal,
             traspaso: '',
             diferencia:0.0,
             denominacion:[
                 denominaciones,
             ]
         }


         const encryptedData = encryptRequest(values);

         const resultado = await realizarOperacion(encryptedData);

         console.log(resultado);
         if(resultado){
             toast.success(`Se ha realizado la dotación correctamente de ${data.moneda}`,{
                 position: "top-center",
                 autoClose: 3000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 theme: "light",
             });
             cleanParameters();
         }
    });

    if(dotacionForm.watch("moneda") === '0'){
        setShowDenominacion(false);
    }else{
        setShowDenominacion(true);
    }

    const cleanParameters = () => {
        dotacionForm.reset();
        denominacionD.reset();
    }

    return(
        <>
            <form className="row m-1 g-3 justify-content-center" onSubmit={terminarDotacion} noValidate>
                <div className="col-md-3">
                    <div className="form-floating">
                        <input
                            {...dotacionForm.register("cantidad_recibida",{
                                required:{
                                    value:true,
                                    message:'El campo Cantidad Recibida no puede ser vacio.'
                                },
                                validate: {
                                    validacionMN: (value) => validarMoneda("Cantidad Recibida",value),
                                    mayorACero: value => parseFloat(value) > 0 || "La Cantidad Recibida debe ser mayor a 0",
                                }
                            })}
                            type="text"
                            className={`form-control ${!!dotacionForm.formState.errors?.cantidad_recibida ? 'invalid-input':''}`}
                            id="cantidad_recibida"
                            name="cantidad_recibida"
                            placeholder="Ingresa la cantidad recibida"
                        />
                        <label htmlFor="cantidad_recibida">Cantidad a Recibir:</label>
                        {
                            dotacionForm.formState.errors?.cantidad_recibida && <div className="invalid-feedback-custom">{dotacionForm.formState.errors?.cantidad_recibida.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-floating mb-3">
                        <select
                            {...dotacionForm.register("moneda",{
                                required:{
                                    value:true,
                                    message:'Debes de seleccionar al menos un tipo de moneda.'
                                },
                                validate: value => {
                                    return value !== "0" || 'Debes seleccionar un tipo de moneda válido.';
                                }
                            })}
                            className={`form-select ${!!dotacionForm.formState.errors?.moneda ? 'invalid-input':''}`}
                            id="moneda"
                            name="moneda"
                            aria-label="Moneda"
                        >
                            <option value="0">Selecciona una opción</option>
                            {
                                catalogo[0]?.map((ele) => (
                                    <option key={ele.id + '-' + ele.descripcion}
                                            value={ele.id}>
                                        {ele.descripcion}
                                    </option>
                                ))
                            }
                        </select>
                        <label htmlFor="moneda">Moneda</label>
                        {
                            dotacionForm.formState.errors?.moneda && <div className="invalid-feedback-custom">{dotacionForm.formState.errors?.moneda.message}</div>
                        }
                    </div>
                </div>
                 <div className="d-flex justify-content-center">
                     {
                         showDenominacion &&
                                <Denominacion type="D" moneda={dotacionForm.watch('moneda')} options={options}/>
                     }
                 </div>
                <div className="col-md-12 d-flex justify-content-center">
                    <button className="btn btn-secondary me-3" onClick={()=>cleanParameters()}>
                        <i className="ri ri-settings-line"></i> Nueva Dotación
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={habilita.entrega}>
                        <span className="bi bi-check-circle me-2" aria-hidden="true"></span>
                        Finalizar Operación
                    </button>
                </div>

            </form>
        </>
    );
}
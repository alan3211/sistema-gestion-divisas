import {DenominacionComponent} from "../denominacion";
import {useContext, useEffect} from "react";
import {
    eliminarDenominacionesConCantidadCero,
    formattedDateWS,
    obtenerObjetoDenominaciones, validarMoneda, validarNombreApellido
} from "../../../utils";
import {dataG} from "../../../App";
import {realizarOperacion} from "../../../services";
import {CajaContext} from "../../../context/caja/CajaContext";
import {useCatalogo} from "../../../hook/useCatalogo";

export const DotacionComponent = () => {

    const {dotacion:{showDenominacion,setShowDenominacion,isOkRecibido,setIsOkRecibido,dotacionForm}} = useContext(CajaContext);
    const catalogo = useCatalogo([15]);

    const terminarDotacion = dotacionForm.handleSubmit(async (data)=>{
        console.log("Terminar Operacion");
        console.log(data);

        /* eliminarDenominacionesConCantidadCero(formValues);

         const denominaciones = obtenerObjetoDenominaciones(formValues);

         denominaciones.divisa = formValues.moneda;
         denominaciones.tipoOperacion = '0';
         denominaciones.movimiento = 'DOTACION';

         const values = {
             cliente: '',
             ticket: `DOT${dataG.sucursal}${dataG.usuario}${formattedDateWS}`,
             divisa: formValues.moneda,
             usuario: dataG.usuario,
             sucursal: dataG.sucursal,
             traspaso: '',
             diferencia:0.0,
             denominacion:[
                 denominaciones,
             ]
         }

         console.log(values);

         const resultado = await realizarOperacion(values);

         console.log(resultado);*/

    });

    useEffect(()=>{
        if (dotacionForm.watch('moneda') !== '')
            setShowDenominacion(true);
    },[dotacionForm.watch('moneda')])

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
                                    validaMoneda: (value) => validarMoneda("Cantidad Recibida",value),
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
                         showDenominacion && <DenominacionComponent importe={dotacionForm.watch('cantidad_recibida')} moneda={dotacionForm.watch('moneda')} type setIsOkRecibido={setIsOkRecibido}/>
                     }
                 </div>

                <div className="col-md-12 d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary">
                        <span className="bi bi-check-circle me-2" aria-hidden="true"></span>
                        Finalizar Operación
                    </button>
                </div>

            </form>
        </>
    );
}
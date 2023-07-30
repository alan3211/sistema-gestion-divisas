import {InputComponent} from "../../commons/inputs/InputComponent";
import {DenominacionComponent} from "../denominacion/DenominacionComponent";
import {useForm} from "../../../hook/useForm";
import {useEffect, useState} from "react";
import {
    eliminarDenominacionesConCantidadCero,
    formattedDateWS, getDenominacion,
    obtenerObjetoDenominaciones
} from "../../../utils/utils";
import {dataG} from "../../../App";
import {realizarOperacion} from "../../../services/operaciones-services";

export const DotacionComponent = () => {

    const [showDenominacion,setShowDenominacion] =  useState(false);
    const [isOkRecibido,setIsOkRecibido] = useState(true);

    const {formValues,handleInputChange} = useForm(getDenominacion());

    const cleanParameters = () => {
        console.log('Valores actuales después de limpiar:', formValues);
    }

    const opcionesForm = [
        { nombre: "Cantidad a Recibir",name:"cantidad_recibida",tipo:"text",texto:"Ingresa la cantidad a recibir",estilo:"col-md-5"},
        { nombre: "Moneda",name:"moneda",tipo:"select",texto:"Moneda",estilo:"col-md-7",id_catalogo:15},
    ];

    const terminarDotacion = async() => {
        console.log("Terminar Operacion");
        console.log(formValues);
        eliminarDenominacionesConCantidadCero(formValues);

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

        console.log(resultado);

    }

    useEffect(()=>{
        if (formValues.moneda !== '')
            setShowDenominacion(true);
    },[formValues.moneda])

    return(
        <>
            <form className="row m-1 g-3 needs-validation was-validated justify-content-center" noValidate>
                 <div className="col-md-6">
                     <div className="row">
                        {
                            opcionesForm.map((elemento) => {
                                return (
                                    <>
                                        <InputComponent key={elemento.name}
                                                        nombre={elemento.nombre}
                                                        name={elemento.name}
                                                        tipo={elemento.tipo}
                                                        texto={elemento.texto}
                                                        estilo={elemento.estilo}
                                                        onInputChange={handleInputChange}
                                                        id_catalogo={elemento.id_catalogo}
                                                        resetForm={cleanParameters}
                                        />
                                    </>);
                            })
                        }
                         <div className="d-flex justify-content-center">
                             {
                                 showDenominacion && <DenominacionComponent importe={formValues.cantidad_recibida} moneda={formValues.moneda} type handleInputChange={handleInputChange} setIsOkRecibido={setIsOkRecibido}/>
                             }
                         </div>
                     </div>
                 </div>
                <div className="col-md-12 d-flex justify-content-center">
                    <button type="button" className="btn btn-primary" onClick={terminarDotacion} disabled={isOkRecibido}>
                        Finalizar Operación
                    </button>
                </div>

            </form>
        </>
    );
}
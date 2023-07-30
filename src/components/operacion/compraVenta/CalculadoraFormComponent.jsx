import { useState } from 'react';
import {InputComponent} from "../../commons/inputs/InputComponent";
import {dataG} from "../../../App";
import {realizaConversion} from "../../../services/operaciones-services";
import {useForm} from "../../../hook/useForm";
import {ModalConfirm} from "../../commons/modals/ModalConfirm";

export const CalculadoraFormComponent = ({tipoDivisa,setOperacion,setContinuaOperacion}) => {

    const {formValues, setFormValues,handleInputChange} = useForm({
        "sucursal":dataG.sucursal,
        "tipo_operacion": "",
        "moneda":"",
        "monto": 0
    });
    const [cantidad, setCantidad] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const closeModal = () => {
        setContinuaOperacion(false);
        setShowModal(false);
    }

    const muestraDivisa = () => {

        if(formValues["tipo_operacion"] === "1"){
            return 'MXP'
        }else{
            return  formValues["moneda"]
        }
    }


    const obtieneDivisa = (tipoDivisa,form) => {

        const divisaValor = tipoDivisa.filter(elemento => {
            return elemento.divisa === formValues["moneda"];
        });

        let valor = null;

        if (divisaValor.length > 0) {
            if (formValues["tipo_operacion"] === "1") {
                valor = divisaValor[0].compra;
            } else {
                valor = divisaValor[0].venta;
            }
        }
        return valor;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        formValues["sucursal"] = dataG.sucursal;
        formValues["monto"] = parseInt(formValues["monto"]);
        const {cantidad_entrega} = await realizaConversion(formValues);
        formValues["cantidad_entregada"] = cantidad_entrega
        setCantidad(cantidad_entrega);
        formValues["tipo_cambio"] = obtieneDivisa(tipoDivisa,formValues);
        setOperacion(formValues);
        setIsLoading(true);
        setShowModal(true);
    };

    const continuarOperacion = () => {
        setContinuaOperacion(true);
        setShowModal(false);
    }


    const cleanParameters = () => {
        setContinuaOperacion(false);
        setIsLoading(false);
        setFormValues({ "sucursal":dataG.sucursal,
            "tipo_operacion": "",
            "moneda":"",
            "monto": 0});
        console.log('Valores actuales después de limpiar:', formValues);
    }

    const elementos = [
        { nombre: "Tipo de operación",name:"tipo_operacion",tipo:"select",texto:"Tipo Operación",estilo:"col-md-6",id_catalogo:9},
        { nombre: "Divisa",name:"moneda",tipo:"select",texto:"Divisa",estilo:"col-md-6",id_catalogo:4},
        { nombre: "Cantidad Recibida",name:"monto",tipo:"text",texto:"Ingresa la cantidad recibida por el cliente",estilo:"col-md-6"},
    ];

    return (
        <form className="row g-3 needs-validation was-validated" noValidate>
            {
                elementos.map((elemento) => {
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
            {
                isLoading &&
                (<div className="col-md-6">
                        <div className="form-floating">
                            <input type="text"
                                   className="form-control input-group has-validation"
                                   id="floatingCE"
                                   value={cantidad}
                                   readOnly
                            />
                            <label htmlFor="floatingCE">Cantidad a Entregar <i>({ muestraDivisa() }</i>)</label>
                        </div>
                </div>)
            }

            <button type="reset" onClick={cleanParameters} className="btn btn-secondary">
                Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Continuar
            </button>

            <ModalConfirm title='¿Desea realizar una operación con esta cotización?'
                          showModal={showModal}
                          closeModal={closeModal}
                          hacerOperacion={continuarOperacion}/>

        </form>
    );
};

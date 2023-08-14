import {useContext, useEffect, useState} from 'react';
import {InputComponent} from "../../commons/inputs";
import {dataG} from "../../../App";
import {realizaConversion} from "../../../services";
import {useForm} from "../../../hook";
import {ModalConfirm} from "../../commons/modals";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {useCatalogo} from "../../../hook/useCatalogo";
import {encryptRequest, validarMoneda, validarNumeroTelefono} from "../../../utils";

export const CalculadoraFormComponent = () => {

    const {cantidad,setCantidad,showModal,setShowModal,showCantidadEntregada,setShowCantidadEntregada,tipoDivisa,setOperacion,setContinuaOperacion,register,handleSubmit,errors,reset,watch,busquedaCliente:{setShowCliente}} = useContext(CompraVentaContext);
    const catalogo = useCatalogo([9,4])


    const closeModal = () => {
        setContinuaOperacion(false);
        setShowModal(false);
    }

    const muestraDivisa = (opcion) => {

        if(opcion === 1){
            return watch("tipo_operacion") === '1' ? watch("moneda"): 'MXP';
        }else{
            return watch("tipo_operacion") === '1' ? 'MXP': watch("moneda");
        }

    }

   const obtieneDivisa = (tipoDivisa,formValues) => {

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

    const handleSubmitCotizacion = handleSubmit(async(data)=> {
        data.sucursal = dataG.sucursal;
        const encryptData = encryptRequest(data);
        const {cantidad_entrega} = await realizaConversion(encryptData);
        setShowCantidadEntregada(true);
        setCantidad(cantidad_entrega);
        data.cantidad_entregada = cantidad_entrega;
        data["tipo_cambio"] = obtieneDivisa(tipoDivisa,data);
        setOperacion(data);
    });

    const clearForm = () => {
        reset();
        setShowCantidadEntregada(false);
        setCantidad('');
        setContinuaOperacion(false); // ocula el modulo de busquedaclientes
        setShowCliente(false); // Oculta el modulo de datos clientes
    }
    const continuarOperacion = () => {
        setContinuaOperacion(true);
        setShowModal(false);
    }

    const closeModalAndReturn = () =>{
        clearForm();
        closeModal();
    }
    return (
        <>
        <form className="row g-3" onSubmit={handleSubmitCotizacion} noValidate>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-floating mb-3">
                        <select
                            {...register("tipo_operacion",{
                                required:{
                                    value:true,
                                    message:'Debes de seleccionar al menos un tipo de operación'
                                },
                                validate: value => {
                                    return value !== "0" || 'Debes seleccionar un tipo de operación válido.';
                                }
                            })}
                            className={`form-select ${!!errors?.tipo_operacion ? 'invalid-input':''}`}
                            id="tipo_operacion"
                            name="tipo_operacion"
                            aria-label="Tipo de Operación"
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
                        <label htmlFor="tipo_operacion">Tipo de operación</label>
                        {
                            errors?.tipo_operacion && <div className="invalid-feedback-custom">{errors?.tipo_operacion.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating mb-3">
                        <select
                            {...register("moneda",{
                                required:{
                                    value:true,
                                    message:'Debes de seleccionar al menos una moneda.'
                                },
                                validate: value => {
                                    return value !== "0" || 'Debes seleccionar una moneda válida.';
                                }
                            })}
                            className={`form-select ${!!errors?.moneda ? 'invalid-input':''}`}
                            id="moneda"
                            name="moneda"
                            aria-label="Moneda"
                        >
                            <option value="0">Selecciona una opción</option>
                            {
                                catalogo[1]?.map((ele) => (
                                    <option key={ele.id + '-' + ele.descripcion}
                                            value={ele.id}>
                                        {ele.descripcion}
                                    </option>
                                ))
                            }
                        </select>
                        <label htmlFor="moneda">Divisa</label>
                        {
                            errors?.moneda && <div className="invalid-feedback-custom">{errors?.moneda.message}</div>
                        }
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8 mb-3 d-flex">
                    <div className="form-floating flex-grow-1">
                        <input
                            {...register("monto", {
                                required: {
                                    value: true,
                                    message: 'El campo Cantidad Recibida no puede estar vacío.'
                                },
                                validate: {
                                    moneda: (value) => validarMoneda("Cantidad Recibida", value),
                                    mayorACero: value => parseFloat(value) > 0 || "La Cantidad Recibida debe ser mayor a 0"
                                }
                            })}
                            type="text"
                            className={`form-control ${!!errors?.monto ? 'is-invalid' : ''}`}
                            id="monto"
                            name="monto"
                            placeholder="Ingresa la cantidad recibida por el cliente"
                        />
                        <label htmlFor="monto" className="form-label">Cantidad Recibida <i>({ muestraDivisa(1) })</i></label>
                        {
                            errors?.monto && <div className="invalid-feedback">{errors?.monto.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-4">
                    <button
                        type="submit"
                        className="btn btn-success d-flex p-3"
                    >
                        <i className="bi bi-cash-coin me-2"></i>
                        Cotizar
                    </button>
                </div>
            </div>

            {showCantidadEntregada &&
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-floating">
                            <input type="text"
                               className={`form-control mb-1 ${cantidad !== '' && 'valid-input'}`}
                               id="floatingCE"
                               value={cantidad}
                               readOnly
                            />
                            <label htmlFor="floatingCE">Cantidad a Entregar <i>({ muestraDivisa(2) })</i></label>
                        </div>
                    </div>
                </div>
            }
            <div className="d-flex justify-content-center">
                <button type="button" onClick={clearForm} className="btn btn-secondary me-2">
                    <i className="bi bi-file-earmark-plus"></i> Nueva Cotización
                </button>
                <button type="button" className="btn btn-primary" onClick={()=> setShowModal(true)} disabled={(cantidad === '')}>
                    <i className="bi bi bi-calculator"></i> Operación
                </button>
            </div>
        </form>

            <ModalConfirm title='¿Desea realizar una operación con esta cotización?'
                          showModal={showModal}
                          closeModal={closeModal}
                          hacerOperacion={continuarOperacion}
                          closeModalAndReturn={closeModalAndReturn}
                          icon="bi bi-exclamation-triangle-fill text-warning m-2"
            />
    </>
    );
};

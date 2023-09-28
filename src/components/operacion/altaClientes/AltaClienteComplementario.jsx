import {memo, useContext, useEffect, useState} from "react";
import {ModalConfirm} from "../../commons/modals";
import {CardLayout} from "../../commons";
import {AltaClienteContext} from "../../../context/AltaCliente/AltaClienteContext";
import {encryptRequest, validarAlfaNumerico, validarNumeros, validarNumeroTelefono} from "../../../utils";
import {useCatalogo} from "../../../hook/useCatalogo";
import {useAltaComplementario} from "../../../hook/useAltaComplementario";
import {dataG} from "../../../App";
import {getCatalogo, getLocalidad, guardaCliente} from "../../../services";

export const AltaClienteComplementario = memo(() => {

    const {propForm} =  useContext(AltaClienteContext);
    const {
        showModal,
        setShowModal,
        closeModal,
        hacerOperacion,
        } = useAltaComplementario();

    const catalogo = useCatalogo([1,3,3,6,12,13,14,10,11,18]);

    const handleValidateFinalForm = propForm.handleSubmit(async(data) => {
        data.sucursal = dataG.sucursal.toString();
        data.usuario = dataG.usuario;

        if(data.origen_recursos !== '5'){
            data.esp_origen_recursos = '';
        }
        if(data.destino_recursos !== '7'){
            data.esp_destino_recursos = '';
        }

        const encryptedBase64 = encryptRequest(data)

        const dataClientes = await guardaCliente(encryptedBase64);
        if (dataClientes) {
            propForm.setDataClientes(dataClientes);
            setShowModal(true);
        }
    });

    const closeModalAndReturn = () =>{
        closeModal();
        propForm.reset();
        propForm.setComplementarios(false);
        propForm.setShowEdit(false);

    }

    const [municipios,setMunicipios] = useState([]);
    const [colonias,setColonias] = useState([]);
    const [codigoPostal,setCodigoPostal] = useState([]);

    useEffect(() => {
        const getFetch = async() =>{
            const values = {
                opcion:1,
                estado: propForm.watch("estado"),
                municipio:'',
                colonia:''
            }
            const encryptedData =  encryptRequest(values);
            const mun = await getLocalidad(encryptedData);
            setMunicipios(mun)
        }
        if(propForm.watch("estado") !== '0') getFetch();
    }, [propForm.watch("estado")]);

    useEffect(() => {
        const getFetch = async() =>{
            const values = {
                opcion:2,
                estado: propForm.watch("estado"),
                municipio:propForm.watch("municipio"),
                colonia:''
            }
            const encryptedData =  encryptRequest(values);
            const colonias = await getLocalidad(encryptedData);
            setColonias(colonias)
        }
        if(propForm.watch("municipio") !== '0') getFetch();
    }, [propForm.watch("municipio")]);

    useEffect(() => {
        const getFetch = async() =>{
            const values = {
                opcion:3,
                estado: propForm.watch("estado"),
                municipio:propForm.watch("municipio"),
                colonia:propForm.watch("colonia")
            }
            const encryptedData =  encryptRequest(values);
            const codigo_postal = await getLocalidad(encryptedData);
            setCodigoPostal(codigo_postal)
        }
        if(propForm.watch("colonia") !== '0') getFetch();
    }, [propForm.watch("colonia")]);


    return (
        <>
            <form className="row g-3" onSubmit={handleValidateFinalForm} noValidate>
                <CardLayout title="Datos Complementarios" icon="ri-file-list-2-fill p-2">
                    <div className="row">
                        <div className="col-md-3">
                                <div className="form-floating mb-3">
                                    <select
                                        {...propForm.register("genero",{
                                            required:{
                                                value:true,
                                                message:'Debes de seleccionar al menos un genero.'
                                            }
                                        })}
                                        className={`form-select ${!!propForm.errors?.genero ? 'invalid-input':''}`}
                                        id="genero"
                                        name="genero"
                                        aria-label="GENERO"
                                    >
                                        <option value="0">SELECCIONA UNA OPCIÓN</option>
                                        {
                                            catalogo[9]?.map((ele) => (
                                                <option key={ele.id + '-' + ele.descripcion}
                                                        value={ele.id}>
                                                    {ele.descripcion}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <label htmlFor="genero">GENERO</label>
                                    {
                                        propForm.errors?.genero && <div className="invalid-feedback-custom">{propForm.errors?.genero.message}</div>
                                    }
                                </div>
                            </div>
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("id_actividad_economica",{
                                        required:{
                                            value:true,
                                            message:'Debes de seleccionar al menos una actividad economica.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una actividad economica válida.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.id_actividad_economica ? 'invalid-input':''}`}
                                    id="id_actividad_economica"
                                    name="id_actividad_economica"
                                    aria-label="Actividad Económica"
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        catalogo[0]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="id_actividad_economica">ACTIVIDAD ECONÓMICA</label>
                                {
                                    propForm.errors?.id_actividad_economica && <div className="invalid-feedback-custom">{propForm.errors?.id_actividad_economica.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("nacionalidad",{
                                        required:{
                                            value:true,
                                            message:'Debes de seleccionar al menos una nacionalidad.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una nacionalidad válida.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.nacionalidad ? 'invalid-input':''}`}
                                    id="nacionalidad"
                                    name="nacionalidad"
                                    aria-label="Nacionalidad"
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        catalogo[1]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="nacionalidad">NACIONALIDAD</label>
                                {
                                    propForm.errors?.nacionalidad && <div className="invalid-feedback-custom">{propForm.errors?.nacionalidad.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("pais_nacimiento",{
                                        required:{
                                            value:true,
                                            message:'Debes de seleccionar al menos un pais de nacimiento.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un pais de nacimiento válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.pais_nacimiento ? 'invalid-input':''}`}
                                    id="pais_nacimiento"
                                    name="pais_nacimiento"
                                    aria-label="País Nacimiento"
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        catalogo[2]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="pais_nacimiento">PAÍS NACIMIENTO</label>
                                {
                                    propForm.errors?.pais_nacimiento && <div className="invalid-feedback-custom">{propForm.errors?.pais_nacimiento.message}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("estado",{
                                        required:{
                                            value:true,
                                            message:'Debes de seleccionar al menos un estado.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un estado válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.estado ? 'invalid-input':''}`}
                                    id="estado"
                                    name="estado"
                                    aria-label="Estado"
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        catalogo[3]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion.toUpperCase()}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="estado">ESTADO</label>
                                {
                                    propForm.errors?.estado && <div className="invalid-feedback-custom">{propForm.errors?.estado.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("municipio",{
                                        required:{
                                            value:true,
                                            message:'Debes de seleccionar al menos un municipio.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un municipio válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.municipio ? 'invalid-input':''}`}
                                    id="municipio"
                                    name="municipio"
                                    aria-label="Municipio"
                                    disabled={(propForm.watch('municipio') === '0') && municipios.length === 0}
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        municipios?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion.toUpperCase()}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="municipio">MUNICIPIO</label>
                                {
                                    propForm.errors?.municipio && <div className="invalid-feedback-custom">{propForm.errors?.municipio.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("colonia",{
                                        required:{
                                            value:true,
                                            message:'Debes de seleccionar al menos una colonia.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una colonia válida.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.colonia ? 'invalid-input':''}`}
                                    id="colonia"
                                    name="colonia"
                                    aria-label="Colonia"
                                    disabled={(propForm.watch('colonia') === '0') && colonias.length === 0}
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        colonias?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion.toUpperCase()}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="colonia">COLONIA</label>
                                {
                                    propForm.errors?.colonia && <div className="invalid-feedback-custom">{propForm.errors?.colonia.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                        <div className="form-floating mb-3">
                            <select
                                {...propForm.register("codigo_postal",{
                                    required:{
                                        value:true,
                                        message:'Debes de seleccionar al menos un código_postal.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar un código postal válido.';
                                    }
                                })}
                                className={`form-select ${!!propForm.errors?.codigo_postal ? 'invalid-input':''}`}
                                id="codigo_postal"
                                name="codigo_postal"
                                aria-label="Código Postal"
                                disabled={(propForm.watch('codigo_postal') === '0') && codigoPostal.length === 0}
                            >
                                <option value="0">SELECCIONA UNA OPCIÓN</option>
                                {
                                    codigoPostal?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="codigo_postal">CÓDIGO POSTAL</label>
                            {
                                propForm.errors?.codigo_postal && <div className="invalid-feedback-custom">{propForm.errors?.codigo_postal.message}</div>
                            }
                        </div>
                    </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("telefono",{
                                        validate: (value) => validarNumeroTelefono("Telefono",value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.telefono ? 'invalid-input':''}`}
                                    id="telefono"
                                    name="telefono"
                                    placeholder="Ingresa el teléfono"
                                />
                                <label htmlFor="telefono">TELÉFONO</label>
                                {
                                    propForm.errors?.telefono && <div className="invalid-feedback-custom">{propForm.errors?.telefono.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("calle",{
                                        required:{
                                            value:true,
                                            message:'El campo Calle no puede ser vacio.'
                                        },
                                        validate: (value) => validarAlfaNumerico("Calle",value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.calle ? 'invalid-input':''}`}
                                    id="calle"
                                    name="calle"
                                    placeholder="Ingresa la calle"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("calle", upperCaseValue);
                                    }}
                                />
                                <label htmlFor="calle">DIRECCIÓN</label>
                                {
                                    propForm.errors?.calle && <div className="invalid-feedback-custom">{propForm.errors?.calle.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("numero_exterior",{
                                        required:{
                                            value:true,
                                            message:'El campo Número Exterior no puede ser vacio.'
                                        },
                                        validate: (value) => validarAlfaNumerico("Número Exterior",value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.numero_exterior ? 'invalid-input':''}`}
                                    id="numero_exterior"
                                    name="numero_exterior"
                                    placeholder="Ingresa el Número Exterior"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("numero_exterior", upperCaseValue);
                                    }}
                                />
                                <label htmlFor="numero_exterior">NÚMERO EXTERIOR</label>
                                {
                                    propForm.errors?.numero_exterior && <div className="invalid-feedback-custom">{propForm.errors?.numero_exterior.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("numero_interior",{
                                        validate: (value) => validarAlfaNumerico("Número Interior",value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.numero_interior ? 'invalid-input':''}`}
                                    id="numero_interior"
                                    name="numero_interior"
                                    placeholder="Ingresa el Número Interior"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("numero_interior", upperCaseValue);
                                    }}
                                />
                                <label htmlFor="numero_interior">NÚMERO INTERIOR</label>
                                {
                                    propForm.errors?.numero_interior && <div className="invalid-feedback-custom">{propForm.errors?.numero_interior.message}</div>
                                }
                            </div>
                        </div>
                    </div>
                </CardLayout>

                <CardLayout title="Perfil Transaccional" icon="bi bi-file-person-fill p-2">
                    <div className="row">
                    <div className="col-md-4">
                        <div className="form-floating mb-3">
                            <select
                                {...propForm.register("monto",{
                                    required:{
                                        value:true,
                                        message:'Debes de seleccionar al menos un monto.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar un monto válido.';
                                    }
                                })}
                                className={`form-select ${!!propForm.errors?.monto ? 'invalid-input':''}`}
                                id="monto"
                                name="monto"
                                aria-label="Monto"
                            >
                                <option value="0">SELECCIONA UNA OPCIÓN</option>
                                {
                                    catalogo[4]?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="monto">MONTO</label>
                            {
                                propForm.errors?.monto && <div className="invalid-feedback-custom">{propForm.errors?.monto.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-floating mb-3">
                            <select
                                {...propForm.register("frecuencia",{
                                    required:{
                                        value:true,
                                        message:'Debes de seleccionar al menos una frecuencia.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar una frecuencia válida.';
                                    }
                                })}
                                className={`form-select ${!!propForm.errors?.frecuencia ? 'invalid-input':''}`}
                                id="frecuencia"
                                name="frecuencia"
                                aria-label="Frecuencia"
                            >
                                <option value="0">SELECCIONA UNA OPCIÓN</option>
                                {
                                    catalogo[5]?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="frecuencia">FRECUENCIA</label>
                            {
                                propForm.errors?.frecuencia && <div className="invalid-feedback-custom">{propForm.errors?.frecuencia.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-floating mb-3">
                            <select
                                {...propForm.register("numero_operaciones",{
                                    required:{
                                        value:true,
                                        message:'Debes de seleccionar al menos un número de operaciones.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar un número de operaciones válido.';
                                    }
                                })}
                                className={`form-select ${!!propForm.errors?.numero_operaciones ? 'invalid-input':''}`}
                                id="numero_operaciones"
                                name="numero_operaciones"
                                aria-label="# Operaciones"
                            >
                                <option value="0">SELECCIONA UNA OPCIÓN</option>
                                {
                                    catalogo[6]?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="numero_operaciones"># OPERACIONES</label>
                            {
                                propForm.errors?.numero_operaciones && <div className="invalid-feedback-custom">{propForm.errors?.numero_operaciones.message}</div>
                            }
                        </div>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-md-3">
                        <div className="form-floating mb-3">
                            <select
                                {...propForm.register("origen_recursos",{
                                    required:{
                                        value:true,
                                        message:'Debes de seleccionar al menos un origen de recursos.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar un origen de recursos válido.';
                                    }
                                })}
                                className={`form-select ${!!propForm.errors?.origen_recursos ? 'invalid-input':''}`}
                                id="origen_recursos"
                                name="origen_recursos"
                                aria-label="Origen Recursos"
                            >
                                <option value="0">SELECCIONA UNA OPCIÓN</option>
                                {
                                    catalogo[7]?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="origen_recursos">ORIGEN RECURSOS</label>
                            {
                                propForm.errors?.origen_recursos && <div className="invalid-feedback-custom">{propForm.errors?.origen_recursos.message}</div>
                            }
                        </div>
                    </div>
                    {
                        propForm.watch("origen_recursos") === '5' &&
                        (<div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("esp_origen_recursos",{
                                        required:{
                                            value:true,
                                            message:'El campo Especifica Origen Recursos no puede ser vacio.'
                                        },
                                        validate: (value) => validarAlfaNumerico("Especifica Origen Recursos",value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.esp_origen_recursos ? 'invalid-input':''}`}
                                    id="esp_origen_recursos"
                                    name="esp_origen_recursos"
                                    placeholder="Especifique Origen Recursos"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("esp_origen_recursos", upperCaseValue);
                                    }}
                                />
                                <label htmlFor="esp_origen_recursos">ESPECIFIQUE ORIGEN RECURSOS</label>
                                {
                                    propForm.errors?.esp_origen_recursos && <div className="invalid-feedback-custom">{propForm.errors?.esp_origen_recursos.message}</div>
                                }
                            </div>
                        </div>)
                    }
                    <div className="col-md-3">
                        <div className="form-floating mb-3">
                            <select
                                {...propForm.register("destino_recursos",{
                                    required:{
                                        value:true,
                                        message:'Debes de seleccionar al menos un destino de los recursos.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar un destino de recursos válido.';
                                    }
                                })}
                                className={`form-select ${!!propForm.errors?.destino_recursos ? 'invalid-input':''}`}
                                id="destino_recursos"
                                name="destino_recursos"
                                aria-label="Destino Recursos"
                            >
                                <option value="0">SELECCIONA UNA OPCIÓN</option>
                                {
                                    catalogo[8]?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="destino_recursos">DESTINO RECURSOS</label>
                            {
                                propForm.errors?.destino_recursos && <div className="invalid-feedback-custom">{propForm.errors?.destino_recursos.message}</div>
                            }
                        </div>
                    </div>
                    {
                        propForm.watch("destino_recursos") === '7' &&
                        (<div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("esp_destino_recursos",{
                                        required:{
                                            value:true,
                                            message:'El campo Especifica Destino Recursos no puede ser vacio.'
                                        },
                                        validate: (value) => validarAlfaNumerico("Especifica Destino Recursos",value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.esp_destino_recursos ? 'invalid-input':''}`}
                                    id="esp_destino_recursos"
                                    name="esp_destino_recursos"
                                    placeholder="Especifique Destino Recursos"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("esp_destino_recursos", upperCaseValue);
                                    }}
                                />
                                <label htmlFor="esp_destino_recursos">ESPECIFIQUE DESTINO RECURSOS</label>
                                {
                                    propForm.errors?.esp_destino_recursos && <div className="invalid-feedback-custom">{propForm.errors?.esp_destino_recursos.message}</div>
                                }
                            </div>
                        </div>)
                    }
                    </div>
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-center">
                            <button
                                type="submit"
                                className="m-2 btn btn-primary d-grid gap-2">
                                <span
                                    className="bi bi-check-circle-fill me-2"
                                    role="status"
                                    aria-hidden="true">
                                    <span className="ms-2">
                                        FINALIZAR
                                    </span>
                                </span>
                            </button>
                        </div>
                    </div>
                </CardLayout>
            </form>

            <ModalConfirm
                showModal={showModal}
                closeModal={closeModal}
                selectedItem={propForm.dataClientes}
                icon="bi bi-check-circle-fill text-success m-2"
                hacerOperacion={hacerOperacion}
                title={`El registro se ha completado satisfactoriamente con el número de cliente ${ propForm.dataClientes.cliente}. ¿Desea realizar una operación con este cliente?`}
                closeModalAndReturn={closeModalAndReturn}
            />

        </>
    );
})
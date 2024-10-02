import {ClienteCoincidenciaComponent, DatosClientes} from "../busquedaClientes";
import {CardLayout} from "../../commons";
import {memo, useContext, useEffect, useState} from "react";
import {AltaClienteContext} from "../../../context/AltaCliente/AltaClienteContext";
import {validaCliente} from "../../../services";
import {
    encryptRequest, OPTIONS,
    validaFechas,
    validarAlfaNumerico,
    validarCorreoElectronico,
    validarNombreApellido, getElementosFecha
} from "../../../utils";
import {useCatalogo, usePrinter} from "../../../hook/";
import {toast} from "react-toastify";
import {Overlay} from "../../commons/toast/Overlay";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";

export const AltaClienteFormComponent = memo(() => {

    const {propForm} = useContext(AltaClienteContext);
    const {busquedaCliente:{showCliente,setShowCliente,data},operacion,
        setShowAltaCliente,setContinuaOperacion,setCantidad,setShowCantidadEntregada,
    } = useContext(CompraVentaContext);
    const catalogo = useCatalogo([2]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [controlName, setControlName] = useState({
        lastName:false,
        secondlastName:false,
    });

    const {imprimeTicketLPB} = usePrinter({});

    const [tipoIdentificacionError, setTipoIdentificacionError] = useState(false);

    useEffect(() => {
        // Validar al montar el componente
        const tipoIdentificacionValue = propForm.watch("tipo_identificacion");
        const isValid = tipoIdentificacionValue !== "";
        setTipoIdentificacionError(!isValid);
    }, [propForm]);

    const nuevoCliente = () => {
        propForm.setComplementarios(true);
        propForm.setMessageActive(false);
    }

    const onSubmitValidaCliente = propForm.handleSubmit(async (data) => {

        const encryptedBase64 = encryptRequest(data);

        const response = await validaCliente(encryptedBase64);
        response.headers = ['Selecciona', ...response.headers]

        if (response) {
            if (response.total_rows !== 0) {
                if(response.result_set[0].hasOwnProperty('Tipo')){
                    const tipo = response.result_set[0].Tipo;
                    const mensaje = response.result_set[0].Resultado;
                    if(tipo === 1){
                        toast.error(mensaje, OPTIONS);
                    } else if(tipo === 2){
                        toast.error(mensaje, OPTIONS);
                        imprimeTicketLPB();
                    }
                    //No encontro a un cliente
                    propForm.setMessageActive(false);
                    propForm.setDataClientes([]);
                    propForm.setComplementarios(false);
                    propForm.reset();
                    setShowCantidadEntregada(false);
                    setCantidad(0);
                    setContinuaOperacion(false); // oculta el modulo de busquedaclientes
                    setShowAltaCliente(false);
                }else{
                    //Encontro a un cliente similar
                    propForm.setMessageActive(true);
                    propForm.setDataClientes(response);
                    setShowOverlay(true);
                    const mensaje = 'El usuario que intenta dar de alta ya se encuentra en la base de datos. A continuación, se muestran los siguientes usuarios con coincidencias.';
                    toast.info(mensaje, {
                        position: "top-center",
                        closeButton: true,
                        closeOnClick:false,
                        className: 'overlay-toast',
                        draggable:false,
                        autoClose:false,
                        theme: "colored",
                        onClose: () => {
                            setShowOverlay(false); // Oculta el fondo de superposición cuando se cierra el toast
                        },
                    });
                }

            } else {
                //No encontro a un cliente
                propForm.setMessageActive(false);
                propForm.setDataClientes([]);
                propForm.setComplementarios(true);
            }
            propForm.setShowEdit(true);
        } else {
            //No encontro a un cliente
            propForm.setMessageActive(false);
            propForm.setDataClientes([]);
            propForm.setComplementarios(true);
        }
    });

    const toggleName = (value) => {
        setControlName((prevControlName) => {
            if (value === 'apellido_paterno') {
                if (prevControlName.lastName) {
                    propForm.setValue("apellido_paterno", "");
                } else {
                    propForm.setValue("apellido_paterno", "SIN APELLIDO PATERNO");
                }
                return {
                    ...prevControlName,
                    lastName: !prevControlName.lastName,
                };
            } else {
                if (prevControlName.secondlastName) {
                    propForm.setValue("apellido_materno", "");
                } else {
                    propForm.setValue("apellido_materno", "SIN APELLIDO MATERNO");
                }
                return {
                    ...prevControlName,
                    secondlastName: !prevControlName.secondlastName,
                };
            }
        });
    };


    return (
        <>
            <CardLayout title="Alta de Usuarios" icon="bx bxs-user-plus p-1">
                <div className="g-3">
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("nombre", {
                                        required: {
                                            value: true,
                                            message: 'El campo Nombre no puede ser vacio.'
                                        },
                                        minLength: {
                                            value: 2,
                                            message: 'El campo Nombre como mínimo debe de tener al menos 2 caracteres.'
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: 'El campo Nombre como máximo debe de tener no mas de 30 caracteres.'
                                        },
                                        validate: (value) => validarNombreApellido("Nombre", value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.nombre ? 'invalid-input' : ''}`}
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Ingresa el nombre del cliente"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("nombre", upperCaseValue);
                                        propForm.trigger('nombre');
                                    }}
                                    disabled={propForm.showEdit}
                                    autoComplete="off"
                                    tabIndex="1"
                                />
                                <label htmlFor="nombre">NOMBRES(S)</label>
                                {
                                    propForm.errors?.nombre &&
                                    <div className="invalid-feedback-custom">{propForm.errors?.nombre.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("apellido_paterno", {
                                        required: {
                                            value: true,
                                            message: 'El campo Apellido Paterno no puede ser vacio.'
                                        },
                                        minLength: {
                                            value: 1,
                                            message: 'El campo Apellido Materno como mínimo debe de tener al menos 1 carácter.'
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: 'El campo Apellido Paterno como máximo debe de tener no mas de 30 caracteres.'
                                        },
                                        validate: (value) => validarNombreApellido("Apellido Paterno", value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.apellido_paterno ? 'invalid-input' : ''}`}
                                    id="apellido_paterno"
                                    name="apellido_paterno"
                                    placeholder="Ingresa el apellido paterno"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("apellido_paterno", upperCaseValue);
                                        propForm.trigger('apellido_paterno');
                                        // Aquí se actualiza la lógica para habilitar/deshabilitar el input
                                        if(upperCaseValue.trim() === "") {
                                            setControlName({
                                                lastName:upperCaseValue.length > 0, // Se inhabilita si hay algún valor en el input
                                                secondlastName: true, // Esto puede ser otra lógica o condición
                                            });
                                        }

                                    }}
                                    disabled={propForm.showEdit || controlName.lastName }
                                    autoComplete="off"
                                    tabIndex="2"
                                />
                                <label htmlFor="apellido_paterno">APELLIDO PATERNO</label>
                                {
                                    propForm.errors?.apellido_paterno && <div
                                        className="invalid-feedback-custom">{propForm.errors?.apellido_paterno.message}</div>
                                }
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="lastNameCheck"
                                    onClick={()=>toggleName('apellido_paterno')} checked={controlName.lastName}
                                           disabled={controlName.secondlastName}
                                           tabIndex="11"
                                    />
                                        <label className="form-check-label" htmlFor="lastNameCheck">SIN APELLIDO PATERNO</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("apellido_materno", {
                                        minLength: {
                                            value: 1,
                                            message: 'El campo Apellido Materno como mínimo debe de tener al menos 1 carácter.'
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: 'El campo Apellido Materno como máximo debe de tener no mas de 30 caracteres.'
                                        },
                                        validate: (value) => validarNombreApellido("Apellido Materno", value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.apellido_paterno ? 'invalid-input' : ''}`}
                                    id="apellido_materno"
                                    name="apellido_materno"
                                    placeholder="Ingresa el apellido materno"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("apellido_materno", upperCaseValue);
                                        propForm.trigger('apellido_materno');
                                        // Aquí se actualiza la lógica para habilitar/deshabilitar el input
                                        if(upperCaseValue.trim() === "") {
                                            setControlName({
                                                lastName: true, // Se inhabilita si hay algún valor en el input
                                                secondlastName: upperCaseValue.length > 0, // Esto puede ser otra lógica o condición
                                            });
                                        }

                                    }}
                                    disabled={propForm.showEdit || controlName.secondlastName }
                                    autoComplete="off"
                                    tabIndex="3"
                                />
                                <label htmlFor="apellido_materno">APELLIDO MATERNO</label>
                                {
                                    propForm.errors?.apellido_materno && <div
                                        className="invalid-feedback-custom">{propForm.errors?.apellido_materno.message}</div>
                                }
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="secondLastNameCheck"
                                           onClick={()=>toggleName('apellido_materno')} checked={controlName.secondlastName}
                                        disabled={controlName.lastName}
                                           autoComplete="off"
                                           tabIndex="12"
                                    />
                                    <label className="form-check-label" htmlFor="secondLastNameCheck">SIN APELLIDO MATERNO</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("fecha_nacimiento", {
                                        validate: (fecha) => validaFechas(fecha)
                                    })}
                                    type="date"
                                    className={`form-control ${!!propForm.errors?.fecha_nacimiento ? 'invalid-input' : ''}`}
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    placeholder="Ingresa la fecha de nacimiento"
                                    disabled={propForm.showEdit}
                                    autoComplete="off"
                                    tabIndex="4"
                                    min="1900-01-01"
                                    max={`${getElementosFecha().year}-12-31`}
                                    required
                                />
                                <label htmlFor="fecha_nacimiento">FECHA NACIMIENTO</label>
                                {
                                    propForm.errors?.fecha_nacimiento && <div
                                        className="invalid-feedback-custom">{propForm.errors?.fecha_nacimiento.message}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("tipo_identificacion", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos un tipo de identificación.'
                                        },
                                        validate: value => {
                                            const isValid = value !== "";
                                            setTipoIdentificacionError(!isValid);
                                            return isValid || 'Debes seleccionar un tipo de identificación válido.';
                                        }
                                    })}
                                    className={`form-select ${tipoIdentificacionError ? 'invalid-input' : ''}`}
                                    id="tipo_identificacion"
                                    name="tipo_identificacion"
                                    aria-label="Tipo Identificación"
                                    disabled={propForm.showEdit}
                                    tabIndex="5"
                                >
                                    <option value="">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        catalogo[0]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="tipo_identificacion">TIPO IDENTIFICACIÓN</label>
                                {
                                    tipoIdentificacionError  && <div
                                        className="invalid-feedback-custom">Debes seleccionar un tipo de identificación válido.</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("numero_identificacion", {
                                        required: {
                                            value: true,
                                            message: `El campo Número ${propForm.watch("tipo_identificacion") === '1' || propForm.watch("tipo_identificacion") === '' ? 'Identificación': 'Pasaporte'} no puede ser vacio.`
                                        },
                                        maxLength: {
                                            value: propForm.watch("tipo_identificacion") === '1' ? 25:15,
                                            message: `El campo Número ${propForm.watch("tipo_identificacion") === '1' || propForm.watch("tipo_identificacion") === '' ? 'Identificación': 'Pasaporte'} como máximo debe de tener no mas de ${propForm.watch("tipo_identificacion") === '1' ? 25:15} caracteres.`
                                        },
                                        validate: (value) => validarAlfaNumerico(`Número de ${propForm.watch("tipo_identificacion") === '1' || propForm.watch("tipo_identificacion") === '' ? 'Identificación': 'Pasaporte'}`, value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.numero_identificacion ? 'invalid-input' : ''}`}
                                    id="numero_identificacion"
                                    name="numero_identificacion"
                                    placeholder={`Número ${propForm.watch("tipo_identificacion") === '1' || propForm.watch("tipo_identificacion") === '' ? 'IDENTIFICACIÓN': 'PASAPORTE'}`}
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("numero_identificacion", upperCaseValue);
                                        propForm.trigger('numero_identificacion');
                                    }}
                                    disabled={propForm.showEdit}
                                    autoComplete="off"
                                    tabIndex="6"
                                />
                                <label htmlFor="numero_identificacion">NÚMERO {propForm.watch("tipo_identificacion") === '1' || propForm.watch("tipo_identificacion") === '' ? 'IDENTIFICACIÓN': 'PASAPORTE'}</label>
                                {
                                    propForm.errors?.numero_identificacion && <div
                                        className="invalid-feedback-custom">{propForm.errors?.numero_identificacion.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("correo_electronico", {
                                        validate: (value) => validarCorreoElectronico(value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.correo_electronico ? 'invalid-input' : ''}`}
                                    id="correo_electronico"
                                    name="correo_electronico"
                                    placeholder="Correo Electrónico"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("correo_electronico", upperCaseValue);
                                        propForm.trigger('correo_electronico');
                                    }}
                                    disabled={propForm.showEdit}
                                    autoComplete="off"
                                    tabIndex="7"
                                />
                                <label htmlFor="correo_electronico">CORREO ELECTRÓNICO</label>
                                {
                                    propForm.errors?.correo_electronico && <div
                                        className="invalid-feedback-custom">{propForm.errors?.correo_electronico.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex">
                                <button
                                    type="button"
                                    className="m-2 btn btn-primary d-grid gap-2"
                                    onClick={onSubmitValidaCliente}
                                    disabled={propForm.showEdit}
                                    tabIndex="8"
                                >
                                  <span className="me-2">
                                      <strong>SIGUIENTE</strong>
                                    <span
                                        className="bi bi-arrow-right-circle-fill ms-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                  </span>
                                </button>
                                {propForm.showEdit && (
                                    <button
                                        type="button"
                                        className={`m-2 btn btn-warning ${!propForm.showEdit ? 'disabled' : ''}`}
                                        onClick={() => {
                                            propForm.setShowEdit(!propForm.showEdit);
                                            propForm.setComplementarios(false);
                                            propForm.setMessageActive(false);
                                            setShowCliente(false)
                                        }}
                                        disabled={!propForm.showEdit}
                                        tabIndex="9"
                                    >
                                      <span className="d-flex align-items-center text-white">
                                        <span className="bi bi-pencil-fill me-2" role="status" aria-hidden="true"></span>
                                        <strong>EDITAR</strong>
                                      </span>
                                    </button>

                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </CardLayout>

            {
                propForm.messageActive &&
                <ClienteCoincidenciaComponent
                    showAddCliente
                    dataClientes={propForm.dataClientes}
                    setDataClientes={propForm.setDataClientes}
                    addCliente={nuevoCliente}
                    setMessageActive={propForm.setMessageActive}
                    setShowCliente={setShowCliente}
                />
            }
            {
                showCliente && <DatosClientes operacion={operacion} cliente={propForm.dataClientes.result_set[0] || {}}/>
            }
            <Overlay showOverlay={showOverlay}/>
        </>
    );
});
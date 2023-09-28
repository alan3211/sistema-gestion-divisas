import {ClienteCoincidenciaComponent} from "../busquedaClientes";
import {CardLayout} from "../../commons";
import {memo, useContext, useState} from "react";
import {AltaClienteContext} from "../../../context/AltaCliente/AltaClienteContext";
import {validaCliente} from "../../../services";
import {encryptRequest, validaFechas, validarAlfaNumerico, validarNombreApellido} from "../../../utils";
import {useCatalogo} from "../../../hook/useCatalogo";
import {toast} from "react-toastify";
import {ModalAlerts} from "../../commons/modals";
import {Overlay} from "../../commons/toast/Overlay";

export const AltaClienteFormComponent = memo(() => {

    const {propForm} = useContext(AltaClienteContext);
    const catalogo = useCatalogo([2]);
    const [showOverlay, setShowOverlay] = useState(false);

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

    return (
        <>
            <CardLayout title="Alta de Usuarios" icon="bx bxs-user-plus p-1">
                <form className="g-3" onSubmit={onSubmitValidaCliente} noValidate>
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
                                    }}
                                    disabled={propForm.showEdit}
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
                                            value: 2,
                                            message: 'El campo Apellido Paterno como mínimo debe de tener al menos 2 caracteres.'
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
                                    }}
                                    disabled={propForm.showEdit}
                                />
                                <label htmlFor="apellido_paterno">APELLIDO PATERNO</label>
                                {
                                    propForm.errors?.apellido_paterno && <div
                                        className="invalid-feedback-custom">{propForm.errors?.apellido_paterno.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("apellido_materno", {
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
                                    }}
                                    disabled={propForm.showEdit}
                                />
                                <label htmlFor="apellido_materno">APELLIDO MATERNO</label>
                                {
                                    propForm.errors?.apellido_materno && <div
                                        className="invalid-feedback-custom">{propForm.errors?.apellido_materno.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("fecha_nacimiento", {
                                        required: {
                                            value: true,
                                            message: 'El campo Fecha Nacimiento no puede ser vacio.'
                                        },
                                        validate: validaFechas
                                    })}
                                    type="date"
                                    className={`form-control ${!!propForm.errors?.fecha_nacimiento ? 'invalid-input' : ''}`}
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    placeholder="Ingresa la fecha de nacimiento"
                                    disabled={propForm.showEdit}
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
                                            return value !== "0" || 'Debes seleccionar un tipo de identificación válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.tipo_identificacion ? 'invalid-input' : ''}`}
                                    id="tipo_identificacion"
                                    name="tipo_identificacion"
                                    aria-label="Tipo Identificación"
                                    disabled={propForm.showEdit}
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
                                <label htmlFor="tipo_identificacion">TIPO IDENTIFICACIÓN</label>
                                {
                                    propForm.errors?.tipo_identificacion && <div
                                        className="invalid-feedback-custom">{propForm.errors?.tipo_identificacion.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("numero_identificacion", {
                                        required: {
                                            value: true,
                                            message: 'El campo Número Identificación no puede ser vacio.'
                                        },
                                        validate: (value) => validarAlfaNumerico("Número de Identificación", value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.numero_identificacion ? 'invalid-input' : ''}`}
                                    id="numero_identificacion"
                                    name="numero_identificacion"
                                    placeholder="Número Identificación"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("numero_identificacion", upperCaseValue);
                                    }}
                                    disabled={propForm.showEdit}
                                />
                                <label htmlFor="numero_identificacion">NÚMERO IDENTIFICACIÓN</label>
                                {
                                    propForm.errors?.numero_identificacion && <div
                                        className="invalid-feedback-custom">{propForm.errors?.numero_identificacion.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex">
                                <button
                                    type="submit"
                                    className="m-2 btn btn-primary d-grid gap-2"
                                    disabled={propForm.showEdit}
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
                                        }}
                                        disabled={!propForm.showEdit}
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
                </form>
            </CardLayout>

            {
                propForm.messageActive &&
                <ClienteCoincidenciaComponent
                    showAddCliente
                    dataClientes={propForm.dataClientes}
                    setDataClientes={propForm.setDataClientes}
                    addCliente={nuevoCliente}
                />
            }

            <Overlay showOverlay={showOverlay}/>

        </>
    );
});
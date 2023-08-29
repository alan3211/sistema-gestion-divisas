import {ClienteCoincidenciaComponent} from "../busquedaClientes";
import {CardLayout} from "../../commons";
import {memo, useContext} from "react";
import {AltaClienteContext} from "../../../context/AltaCliente/AltaClienteContext";
import {validaCliente} from "../../../services";
import {encryptRequest, validaFechas, validarAlfaNumerico, validarNombreApellido} from "../../../utils";
import {useCatalogo} from "../../../hook/useCatalogo";
import {toast} from "react-toastify";

export const AltaClienteFormComponent = memo(() => {

    const {propForm} = useContext(AltaClienteContext);
    const catalogo = useCatalogo([2]);

    const nuevoCliente = () => {
        propForm.setComplementarios(true);
        propForm.setMessageActive(false);
    }

    const onSubmitValidaCliente = propForm.handleSubmit(async(data) => {

        const encryptedBase64 = encryptRequest(data);

        const response = await validaCliente(encryptedBase64);
        console.log(response);

        if(response) {
            if (response.length !== 0) {
                //Encontro a un cliente similar
                propForm.setMessageActive(true);
                propForm.setDataClientes(response);
                const mensaje = 'El cliente que intenta dar de alta ya se encuentra en la base de datos. A continuación, se muestran los siguientes clientes con coincidencias.';
                toast.info(mensaje, {
                    position: "top-center",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "light",
                });
            } else {
                //No encontro a un cliente
                propForm.setMessageActive(false);
                propForm.setDataClientes([]);
                propForm.setComplementarios(true);
            }
        }else{
            //No encontro a un cliente
            propForm.setMessageActive(false);
            propForm.setDataClientes([]);
            propForm.setComplementarios(true);
        }
    });

    return (
        <>
            <CardLayout title="Alta de Clientes" icon="bx bxs-user-plus p-1">
                <form className="row g-3" onSubmit={onSubmitValidaCliente} noValidate>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                {...propForm.register("nombre",{
                                    required:{
                                        value:true,
                                        message:'El campo Nombre no puede ser vacio.'
                                    },
                                    minLength:{
                                        value:2,
                                        message:'El campo Nombre como mínimo debe de tener al menos 2 caracteres.'
                                    },
                                    maxLength:{
                                        value:30,
                                        message:'El campo Nombre como máximo debe de tener no mas de 30 caracteres.'
                                    },
                                    validate: (value) => validarNombreApellido("Nombre",value)
                                })}
                                type="text"
                                className={`form-control ${!!propForm.errors?.nombre ? 'invalid-input':''}`}
                                id="nombre"
                                name="nombre"
                                placeholder="Ingresa el nombre del cliente"
                            />
                            <label htmlFor="nombre">Nombre(s)</label>
                            {
                                propForm.errors?.nombre && <div className="invalid-feedback-custom">{propForm.errors?.nombre.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                {...propForm.register("apellido_paterno",{
                                    required:{
                                        value:true,
                                        message:'El campo Apellido Paterno no puede ser vacio.'
                                    },
                                    minLength:{
                                        value:2,
                                        message:'El campo Apellido Paterno como mínimo debe de tener al menos 2 caracteres.'
                                    },
                                    maxLength:{
                                        value:30,
                                        message:'El campo Apellido Paterno como máximo debe de tener no mas de 30 caracteres.'
                                    },
                                    validate: (value) => validarNombreApellido("Apellido Paterno",value)
                                })}
                                type="text"
                                className={`form-control ${!!propForm.errors?.apellido_paterno ? 'invalid-input':''}`}
                                id="apellido_paterno"
                                name="apellido_paterno"
                                placeholder="Ingresa el apellido paterno"
                            />
                            <label htmlFor="apellido_paterno">Apellido Paterno</label>
                            {
                                propForm.errors?.apellido_paterno && <div className="invalid-feedback-custom">{propForm.errors?.apellido_paterno.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                {...propForm.register("apellido_materno",{
                                    validate: (value) => validarNombreApellido("Apellido Materno",value)
                                })}
                                type="text"
                                className={`form-control ${!!propForm.errors?.apellido_paterno ? 'invalid-input':''}`}
                                id="apellido_materno"
                                name="apellido_materno"
                                placeholder="Ingresa el apellido materno"
                            />
                            <label htmlFor="apellido_materno">Apellido Materno</label>
                            {
                                propForm.errors?.apellido_materno && <div className="invalid-feedback-custom">{propForm.errors?.apellido_materno.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                {...propForm.register("fecha_nacimiento",{
                                    required:{
                                        value:true,
                                        message:'El campo Fecha Nacimiento no puede ser vacio.'
                                    },
                                    validate: validaFechas
                                })}
                                type="date"
                                className={`form-control ${!!propForm.errors?.fecha_nacimiento ? 'invalid-input':''}`}
                                id="fecha_nacimiento"
                                name="fecha_nacimiento"
                                placeholder="Ingresa el apellido paterno"
                            />
                            <label htmlFor="fecha_nacimiento">Fecha Nacimiento</label>
                            {
                                propForm.errors?.fecha_nacimiento && <div className="invalid-feedback-custom">{propForm.errors?.fecha_nacimiento.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating mb-3">
                            <select
                                {...propForm.register("tipo_identificacion",{
                                    required:{
                                        value:true,
                                        message:'Debes de seleccionar al menos un tipo de identificación.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar un tipo de identificación válido.';
                                    }
                                })}
                                className={`form-select ${!!propForm.errors?.tipo_identificacion ? 'invalid-input':''}`}
                                id="tipo_identificacion"
                                name="tipo_identificacion"
                                aria-label="Tipo Identificación"
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
                            <label htmlFor="tipo_identificacion">Tipo Identificación</label>
                            {
                                propForm.errors?.tipo_identificacion && <div className="invalid-feedback-custom">{propForm.errors?.tipo_identificacion.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                {...propForm.register("numero_identificacion",{
                                    required:{
                                        value:true,
                                        message:'El campo Número Identificación no puede ser vacio.'
                                    },
                                    validate: (value) => validarAlfaNumerico("Número de Identificación",value)
                                })}
                                type="text"
                                className={`form-control ${!!propForm.errors?.numero_identificacion ? 'invalid-input':''}`}
                                id="numero_identificacion"
                                name="numero_identificacion"
                                placeholder="Número Identificación"
                            />
                            <label htmlFor="numero_identificacion">Número de Identificación</label>
                            {
                                propForm.errors?.numero_identificacion && <div className="invalid-feedback-custom">{propForm.errors?.numero_identificacion.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-2">
                            <button
                                type="submit"
                                className="m-2 btn btn-primary d-grid gap-2"
                                >
                                <span className="me-2">
                                    Siguiente
                                      <span
                                          className="bi bi-arrow-right-circle-fill ms-2"
                                          role="status"
                                          aria-hidden="true">
                                      </span>
                                </span>
                            </button>
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
                    tools={{selecciona: true}}
                />
            }
        </>
    );
});
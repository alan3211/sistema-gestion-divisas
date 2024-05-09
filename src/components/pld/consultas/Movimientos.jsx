import {encryptRequest, validaFechas, validarNombreApellido, year} from "../../../utils";
import {useForm} from "react-hook-form";
import {CardLayout, Layout} from "../../commons";
import {useState} from "react";
import {consultaMovimientos} from "../../../services/pld-services";
import {TableComponent} from "../../commons/tables";

export const Movimientos = () => {

    const moduleName= {
        title: 'PLD',
        module: "Consulta Movimientos",
        icon: "bi bi-list me-2"
    };

    const {register,handleSubmit,watch,
    reset,formState:{errors},setValue,trigger} = useForm();

    const [dataMovimientos,setDataMovimientos] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    const [controlName, setControlName] = useState({
        lastName:false,
        secondlastName:false,
    });

    const optionsMov = {
        showMostrar:true,
        excel:true,
        tableName:'Consulta Movimientos del Usuario',
        buscar: true,
        paginacion: true,
        filters:[{columna:"Monto Opera",filter:'currency'},{columna:"Tipo Cambio",filter:'currency'}],
    }

    // Busca los movimientos de los usuarios
    const onHandleMovimientos = handleSubmit(async (data) => {

        setIsLoading(false);

        const valores = {
            nombre: data.nombre,
            apellido_paterno: data.apellido_paterno,
            apellido_materno: data.apellido_materno,
            fecha_nacimiento: data.fecha_nacimiento
        }

        const encryptedData = encryptRequest(valores);

        const response = await consultaMovimientos(encryptedData);

        if( response.total_rows > 0 ){
            setIsLoading(false);
            setDataMovimientos(response);
            reset();
        }else{
            setIsLoading(false);
            setDataMovimientos([]);
        }
    });

    const toggleName = (value) => {
        setControlName((prevControlName) => {
            if (value === 'apellido_paterno') {
                if (prevControlName.lastName) {
                    setValue("apellido_paterno", "");
                } else {
                    setValue("apellido_paterno", "SIN APELLIDO PATERNO");
                }
                return {
                    ...prevControlName,
                    lastName: !prevControlName.lastName,
                };
            } else {
                if (prevControlName.secondlastName) {
                    setValue("apellido_materno", "");
                } else {
                    setValue("apellido_materno", "SIN APELLIDO MATERNO");
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
            <Layout moduleName={moduleName}>
            <CardLayout title="Consulta Movimientos" icon="bi bi-list p-1">
                <div className="g-3">
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...register("nombre", {
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
                                    className={`form-control ${!!errors?.nombre ? 'invalid-input' : ''}`}
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Ingresa el nombre del usuario"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        setValue("nombre", upperCaseValue);
                                        trigger('nombre');
                                    }}
                                    autoComplete="off"
                                    tabIndex="1"
                                />
                                <label htmlFor="nombre">NOMBRES(S)</label>
                                {
                                    errors?.nombre &&
                                    <div className="invalid-feedback-custom">{errors?.nombre.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...register("apellido_paterno", {
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
                                    className={`form-control ${!!errors?.apellido_paterno ? 'invalid-input' : ''}`}
                                    id="apellido_paterno"
                                    name="apellido_paterno"
                                    placeholder="Ingresa el apellido paterno"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        setValue("apellido_paterno", upperCaseValue);
                                        trigger('apellido_paterno');
                                        // Aquí se actualiza la lógica para habilitar/deshabilitar el input
                                        if(upperCaseValue.trim() === "") {
                                            setControlName({
                                                lastName:upperCaseValue.length > 0, // Se inhabilita si hay algún valor en el input
                                                secondlastName: true, // Esto puede ser otra lógica o condición
                                            });
                                        }

                                    }}
                                    disabled={controlName.lastName}
                                    autoComplete="off"
                                    tabIndex="2"
                                />
                                <label htmlFor="apellido_paterno">APELLIDO PATERNO</label>
                                {
                                    errors?.apellido_paterno && <div
                                        className="invalid-feedback-custom">{errors?.apellido_paterno.message}</div>
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
                                    {...register("apellido_materno", {
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
                                    className={`form-control ${!!errors?.apellido_paterno ? 'invalid-input' : ''}`}
                                    id="apellido_materno"
                                    name="apellido_materno"
                                    placeholder="Ingresa el apellido materno"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        setValue("apellido_materno", upperCaseValue);
                                        trigger('apellido_materno');
                                        // Aquí se actualiza la lógica para habilitar/deshabilitar el input
                                        if(upperCaseValue.trim() === "") {
                                            setControlName({
                                                lastName: true, // Se inhabilita si hay algún valor en el input
                                                secondlastName: upperCaseValue.length > 0, // Esto puede ser otra lógica o condición
                                            });
                                        }

                                    }}
                                    disabled={controlName.secondlastName }
                                    autoComplete="off"
                                    tabIndex="3"
                                />
                                <label htmlFor="apellido_materno">APELLIDO MATERNO</label>
                                {
                                    errors?.apellido_materno && <div
                                        className="invalid-feedback-custom">{errors?.apellido_materno.message}</div>
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
                                    {...register("fecha_nacimiento", {
                                        validate: (fecha) => validaFechas(fecha)
                                    })}
                                    type="date"
                                    className={`form-control ${!!errors?.fecha_nacimiento ? 'invalid-input' : ''}`}
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    placeholder="Ingresa la fecha de nacimiento"
                                    autoComplete="off"
                                    tabIndex="4"
                                    min="1900-01-01"
                                    max={`${year}-12-31`}
                                    required
                                />
                                <label htmlFor="fecha_nacimiento">FECHA NACIMIENTO</label>
                                {
                                    errors?.fecha_nacimiento && <div
                                        className="invalid-feedback-custom">{errors?.fecha_nacimiento.message}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="d-flex justify-content-center">
                            <button
                                type="button"
                                className="m-2 btn btn-primary d-grid gap-2"
                                onClick={onHandleMovimientos}
                                tabIndex="8"
                            >
                                  <span className="me-2">
                                      <strong>BUSCAR</strong>
                                    <span
                                        className="bi bi-search ms-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                  </span>
                            </button>
                        </div>
                    </div>
            </div>
                {
                    !isLoading && <TableComponent data={dataMovimientos} options={optionsMov}/>
                }
        </CardLayout>
            </Layout>
        </>
    );
}
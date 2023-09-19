import {useForm} from "react-hook-form";
import {encryptRequest, validarAlfaNumerico, validarMayus, validarNumeros, validarNumeroTelefono} from "../../../utils";
import {guardaCatalogo} from "../../../services";
import {toast} from "react-toastify";
import {useCatalogo} from "../../../hook/useCatalogo";
import {CardLayout} from "../../commons";

export const Sucursales = () => {

    const catalogo = useCatalogo([1,2])

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();

    const onSubmitCatalogo = handleSubmit(async (data) => {
        console.log("CATALOGO: ", data);
        data.tipo = 'moneda';
        data.descripcion = data.descripcion.toUpperCase();
        const encryptedData = encryptRequest(data);

        const response = await guardaCatalogo(encryptedData);

        if (response !== '') {
            toast.success(response, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
            reset();
        }
    });


    return (
        <>
            <form className="row g-3" onSubmit={onSubmitCatalogo} noValidate>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                {...register("numero_sucursal",{
                                    required:{
                                        value:true,
                                        message:'El campo Número Sucursal no puede ser vacio.'
                                    },
                                    validate: (value) => validarNumeros("Número Sucursal",value)
                                })}
                                type="text"
                                className={`form-control ${!!errors?.numero_sucursal ? 'invalid-input':''}`}
                                id="numero_sucursal"
                                name="numero_sucursal"
                                placeholder="Ingresa el número de la sucursal"
                            />
                            <label htmlFor="numero_sucursal">Número de Sucursal</label>
                            {
                                errors?.numero_sucursal && <div className="invalid-feedback-custom">{errors?.numero_sucursal.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                {...register("nombre_sucursal",{
                                    required:{
                                        value:true,
                                        message:'El campo Nombre Sucursal no puede ser vacio.'
                                    },
                                    validate: (value) => validarAlfaNumerico("Nombre Sucursal",value)
                                })}
                                type="text"
                                className={`form-control ${!!errors?.nombre_sucursal ? 'invalid-input':''}`}
                                id="nombre_sucursal"
                                name="nombre_sucursal"
                                placeholder="Ingresa el nombre de sucursal"
                            />
                            <label htmlFor="nombre_sucursal">Nombre Sucursal</label>
                            {
                                errors?.nombre_sucursal && <div className="invalid-feedback-custom">{errors?.nombre_sucursal.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                {...register("direccion",{
                                    required:{
                                        value:true,
                                        message:'El campo Direccion no puede ser vacio.'
                                    },
                                    validate: (value) => validarAlfaNumerico("Direccion",value)
                                })}
                                type="text"
                                className={`form-control ${!!errors?.direccion ? 'invalid-input':''}`}
                                id="direccion"
                                name="direccion"
                                placeholder="Ingresa la direccion de la sucursal"
                            />
                            <label htmlFor="direccion">Dirección</label>
                            {
                                errors?.direccion && <div className="invalid-feedback-custom">{errors?.direccion.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                {...register("telefono",{
                                    required:{
                                        value:true,
                                        message:'El campo Teléfono no puede ser vacio.'
                                    },
                                    validate: (value) => validarNumeroTelefono("Teléfono",value)
                                })}
                                type="text"
                                className={`form-control ${!!errors?.telefono ? 'invalid-input':''}`}
                                id="telefono"
                                name="telefono"
                                placeholder="Ingresa el teléfono"
                            />
                            <label htmlFor="telefono">Teléfono</label>
                            {
                                errors?.telefono && <div className="invalid-feedback-custom">{errors?.telefono.message}</div>
                            }
                        </div>
                    </div>
                </div>
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
                                aria-label="Genero"
                            >
                                <option value="0">Selecciona una opción</option>
                                {
                                    catalogo[9]?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="genero">Genero</label>
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
                            <label htmlFor="id_actividad_economica">Actividad Económica</label>
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
                            <label htmlFor="nacionalidad">Nacionalidad</label>
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
                                <option value="0">Selecciona una opción</option>
                                {
                                    catalogo[2]?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="pais_nacimiento">País Nacimiento</label>
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
                                    <option value="0">Selecciona una opción</option>
                                    {
                                        catalogo[3]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="estado">Estado</label>
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
                                    <option value="0">Selecciona una opción</option>
                                    {
                                        municipios?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="municipio">Municipio</label>
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
                                    <option value="0">Selecciona una opción</option>
                                    {
                                        colonias?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="colonia">Colonia</label>
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
                                    <option value="0">Selecciona una opción</option>
                                    {
                                        codigoPostal?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="codigo_postal">Código Postal</label>
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
                                        required:{
                                            value:true,
                                            message:'El campo Telefono no puede ser vacio.'
                                        },
                                        validate: (value) => validarNumeroTelefono("Telefono",value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.telefono ? 'invalid-input':''}`}
                                    id="telefono"
                                    name="telefono"
                                    placeholder="Ingresa el teléfono"
                                />
                                <label htmlFor="telefono">Teléfono</label>
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
                                />
                                <label htmlFor="calle">Calle</label>
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
                                />
                                <label htmlFor="numero_exterior">Número Exterior</label>
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
                                />
                                <label htmlFor="numero_interior">Número Interior</label>
                                {
                                    propForm.errors?.numero_interior && <div className="invalid-feedback-custom">{propForm.errors?.numero_interior.message}</div>
                                }
                            </div>
                        </div>
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
                                        Finalizar
                                    </span>
                                </span>
                            </button>
                        </div>
                    </div>
            </form>
        </>
    );
}
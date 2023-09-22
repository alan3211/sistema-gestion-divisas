import {useForm} from "react-hook-form";
import {encryptRequest, validarAlfaNumerico, validarNumeros, validarNumeroTelefono} from "../../../utils";
import {getLocalidad, guardaCatalogo} from "../../../services";
import {toast} from "react-toastify";
import {useCatalogo} from "../../../hook/useCatalogo";
import {useEffect, useState} from "react";

export const Sucursales = () => {

    const catalogo = useCatalogo([1,2,16,6,22])
    const [municipios,setMunicipios] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: {errors},
    } = useForm();

    const onSubmitCatalogo = handleSubmit(async (data) => {
        console.log("CATALOGO: ", data);
        data.tipo = 'sucursal';
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

    useEffect(() => {
        const getFetch = async() =>{
            const values = {
                opcion:1,
                estado: watch("estado"),
                municipio:'',
                colonia:''
            }
            console.log(values)
            const encryptedData =  encryptRequest(values);
            const mun = await getLocalidad(encryptedData);
            setMunicipios(mun)
        }
        if(watch("estado") !== '0') getFetch();
    }, [watch("estado")]);


    return (
            <>
                <hr/>
                <form className="row g-3 mb-3" onSubmit={onSubmitCatalogo} noValidate>
                    <div className="row">
                        <div className="col-md-3 mt-3">
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
                        <div className="col-md-3 mt-3">
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
                        <div className="col-md-3 mt-3">
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
                        <div className="col-md-3 mt-3">
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
                        <div className="col-md-3 mt-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...register("region", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos una región.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una región válida.';
                                        }
                                    })}
                                    className={`form-select ${!!errors?.region ? 'invalid-input' : ''}`}
                                    id="region"
                                    name="region"
                                    aria-label="Región"
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
                                <label htmlFor="region">Región</label>
                                {
                                    errors?.region &&
                                    <div className="invalid-feedback-custom">{errors?.region.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3 mt-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...register("estado",{
                                        required:{
                                            value:true,
                                            message:'Debes de seleccionar al menos un estado.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un estado válido.';
                                        }
                                    })}
                                    className={`form-select ${!!errors?.estado ? 'invalid-input':''}`}
                                    id="estado"
                                    name="estado"
                                    aria-label="Estado"
                                >
                                    <option value="0">Selecciona una opción</option>
                                    {
                                        catalogo[3]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.descripcion}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="estado">Estado</label>
                                {
                                    errors?.estado && <div className="invalid-feedback-custom">{errors?.estado.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3 mt-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...register("municipio",{
                                        required:{
                                            value:true,
                                            message:'Debes de seleccionar al menos un municipio.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un municipio válido.';
                                        }
                                    })}
                                    className={`form-select ${!!errors?.municipio ? 'invalid-input':''}`}
                                    id="municipio"
                                    name="municipio"
                                    aria-label="Municipio"
                                    disabled={(watch('municipio') === '0') && municipios.length === 0}
                                >
                                    <option value="0">Selecciona una opción</option>
                                    {
                                        municipios?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.descripcion}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="municipio">Municipio</label>
                                {
                                    errors?.municipio && <div className="invalid-feedback-custom">{errors?.municipio.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3 mt-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...register("tipo_establecimiento",{
                                        required:{
                                            value:true,
                                            message:'Debes de seleccionar al menos un tipo.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un tipo válido.';
                                        }
                                    })}
                                    className={`form-select ${!!errors?.tipo_establecimiento ? 'invalid-input':''}`}
                                    id="tipo_establecimiento"
                                    name="tipo_establecimiento"
                                    aria-label="Tipo"
                                >
                                    <option value="0">Selecciona una opción</option>
                                    {
                                        catalogo[4]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.descripcion}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="tipo_establecimiento">Tipo</label>
                                {
                                    errors?.tipo_establecimiento && <div className="invalid-feedback-custom">{errors?.tipo_establecimiento.message}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mt-3">
                            <div className="form-floating mb-3">
                                <input
                                    {...register("fecha_apertura",{
                                        required:{
                                            value:true,
                                            message:'El campo Fecha Apertura no puede ser vacio.'
                                        },
                                    })}
                                    type="date"
                                    className={`form-control ${!!errors?.fecha_apertura ? 'invalid-input':''}`}
                                    id="fecha_apertura"
                                    name="fecha_apertura"
                                    placeholder="Ingresa la fecha de apertura"
                                />
                                <label htmlFor="fecha_apertura">Fecha Apertura</label>
                                {
                                    errors?.fecha_apertura && <div className="invalid-feedback-custom">
                                    {errors?.fecha_apertura.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3 mt-3">
                            <div className="form-floating">
                                    <input
                                        {...register("limite_diario",{
                                            required:{
                                                value:true,
                                                message:'El campo Limite Diario no puede ser vacio.'
                                            },
                                            validate: (value) => validarNumeros("Limite Diario",value)
                                        })}
                                        type="text"
                                        className={`form-control ${!!errors?.limite_diario ? 'invalid-input':''}`}
                                        id="limite_diario"
                                        name="limite_diario"
                                        placeholder="Ingresa el limite diario"
                                    />
                                    <label htmlFor="limite_diario">Limite Diario</label>
                                    {
                                        errors?.limite_diario && <div className="invalid-feedback-custom">{errors?.limite_diario.message}</div>
                                    }
                                </div>
                        </div>
                        <div className="col-md-3 mt-3">
                            <div className="form-floating">
                                <input
                                    {...register("limite_mensual",{
                                        required:{
                                            value:true,
                                            message:'El campo Limite Mensual no puede ser vacio.'
                                        },
                                        validate: (value) => validarNumeros("Limite Mensua",value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!errors?.limite_mensual ? 'invalid-input':''}`}
                                    id="limite_mensual"
                                    name="limite_mensual"
                                    placeholder="Ingresa el limite mensual"
                                />
                                <label htmlFor="limite_mensual">Limite Mensual</label>
                                {
                                    errors?.limite_mensual && <div className="invalid-feedback-custom">{errors?.limite_mensual.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3 mt-3">
                            <div className="col-md-12 d-flex justify-content-center">
                                <button
                                    type="submit"
                                    className="m-2 btn btn-primary d-grid gap-2">
                                    <span
                                        className="bi bi-save me-2"
                                        role="status"
                                        aria-hidden="true">
                                        <span className="ms-2">
                                            Guardar
                                        </span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </>
    );
}
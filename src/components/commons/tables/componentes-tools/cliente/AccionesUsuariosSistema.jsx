import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../../../../utils";
import {ModalGenericTool} from "../../../modals";
import {ModalLoading} from "../../../modals/ModalLoading";
import {Modal} from "react-bootstrap";
import {useCatalogo} from "../../../../../hook";
import {accionesCaja} from "../../../../../services/tools-services";
import {toast} from "react-toastify";
import {accionesUsuario, accionesUsuarios} from "../../../../../services/administracion-services";
import {dataG} from "../../../../../App";

export const AccionesUsuariosSistema = ({item, index, refresh}) => {

    const catalogo = useCatalogo([21,27]);
    const [showModal, setShowModal] = useState(false);
    const [guarda, setGuarda] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors}, reset
        , watch,setValue
    } = useForm();
    const [optionBtn, setOptionBtn] = useState(1);


    useEffect(() => {
        if (item) {
            setValue("usuario", item.Usuario);
            setValue("nombre_usuario", item.Nombre);
            setValue("perfil", item.ID);
            setValue("password", item.Pass);
            setValue("sucursal", item.Sucursal);
        }
    }, [item, setValue]);

    /*Aqui se diferencia entre un boton de aceptar y otro de rechazar*/
    const onHandleOptions = (option) => {
        setOptionBtn(option);
        setShowModal(true);
    }

    const options = {
        showModal,
        closeModal: () => {setShowModal(false); reset()},
        title: (optionBtn === 1) ? 'Eliminar Usuario' : 'Editar Usuario',
        icon: (optionBtn === 1) ? 'bi bi-trash m-2' : 'bi bi-pencil m-2',
        subtitle: (optionBtn === 1) ? '¿Esta seguro de eliminar al usuario? Esta acción no se puede revertir.' : '',
    };

    const optionsLoad = {
        showModal: guarda,
        title: `${ optionBtn === 1 ? "Eliminado usuario":"Guardando cambios"} ...`,
    };

    // Metodo para eliminar al usuario
    const eliminarUsuario = handleSubmit(async() => {
        const valores = {
            opcion:1,
            usuario: item.Usuario,
            nombre_usuario:"",
            password:"",
            perfil:"",
            sucursal:"",
            usuario_accion: dataG.usuario,
            usuario_anterior: "",
        }
        const encryptedData = encryptRequest(valores);
        const response = await accionesUsuarios(encryptedData);

        if (response !== '') {
            toast.success(response, OPTIONS);
            setShowModal(false);
            refresh();
            reset();
            setGuarda(false);
        }

    });

    // Metodo para editar al usuario
    const actualizarUsuario = handleSubmit(async(data) => {
            const valores = {
                opcion:2,
                usuario: data.usuario,
                nombre_usuario:data.nombre_usuario,
                password:data.password,
                perfil:data.perfil,
                sucursal:data.sucursal,
                usuario_accion: dataG.usuario,
                usuario_anterior: item.Usuario,
            }
            const encryptedData = encryptRequest(valores);
            const response = await accionesUsuarios(encryptedData);

            if (response !== '') {
                toast.success(response, OPTIONS);
                setShowModal(false);
                refresh();
                reset();
                setGuarda(false);
            }
    });

    return (
        <td key={index} className="text-center">
            <button className="btn btn-danger me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar"
                    onClick={() => onHandleOptions(1)} disabled={item["Perfil"] === "Administrador"}>
                <i className="bi bi-trash"></i>
            </button>
            <button className="btn btn-warning" data-bs-toggle="tooltip" data-bs-placement="top" title="Actualizar"
                    onClick={() => onHandleOptions(2)}>
                <i className="bi bi-pencil"></i>
            </button>
            {
                showModal
                && (
                    <form>
                            {
                                optionBtn === 1 && (
                                    <Modal size={"sm"} centered show={options.showModal} backdrop="static" keyboard={false}>
                                        <Modal.Header>
                                            <Modal.Title>
                                                <h5 className="card-title">
                                                    <i className={options.icon}></i>
                                                    {options.title}
                                                </h5>
                                            </Modal.Title>
                                            {!options.waiting && <button type="button" className="btn-close" onClick={options.closeModal} aria-label="Close" style={{ fontSize: '48px' }} ></button>}
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p>{options.subtitle}</p>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="d-flex justify-content-center mt-2">
                                                        <button type="button" className={`btn btn-danger me-2`} onClick={()=> setShowModal(false)}>
                                                            <i className='bi bi-x-circle me-2'></i>
                                                            NO
                                                        </button>

                                                        <button type="button" className="btn btn-success"
                                                                onClick={eliminarUsuario}>
                                                            <i className="bi bi-check-circle me-2"></i>
                                                            SI,DE ACUERDO
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                )
                            }
                            {
                                optionBtn === 2 && (
                                    <Modal size={"lg"} centered show={options.showModal} backdrop="static" keyboard={false}>
                                        <Modal.Header>
                                            <Modal.Title>
                                                <h5 className="card-title">
                                                    <i className={options.icon}></i>
                                                    {options.title}
                                                </h5>
                                            </Modal.Title>
                                            {!options.waiting && <button type="button" className="btn-close" onClick={options.closeModal} aria-label="Close" style={{ fontSize: '48px' }} ></button>}
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <form className="container justify-content-center align-items-center mt-4" onSubmit={(e) => e.preventDefault()}>
                                                        <div
                                                            className="text-center mb-4"
                                                        >
                                                            <div className="col-md-4 mx-auto">
                                                                <div className="form-floating mb-3">
                                                                    <input
                                                                        {...register("usuario", {
                                                                            required: {
                                                                                value: true,
                                                                                message: 'El campo Usuario no puede ser vacio.'
                                                                            },
                                                                            minLength: {
                                                                                value: 2,
                                                                                message: 'El campo Usuario como mínimo debe de tener al menos 2 caracteres.'
                                                                            },
                                                                            maxLength: {
                                                                                value: 30,
                                                                                message: 'El campo Usuario como máximo debe de tener no mas de 30 caracteres.'
                                                                            },
                                                                            validate: (value) => validarAlfaNumerico("Usuario", value)
                                                                        })}
                                                                        type="text"
                                                                        className={`form-control ${!!errors?.usuario ? 'invalid-input' : ''}`}
                                                                        id="usuario"
                                                                        name="usuario"
                                                                        placeholder="Ingresa el usuario"
                                                                        autoComplete="off"
                                                                        onChange={(e) => {
                                                                            const upperCaseValue = e.target.value.toUpperCase();
                                                                            e.target.value = upperCaseValue;
                                                                            setValue("usuario", upperCaseValue);
                                                                        }}
                                                                    />
                                                                    <label htmlFor="usuario">USUARIO DE SISTEMA</label>
                                                                    {
                                                                        errors?.usuario && <div className="invalid-feedback-custom">{errors?.usuario.message}</div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4 mx-auto">
                                                                <div className="form-floating mb-3">
                                                                    <input
                                                                        {...register("nombre_usuario", {
                                                                            required: {
                                                                                value: true,
                                                                                message: 'El campo Nombre Usuario no puede ser vacio.'
                                                                            },
                                                                            minLength: {
                                                                                value: 2,
                                                                                message: 'El campo Nombre Usuario como mínimo debe de tener al menos 2 caracteres.'
                                                                            },
                                                                            maxLength: {
                                                                                value: 30,
                                                                                message: 'El campo Nombre Usuario como máximo debe de tener no mas de 30 caracteres.'
                                                                            },
                                                                            validate: (value) => validarAlfaNumerico("Nombre Usuario", value)
                                                                        })}
                                                                        type="text"
                                                                        className={`form-control ${!!errors?.nombre_usuario ? 'invalid-input' : ''}`}
                                                                        id="nombre_usuario"
                                                                        name="nombre_usuario"
                                                                        placeholder="Ingresa el nombre completo del usuario"
                                                                        autoComplete="off"
                                                                        onChange={(e) => {
                                                                            const upperCaseValue = e.target.value.toUpperCase();
                                                                            e.target.value = upperCaseValue;
                                                                            setValue("nombre_usuario", upperCaseValue);
                                                                        }}
                                                                    />
                                                                    <label htmlFor="nombre_usuario">NOMBRE DE USUARIO</label>
                                                                    {
                                                                        errors?.nombre_usuario &&
                                                                        <div className="invalid-feedback-custom">{errors?.nombre_usuario.message}</div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4 mx-auto">
                                                                <div className="form-floating mb-3">
                                                                    <input
                                                                        {...register("password", {
                                                                            required: {
                                                                                value: true,
                                                                                message: 'El campo contraseña no puede ser vacio.'
                                                                            },
                                                                            minLength: {
                                                                                value: 8,
                                                                                message: 'El campo contraseña como mínimo debe de tener al menos 8 caracteres.'
                                                                            },
                                                                            maxLength: {
                                                                                value: 8,
                                                                                message: 'El campo contraseña como máximo debe de tener 8 caracteres.'
                                                                            }
                                                                        })}
                                                                        type="password"
                                                                        className={`form-control ${!!errors.password ? 'invalid-input' : ''}`}
                                                                        id="password"
                                                                        name="password"
                                                                        placeholder="Ingresa la contraseña"
                                                                        autoComplete="off"
                                                                    />
                                                                    <label htmlFor="password">CONTRASEÑA</label>
                                                                    {
                                                                        errors.password && <div className="invalid-feedback-custom">{errors.password.message}</div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4 mx-auto">
                                                                <div className="form-floating mb-3">
                                                                    <select
                                                                        {...register("perfil",{
                                                                            required:{
                                                                                value:true,
                                                                                message:'Debes de seleccionar al menos un perfil.'
                                                                            }
                                                                        })}
                                                                        className={`form-select ${!!errors?.perfil ? 'invalid-input':''}`}
                                                                        id="perfil"
                                                                        name="perfil"
                                                                        aria-label="Perfil"
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
                                                                    <label htmlFor="perfil">PERFIL</label>
                                                                    {
                                                                        errors?.perfil && <div className="invalid-feedback-custom">{errors?.perfil.message}</div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            {
                                                                ![1,2,5,6].includes(parseInt(watch("perfil"))) && (  <div className="col-md-4 mx-auto">
                                                                    <div className="form-floating mb-3">
                                                                        <select
                                                                            {...register("sucursal",{
                                                                                required:{
                                                                                    value:true,
                                                                                    message:'Debes de seleccionar al menos una sucursal.'
                                                                                }
                                                                            })}
                                                                            className={`form-select ${!!errors?.perfil ? 'invalid-input':''}`}
                                                                            id="sucursal"
                                                                            name="sucursal"
                                                                            aria-label="Sucursal"
                                                                        >
                                                                            <option value="">SELECCIONA UNA OPCIÓN</option>
                                                                            {
                                                                                catalogo[1]?.map((ele) => (
                                                                                    <option key={ele.id + '-' + ele.descripcion}
                                                                                            value={ele.id}>
                                                                                        {ele.descripcion}
                                                                                    </option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                        <label htmlFor="sucursal">SUCURSAL</label>
                                                                        {
                                                                            errors?.sucursal && <div className="invalid-feedback-custom">{errors?.sucursal.message}</div>
                                                                        }
                                                                    </div>
                                                                </div>)
                                                            }
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <div className="d-flex justify-content-center mt-2">
                                                                        <button type="button" className={`btn btn-danger me-2`} onClick={()=> setShowModal(false)}>
                                                                            <i className='bi bi-x-circle me-2'></i>
                                                                            CANCELAR
                                                                        </button>

                                                                        <button type="button" className="btn btn-success"
                                                                                onClick={actualizarUsuario}>
                                                                            <i className="bi bi-check-circle me-2"></i>
                                                                            GUARDAR
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                )
                            }
                            {guarda && <ModalLoading options={optionsLoad}/>}
                        </form>
                )}
        </td>);
}
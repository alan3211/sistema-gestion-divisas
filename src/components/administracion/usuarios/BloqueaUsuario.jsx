import {useCatalogo} from "../../../hook/useCatalogo";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {dataG} from "../../../App";
import {encryptRequest, OPTIONS} from "../../../utils";
import {accionesUsuario} from "../../../services/administracion-services";
import {toast} from "react-toastify";
import {getUsuariosSistema} from "../../../services";

export const BloqueaUsuario = () => {
    const catalogo = useCatalogo([17]);
    const {
        register, handleSubmit,
        formState: {errors},
        reset,
        watch,
        setValue
    } = useForm();
    const [usuarios, setUsuarios] = useState([]);
    const [activo, setActivo] = useState(0);

    const asignarUsuario = handleSubmit(async (data) => {
        setActivo(0);
        data.tipo_operacion = 3;
        data.usuario_alta = dataG.usuario;
        data.sucursal = data.sucursal_origen;
        data.nombre_usuario = '';
        data.password = '';
        data.perfil = '';
        data.activo = activo;
        const encryptedData = encryptRequest(data);

        const response = await accionesUsuario(encryptedData);

        if (response !== '') {
            toast.success(response, OPTIONS);
            reset();
            setValue("sucursal_origen", "0");
            setUsuarios([])
        }


    });

    useEffect(() => {
        const getFetch = async () => {
            const values = {
                sucursal: watch("sucursal_origen"),
                usuario: dataG.usuario
            }
            const encryptedData = encryptRequest(values);
            const usuarios = await getUsuariosSistema(encryptedData);
            if (!usuarios.hasOwnProperty('resultSize') && usuarios.resultSize !== 0) {
                setUsuarios(usuarios);
            } else{
                setValue("sucursal_origen", "0");
                setUsuarios([])
            }
        }
        if (watch("sucursal_origen") !== '0') getFetch();
    }, [watch("sucursal_origen")]);

    return (
        <div className="container justify-content-center align-items-center mt-4">
            <div
                className="text-center mb-4"
            >
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <select
                            {...register("sucursal_origen", {
                                required: {
                                    value: true,
                                    message: 'Debes de seleccionar al menos una sucursal.'
                                },
                                validate: value => {
                                    return value !== "0" || 'Debes seleccionar una sucursal válida.';
                                }
                            })}
                            className={`form-select ${!!errors?.sucursal_origen ? 'invalid-input' : ''}`}
                            id="sucursal_origen"
                            name="sucursal_origen"
                            aria-label="Sucursal Origen"
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
                        <label htmlFor="sucursal_origen">SUCURSAL ORIGEN</label>
                        {
                            errors?.sucursal_origen &&
                            <div className="invalid-feedback-custom">{errors?.sucursal_origen.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <select
                            {...register("usuario", {
                                required: {
                                    value: true,
                                    message: 'Debes de seleccionar al menos a un usuario.'
                                },
                                validate: value => {
                                    return value !== "0" || 'Debes seleccionar a un usuario válido.';
                                }
                            })}
                            className={`form-select ${!!errors?.usuario ? 'invalid-input' : ''}`}
                            id="usuario"
                            name="usuario"
                            aria-label="usuario"
                            disabled={(watch('sucursal_origen') === '0') && usuarios.length === 0}
                        >
                            <option value="">SELECCIONA UNA OPCIÓN</option>
                            {
                                usuarios && usuarios.map((ele) => (
                                    <option key={ele.Usu + '-' + ele.Nombre} value={ele.Usu}>
                                        {ele.Nombre}
                                    </option>
                                ))
                            }
                        </select>
                        <label htmlFor="usuario">USUARIOS DE SISTEMA</label>
                        {
                            errors?.usuario &&
                            <div className="invalid-feedback-custom">{errors?.usuario.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <button
                        type="submit"
                        className="m-2 btn btn-primary"
                        onClick={()=>setActivo(1)}
                        disabled={ watch("sucursal_origen") === '0' && usuarios.length === 0}
                    >
                        <i className="bi bi-unlock-fill me-2"></i>
                        DESBLOQUEAR USUARIO
                    </button>
                    <button
                        type="button"
                        className="m-2 btn btn-danger"
                        onClick={asignarUsuario}
                        disabled={ watch("sucursal_origen") === '0' && usuarios.length === 0}
                    >
                        <i className="bi bi-lock-fill me-2"></i>
                       BLOQUEAR USUARIO
                    </button>
                </div>
            </div>
        </div>
    );
}
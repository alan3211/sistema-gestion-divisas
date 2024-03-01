import {memo, useContext, useEffect, useMemo, useState} from "react";
import {CardLayout} from "../../commons";
import {AltaClienteContext} from "../../../context/AltaCliente/AltaClienteContext";
import {
    encryptRequest,
    formattedDate,
    OPTIONS,
    validaFechas, validaFechaVigencia,
    validarAlfaNumerico,
    validarNumeroTelefono,
    year
} from "../../../utils";
import {useCatalogo} from "../../../hook";
import {useAltaComplementario} from "../../../hook";
import {dataG} from "../../../App";
import {getLocalidad, guardaCliente} from "../../../services";
import {FilterComboInput} from "../../commons/inputs/FilterComboInput";
import {toast} from "react-toastify";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {ModalGenericTool} from "../../commons/modals";
import {cargaArchivos} from "../../../services/commons-services";
import {useDropzone} from 'react-dropzone';
import {ModalLoading} from "../../commons/modals/ModalLoading";

const InstructivoCargaDocumentos = () => {
    return (
        <div className="card border-primary mb-3">
            <div className="card-header bg-primary text-white">Instrucciones para cargar documentos</div>
            <div className="card-body">
                <h5 className="card-title">Pasos a seguir:</h5>
                <ol className="list-group list-group-numbered">
                    <li className="list-group-item">Arrastra y suelta archivos en el área designada o haz clic para seleccionar archivos.</li>
                    <li className="list-group-item">Una vez que hayas seleccionado los archivos, aparecerán en la lista de <strong>"Archivos Cargados"</strong>.</li>
                    <li className="list-group-item">Si deseas eliminar un archivo de la lista, haz clic en el botón <strong>"Eliminar"</strong> junto al archivo correspondiente.</li>
                    <li className="list-group-item">Podrás ver una vista previa una ves dando clic en el archivo seleccionado en la sección <strong>"Vista Previa del Archivo"</strong>.</li>
                    <li className="list-group-item">Una vez que hayas cargado todos los archivos deseados, presiona el botón <strong>"Subir Archivos"</strong>.</li>
                </ol>
            </div>
        </div>
    );
};


export const AltaClienteComplementario = memo(() => {

    const {propForm} = useContext(AltaClienteContext);
    const {setShowAltaCliente, cliente, setCliente, setContinuaOperacion} = useContext(CompraVentaContext);
    const {
        closeModal,
    } = useAltaComplementario();

    const catalogo = useCatalogo([1, 3, 3, 6, 12, 13, 14, 10, 11, 18, 25]);

    const handleValidateFinalForm = propForm.handleSubmit(async (data) => {
        data.sucursal = dataG.sucursal.toString();
        data.usuario = dataG.usuario;

        if (data.numero_exterior.includes("SIN NÚMERO EXTERIOR")) {
            data.numero_exterior = "";
        }

        if (data.origen_recursos !== '5') {
            data.esp_origen_recursos = '';
        }
        if (data.destino_recursos !== '7') {
            data.esp_destino_recursos = '';
        }

        const encryptedBase64 = encryptRequest(data)

        const dataClientes = await guardaCliente(encryptedBase64);

        if (dataClientes.result_set[0].hasOwnProperty('Mensaje')) {
            toast.warn(dataClientes.result_set[0].Mensaje, OPTIONS);
            closeModalAndReturn();
        } else {
            propForm.setShowCargaDocumentos(true);
            toast.success(`El registro se ha completado satisfactoriamente con el número de usuario ${dataClientes.result_set[0].Cliente}.`, OPTIONS)
            setCliente(dataClientes.result_set[0].Cliente);
            //setShowAltaCliente(false);
        }
    });

    const closeModalAndReturn = () => {
        closeModal();
        propForm.reset();
        propForm.setComplementarios(false);
        propForm.setShowEdit(false);

    }

    const [municipios, setMunicipios] = useState([]);
    const [colonias, setColonias] = useState([]);
    const [codigoPostal, setCodigoPostal] = useState([]);

    useEffect(() => {
        const getFetch = async () => {
            const values = {
                opcion: 1,
                estado: propForm.watch("estado"),
                municipio: '',
                colonia: ''
            }
            const encryptedData = encryptRequest(values);
            const mun = await getLocalidad(encryptedData);
            setMunicipios(mun)
        }
        if (propForm.watch("estado") !== '0') getFetch();
    }, [propForm.watch("estado")]);

    useEffect(() => {
        const getFetch = async () => {
            const values = {
                opcion: 2,
                estado: propForm.watch("estado"),
                municipio: propForm.watch("municipio"),
                colonia: ''
            }
            const encryptedData = encryptRequest(values);
            const colonias = await getLocalidad(encryptedData);
            setColonias(colonias)
        }
        if (propForm.watch("municipio") !== '0') getFetch();
    }, [propForm.watch("municipio")]);

    useEffect(() => {
        const getFetch = async () => {
            const values = {
                opcion: 3,
                estado: propForm.watch("estado"),
                municipio: propForm.watch("municipio"),
                colonia: propForm.watch("colonia")
            }
            const encryptedData = encryptRequest(values);
            const codigo_postal = await getLocalidad(encryptedData);
            setCodigoPostal(codigo_postal)
        }
        if (propForm.watch("colonia") !== '0') getFetch();
    }, [propForm.watch("colonia")]);

    const [controlName, setControlName] = useState(false);

    const toggleCheck = (value) => {
        setControlName((prevControlName) => {
            if (prevControlName) {
                propForm.setValue("numero_exterior", "");
                return false;
            } else {
                propForm.setValue("numero_exterior", "S/N EXT");
                return true;
            }
        });
    };

    const options = {
        size: 'xl',
        showModal: propForm.showCargaDocumentos,
        closeModal: () => propForm.setShowCargaDocumentos(false),
        title: 'Carga de Documentos del Usuario',
        icon: 'bi bi-file-earmark-arrow-up m-2',
        subtitle: `Sube los documentos del usuario ${cliente} para almacenarlos en su expediente.`,
    };

    const [selectedFile, setSelectedFile] = useState(null);
    const [showContinuaDoc, setShowContinuaDoc] = useState(false);
    const [files, setFiles] = useState([]);

    const handleChange = async (archivo) => {
         setShowContinuaDoc(true);
         setFiles(archivo);
         const formData = new FormData();
         formData.append("usuario_sistema", dataG.usuario);
         formData.append("sucursal", dataG.sucursal);
         formData.append("usuario", cliente);
        files.forEach((file, index) => {
            formData.append(`archivo`, file);
        });

         const response = await cargaArchivos(formData);

         if(response === 'OK'){
             setShowContinuaDoc(false);
             setContinuaOperacion(true);
             setShowAltaCliente(false);
             propForm.setShowCargaDocumentos(false);
             toast.success("Se cargaron los documentos correctamente",OPTIONS)
         }else{
            setShowContinuaDoc(false);
            toast.error("Hubo un problema al cargar la documentación.",OPTIONS)
         }
     };

    const [uploading, setUploading] = useState(false);

    const onDrop = acceptedFiles => {
        setUploading(true);
        setTimeout(() => {
            setFiles([...files, ...acceptedFiles]);
            setUploading(false);
        }, 1000); // Simulating upload delay
    };

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out'
    };

    const focusedStyle = {
        borderColor: '#2196f3'
    };

    const acceptStyle = {
        borderColor: '#00e676'
    };

    const rejectStyle = {
        borderColor: '#ff1744'
    };

    const {getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject} = useDropzone({onDrop});

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    // Función para manejar la selección de archivos
    const handleFileSelection = (file) => {
        setSelectedFile(file);
    };

    const optionsLoad = {
        showModal:!showContinuaDoc,
        closeCustomModal: ()=> setShowContinuaDoc(true),
        title:'Guardando documentación...'
    }

    return (
        <>
            <div className="row g-3">
                <CardLayout title="Datos Complementarios" icon="ri-file-list-2-fill p-2">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("genero", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos un genero.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una genero válido.';
                                        }
                                    })}
                                    className={`form-select ${propForm.errors?.genero ? 'invalid-input' : ''}`}
                                    id="genero"
                                    name="genero"
                                    aria-label="GENERO"
                                    tabIndex="12"
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
                                    propForm.errors?.genero &&
                                    <div className="invalid-feedback-custom">Debes de seleccionar un genero
                                        válido </div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("id_actividad_economica", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos una actividad economica.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una actividad economica válida.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.id_actividad_economica ? 'invalid-input' : ''}`}
                                    id="id_actividad_economica"
                                    name="id_actividad_economica"
                                    aria-label="Actividad Económica"
                                    tabIndex="13"
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
                                    propForm.errors?.id_actividad_economica && <div
                                        className="invalid-feedback-custom">{propForm.errors?.id_actividad_economica.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <FilterComboInput
                                propForm={propForm}
                                name="nacionalidad"
                                label="NACIONALIDAD"
                                options={catalogo[1] || []}
                                input={propForm.watch("nacionalidad")}
                                tabIndex="14"
                            />
                        </div>
                        <div className="col-md-3">
                            <FilterComboInput
                                propForm={propForm}
                                name="pais_nacimiento"
                                label="PAÍS NACIMIENTO"
                                options={catalogo[1] || []}
                                input={propForm.watch("pais_nacimiento")}
                                tabIndex="15"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("estado", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos un estado.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un estado válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.estado ? 'invalid-input' : ''}`}
                                    id="estado"
                                    name="estado"
                                    aria-label="Estado"
                                    tabIndex="16"
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
                                    propForm.errors?.estado &&
                                    <div className="invalid-feedback-custom">{propForm.errors?.estado.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("municipio", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos un municipio.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un municipio válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.municipio ? 'invalid-input' : ''}`}
                                    id="municipio"
                                    name="municipio"
                                    aria-label="Municipio"
                                    disabled={(propForm.watch('municipio') === '0') && municipios.length === 0}
                                    tabIndex="17"
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
                                    propForm.errors?.municipio &&
                                    <div className="invalid-feedback-custom">{propForm.errors?.municipio.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("colonia", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos una colonia.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una colonia válida.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.colonia ? 'invalid-input' : ''}`}
                                    id="colonia"
                                    name="colonia"
                                    aria-label="Colonia"
                                    disabled={(propForm.watch('colonia') === '0') && colonias.length === 0}
                                    tabIndex="18"
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
                                    propForm.errors?.colonia &&
                                    <div className="invalid-feedback-custom">{propForm.errors?.colonia.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("codigo_postal", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos un código_postal.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un código postal válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.codigo_postal ? 'invalid-input' : ''}`}
                                    id="codigo_postal"
                                    name="codigo_postal"
                                    aria-label="Código Postal"
                                    disabled={(propForm.watch('codigo_postal') === '0') && codigoPostal.length === 0}
                                    tabIndex="19"
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
                                    propForm.errors?.codigo_postal && <div
                                        className="invalid-feedback-custom">{propForm.errors?.codigo_postal.message}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("codigo_telefono", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos un codigo.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un codigo válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.codigo_telefono ? 'invalid-input' : ''}`}
                                    id="codigo_telefono"
                                    name="codigo_telefono"
                                    aria-label="Codigo Telefono"
                                    tabIndex="20"
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        catalogo[10]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion.toUpperCase()}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="codigo_telefono">PREFIJO</label>
                                {
                                    propForm.errors?.codigo_telefono && <div
                                        className="invalid-feedback-custom">{propForm.errors?.codigo_telefono.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-floating mb-3">
                                <input
                                    {...propForm.register("telefono", {
                                        validate: (value) => validarNumeroTelefono("Telefono", value),
                                        maxLength: {
                                            value: 10,
                                            message: 'El campo Teléfono como máximo debe de tener no mas de 10 digitos.'
                                        },
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.telefono ? 'is-invalid' : ''}`}
                                    id="telefono"
                                    name="telefono"
                                    placeholder="Ingresa el teléfono"
                                    autoComplete="off"
                                    tabIndex="21"
                                />
                                <label htmlFor="telefono">TELÉFONO</label>
                                {propForm.errors?.telefono &&
                                    <div className="invalid-feedback-custom">{propForm.errors?.telefono.message}</div>}
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("calle", {
                                        required: {
                                            value: true,
                                            message: 'El campo no puede ser vacio.'
                                        },
                                        validate: (value) => validarAlfaNumerico("Calle", value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.calle ? 'invalid-input' : ''}`}
                                    id="calle"
                                    name="calle"
                                    placeholder="Ingresa la calle"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("calle", upperCaseValue);
                                        propForm.trigger('calle');
                                    }}
                                    autoComplete="off"
                                    tabIndex="22"
                                />
                                <label htmlFor="calle">CALLE, AVENIDA, BOULEVARD,CERRADA</label>
                                {
                                    propForm.errors?.calle &&
                                    <div className="invalid-feedback-custom">{propForm.errors?.calle.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("numero_exterior", {
                                        required: {
                                            value: true,
                                            message: 'El campo Número Exterior no puede ser vacio.'
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: 'El campo Número Exterior como máximo debe de tener no mas de 10 caracteres.'
                                        },
                                        validate: (value) => validarAlfaNumerico("Número Exterior", value)
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.numero_exterior ? 'invalid-input' : ''}`}
                                    id="numero_exterior"
                                    name="numero_exterior"
                                    placeholder="Ingresa el Número Exterior"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("numero_exterior", upperCaseValue);
                                        propForm.trigger('numero_exterior');
                                    }}
                                    autoComplete="off"
                                    disabled={controlName}
                                    tabIndex="23"
                                />
                                <label htmlFor="numero_exterior">NÚMERO EXTERIOR</label>
                                {
                                    propForm.errors?.numero_exterior && <div
                                        className="invalid-feedback-custom">{propForm.errors?.numero_exterior.message}</div>
                                }
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="numero_exteriorC"
                                           onClick={() => toggleCheck('numero_exterior')} checked={controlName}
                                           autoComplete="off"
                                           tabIndex="25"
                                    />
                                    <label className="form-check-label" htmlFor="numero_exteriorc">SIN NÚMERO
                                        EXTERIOR</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("numero_interior", {
                                        validate: (value) => validarAlfaNumerico("Número Interior", value),
                                        maxLength: {
                                            value: 10,
                                            message: 'El campo Número Interior como máximo debe de tener no mas de 10 caracteres.'
                                        },
                                    })}
                                    type="text"
                                    className={`form-control ${!!propForm.errors?.numero_interior ? 'invalid-input' : ''}`}
                                    id="numero_interior"
                                    name="numero_interior"
                                    placeholder="Ingresa el Número Interior"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase();
                                        e.target.value = upperCaseValue;
                                        propForm.setValue("numero_interior", upperCaseValue);
                                        propForm.trigger('numero_interior');
                                    }}
                                    autoComplete="off"
                                    tabIndex="24"
                                />
                                <label htmlFor="numero_interior">NÚMERO INTERIOR</label>
                                {
                                    propForm.errors?.numero_interior && <div
                                        className="invalid-feedback-custom">{propForm.errors?.numero_interior.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input
                                    {...propForm.register("vigencia", {
                                            required: {
                                                value: true,
                                                message: 'Debes de seleccionar al menos una vigencia.'
                                            },
                                            validate: (fecha) => validaFechaVigencia(fecha)
                                        }
                                    )}
                                    type="date"
                                    className={`form-control ${!!propForm.errors?.vigencia ? 'invalid-input' : ''}`}
                                    id="vigencia"
                                    name="vigencia"
                                    placeholder="Ingresa la vigencia de la identificación"
                                    autoComplete="off"
                                    min={formattedDate}
                                    tabIndex="26"
                                    max={`${year + 10}-12-31`}
                                />
                                <label htmlFor="vigencia">VIGENCIA IDENTIFICACIÓN</label>
                                {
                                    propForm.errors?.vigencia && <div
                                        className="invalid-feedback-custom">{propForm.errors?.vigencia.message}</div>
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
                                    {...propForm.register("monto", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos un monto.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un monto válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.monto ? 'invalid-input' : ''}`}
                                    id="monto"
                                    name="monto"
                                    aria-label="Monto"
                                    tabIndex="27"
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
                                    propForm.errors?.monto &&
                                    <div className="invalid-feedback-custom">{propForm.errors?.monto.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("frecuencia", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos una frecuencia.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una frecuencia válida.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.frecuencia ? 'invalid-input' : ''}`}
                                    id="frecuencia"
                                    name="frecuencia"
                                    aria-label="Frecuencia"
                                    tabIndex="28"
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
                                    propForm.errors?.frecuencia &&
                                    <div className="invalid-feedback-custom">{propForm.errors?.frecuencia.message}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("numero_operaciones", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos un número de operaciones.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un número de operaciones válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.numero_operaciones ? 'invalid-input' : ''}`}
                                    id="numero_operaciones"
                                    name="numero_operaciones"
                                    aria-label="# Operaciones"
                                    tabIndex="29"
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
                                    propForm.errors?.numero_operaciones && <div
                                        className="invalid-feedback-custom">{propForm.errors?.numero_operaciones.message}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("origen_recursos", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos un origen de recursos.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un origen de recursos válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.origen_recursos ? 'invalid-input' : ''}`}
                                    id="origen_recursos"
                                    name="origen_recursos"
                                    aria-label="Origen Recursos"
                                    tabIndex="30"
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
                                    propForm.errors?.origen_recursos && <div
                                        className="invalid-feedback-custom">{propForm.errors?.origen_recursos.message}</div>
                                }
                            </div>
                        </div>
                        {
                            propForm.watch("origen_recursos") === '5' &&
                            (<div className="col-md-3">
                                <div className="form-floating">
                                    <input
                                        {...propForm.register("esp_origen_recursos", {
                                            required: {
                                                value: true,
                                                message: 'El campo Especifica Origen Recursos no puede ser vacio.'
                                            },
                                            validate: (value) => validarAlfaNumerico("Especifica Origen Recursos", value)
                                        })}
                                        type="text"
                                        className={`form-control ${!!propForm.errors?.esp_origen_recursos ? 'invalid-input' : ''}`}
                                        id="esp_origen_recursos"
                                        name="esp_origen_recursos"
                                        placeholder="Especifique Origen Recursos"
                                        onChange={(e) => {
                                            const upperCaseValue = e.target.value.toUpperCase();
                                            e.target.value = upperCaseValue;
                                            propForm.setValue("esp_origen_recursos", upperCaseValue);
                                            propForm.trigger('esp_origen_recursos');
                                        }}
                                        autoComplete="off"
                                        tabIndex="32"
                                    />
                                    <label htmlFor="esp_origen_recursos">ESPECIFIQUE ORIGEN RECURSOS</label>
                                    {
                                        propForm.errors?.esp_origen_recursos && <div
                                            className="invalid-feedback-custom">{propForm.errors?.esp_origen_recursos.message}</div>
                                    }
                                </div>
                            </div>)
                        }
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...propForm.register("destino_recursos", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos un destino de los recursos.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar un destino de recursos válido.';
                                        }
                                    })}
                                    className={`form-select ${!!propForm.errors?.destino_recursos ? 'invalid-input' : ''}`}
                                    id="destino_recursos"
                                    name="destino_recursos"
                                    aria-label="Destino Recursos"
                                    tabIndex="31"
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
                                    propForm.errors?.destino_recursos && <div
                                        className="invalid-feedback-custom">{propForm.errors?.destino_recursos.message}</div>
                                }
                            </div>
                        </div>
                        {
                            propForm.watch("destino_recursos") === '7' &&
                            (<div className="col-md-3">
                                <div className="form-floating">
                                    <input
                                        {...propForm.register("esp_destino_recursos", {
                                            required: {
                                                value: true,
                                                message: 'El campo Especifica Destino Recursos no puede ser vacio.'
                                            },
                                            validate: (value) => validarAlfaNumerico("Especifica Destino Recursos", value)
                                        })}
                                        type="text"
                                        className={`form-control ${!!propForm.errors?.esp_destino_recursos ? 'invalid-input' : ''}`}
                                        id="esp_destino_recursos"
                                        name="esp_destino_recursos"
                                        placeholder="Especifique Destino Recursos"
                                        onChange={(e) => {
                                            const upperCaseValue = e.target.value.toUpperCase();
                                            e.target.value = upperCaseValue;
                                            propForm.setValue("esp_destino_recursos", upperCaseValue);
                                            propForm.trigger('esp_destino_recursos');
                                        }}
                                        autoComplete="off"
                                        tabIndex="33"
                                    />
                                    <label htmlFor="esp_destino_recursos">ESPECIFIQUE DESTINO RECURSOS</label>
                                    {
                                        propForm.errors?.esp_destino_recursos && <div
                                            className="invalid-feedback-custom">{propForm.errors?.esp_destino_recursos.message}</div>
                                    }
                                </div>
                            </div>)
                        }
                    </div>
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-center">
                            <button
                                type="button"
                                onClick={handleValidateFinalForm}
                                tabIndex="34"
                                className="m-2 btn btn-primary d-grid gap-2">
                                <span
                                    className="bi bi-file-earmark-arrow-up me-2"
                                    role="status"
                                    aria-hidden="true">
                                    <span className="ms-2">
                                        CONTINUAR CON CARGA DE DOCUMENTOS
                                    </span>
                                </span>
                            </button>
                        </div>
                    </div>
                </CardLayout>
            </div>
            {
                propForm.showCargaDocumentos &&
                (
                    <ModalGenericTool options={options}>

                        <div className="row">
                            <div className="col-md-8">
                                <div className="card pt-4">
                                    <div className="card-body">
                                        <div {...getRootProps(({style}))}>
                                            <input {...getInputProps()} />
                                            {uploading ? (
                                                <div className="d-flex align-items-center">
                                                    <div className="spinner-border me-2" role="status">
                                                        <span className="visually-hidden"><strong>Subiendo archivos...</strong></span>
                                                    </div>
                                                    <p className="m-0"><strong>Subiendo archivos...</strong></p>
                                                </div>
                                            ) : (
                                                <p className="text-blue">
                            <span className="me-2">
                                <i className="ri ri-upload-2-line"></i>
                            </span>
                                                    <strong>Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos</strong>
                                                </p>
                                            )}
                                        </div>
                                        {files.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="mb-3 fs-5">
                                                    <i className="bi bi-cloud-upload me-2"></i>
                                                    Archivos Cargados
                                                </h4>
                                                <ul className="list-group">
                                                    {files.map((file, index) => (
                                                        <li
                                                            key={index}
                                                            className="list-group-item d-flex justify-content-between align-items-center cursor-pointer table-hover"
                                                            onClick={() => handleFileSelection(file)}
                                                        >
                                                            <div>
                                        <span className="me-2">
                                            <i className="ri ri-file-line"></i>
                                        </span>
                                                                {file.name} - {file.size} bytes
                                                            </div>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => {
                                                                    const newFiles = [...files];
                                                                    const indexToRemove = newFiles.findIndex(f => f === file);
                                                                    if (indexToRemove !== -1) {
                                                                        newFiles.splice(indexToRemove, 1);
                                                                        setFiles(newFiles);
                                                                        setSelectedFile(null);
                                                                    }
                                                                }}
                                                            >
                                                                <strong>
                                                                    <i className="bi bi-trash me-1"></i>
                                                                    Eliminar
                                                                </strong>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        {/* Vista previa del archivo */}
                                        {(selectedFile && files.length > 0) && (
                                            <div>
                                                <h4 className="mt-4 fs-5">
                                                    <i className="bi bi-eye-fill me-2"></i>
                                                    Vista Previa del Archivo
                                                </h4>
                                                {/* Utiliza un componente de vista previa de archivo */}
                                                {selectedFile.type.startsWith('image/') ? (
                                                    <img src={URL.createObjectURL(selectedFile)} alt="Vista previa del archivo" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                                                ) : selectedFile.type === 'application/pdf' ? (
                                                    <iframe src={URL.createObjectURL(selectedFile)} width="100%" height="400px"></iframe>
                                                ) : (
                                                    <p>No se puede mostrar la vista previa del archivo.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {
                                showContinuaDoc && <ModalLoading options={optionsLoad} />
                            }
                            <div className="col-md-4">
                                <InstructivoCargaDocumentos/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mx-auto">
                                <button type="button"  className="m-2 btn btn-success"
                                        onClick={()=>handleChange(files)}
                                        style={{fontWeight: 'bold'}}
                                        tabIndex="37"
                                        disabled={!(files.length > 0)}>
                                    <i className="ri ri-upload-2-line me-2"></i>
                                    SUBIR ARCHIVOS
                                </button>
                            </div>
                        </div>

                    </ModalGenericTool>
                )
            }
        </>
    );
})
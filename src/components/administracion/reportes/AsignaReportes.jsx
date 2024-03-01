import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { useCatalogo } from "../../../hook";
import {encryptRequest, OPTIONS} from "../../../utils";
import { consultaReporteContable } from "../../../services/reportes-services";
import { useForm } from "react-hook-form";
import {guardaAsignacion} from "../../../services/administracion-services";
import {toast} from "react-toastify";
import {ModalLoading} from "../../commons/modals/ModalLoading";


const InstructivoAsignacion = () => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Instrucciones</h5>
                <p className="card-text">
                    Para asignar un reporte a un perfil, sigue estos pasos:
                </p>
                <ol className="list-decimal">
                    <li>Selecciona un tipo de reporte en el menú desplegable.</li>
                    <li>Da doble clic el perfil desde la sección <strong>"Perfiles"</strong> para moverlo a la sección <strong>"Tipos de Reporte"</strong>.</li>
                    <li>Una vez asignado, el perfil aparecerá en la lista de <strong>"Tipos de Reporte"</strong>.</li>
                    <li>Para deshacer la asignación, haz clic en la cruz en la lista de <strong>"Tipos de Reporte"</strong>.</li>
                    <li>Una vez que hayas terminado de asignar, presiona el botón <strong>"Guardar"</strong>.</li>
                </ol>
            </div>
        </div>
    );
};
export const AsignaReportes = () => {
    const [profiles, setProfiles] = useState([]);
    const [reportTypes, setReportTypes] = useState([]);
    const [dataReport, setDataReport] = useState([]);
    const catalogo = useCatalogo([21]);
    const [guarda,setGuarda] = useState(false);
    const {
        register, handleSubmit, formState: { errors }, reset, watch, setValue,
    } = useForm();


    const [selectedReporte, setSelectedReporte] = useState(false);

    useEffect(() => {
        const catalagosReporte = async () => {
            const response = await consultaReporteContable(encryptRequest({ id_perfil: 0 }));
            setDataReport(response.result_set);
        }
        catalagosReporte();
    }, []);


    useEffect(() => {
        if(watch("tipo_reporte") !== ''){
            setSelectedReporte(true)
            setProfiles(catalogo[0]);
            setReportTypes([])
        }
    }, [watch("tipo_reporte")]);

    const optionsLoad = {
        showModal:guarda,
        closeCustomModal: ()=> setGuarda(false),
        title:'Asignando Reportes por Perfil...'
    }

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        if (destination.droppableId === 'perfiles') {
            const profileToMove = reportTypes.find(profile => profile.id === draggableId);
            setReportTypes(prevReportTypes => prevReportTypes.filter(profile => profile.id !== draggableId));
            setProfiles(prevProfiles => [...prevProfiles, profileToMove]);
        }

        if (destination.droppableId === 'reportTypes') {
            const profileToMove = profiles.find(profile => profile.id === draggableId);
            setReportTypes(prevReportTypes => [...prevReportTypes, profileToMove]);
            setProfiles(prevProfiles => prevProfiles.filter(profile => profile.id !== draggableId));
        }
    };

    const handleDoubleClick = (profileId) => {
        moveProfileToReportTypes(profileId);
    };

    const handleSave = handleSubmit(async(data) => {
        setGuarda(true)
        const selectedReportIds = reportTypes.map(report => report.id).join(',');
        console.log(data)
        console.log(selectedReportIds)

        const valores = {
            opcion:2,
            idReporte:data.tipo_reporte.split("-")[0],
            perfiles: selectedReportIds
        }

        const encryptedData = encryptRequest(valores);
        const response = await guardaAsignacion(encryptedData)

        if(response.total_rows > 0){
            toast.success(response.result_set[0].Mensaje,OPTIONS);
        }else{
            toast.error('Hubo un problema al realizar la asignación de reportes.',OPTIONS);
        }

        setGuarda(false);

    });

    const moveProfileToReportTypes = (profileId) => {
        const profileToMove = profiles.find(profile => profile.id === profileId);
        setProfiles(prevProfiles => prevProfiles.filter(profile => profile.id !== profileId));
        setReportTypes(prevReportTypes => [...prevReportTypes, profileToMove]);
    };

    const moveReportTypesToProfile = (profileId) => {
        const profileToMove = reportTypes.find(profile => profile.id === profileId);
        setReportTypes(prevReportTypes => prevReportTypes.filter(profile => profile.id !== profileId));
        setProfiles(prevProfiles => [...prevProfiles, profileToMove]);
    };

    return (
        <>
            <div className="col-md-5 mx-auto mt-4">
                <div className="form-floating mb-3">
                    <select
                        {...register("tipo_reporte", {
                            required: {
                                value: true, message: 'Debes de seleccionar al menos un tipo de reporte.'
                            }, validate: value => {
                                return value !== "0" || 'Debes seleccionar un tipo de reporte válido.';
                            }
                        })}
                        className={`form-select ${!!errors?.tipo_reporte ? 'invalid-input' : ''}`}
                        id="tipo_reporte"
                        name="tipo_reporte"
                        aria-label="Tipo Reporte"
                    >
                        <option value="">SELECCIONA UNA OPCIÓN</option>
                        {dataReport?.map((ele) => (<option key={ele.Id + '-' + ele.Descripcion}
                                                           value={`${ele.Id}-${ele.Descripcion}`}>
                            {ele.Descripcion}
                        </option>))}
                    </select>
                    <label htmlFor="tipo_reporte">TIPO DE REPORTE</label>
                    {errors?.tipo_reporte &&
                        <div className="invalid-feedback-custom">{errors?.tipo_reporte.message}</div>}
                </div>
            </div>

            <div className="d-flex row">
                <div className="col-md-6">
                    <InstructivoAsignacion/>
                </div>
                <div className="col-md-6">
                    {
                        selectedReporte && (
                            <>
                                <DragDropContext onDragEnd={onDragEnd} >
                                    <div className="d-flex justify-content-around mt-5">
                                        <Droppable droppableId="perfiles">
                                            {(provided) => (<div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                style={{
                                                    background: '#f8f9fa',
                                                    padding: 10,
                                                    width: 250,
                                                    minHeight: 300,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    border: '2px solid #dee2e6',
                                                    borderRadius: 10,
                                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                                }}
                                            >
                                                <div className="text-center">
                                                    <p className="text-blue">
                                                        <i className="ri ri-shield-user-fill me-2"></i>
                                                        Perfiles
                                                    </p>
                                                </div>
                                                {profiles?.map((profile, index) => (
                                                    <Draggable key={profile.id} draggableId={profile.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    margin: '8px 0',
                                                                    background: 'white',
                                                                    padding: '12px',
                                                                    borderRadius: '8px',
                                                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                                                    cursor: 'pointer',
                                                                }}
                                                                onDoubleClick={() => handleDoubleClick(profile.id)}
                                                            >
                                                        <span className="text-center">
                                                            <i className="bi bi-person-circle me-2"></i>
                                                            <strong>{profile.descripcion}</strong>
                                                        </span>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>)}
                                        </Droppable>
                                        <Droppable droppableId="reportTypes">
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    style={{
                                                        background: '#f8f9fa',
                                                        padding: 10,
                                                        width: 250,
                                                        minHeight: 300,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        border: '2px solid #dee2e6',
                                                        borderRadius: 10,
                                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                                    }}
                                                >
                                                    <div className="text-center">
                                                        <p className="text-blue">
                                                            <i className="ri ri-file-chart-fill me-2"></i>
                                                            <strong>
                                                                {watch("tipo_reporte") && watch("tipo_reporte") !== "" ? watch("tipo_reporte").split("-")[1] : ""}
                                                            </strong>
                                                        </p>
                                                    </div>
                                                    {reportTypes.map((type, index) => (
                                                        <Draggable key={type.id} draggableId={type.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        margin: '8px 0',
                                                                        background: 'white',
                                                                        padding: '12px',
                                                                        borderRadius: '8px',
                                                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                                                    }}
                                                                >
                                                            <span className="text-center">
                                                                  <i className="bi bi-person-circle me-2"></i>
                                                                  <strong>{type.descripcion}</strong>
                                                            </span>
                                                                    <i
                                                                        className="ri ri-close-circle-fill text-danger ms-2"
                                                                        onClick={() => moveReportTypesToProfile(type.id)}
                                                                        style={{ cursor: 'pointer' }}
                                                                    ></i>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>)}
                                        </Droppable>
                                    </div>
                                </DragDropContext>
                            </>
                        )
                    }
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <div className="col-md-2 mx-auto mb-2">
                        <button type="button" className="btn btn-success mt-2"
                                onClick={handleSave}
                                disabled={reportTypes.length === 0}>
                            <span className="bi bi-save me-2" aria-hidden="true"></span>
                            GUARDAR
                        </button>
                    </div>
                </div>
            </div>

            {
                guarda && <ModalLoading options={optionsLoad} />
            }
        </>
    );
};

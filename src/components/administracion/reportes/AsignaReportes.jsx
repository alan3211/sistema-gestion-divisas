import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {useCatalogo} from "../../../hook";
import {encryptRequest} from "../../../utils";
import {consultaReporteContable} from "../../../services/reportes-services";
import {useForm} from "react-hook-form";

export const AsignaReportes = () => {

    const [profiles, setProfiles] = useState([]);
    const [reportTypes, setReportTypes] = useState([]);
    const [dataReport, setDataReport] = useState([]);
    const catalogo = useCatalogo([21]);
    const {register,
        handleSubmit,
        formState: {errors}, reset,
        watch,
        setValue,
    } = useForm();



    useEffect(() => {
       const catalagosReporte = async() => {
           const response =  await consultaReporteContable(encryptRequest({id_perfil:6}));
           setDataReport(response.result_set);
       }
       catalagosReporte();
    }, []);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        // Si no hay destino o el elemento fue soltado en el mismo lugar de origen, no hacemos nada
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        // Si el elemento fue soltado en la lista de perfiles
        if (destination.droppableId === 'profiles') {
            const newProfiles = Array.from(profiles);
            newProfiles.splice(destination.index, 0, reportTypes.find(type => type.id === draggableId));
            setProfiles(newProfiles);
            setReportTypes(prevReportTypes => prevReportTypes.filter(type => type.id !== draggableId));
        }

        // Si el elemento fue soltado en la lista de tipos de reporte
        if (destination.droppableId === 'reportTypes') {
            const newReportTypes = Array.from(reportTypes);
            newReportTypes.splice(destination.index, 0, profiles.find(profile => profile.id === draggableId));
            setReportTypes(newReportTypes);
            setProfiles(prevProfiles => prevProfiles.filter(profile => profile.id !== draggableId));
        }
    };

    console.log(catalogo[0])

    return (

        <>
            <div className="col-md-5 mx-auto">
                <div className="form-floating mb-3">
                    <select
                        {...register("tipo_reporte", {
                            required: {
                                value: true,
                                message: 'Debes de seleccionar al menos un tipo de reporte.'
                            },
                            validate: value => {
                                return value !== "0" || 'Debes seleccionar un tipo de reporte válido.';
                            }
                        })}
                        className={`form-select ${!!errors?.tipo_reporte ? 'invalid-input' : ''}`}
                        id="tipo_reporte"
                        name="tipo_reporte"
                        aria-label="Tipo Reporte"
                    >
                        <option value="">SELECCIONA UNA OPCIÓN</option>
                        {
                            dataReport?.map((ele) => (
                                <option key={ele.Id + '-' + ele.Descripcion}
                                        value={`${ele.Id}-${ele.Descripcion}`}>
                                    {ele.Descripcion}
                                </option>
                            ))
                        }
                    </select>
                    <label htmlFor="tipo_reporte">TIPO DE REPORTE</label>
                    {
                        errors?.tipo_reporte &&
                        <div className="invalid-feedback-custom">{errors?.tipo_reporte.message}</div>
                    }
                </div>
            </div>
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 50 }}>
                <Droppable droppableId="profiles">
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
                                    <i className="ri ri-shield-user-fill me-2"></i>
                                    Perfiles
                                </p>
                            </div>
                            {catalogo[0].map((profile, index) => (
                                <Draggable key={profile.id} draggableId={profile.id} index={index}>
                                    {(provided) => (
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
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            {profile.descripcion}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
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
                                    Tipo de Reporte
                                </p>
                                <p className="text-blue">
                                    { watch("tipo_reporte") && watch("tipo_reporte") !== "" ? watch("tipo_reporte").split("-")[1]:""}
                                </p>
                            </div>
                            {reportTypes.map((type, index) => (
                                <Draggable key={type.id} draggableId={type.id} index={index}>
                                    {(provided) => (
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
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            {type.name}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
        </>
    );
};
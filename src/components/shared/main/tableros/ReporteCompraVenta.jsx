import React, {useEffect, useState} from 'react';
import ApexCharts from 'apexcharts';
import {encryptRequest, formattedDate} from "../../../../utils";
import {useForm} from "react-hook-form";
import {consultaActividadDiaria, consultaMovimientosPorSucursal} from "../../../../services/tools-services";

export const ReporteCompraVenta = ({data}) => {

    const [dataState, setDataState] = useState(data);
    const [fechaConsulta, setFechaConsulta] = useState(formattedDate());

    const {register,handleSubmit,setValue,formState:{errors}} = useForm();

    useEffect(() => {
        // Este efecto se ejecutará cada vez que cambie la fechaConsulta
        console.log("Fecha actualizada:", fechaConsulta);
    }, [fechaConsulta]);

    const onHandleDateChange = handleSubmit(async (formData) => {
        const encryptedData = encryptRequest(formData);
        const response = await consultaActividadDiaria(encryptedData);
        if (response.result_set) {
            setDataState(response);
        } else {
            setDataState({});
        }
    });

    function formatHoursToISODate(hoursArray) {
        const baseDate = new Date(); // Obtener la fecha y hora actual
        return hoursArray.map(hour => {
            const date = new Date(baseDate); // Crear una nueva fecha con la fecha base
            date.setHours(hour); // Establecer la hora
            // Convertir a formato local con la zona horaria de México
            date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate().toString().padStart(2, "0")}T${hour.toString().padStart(2,"0")}:00:00.000Z`;
        });
    }

    const hours = dataState.result_set.map(item => item.Hora);

    const formattedDates = formatHoursToISODate(hours);

    useEffect(() => {

        const compras = dataState.result_set.map(item => parseInt(item.Compras));
        const ventas = dataState.result_set.map(item => parseInt(item.Ventas));
        const totalCompras = compras.reduce((acc, val) => acc + val, 0);
        const totalVentas = ventas.reduce((acc, val) => acc + val, 0);
        const usuariosNuevos = dataState.result_set.map(item => parseInt(item["Usuarios Nuevos"]));
        const usuarios = dataState.result_set.map(item => parseInt(item["Usuarios Existentes"]));
        const totalUsuarios = usuarios.reduce((acc, val) => acc + val, 0);
        const totalUsuariosNuevos = usuariosNuevos.reduce((acc, val) => acc + val, 0);

        const chart = new ApexCharts(document.querySelector("#reportsChart"), {
            series: [{
                name: 'Compras',
                data: compras,
            }, {
                name: 'Ventas',
                data: ventas
            }, {
                name: 'Operación de Usuarios',
                data: usuarios
            },
            {
                name: 'Nuevos Usuarios',
                data: usuariosNuevos
            }],
            chart: {
                height: 370,
                type: 'area',
                zoom: {
                    enabled: false
                }
            },
            markers: {
                size: 4
            },
            colors: ['#4154f1', '#2eca6a', '#ff771d',"#6c2fda"],
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.3,
                    opacityTo: 0.4,
                    stops: [0, 90, 100]
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                type: 'datetime',
                categories: formattedDates
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                formatter: function(seriesName, opts) {
                    let total = 0;
                    if (seriesName === 'Compras') total = totalCompras;
                    if (seriesName === 'Ventas') total = totalVentas;
                    if (seriesName === 'Operación de Usuarios') total = totalUsuarios;
                    if (seriesName === 'Nuevos Usuarios') total = totalUsuariosNuevos;
                    return seriesName + ": " + total;
                }
            }
        });

        chart.render();

        // Cleanup cuando el componente se desmonta
        return () => {
            chart.destroy();
        };
    }, [dataState]);

    return (
        <div className="col-12">
            <div className="card">
                <div className="filter">
                    <a className="icon" data-bs-toggle="dropdown" aria-expanded="true"
                       style={{padding: "20px", cursor: "pointer"}}>
                        <i className="bi bi-three-dots"></i>
                    </a>
                    <ul
                        className="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
                        style={{
                            position: "absolute",
                            inset: "0px 0px auto auto",
                            margin: "0px",
                            transform: "translate3d(0px, 29.5px, 0px)"
                        }}
                    >
                        <li className="dropdown-header text-start">
                            <h6>Filtro</h6>
                        </li>
                        <li>
                            <a className="dropdown-item">
                                <form className={`col-12`} onSubmit={(e) => e.preventDefault()}>
                                    <div className="form-floating">
                                        <input
                                            {...register("fecha", {})}
                                            type="date"
                                            className={`form-control ${!!errors?.fecha ? 'invalid-input' : ''}`}
                                            id="fecha"
                                            name="fecha"
                                            placeholder="Ingresa la fecha de consulta"
                                            onChange={(e) => {
                                                setValue("fecha", e.target.value);
                                                setFechaConsulta(e.target.value)
                                                onHandleDateChange(e.target.value)
                                            }}
                                            autoComplete="off"
                                        />
                                        <label htmlFor="fecha">FECHA CONSULTA</label>
                                        {errors?.fecha && (
                                            <div className="invalid-feedback-custom">{errors?.fecha.message}</div>
                                        )}
                                    </div>
                                </form>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        <i className="bx bx-line-chart me-2"></i>
                        Actividad Diaria GCC <span>| {fechaConsulta}</span>
                    </h5>
                    <div id="reportsChart"></div>
                </div>
            </div>
        </div>
    );
}

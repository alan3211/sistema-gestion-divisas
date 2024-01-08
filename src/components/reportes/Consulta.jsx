import {useEffect, useRef, useState} from "react";
import {dataG} from "../../App";
import {
    encryptRequest,
    formattedDate,
    formattedDateDD,
    formattedDateH,
    obtenDia,
    obtenerNombreMes,
    OPTIONS
} from "../../utils";
import {consultaReporteContable, consultaReporteFinal, obtenTitulo} from "../../services/reportes-services";
import {useForm} from "react-hook-form";
import {useCatalogo} from "../../hook";
import {toast} from "react-toastify";
import {ModalLoading} from "../commons/modals/ModalLoading";
import * as ExcelJS from "exceljs";
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import 'jspdf-autotable';

export const Consulta = () => {

    const catalogo = useCatalogo([17,15])
    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [meses, setMeses] = useState([]);
    const [anios, setAnios] = useState([]);
    const [reporte, setReporte] = useState({})
    const {register,
        handleSubmit,
        formState:{errors},
        reset,
        setValue,
        watch,
    } = useForm()
    const [currentDate, setCurrentDate] = useState('');
    const [guarda, setGuarda] = useState(false);

    const consultaReportes= async (encryptedData) => {
        const response =  await consultaReporteContable(encryptedData);
        setData(response.result_set);
    }

    const optionsLoad = {
        showModal: guarda,
        closeCustomModal: () => setGuarda(false),
        title: "Generando Reporte Contable ...",
    };

    useEffect(() => {
        // Obtenemos los nombres capitalizados de los meses
        const monthNames = Array.from({ length: 12 }, (_, index) => {
            const date = new Date(2000, index, 1); // Usamos el año 2000 como referencia
            const monthName = date.toLocaleString('default', { month: 'long' });
            return monthName.toUpperCase();
        });
        // Lógica para obtener la lista de años, por ejemplo, para los últimos 5 años
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

        setAnios(years);
        setMeses(monthNames);
    }, []);


    useEffect(() => {
        setValue("fecha_operacion",formattedDate);
        setCurrentDate(formattedDate);
        const currentMonth = new Date().getMonth() + 1; // Se suma 1 porque los meses van de 0 a 11
        const currentYear = new Date().getFullYear();

        setValue("mes", currentMonth);
        setValue("anio", currentYear);
        consultaReportes(encryptRequest({id_perfil:dataG.id_perfil}));
    }, []);

    useEffect(() => {
        let objetoEncontrado = data.find(function(elemento) {
            return elemento.Id === parseInt(watch("tipo_reporte"));
        });
        setReporte(objetoEncontrado);
    }, [watch("tipo_reporte")]);

    const generaReporteContable = handleSubmit(async (data) => {
        console.log("DATA DE REPORTE", data);
        console.log("TipoReporte", reporte.Proceso);
        setGuarda(true);

        data.proceso = reporte.Proceso;

        const encryptedData = encryptRequest(data);

        const responseData = await consultaReporteFinal(encryptedData);
        if (responseData.total_rows > 0) {
            const datosOrdenados = responseData.result_set.map((fila) => {
                const filaOrdenada = {};
                responseData.headers.forEach((columna) => {
                    filaOrdenada[columna] = fila[columna];
                });
                return filaOrdenada;
            });
            let descripcionCortada = reporte.Descripcion.split(' ')
                .map(word => word.charAt(0)) // Obtiene la primera letra de cada palabra
                .join(''); // Une las letras para formar la nueva cadena

            // Crear un nuevo libro de Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(descripcionCortada);


            const titulo = await obtenTitulo();
            // Añadir título a la fila 1
            worksheet.addRow([titulo]);
            // Obtener el número de columnas en tus encabezados
            const numColumnas = responseData.headers.length;
            // Obtener la letra de la última columna (por ejemplo, 'N' si tienes 14 columnas)
            const ultimaLetraColumna = String.fromCharCode('A'.charCodeAt(0) + numColumnas - 1);
            // Establecer el estilo para cada celda de la fila de encabezados
            const headerFirstRow = worksheet.getRow(1);
            headerFirstRow.eachCell((cell) => {
                cell.font = { bold: true }; // Color de la letra blanco y negrita
                cell.alignment = { horizontal: 'center' }; // Alineación central
            });
            // Combinar celdas desde A1 hasta la última columna (por ejemplo, N1)
            worksheet.mergeCells(`A1:${ultimaLetraColumna}1`);

            worksheet.addRow([reporte.Descripcion]);
            const headerSecondRow = worksheet.getRow(2);
            headerSecondRow.eachCell((cell) => {
                cell.font = { bold: true }; // Color de la letra blanco y negrita
                cell.alignment = { horizontal: 'center' }; // Alineación central
            });
            // Combinar celdas desde A2 hasta la última columna (por ejemplo, N2)
            worksheet.mergeCells(`A2:${ultimaLetraColumna}2`);

            //Tercer header
            let periodo = "";
            if(reporte.Periodo === 'Diario'){
                periodo = `Por el periodo comprendido al ${data.fecha_operacion}`;
            }else{
                periodo = `Por el periodo comprendido del 1 al ${obtenDia(data.mes)} de ${obtenerNombreMes(data.mes)} ${data.anio} `;
            }
            worksheet.addRow([periodo])
            const headerThirdRow = worksheet.getRow(3);
            headerThirdRow.eachCell((cell) => {
                cell.font = { bold: true }; // Color de la letra blanco y negrita
                cell.alignment = { horizontal: 'center' }; // Alineación central
            });
            // Combinar celdas desde A3 hasta la última columna (por ejemplo, N3)
            worksheet.mergeCells(`A3:${ultimaLetraColumna}3`);

            // Agregar encabezado
            worksheet.addRow(responseData.headers); // Reemplaza con tus encabezados
            // Estilo para los encabezados
            const headerRow = worksheet.getRow(4); // Fila de encabezados

            // Establecer el estilo para cada celda de la fila de encabezados
            headerRow.eachCell((cell) => {
                cell.font = { color: { argb: 'FFFFFF' }, bold: true }; // Color de la letra blanco y negrita
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '012970' } }; // Color de fondo azul oscuro
                cell.alignment = { horizontal: 'center' }; // Alineación central
            });

            // Agregar los datos ordenados a la hoja de cálculo
            datosOrdenados.forEach((fila,index) => {
                const rowData = responseData.headers.map(header => fila[header]);
                worksheet.addRow(rowData);
            });

            // Construir el blob y descargar el archivo
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const fileName = `Reporte-${currentDate}-${descripcionCortada}`;
            // Descargar el archivo
            saveAs(blob, fileName+'.xlsx');

                // Crear un nuevo objeto jsPDF
                const pdf = new jsPDF({
                    orientation: 'l',
                    unit: 'mm',
                    format: 'a4',
                    putOnlyUsedFonts: true
                });

                // Agregar títulos al PDF
                pdf.text(titulo, 150, 10, { align: "center" });
                pdf.text(reporte.Descripcion, 150, 20, { align: "center" });
                pdf.text(periodo, 150, 30, { align: "center" });

                // Crear una tabla
                const headers = responseData?.headers;
                const dataT = responseData?.result_set.map(fila => headers.map(header => fila[header]));

            pdf.autoTable({
                head: [headers],  // Encabezados de la tabla
                body: dataT,  // Datos de la tabla
                startY: 40,
                theme: 'grid',  // Estilo de la tabla (puedes cambiarlo según tus preferencias)
                styles: {
                    fontSize: 8,
                    cellPadding: 1,
                    valign: 'middle',
                    halign: 'center',
                    overflow: 'linebreak',
                    lineWidth: 0.1,
                },
                headStyles: {
                    fillColor: [1, 41, 112],  // Color de fondo del encabezado (#012970)
                    textColor: [255, 255, 255]  // Color del texto del encabezado (blanco)
                },
                columnStyles: {
                    0: { cellWidth: 20 },  // Ancho de la primera columna
                    // Ajusta los anchos de las columnas según tus necesidades
                },
            });
            pdf.setFontSize(8);
            pdf.text(`Generado por: ${dataG.username} el ${formattedDateDD} a las ${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, "0")}:${new Date().getSeconds()}  ${new Date().getHours() >= 12 ? 'PM' : 'AM'}`, 200, 200);

            // Descargar el PDF
                pdf.save(`${fileName}.pdf`);

        } else {
            toast.warn(`Hubo un problema para generar el reporte de ${reporte.Descripcion}. Valide si existe información`, OPTIONS);
        }

        setGuarda(false);
        reset();
    });


    return (
        <>
            <div className="row mt-3">
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
                            <option value="0">SELECCIONA UNA OPCIÓN</option>
                            {
                                data?.map((ele) => (
                                    <option key={ele.Id + '-' + ele.Descripcion}
                                            value={ele.Id}>
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
                {
                    reporte?.Periodo === 'Diario' && reporte?.Periodo !== ''
                        &&
                        ( <div className="d-flex align-items-center justify-content-center">
                            <div className="col-md-5 form-floating mb-3">
                                <input
                                    {...register("fecha_operacion",{
                                        required:{
                                            value:true,
                                            message:'El campo Fecha Operación no puede ser vacio.'
                                        },
                                    })}
                                    type="date"
                                    className={`form-control ${!!errors?.fecha_operacion ? 'invalid-input':''}`}
                                    id="fecha_operacion"
                                    name="fecha_operacion"
                                    placeholder="Ingresa la fecha de operación"
                                    value={currentDate}
                                    onChange={(e)=> setCurrentDate(e.target.value)}
                                    autoComplete="off"
                                />
                                <label htmlFor="fecha_operacion">FECHA OPERACIÓN</label>
                                {
                                    errors?.fecha_operacion && <div className="invalid-feedback-custom">{errors?.fecha_operacion.message}</div>
                                }
                            </div>
                        </div>)
                }
                {  reporte?.Periodo === 'Mensual' && reporte?.Periodo !== ''
                    && (<div className="d-flex align-items-center justify-content-center">
                            <div className="col-md-3 form-floating mb-3 me-4">
                                <select
                                    {...register("mes", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar un mes.'
                                        }
                                    })}
                                    className={`form-select ${!!errors?.mes ? 'invalid-input' : ''}`}
                                    id="mes"
                                    name="mes"
                                    aria-label="Mes"
                                >
                                    <option value="0">SELECCIONA UN MES</option>
                                    {meses.map((mes, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {mes}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="mes">MES</label>
                                {errors?.mes && <div className="invalid-feedback-custom">{errors?.mes.message}</div>}
                            </div>

                            <div className="col-md-3 form-floating mb-3 me-4">
                                <select
                                    {...register("anio", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar un año.'
                                        }
                                    })}
                                    className={`form-select ${!!errors?.anio ? 'invalid-input' : ''}`}
                                    id="anio"
                                    name="anio"
                                    aria-label="Año"
                                >
                                    <option value="0">SELECCIONA UN AÑO</option>
                                    {anios.map((anio) => (
                                        <option key={anio} value={anio}>
                                            {anio}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="anio">AÑO</label>
                                {errors?.anio && <div className="invalid-feedback-custom">{errors?.anio.message}</div>}
                            </div>
                        </div>)
                }

                {
                    reporte?.Sucursal === 'Si'
                    &&  ( <div className="d-flex align-items-center justify-content-center">
                            <div className="col-md-5 form-floating mb-3">
                                <select
                                    {...register("sucursal", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos una sucursal.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una sucursal válida.';
                                        }
                                    })}
                                    className={`form-select ${!!errors?.sucursal ? 'invalid-input' : ''}`}
                                    id="sucursal"
                                    name="sucursal"
                                    aria-label="Sucursal"
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
                                <label htmlFor="sucursal">SUCURSAL</label>
                                {
                                    errors?.sucursal &&
                                    <div className="invalid-feedback-custom">{errors?.sucursal.message}</div>
                                }
                            </div>
                        </div>)
                }
                {
                    reporte?.Moneda === 'SI'
                        && (<div className="d-flex align-items-center justify-content-center">
                            <div className="col-md-5 form-floating mb-3">
                                <select
                                    {...register("moneda", {
                                        required: {
                                            value: true,
                                            message: "Debes seleccionar al menos una moneda.",
                                        },
                                        validate: (value) => {
                                            return (
                                                value !== "0" || "Debes seleccionar una moneda válida."
                                            );
                                        },
                                    })}
                                    className={`form-select ${
                                        !!errors?.moneda ? "invalid-input" : ""
                                    }`}
                                    id="moneda"
                                    name="moneda"
                                    aria-label="Moneda"
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {catalogo[1]?.map((ele) => (
                                        <option
                                            key={ele.id + "-" + ele.descripcion}
                                            value={ele.id}
                                        >
                                            {ele.descripcion}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="moneda">DIVISA</label>
                                {errors?.moneda && (
                                    <div className="invalid-feedback-custom">
                                        {errors?.moneda.message}
                                    </div>
                                )}
                            </div>
                        </div>)
                }

                <div className="d-flex align-items-center justify-content-center">
                    <div className="col-md-2 mx-auto mb-2">
                        <button type="button" className="btn btn-primary mt-2"
                                onClick={generaReporteContable}>
                            <span className="bi bi-check-circle me-2" aria-hidden="true"></span>
                            GENERAR
                        </button>
                    </div>
                </div>
            </div>

            {guarda && <ModalLoading options={optionsLoad}/>}
        </>
    );


}
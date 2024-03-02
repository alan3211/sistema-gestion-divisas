import {useEffect, useState} from "react";
import {dataG} from "../../App";
import {
    encryptRequest, FormatoMoneda,
    formattedDate,
    formattedDateDD, getTextDivisa,
    obtenerDiasEnMes,
    obtenerNombreMes,
    OPTIONS
} from "../../utils";
import {
    consultaReporteCajaContable,
    consultaReporteContable,
    consultaReporteFinal,
    obtenTitulo
} from "../../services/reportes-services";
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
        trigger,
    } = useForm()
    const [currentDate, setCurrentDate] = useState(formattedDate);
    const [guarda, setGuarda] = useState(false);
    const reportesSuc = ["1","4","6","7","8","9","10","11"];

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
        setCurrentDate(formattedDate);
        setValue("fecha_operacion",formattedDate);
        const currentMonth = new Date().getMonth() + 1; // Se suma 1 porque los meses van de 0 a 11
        const currentYear = new Date().getFullYear();

        setValue("mes", currentMonth.toString());
        setValue("anio", currentYear.toString());
        setValue("moneda","");
        setValue("sucursal","");
        consultaReportes(encryptRequest({id_perfil:dataG.id_perfil}));
    }, [watch("tipo_reporte")]);

    useEffect(() => {
        let objetoEncontrado = data.find(function(elemento) {
            return elemento.Id === parseInt(watch("tipo_reporte"));
        });
        setReporte(objetoEncontrado);
    }, [watch("tipo_reporte")]);

    // Filtros para mostrar en el Excel y PDF
    const filters = [
        {columna:"Monto MXP", filter:"currency"},
        {columna:"Monto USD", filter:"currency"},
        {columna:"Tipo Cambio Promedio", filter:"currency"},
        {columna:".05", filter:"currency"},
        {columna:".10", filter:"currency"},
        {columna:".20", filter:"currency"},
        {columna:".50", filter:"currency"},
        {columna:"1", filter:"currency"},
        {columna:"2", filter:"currency"},
        {columna:"5", filter:"currency"},
        {columna:"10", filter:"currency"},
        {columna:"20", filter:"currency"},
        {columna:"50", filter:"currency"},
        {columna:"100", filter:"currency"},
        {columna:"200", filter:"currency"},
        {columna:"500", filter:"currency"},
        {columna:"1000", filter:"currency"},
        {columna:"TC Promedio", filter:"currency"},
        {columna:"Importe USD", filter:"currency"},
        {columna:"Importe Venta MXP", filter:"currency"},
        {columna:"Costo Venta USD", filter:"currency"},
        {columna:"Utilidad/Perdida", filter:"currency"},
        {columna:"Total Operación Compra", filter:"currency"},
        {columna:"Tipo Cambio", filter:"currency"},
        {columna:"Costo de Venta USD", filter:"currency"},
        {columna:"Utilidad / Perdida", filter:"currency"},
        {columna:"Tipo Cambio Compra", filter:"currency"},
        {columna:"Tipo Cambio Vta Promedio", filter:"currency"},
        {columna:"Entradas Compra", filter:"currency"},
        {columna:"Salidas Venta", filter:"currency"},
        {columna:"Saldo USD", filter:"currency"},
        {columna:"Saldo MXP", filter:"currency"},
        {columna:"Valor USD", filter:"currency"},
        {columna:"Tipo Cambio Venta", filter:"currency"},
        {columna:"Costo Vta Promedio", filter:"currency"},
        {columna:"Venta USD a MXP", filter:"currency"},
        {columna:"Utilidad Venta USD", filter:"currency"},
        {columna:"Importe M.N", filter:"currency"},
        {columna:"Saldo Inicial USD", filter:"currency"},
        {columna:"Compras USD", filter:"currency"},
        {columna:"Ventas USD", filter:"currency"},
        {columna:"Saldo Final USD", filter:"currency"},
        {columna:"Saldo Inicial MXP", filter:"currency"},
        {columna:"Compras MXP", filter:"currency"},
        {columna:"Ventas MXP", filter:"currency"},
        {columna:"Saldo Final MXP", filter:"currency"},
        {columna:"Limite Max USD", filter:"currency"},
        {columna:"Limite Max MXP", filter:"currency"},
        {columna:"Excedente / Faltante USD", filter:"currency"},
        {columna:"Excedente / Faltante MXP", filter:"currency"},
        {columna:"Denominacion", filter:"entero"},
        {columna:"Cantidad Sistema", filter:"entero"},
        {columna:"Monto Sistema", filter:"currency"},
        {columna:"Cantidad Cierre", filter:"entero"},
        {columna:"Monto Cierre", filter:"currency"},
        {columna:"Cantidad Sobrante / Faltante", filter:"entero"},
        {columna:"Monto Sobrante / Faltante", filter:"currency"},
        {columna:"Importe", filter:"currency"},
    ];

    // Función para obtener el filtro adecuado para una columna
    const getFilterForColumn = (columna) => {
        const filterObject = filters.find((filtro) => filtro.columna === columna);
        return filterObject ? filterObject.filter : null;
    };

    const applyFilter = (filtro, valor) => {
        if(filtro === 'currency'){
            if(valor === '' || valor === null || isNaN(valor)){
                return FormatoMoneda(0);
            }else{
                return FormatoMoneda(valor);
            }
        } else if (filtro === 'tooltip') {
            return valor && valor.slice(0, 12) + '...';
        }else if(filtro === 'entero'){
            return valor.toString();
        }
        return valor;
    }

    const nombreArchivo = (data) => {
        let fileName='';
        // Nombre del archivo final a descargar
        if(data.moneda === '' && data.fecha_operacion === '' && data.sucursal === ''){
            fileName = `${reporte.Descripcion}-${currentDate}`;
        }else if (data.moneda !== ''){
            fileName = `${reporte.Descripcion}-${currentDate}-${data.moneda}`;
        }else if (data.fecha_operacion !== ''){
            fileName = `${reporte.Descripcion}-${currentDate}-Operacion-${data.fecha_operacion}`;
        } else if (data.sucursal !== ''){
            if(data.sucursal === 1000){
                fileName = `TOTALES-${reporte.Descripcion}-${currentDate}`;
            }else{
                fileName = `${data.sucursal}-${reporte.Descripcion}-${currentDate}`;
            }
        }
        return fileName;
    }

    const createExcelReport = async (responseData,titulo,data) => {
        let fileName= nombreArchivo(data);

        // Se ordenan los datos que se encontraron por sucursal
        console.log("responseData")
        console.log(responseData);

       const datosOrdenados = responseData.result_set.map((fila) => {
            const filaOrdenada = {};
            responseData.headers.forEach((columna) => {
                filaOrdenada[columna] = fila[columna];
            });
            return filaOrdenada;
        });

        if (responseData.total_rows > 0) {
            // Objeto para almacenar los registros organizados por número de sucursal
            let registrosPorSucursal = {};
            // Iterar sobre los registros y organizarlos por número de sucursal
            responseData.result_set?.forEach(registro => {
                const noSucursal = registro["No. Sucursal"] || registro["Sucursal"];
                if (!registrosPorSucursal[noSucursal]) {
                    registrosPorSucursal[noSucursal] = [];
                }
                registrosPorSucursal[noSucursal].push(registro);
            });

            console.log("registrosPorSucursal")
            console.log(registrosPorSucursal)

            // Crear un nuevo libro de Excel
            const workbook = new ExcelJS.Workbook();

            // Iterar sobre cada sucursal y crear una hoja de Excel para ella
            for (const sucursal in registrosPorSucursal) {

                //Tercer header
                let periodo = "";
                if (reporte.Periodo === 'Diario') {
                    periodo = `Por el periodo comprendido al ${data.fecha_operacion}`;
                } else {
                    periodo = `Por el periodo comprendido del 1 al ${obtenerDiasEnMes(data.mes, data.anio)} de ${obtenerNombreMes(data.mes)} ${data.anio} `;
                }

                if (registrosPorSucursal.hasOwnProperty(sucursal)) {
                    const registros = registrosPorSucursal[sucursal];
                    const worksheet = workbook.addWorksheet(`Sucursal ${sucursal}`);

                    // Añadir título a la fila 1
                    worksheet.addRow([titulo.result_set[0].Nombre]);
                    // Obtener el número de columnas en tus encabezados
                    const numColumnas = responseData.headers.length;
                    // Obtener la letra de la última columna (por ejemplo, 'N' si tienes 14 columnas)
                    const ultimaLetraColumna = String.fromCharCode('A'.charCodeAt(0) + numColumnas - 1);
                    // Establecer el estilo para cada celda de la fila de encabezados
                    const headerFirstRow = worksheet.getRow(1);
                    headerFirstRow.eachCell((cell) => {
                        cell.font = {bold: true}; // Color de la letra blanco y negrita
                        cell.alignment = {horizontal: 'center'}; // Alineación central
                    });
                    // Combinar celdas desde A1 hasta la última columna (por ejemplo, N1)
                    worksheet.mergeCells(`A1:${ultimaLetraColumna}1`);

                    worksheet.addRow([reporte.Descripcion]);
                    const headerSecondRow = worksheet.getRow(2);
                    headerSecondRow.eachCell((cell) => {
                        cell.font = {bold: true}; // Color de la letra blanco y negrita
                        cell.alignment = {horizontal: 'center'}; // Alineación central
                    });
                    // Combinar celdas desde A2 hasta la última columna (por ejemplo, N2)
                    worksheet.mergeCells(`A2:${ultimaLetraColumna}2`);

                    worksheet.addRow([periodo])
                    const headerThirdRow = worksheet.getRow(3);
                    headerThirdRow.eachCell((cell) => {
                        cell.font = {bold: true}; // Color de la letra blanco y negrita
                        cell.alignment = {horizontal: 'center'}; // Alineación central
                    });
                    // Combinar celdas desde A3 hasta la última columna (por ejemplo, N3)
                    worksheet.mergeCells(`A3:${ultimaLetraColumna}3`);

                    // Agregar encabezado
                    worksheet.addRow(responseData.headers); // Reemplaza con tus encabezados
                    // Estilo para los encabezados
                    const headerRow = worksheet.getRow(4); // Fila de encabezados

                    // Establecer el estilo para cada celda de la fila de encabezados
                    headerRow.eachCell((cell, index) => {
                        cell.font = {color: {argb: 'FFFFFF'}, bold: true}; // Color de la letra blanco y negrita
                        cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: '012970'}}; // Color de fondo azul oscuro
                        cell.alignment = {horizontal: 'center'}; // Alineación central
                        const column = worksheet.getColumn(index + 1); // Indexamos desde 1
                        const headerLength = headerRow.toString().length;
                        const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
                        column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
                    });

                    // Agregar los datos de la sucursal a la hoja de cálculo
                    registros.forEach((fila) => {
                        // Agregar los datos ordenados a la hoja de cálculo
                            const rowData = responseData.headers.map((column) => fila[column]);
                            // Aplicar filtros
                            filters.forEach((filtro) => {
                                const {columna, filter} = filtro;
                                const columnIndex = responseData.headers.indexOf(columna);

                                if (columnIndex !== -1) {
                                    // Verificar si el índice de la columna está dentro de los límites de la fila
                                    if (columnIndex < rowData.length) {
                                        // Aplicar el filtro a la celda correspondiente
                                        if (filter !== 'tooltip') {
                                            rowData[columnIndex] = applyFilter(filter, parseFloat(rowData[columnIndex]));
                                        }
                                    }
                                }
                            });

                            rowData.forEach((valor, index) => {
                                const column = worksheet.getColumn(index + 1); // Indexamos desde 1
                                const cellLength = valor ? valor.toString().length : 0;
                                const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
                                column.width = Math.max(currentWidth, cellLength + 2); // Ajustar el ancho de la columna
                            });

                            worksheet.addRow(rowData);

                    });

                    // Calcular y agregar los totales
                    const totalsRow = worksheet.addRow([]);

                    // Establecer el valor de la primera celda como "Totales" y aplicar estilo
                    const totalsCell = totalsRow.getCell(1);
                    totalsCell.value = 'Totales';
                    totalsCell.font = { bold: true }; // Asegurar que el texto esté en negrita
                    totalsCell.alignment = { horizontal: 'center' }; // Alinear el texto al centro

                    headerRow.eachCell((headerCell, index) => {
                        const columnName = headerCell.value;
                        const keywords = filters.map(filtro => filtro.columna);
                        const keywordsSinSuma = ['Cambio','Promedio','Saldo'];
                        // Verificar si el nombre de la columna contiene al menos una de las palabras clave
                        const containsKeyword = keywords.some(keyword => columnName.includes(keyword));

                        if (index > 0 && containsKeyword) {
                            const columnValues = worksheet.getColumn(index).values.slice(4); // Comenzar desde la quinta fila (después de los encabezados)
                            let total = 0;

                            columnValues.forEach((val, rowIndex) => {
                                if (rowIndex === 0) return; // Ignorar la primera fila (nombre de la columna)

                                const parsedValue = parseFloat(val.replace(/[^\d.-]/g, '')); // Eliminar caracteres no numéricos antes de intentar convertir a número
                                if (!isNaN(parsedValue)) {
                                    // Verificar si el nombre de la columna es un dígito
                                    const columnNameIsDigit = /^\d+$/.test(columnName);
                                    const containsSinSuma = keywordsSinSuma.some(keyword => columnName.includes(keyword));
                                    if ((!columnNameIsDigit || rowIndex !== 0) && !containsSinSuma) {
                                        total += parsedValue;
                                    }
                                }
                            })

                            if (total !== 0) { // Solo asignar el total si no es cero
                                totalsRow.getCell(index).value = total;
                                totalsRow.font = { bold: true }; // Asegurar que el texto esté en negrita
                                // Aplicar filtro currency a la columna
                                worksheet.getColumn(index).numFmt = '#,##0.00';
                            } else {
                                totalsRow.getCell(index).value = ''; // Dejar vacía la celda de total si la sumatoria es cero
                            }
                        } else {
                            if(index !== 1) totalsRow.getCell(index).value = ''; // Dejar vacías las celdas de los totales para las columnas que no cumplen con los requisitos
                        }
                    });


                }
            }

            // Construir el blob y descargar el archivo
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

            // Descargar el archivo
            saveAs(blob, fileName + '.xlsx');

        }
        else{
            toast.warn('No se encontró información para este periodo, favor de validar si hubo operaciones.',OPTIONS)
        }
        setGuarda(false);
    }

    const createPDFReport = (responseData, titulo, data) => {
        // Nombre del archivo final a descargar
        let fileName= nombreArchivo(data);
        // Crear un nuevo objeto jsPDF
        const pdf = new jsPDF({
            orientation: 'l',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true
        });

        let counter = 0;

        // Objeto para almacenar los registros organizados por número de sucursal
        let registrosPorSucursal = {};
        // Iterar sobre los registros y organizarlos por número de sucursal
        responseData.result_set?.forEach(registro => {
            const noSucursal = registro["No. Sucursal"] || registro["Sucursal"];
            if (!registrosPorSucursal[noSucursal]) {
                registrosPorSucursal[noSucursal] = [];
            }
            registrosPorSucursal[noSucursal].push(registro);
        });

        // Iterar sobre cada sucursal y crear una tabla para cada una
        for (const sucursal in registrosPorSucursal) {
            if (registrosPorSucursal.hasOwnProperty(sucursal)) {
                const sucursalData = registrosPorSucursal[sucursal];

                let periodo = "";
                console.log("REPORTE: ",reporte);
                if (reporte.Periodo === 'Diario') {
                    periodo = `Por el periodo comprendido al ${data.fecha_operacion}`;
                } else {
                    periodo = `Por el periodo comprendido del 1 al ${obtenerDiasEnMes(data.mes, data.anio)} de ${obtenerNombreMes(data.mes)} ${data.anio} `;
                }

                // Agregar títulos al PDF
                pdf.setFontSize(8);
                pdf.text(titulo.result_set[0].Nombre, 150, 10, {align: "center"});
                // Agregar título de la sucursal
                pdf.text(`Sucursal ${sucursal}`, 150, 15,{align: "center"});
                pdf.text(reporte.Descripcion, 150, 20, {align: "center"});
                pdf.text(periodo, 150, 25, {align: "center"});

                // Crear una tabla para esta sucursal
                const headers = responseData.headers;

                // Calcular totales
                const totalsRow = headers.map((header, index) => {
                    const keywords = filters.map(filtro => filtro.columna);
                    const containsKeyword = keywords.some(keyword => header.includes(keyword));
                    const keywordsSinSuma = ['Cambio','Promedio','Saldo'];
                    const containsSinSuma = keywordsSinSuma.some(keyword => header.includes(keyword));

                    if (index > 0 && containsKeyword && !containsSinSuma ) {
                        const total = sucursalData.reduce((acc, curr) => acc + (parseFloat(curr[header]) || 0), 0);
                        return total.toFixed(2);
                    } else {
                        if (index === 0) return 'Totales';
                        else return '';
                    }
                });

                // Aplicar filtros y formato a la fila de totales

                totalsRow.forEach((value, index) => {
                    const header = headers[index];
                    const keywordsSinSuma = ['Cambio','Promedio','Saldo'];
                    const containsSinSuma = keywordsSinSuma.some(keyword => header.includes(keyword));
                    if(!containsSinSuma){
                        const filter = getFilterForColumn(header);
                        if (filter && filter !== 'tooltip') {
                            totalsRow[index] = applyFilter(filter, parseFloat(value));
                        }
                    }
                });

                // Aplicar filtros y formato a los datos en el PDF
                sucursalData.forEach((fila) => {
                    headers.forEach((columna) => {
                        const filter = getFilterForColumn(columna);
                        if (filter && filter !== 'tooltip') {
                            fila[columna] = applyFilter(filter, parseFloat(fila[columna]));
                        }
                    });
                });

                // Generar la tabla para el PDF
                let rows = sucursalData.map(fila => headers.map(header => fila[header]));

                // Agregar fila de totales al final del arreglo rows
                rows.push(totalsRow);

                pdf.autoTable({
                    head: [headers],
                    body: rows,
                    startY: 40,
                    theme: 'grid',
                    styles: {
                        fontSize: 8,
                        cellPadding: 1,
                        valign: 'middle',
                        halign: 'center',
                        overflow: 'linebreak',
                        lineWidth: 0.1,
                    },
                    headStyles: {
                        fillColor: [1, 41, 112],
                        textColor: [255, 255, 255]
                    },
                    columnStyles: {
                        0: { cellWidth: 20 },
                    },
                    margin: { top: 30 },
                });
                // Agregar información de generación del reporte
                pdf.setFontSize(8);
                pdf.text(`Generado por: ${dataG.username} el ${formattedDateDD} a las ${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, "0")}:${new Date().getSeconds()}  ${new Date().getHours() >= 12 ? 'PM' : 'AM'}`, 200, 200);
                counter++;
                if (counter < Object.keys(registrosPorSucursal).length){
                    pdf.addPage();
                }
            }
        }
        // Descargar el PDF
        pdf.save(`${fileName}.pdf`);
        setGuarda(false);
    }


    const generaReporteContable = handleSubmit(async (data) => {
        setGuarda(true);
        data.proceso = reporte.Proceso;
        /*
           Si la sucursal es la que esta generando el reporte entonces no le solicites la sucursal directamente,
           solamente agrega el parametro manualmente.
         */
        if (dataG.id_perfil === 3) {
            data.sucursal = dataG.sucursal.toString();
        }
        const titulo = await obtenTitulo();


        const encryptedData = encryptRequest(data);
        const responseData = await consultaReporteFinal(encryptedData);

        if(responseData.total_rows === 0){
            toast.warn("No se ha encontrado información con los parametros ingresados. Te recomendamos verificar si hay operaciones registradas.",OPTIONS);
            setGuarda(false);
        }
        else{
            // Si la sucursal que se llamo fue TODAS entonces se muestra la logica de la paginacion por hojas en el excel y PDF
            if (parseInt(data.sucursal) === 1000){
                if (dataG.id_perfil !== 7) {
                    createExcelReport(responseData, titulo, data);
                }
                createPDFReport(responseData, titulo, data)
            }
            else{
                let fileName= nombreArchivo(data);
                const datosOrdenados = responseData.result_set.map((fila) => {
                    const filaOrdenada = {};
                    responseData.headers.forEach((columna) => {
                        filaOrdenada[columna] = fila[columna];
                    });
                    return filaOrdenada;
                });

                if (responseData.total_rows > 0) {
                    const titulo = await obtenTitulo();
                    //Tercer header
                    let periodo = "";
                    if (reporte.Periodo === 'Diario') {
                        periodo = `Por el periodo comprendido al ${data.fecha_operacion}`;
                    } else {
                        periodo = `Por el periodo comprendido del 1 al ${obtenerDiasEnMes(data.mes, data.anio)} de ${obtenerNombreMes(data.mes)} ${data.anio} `;
                    }
                    if (dataG.id_perfil !== 7) {
                        // Crear un nuevo libro de Excel
                        const workbook = new ExcelJS.Workbook();
                        const worksheet = workbook.addWorksheet("Reporte");

                        // Añadir título a la fila 1
                        worksheet.addRow([titulo.result_set[0].Nombre]);
                        // Obtener el número de columnas en tus encabezados
                        const numColumnas = responseData.headers.length;
                        // Obtener la letra de la última columna (por ejemplo, 'N' si tienes 14 columnas)
                        const ultimaLetraColumna = String.fromCharCode('A'.charCodeAt(0) + numColumnas - 1);
                        // Establecer el estilo para cada celda de la fila de encabezados
                        const headerFirstRow = worksheet.getRow(1);
                        headerFirstRow.eachCell((cell) => {
                            cell.font = {bold: true}; // Color de la letra blanco y negrita
                            cell.alignment = {horizontal: 'center'}; // Alineación central
                        });
                        // Combinar celdas desde A1 hasta la última columna (por ejemplo, N1)
                        worksheet.mergeCells(`A1:${ultimaLetraColumna}1`);

                        worksheet.addRow([`${reporte.Descripcion} ${data.moneda === '' ? '':`EN ${getTextDivisa(data.moneda).plural.toUpperCase()}`}`]);
                        const headerSecondRow = worksheet.getRow(2);
                        headerSecondRow.eachCell((cell) => {
                            cell.font = {bold: true}; // Color de la letra blanco y negrita
                            cell.alignment = {horizontal: 'center'}; // Alineación central
                        });
                        // Combinar celdas desde A2 hasta la última columna (por ejemplo, N2)
                        worksheet.mergeCells(`A2:${ultimaLetraColumna}2`);

                        worksheet.addRow([periodo])
                        const headerThirdRow = worksheet.getRow(3);
                        headerThirdRow.eachCell((cell) => {
                            cell.font = {bold: true}; // Color de la letra blanco y negrita
                            cell.alignment = {horizontal: 'center'}; // Alineación central
                        });
                        // Combinar celdas desde A3 hasta la última columna (por ejemplo, N3)
                        worksheet.mergeCells(`A3:${ultimaLetraColumna}3`);

                        // Agregar encabezado
                        worksheet.addRow(responseData.headers); // Reemplaza con tus encabezados
                        // Estilo para los encabezados
                        const headerRow = worksheet.getRow(4); // Fila de encabezados

                        // Establecer el estilo para cada celda de la fila de encabezados
                        headerRow.eachCell((cell, index) => {
                            cell.font = {color: {argb: 'FFFFFF'}, bold: true}; // Color de la letra blanco y negrita
                            cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: '012970'}}; // Color de fondo azul oscuro
                            cell.alignment = {horizontal: 'center'}; // Alineación central
                            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
                            const headerLength = headerRow.toString().length;
                            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
                            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
                        });

                        // Agregar los datos ordenados a la hoja de cálculo
                        datosOrdenados.forEach((fila, index) => {
                            const rowData = responseData.headers.map((column) => fila[column]);

                            // Aplicar filtros
                            filters.forEach((filtro) => {
                                const {columna, filter} = filtro;
                                const columnIndex = responseData.headers.indexOf(columna);

                                if (columnIndex !== -1) {
                                    // Verificar si el índice de la columna está dentro de los límites de la fila
                                    if (columnIndex < rowData.length) {
                                        // Aplicar el filtro a la celda correspondiente
                                        if (filter !== 'tooltip') {
                                            rowData[columnIndex] = applyFilter(filter, parseFloat(rowData[columnIndex]));
                                        }
                                    }
                                }
                            });

                            rowData.forEach((valor, index) => {
                                const column = worksheet.getColumn(index + 1); // Indexamos desde 1
                                const cellLength = valor ? valor.toString().length : 0;
                                const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
                                column.width = Math.max(currentWidth, cellLength + 2); // Ajustar el ancho de la columna
                            });

                            worksheet.addRow(rowData);
                        });

                        // Calcular y agregar los totales
                        const totalsRow = worksheet.addRow([]);

                        // Establecer el valor de la primera celda como "Totales" y aplicar estilo
                        const totalsCell = totalsRow.getCell(1);
                        totalsCell.value = 'Totales';
                        totalsCell.font = { bold: true }; // Asegurar que el texto esté en negrita
                        totalsCell.alignment = { horizontal: 'center' }; // Alinear el texto al centro

                        headerRow.eachCell((headerCell, index) => {
                            const columnName = headerCell.value;
                            const keywords = filters.map(filtro => filtro.columna);
                            const keywordsSinSuma = ['Cambio','Promedio','Saldo','Limite Max','Excedente','Denominacion'];
                            // Verificar si el nombre de la columna contiene al menos una de las palabras clave
                            const containsKeyword = keywords.some(keyword => columnName.includes(keyword));

                            if (index > 0 && containsKeyword) {
                                const columnValues = worksheet.getColumn(index).values.slice(4); // Comenzar desde la quinta fila (después de los encabezados)
                                let total = 0;

                                columnValues.forEach((val, rowIndex) => {
                                    if (rowIndex === 0) return; // Ignorar la primera fila (nombre de la columna)
                                    // Verificar si val es un número.
                                    const parsedValue = parseFloat(val.replace(/[^\d.-]/g, ''));
                                    if (!isNaN(parsedValue)) {
                                        // Verificar si el nombre de la columna es un dígito
                                        const columnNameIsDigit = /^\d+$/.test(columnName);
                                        const containsSinSuma = keywordsSinSuma.some(keyword => {
                                            if(columnName === 'Saldo Inicial USD' || columnName === 'Saldo Inicial MXP' ||
                                                columnName === 'Saldo Final USD' || columnName === 'Saldo Final MXP'){
                                                return false;
                                            }
                                            return columnName.includes(keyword)
                                        });
                                        if ((!columnNameIsDigit || rowIndex !== 0) && !containsSinSuma) {
                                            total += parsedValue;
                                        }
                                    }
                                })

                                if (total !== 0) { // Solo asignar el total si no es cero
                                    totalsRow.getCell(index).value = total;
                                    totalsRow.font = { bold: true }; // Asegurar que el texto esté en negrita
                                    // Verificar si el filtro de la columna es 'currency' y aplicar el formato de moneda si es así
                                    const currencyFilter = filters.find(filtro => filtro.columna === columnName && filtro.filter === 'currency');
                                    if(currencyFilter) {
                                        worksheet.getColumn(index).numFmt = '$#,##0.00';
                                    }
                                } else {
                                    totalsRow.getCell(index).value = ''; // Dejar vacía la celda de total si la sumatoria es cero
                                }
                            }else {
                                if(index !== 1) totalsRow.getCell(index).value = ''; // Dejar vacías las celdas de los totales para las columnas que no cumplen con los requisitos
                            }
                        });

                        // Construir el blob y descargar el archivo
                        const buffer = await workbook.xlsx.writeBuffer();
                        const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

                        // Descargar el archivo
                        saveAs(blob, fileName + '.xlsx');
                    }

                    // Crear un nuevo objeto jsPDF
                    const pdf = new jsPDF({
                        orientation: 'l',
                        unit: 'mm',
                        format: 'a4',
                        putOnlyUsedFonts: true
                    });

                    // Agregar títulos al PDF
                    pdf.setFontSize(8);
                    pdf.text(titulo.result_set[0].Nombre, 150, 10, {align: "center"});
                    if (dataG.id_perfil === 3 && reportesSuc.includes(data.tipo_reporte)) {
                        pdf.text(`${dataG.sucursal} - ${dataG.nombre_sucursal}`, 150, 15, {align: "center"});
                    }
                    pdf.text(`${reporte.Descripcion} ${data.moneda === '' ? '':`EN ${getTextDivisa(data.moneda).plural.toUpperCase()}`}`, 150, 20, {align: "center"});
                    pdf.text(periodo, 150, 25, {align: "center"});

                    // Crear una tabla
                    const headers = responseData?.headers;
                    // const dataT = responseData?.result_set.map(fila => headers.map(header => fila[header]));

                    // Calcular totales
                    const totalsRow = headers.map((header, index) => {
                        const keywords = filters.map(filtro => filtro.columna);
                        const containsKeyword = keywords.some(keyword => header.includes(keyword));
                        const keywordsSinSuma = ['Cambio','Promedio','Saldo','Limite Max','Excedente','Denominacion'];
                        const containsSinSuma = keywordsSinSuma.some(keyword => {
                            if(header === 'Saldo Inicial USD' || header === 'Saldo Inicial MXP'
                                || header === 'Saldo Final USD' || header === 'Saldo Final MXP'){
                                return false;
                            }
                            return header.includes(keyword)
                        });

                        if (index > 0 && containsKeyword && !containsSinSuma) {
                            const total = datosOrdenados.reduce((acc, curr) => acc + (parseFloat(curr[header]) || 0), 0);
                            return total.toFixed(2);
                        } else {
                            if (index === 0) return 'Totales';
                            else return '';
                        }
                    });

                    // Aplicar filtros y formato a la fila de totales
                    totalsRow.forEach((value, index) => {
                        const header = headers[index];
                        const keywordsSinSuma = ['Cambio','Promedio','Saldo','Limite Max','Excedente','Denominacion'];
                        const containsSinSuma = keywordsSinSuma.some(keyword => {
                            if(header === 'Saldo Inicial USD' || header === 'Saldo Inicial MXP' ||
                                header === 'Saldo Final USD' || header === 'Saldo Final MXP'){
                                return false;
                            }
                            return header.includes(keyword)
                        });
                        if(!containsSinSuma){
                            const filter = getFilterForColumn(header);
                            if (filter && filter !== 'tooltip') {
                                totalsRow[index] = applyFilter(filter, parseFloat(value));
                            }
                        }
                    });

                    // Aplicar filtros y formato a los datos en el PDF
                    datosOrdenados.forEach((fila) => {
                        headers.forEach((columna) => {
                            const filter = getFilterForColumn(columna);
                            if (filter && filter !== 'tooltip') {
                                fila[columna] = applyFilter(filter, parseFloat(fila[columna]));
                            }
                        });
                    });

                    // Generar la tabla para el PDF
                    let rows = datosOrdenados.map(fila => headers.map(header => fila[header]));

                    // Agregar fila de totales al final del arreglo rows
                    rows.push(totalsRow);

                    pdf.autoTable({
                        head: [headers],  // Encabezados de la tabla
                        body: rows,  // Datos de la tabla
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
                            0: {cellWidth: 20},  // Ancho de la primera columna
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
            }
        }
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
                            <option value="">SELECCIONA UNA OPCIÓN</option>
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
                                    onChange={(e)=> {
                                        setCurrentDate(e.target.value);
                                        setValue("fecha_operacion",currentDate)
                                        trigger("fecha_operacion")
                                    }}
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
                    reporte?.Sucursal === 'Si' && ![3,4].includes(dataG.id_perfil)
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
                                    <option value="">SELECCIONA UNA OPCIÓN</option>
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
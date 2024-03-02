import {useEffect, useState} from "react";
import {
    encryptRequest, FormatoMoneda,
    formattedDateDD,
    getTextDivisa,
    obtenerDiasEnMes,
    obtenerNombreMes,
    OPTIONS
} from "../../../../../utils";
import {dataG} from "../../../../../App";
import {consultaReporteCajaContable, obtenTitulo} from "../../../../../services/reportes-services";
import * as ExcelJS from "exceljs";
import jsPDF from "jspdf";
import {toast} from "react-toastify";
import {ModalLoading} from "../../../modals/ModalLoading";
import { saveAs } from 'file-saver';

export const ReporteCaja = ({item, index, columna, params}) => {

    const [guarda, setGuarda] = useState(false);
    const [detalleReporte, setDetalleReporte] = useState([]);

    const obtieneDetalle = async () => {
        const id_opciones = [1,2];
        try {
            const results = await Promise.all(id_opciones.map((id) =>{
                const values = {
                    opcion: id,
                    sucursal: dataG.sucursal,
                    ticket: item["No Movimiento"],
                }
                const encryptedData = encryptRequest(values);
                return consultaReporteCajaContable(encryptedData);
            }));
            setDetalleReporte(results);
            console.log("detalleReporte!")
            console.log(detalleReporte)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        obtieneDetalle();
    }, []);

    useEffect(() => {
        obtieneDetalle();
    }, [item["No Movimiento"]]);

    useEffect(() => {
        console.log("detalleReporte desde el estado:");
        console.log(detalleReporte);
    }, [detalleReporte]);

    const optionsLoad = {
        showModal: guarda,
        closeCustomModal: () => setGuarda(false),
        title: "Descargando Reporte de Caja ...",
    };

    const filters = [
        {columna:"Importe", filter:"currency"},
        {columna:"Cantidad", filter:"entera"},
        {columna:"Denominacion", filter:"currency"},
    ]

    const applyFilter = (filtro, valor) => {
        if(filtro === 'currency'){
            if(valor === '' || valor === null || isNaN(valor)){
                return FormatoMoneda(0);
            }else{
                return FormatoMoneda(valor);
            }

        } else if (filtro === 'tooltip') {
            return valor && valor.slice(0, 12) + '...';
        }else{
            return parseInt(valor);
        }
        return valor;
    }

    const getFilterForColumn = (columna) => {
        const filterObject = filters.find((filtro) => filtro.columna === columna);
        return filterObject ? filterObject.filter : null;
    };

    const createReportCaja = async(titulo) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${params.opcion === 1 ? 'Reporte de Caja':'Reporte de Cierre de Caja'}`);
        const title =  titulo.result_set[0].Nombre;
        // Añadir título a la fila 1
        worksheet.addRow([title]);
        const headerFirstRow = worksheet.getRow(1);
        headerFirstRow.eachCell((cell) => {
            cell.font = {bold: true}; // Color de la letra blanco y negrita
            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
            const headerLength = headerFirstRow.toString().length;
            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
        });
        // Añadir título a la fila 2
        worksheet.addRow([`${params.opcion === 1 ? 'REPORTE DE DOTACION DE FONDOS DE CAJA PRINCIPAL A CAJEROS':'CORTE DE CAJA DE CAJERO A CAJA PRINCIPAL'}`]);
        const secondFirstRow = worksheet.getRow(2);
        secondFirstRow.eachCell((cell) => {
            cell.font = {bold: true}; // Color de la letra blanco y negrita
            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
            const headerLength = secondFirstRow.toString().length;
            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
        });
        worksheet.addRow(["SUCURSAL",detalleReporte[0].result_set[0].Sucursal])
        const headerThirdRow = worksheet.getRow(3);
        headerThirdRow.eachCell((cell,index) => {
            if(index === 1) cell.font = {bold: true}; // Color de la letra blanco y negrita
            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
            const headerLength = headerThirdRow.toString().length;
            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
        });
        worksheet.addRow(["CAJERO",detalleReporte[0].result_set[0].Caja])
        const headerFourthRow = worksheet.getRow(4);
        headerFourthRow.eachCell((cell,index) => {
            if(index === 1) cell.font = {bold: true}; // Color de la letra blanco y negrita
            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
            const headerLength = headerFourthRow.toString().length;
            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
        });
        worksheet.addRow(["FECHA",`${detalleReporte[0].result_set[0].Fecha} ${detalleReporte[0].result_set[0].Hora}`])
        const headerFifthRow = worksheet.getRow(5);
        headerFifthRow.eachCell((cell,index) => {
            if(index === 1) cell.font = {bold: true}; // Color de la letra blanco y negrita
            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
            const headerLength = headerFifthRow.toString().length;
            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
        });

        worksheet.addRow([])
        worksheet.addRow([])

        worksheet.addRow([`${getTextDivisa(detalleReporte[0].result_set[0].Moneda).plural.toUpperCase()}`])
        const headerSixthRow = worksheet.getRow(8);
        headerSixthRow.eachCell((cell,index) => {
            cell.font = {color: {argb: 'FFFFFF'}, bold: true}; // Color de la letra blanco y negrita
            cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'b9b9b9'}}; // Color de fondo azul oscuro
            cell.alignment = {horizontal: 'center'}; // Alineación central
            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
            const headerLength = headerSixthRow.toString().length;
            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
        });
        // Combinar celdas desde A1 hasta la última columna (por ejemplo, N1)
        worksheet.mergeCells(`A8:B8`);

        worksheet.addRow([,,,"IMPORTE"]);
        const headerSeventhRow = worksheet.getRow(9);
        headerSeventhRow.eachCell((cell) => {
            cell.font = {bold: true}; // Color de la letra blanco y negrita
            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
            const headerLength = headerSeventhRow.toString().length;
            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
        });
        worksheet.addRow([,"DENOMINACIÓN","CANTIDAD",detalleReporte[0].result_set[0].Moneda]);
        const headerEigthRow = worksheet.getRow(10);
        headerEigthRow.eachCell((cell) => {
            cell.font = {bold: true}; // Color de la letra blanco y negrita
            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
            const headerLength = headerEigthRow.toString().length;
            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
        });
        worksheet.addRow([]);

        // Tabla de denominaciones
        // Agregar los datos ordenados a la hoja de cálculo
        detalleReporte[1].result_set.forEach((fila, index) => {
            const rowData = detalleReporte[1].headers.map((column) => fila[column]);

            // Aplicar filtros
            filters.forEach((filtro) => {
                const {columna, filter} = filtro;
                const columnIndex = detalleReporte[1].headers.indexOf(columna);

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
        worksheet.addRow([]);

        const sumaImportes = detalleReporte[1].result_set.reduce((acumulador, objeto) => {
            // Convertimos el valor de la propiedad "Importe" a número y lo sumamos al acumulador
            return acumulador + parseFloat(objeto.Importe);
        }, 0);

        worksheet.addRow([,`TOTAL ${detalleReporte[0].result_set[0].Moneda === 'USD' ?'DÓLARES':'PESOS MEXICANOS'}`,"",FormatoMoneda(sumaImportes)]);
        const headerNinthRow = worksheet.getRow(detalleReporte[0].result_set[0].Moneda === 'MXP'?27:20,);
        headerNinthRow.eachCell((cell) => {
            cell.font = {bold: true}; // Color de la letra blanco y negrita
            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
            const headerLength = headerNinthRow.toString().length;
            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
        });
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([,`CAJA PRINCIPAL`,"","CAJERO"]);
        const headerTenthRow = worksheet.getRow(detalleReporte[0].result_set[0].Moneda === 'MXP'?30:23);
        headerTenthRow.eachCell((cell,index) => {
            cell.font = {bold: true}; // Color de la letra blanco y negrita
            cell.alignment = { horizontal: 'center' };
            if(index === 1 || index === 3){cell.border = {
                top: {style:'thin', color: {argb:'000000'}} // Establece el estilo del borde y el color negro
            };}
            const column = worksheet.getColumn(index + 1); // Indexamos desde 1
            const headerLength = headerTenthRow.toString().length;
            const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
            column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
        });
        // Construir el blob y descargar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

        // Descargar el archivo
        saveAs(blob, `${dataG.sucursal} - Dotación de Caja ${formattedDateDD}.xlsx`);

    }

    const createReportCajaPDF = async(titulo) => {
        // Crear un nuevo objeto jsPDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true
        });

        const styles = {
            bold: {
                fontStyle: 'bold'
            },
            tableHeader: {
                fontSize: 12,
                fontStyle: 'bold',
                textColor: [255, 255, 255], // Blanco
                fillColor: [185, 185, 185] // Azul oscuro
            },
            tableRow: {
                fontSize: 10,
                textColor: [0, 0, 0] // Negro
            }
        };


        // Agregar títulos al PDF
        pdf.setFontSize(8);
        //pdf.setFont('',"bold");
        pdf.text(titulo.result_set[0].Nombre, 100, 10, {align: "center"});
        pdf.text(`REPORTE DE DOTACIÓN DE FONDOS DE CAJA PRINCIPAL A CAJEROS`, 100, 15, {align: "center"});

        // Datos para la tabla
        const tableData = [
            ['SUCURSAL', detalleReporte[0].result_set[0].Sucursal],
            ['CAJERO', detalleReporte[0].result_set[0].Caja],
            ['FECHA', `${detalleReporte[0].result_set[0].Fecha} ${detalleReporte[0].result_set[0].Hora}`]
        ];

        // Generar tabla
        pdf.autoTable({
            startY: 20,
            body: tableData,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2,
                valign: 'middle',
                halign: 'left'
            },
            autoSize: true
        });

        // Agregar títulos al PDF
        pdf.setFont(styles.tableHeader.fontStyle);
        pdf.setTextColor(...styles.tableHeader.textColor);
        pdf.setFillColor(...styles.tableHeader.fillColor);
        pdf.text(`${getTextDivisa(detalleReporte[0].result_set[0].Moneda).plural.toUpperCase()}`, 100, 50);
        // Crear una tabla
        const headers = detalleReporte[1]?.headers;
        // const dataT = responseData?.result_set.map(fila => headers.map(header => fila[header]));

        // Calcular totales
        const totalsRow = headers.map((header, index) => {
            const keywords = filters.map(filtro => filtro.columna);
            const containsKeyword = keywords.some(keyword => header.includes(keyword));
            const keywordsSinSuma = ['Denominacion','Cantidad'];
            const containsSinSuma = keywordsSinSuma.some(keyword => header.includes(keyword));

            if (index > 0 && containsKeyword && !containsSinSuma) {
                const total = detalleReporte[1].result_set.reduce((acc, curr) => acc + (parseFloat(curr[header]) || 0), 0);
                return total.toFixed(2);
            } else {
                if (index === 0) return `TOTAL ${detalleReporte[0].result_set[0].Moneda === 'USD' ?'DÓLARES':'PESOS MEXICANOS'}`;
                else return '';
            }
        });

        // Aplicar filtros y formato a la fila de totales
        totalsRow.forEach((value, index) => {
            const header = headers[index];
            const keywordsSinSuma = ['Denominacion','Cantidad'];
            const containsSinSuma = keywordsSinSuma.some(keyword => header.includes(keyword));
            if(!containsSinSuma){
                const filter = getFilterForColumn(header);
                if (filter && filter !== 'tooltip') {
                    totalsRow[index] = applyFilter(filter, parseFloat(value));
                }
            }
        });

        // Aplicar filtros y formato a los datos en el PDF
        detalleReporte[1].result_set.forEach((fila) => {
            headers.forEach((columna) => {
                const filter = getFilterForColumn(columna);
                if (filter && filter !== 'tooltip') {
                    fila[columna] = applyFilter(filter, parseFloat(fila[columna]));
                }
            });
        });

        // Generar la tabla para el PDF
        let rows = detalleReporte[1].result_set.map(fila => headers.map(header => fila[header]));

        // Agregar fila de totales al final del arreglo rows
        rows.push(totalsRow);

        pdf.autoTable({
            head: [headers],  // Encabezados de la tabla
            body: rows,  // Datos de la tabla
            startY: 60,
            startX: 100,
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
                0: {cellWidth: 30},
                1: {cellWidth: 30},
                2: {cellWidth: 30},
            },
        });
        pdf.setFontSize(8);
        pdf.text(`Generado por: ${dataG.username} el ${formattedDateDD} a las ${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, "0")}:${new Date().getSeconds()}  ${new Date().getHours() >= 12 ? 'PM' : 'AM'}`, 130, 250);

        // Descargar el PDF
        pdf.save(`${dataG.sucursal} - Dotación de Caja ${formattedDateDD}.pdf`);
    }

    const onDownloadReport = async () => {
        //setGuarda(true);
        const titulo = await obtenTitulo();
        createReportCaja(titulo);
        //createReportCajaPDF(titulo);
        /*

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
            const keywordsSinSuma = ['Cambio','Promedio','Saldo'];
            const containsSinSuma = keywordsSinSuma.some(keyword => header.includes(keyword));

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
        setGuarda(false);*/
        //setGuarda(false);
    }

    return (
        <td key={index} className="text-center">
            <button className="btn btn-cotizar me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Descargar Reporte"
                    onClick={onDownloadReport}
            disabled={item.Estatus === 'Pendiente'}>
                <i className="ri ri-archive-fill"></i>
            </button>
            {guarda && <ModalLoading options={optionsLoad}/>}
        </td>
    );
}
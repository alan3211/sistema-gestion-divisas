import {useState} from "react";
import {MessageComponent} from "../MessageComponent";
import {
    FormatoMoneda, formattedDate,
    mensajeSinElementos,
    OPTIONS,
} from "../../../utils";

import './table.css';
import {obtenTitulo} from "../../../services/reportes-services";
import * as ExcelJS from "exceljs";
import { saveAs } from 'file-saver';
import {toast} from "react-toastify";
import {Tabla} from "./Tabla";
import jsPDF from "jspdf";

export const TableComponent = ({data: {headers, result_set, total_rows}, options}) => {
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");

    const {
        showMostrar = false,
        excel=false,
        buscar = false,
        paginacion = false,
        tableName = 'Consulta',
        tools = [],
        filters=[],
        disabledColumns=[],
        disabledColumnsExcel=[],
        deps = {},
        params = {},
    } = options || {};

    const handlePerPageChange = (event) => {
        setPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        const totalPages = Math.ceil(filteredData.length / perPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    // Filtrar los datos según el término de búsqueda
    const filteredData = result_set ? result_set?.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))) : [];

    // Calcular el número total de páginas
    const totalPages = Math.ceil(filteredData.length / perPage);

    // Obtener los registros para la página actual
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
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
        }
        return valor;
    }

    const opciones = {
        headers,disabledColumns,sortColumn,sortDirection,handleSort,
        currentData,tools,filters,applyFilter
    };

    // Administracion de la descarga de excel
    const handleDownloadExcel = async() => {
        if (total_rows > 0) {
            const datosOrdenados = result_set.map((fila) => {
                const filaOrdenada = {};
                headers.forEach((columna) => {
                    filaOrdenada[columna] = fila[columna];
                });
                return filaOrdenada;
            });

            // Crear un nuevo libro de Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(tableName);

            const titulo = await obtenTitulo();
            // Añadir título a la fila 1
            worksheet.addRow([titulo.result_set[0].Nombre]);
            // Obtener el número de columnas en tus encabezados
            const numColumnas = headers.length;
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

            worksheet.addRow([tableName]);
            const headerSecondRow = worksheet.getRow(2);
            headerSecondRow.eachCell((cell) => {
                cell.font = { bold: true }; // Color de la letra blanco y negrita
                cell.alignment = { horizontal: 'center' }; // Alineación central
            });
            // Combinar celdas desde A2 hasta la última columna (por ejemplo, N2)
            worksheet.mergeCells(`A2:${ultimaLetraColumna}2`);

            // Agregar encabezado
            worksheet.addRow(headers); // Reemplaza con tus encabezados
            // Estilo para los encabezados
            const headerRow = worksheet.getRow(3); // Fila de encabezados

            // Establecer el estilo para cada celda de la fila de encabezados
            headerRow.eachCell((cell) => {
                cell.font = { color: { argb: 'FFFFFF' }, bold: true }; // Color de la letra blanco y negrita
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '012970' } }; // Color de fondo azul oscuro
                cell.alignment = { horizontal: 'center' }; // Alineación central
            });

            // Eliminar columnas según el array disabledColumnsExcel
            disabledColumnsExcel.forEach((columnToDelete) => {
                const columnIndex = headers.indexOf(columnToDelete);
                if (columnIndex !== -1) {
                    // Eliminar la columna del array de headers
                    headers.splice(columnIndex, 1);

                    // Eliminar la columna de cada fila en datosOrdenados
                    datosOrdenados.forEach((fila) => {
                        delete fila[columnToDelete]; // Eliminar la propiedad del objeto
                    });
                }
            });

        // Agregar los datos ordenados a la hoja de cálculo
            datosOrdenados.forEach((fila, index) => {
                const rowData = headers.map((column) => fila[column]);

                rowData.forEach((valor, index) => {
                    const column = worksheet.getColumn(index + 1); // Indexamos desde 1
                    const cellLength = valor ? valor.toString().length : 0;
                    const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
                    column.width = Math.max(currentWidth, cellLength + 2); // Ajustar el ancho de la columna
                });

                // Aplicar filtros
                filters.forEach((filtro) => {
                    const { columna, filter } = filtro;
                    const columnIndex = headers.indexOf(columna);

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

                worksheet.addRow(rowData);
            });

            // Actualizar el encabezado en la hoja de cálculo
            worksheet.getRow(3).values = headers;

            // Estilo para los encabezados actualizados
            const updatedHeaderRow = worksheet.getRow(3);
            updatedHeaderRow.eachCell((cell,index) => {
                cell.font = { color: { argb: 'FFFFFF' }, bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '012970' } };
                cell.alignment = { horizontal: 'center' };
                const column = worksheet.getColumn(index + 1); // Indexamos desde 1
                const headerLength = headerRow.toString().length;
                const currentWidth = column.width || 12; // Si el ancho actual de la columna es 0, usar 12 como valor predeterminado
                column.width = Math.max(currentWidth, headerLength + 2); // Ajustar el ancho de la columna
            });


            // Construir el blob y descargar el archivo
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const fileName = `Consulta-${formattedDate()}-${tableName}.xlsx`;

            // Descargar el archivo
            saveAs(blob, fileName);
        } else {
            toast.warn(`Hubo un problema para generar el excel con la tabla. Valide si existe información`, OPTIONS);
        }
    };

    // Función para obtener el filtro adecuado para una columna
    const getFilterForColumn = (columna) => {
        const filterObject = filters.find((filtro) => filtro.columna === columna);
        return filterObject ? filterObject.filter : null;
    };


    // Administracion de la descarga de PDF
    const handleDownloadPDF = async() => {
        const titulo = await obtenTitulo();
        // Crear un nuevo objeto jsPDF
        const pdf = new jsPDF({
            orientation: 'l',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true
        });

        // Agregar títulos al PDF
        pdf.text(titulo.result_set[0].Nombre, 150, 10, { align: "center" });
        pdf.text(tableName, 150, 20, { align: "center" });

        // Crear una tabla
        const datosOrdenados = result_set.map((fila) => {
            const filaOrdenada = {};
            headers.forEach((columna) => {
                filaOrdenada[columna] = fila[columna];
            });
            return filaOrdenada;
        });
        // Eliminar columnas según el array disabledColumnsExcel
        disabledColumnsExcel.forEach((columnToDelete) => {
            const columnIndex = headers.indexOf(columnToDelete);

            if (columnIndex !== -1) {
                // Eliminar la columna del array de headers
                headers.splice(columnIndex, 1);

                // Eliminar la columna de cada fila en datosOrdenados
                datosOrdenados.forEach((fila) => {
                    fila[columnToDelete] = undefined; // O puedes eliminar completamente la propiedad
                });
            }
        });

        // Aplicar filtros y formato a los datos en el PDF
        datosOrdenados.forEach((fila) => {
            headers.forEach((columna) => {
                const filter = getFilterForColumn(columna); // Obtener el filtro adecuado para la columna
                if (filter) {
                    if (filter !== 'tooltip'){
                        // Aplicar el filtro a la celda correspondiente
                        fila[columna] = applyFilter(filter, parseFloat(fila[columna]));
                    }
                }
            });
        });

        // Generar la tabla para el PDF
        const rows = datosOrdenados.map((fila) => headers.map((columna) => fila[columna]));

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
                0: { cellWidth: 20 },  // Ancho de la primera columna
                // Ajusta los anchos de las columnas según tus necesidades
            },
        });

        // Descargar el PDF
        pdf.save(`${tableName}.pdf`);
    }

    if (total_rows === 0) {
        return (
                <MessageComponent estilos={mensajeSinElementos}>
                    No se encontraron datos con los parametros especificados.
                </MessageComponent>
        );
    }
    return (<>
            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns mx-auto"
                 style={{"fontSize": "12px"}}>
                <div className="datatable-top row">
                    {showMostrar && filteredData.length >= 5 && (
                        <div className="col-3 col-sm-4 col-md-4 col-lg-2 mt-3">
                            <label className="d-flex align-items-center me-2">
                                <span>Mostrar</span>
                                <select
                                    className="datatable-selector ms-2"
                                    value={perPage}
                                    onChange={handlePerPageChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="200">200</option>
                                </select>
                                <span className="ms-2">por página</span>
                            </label>
                        </div>
                    )}
                    <div className="col-12">
                        <div className="row justify-content-end">
                            {buscar && result_set && (
                                <div className="col-12 col-md-3 col-lg-3 mb-2">
                                    <div className="row form-floating">
                                        <input
                                            key="searchTable"
                                            placeholder="Buscar en la tabla"
                                            className="form-control"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            autoComplete="off"
                                        />
                                        <label htmlFor="fecha" className="mt-1">
                                            BUSCAR EN LA TABLA
                                            <i className="bx bx-search ms-2"></i>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {excel && result_set && (
                                <div className="col-12 col-md-3 col-lg-2 mt-2">
                                    <button
                                        className="btn btn-success me-2"
                                        onClick={handleDownloadExcel}
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Descargar Excel"
                                    >
                                        <i className="ri ri-file-excel-2-fill"></i>
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={handleDownloadPDF}
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Descargar PDF"
                                    >
                                        <i className="ri ri-file-pdf-fill"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {
                    currentData.length !== 0 ? (
                        <>
                            <div className="datatable-container table-overflow">
                                <Tabla options={opciones}/>
                            </div>
                            {paginacion && (<div className="datatable-bottom">
                                <div className="datatable-info">
                                    Mostrando
                                    página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> de <strong>{filteredData.length} </strong>
                                    {filteredData.length === 1 ? 'registro': 'registros'}
                                </div>
                                {  filteredData.length > 5 &&
                                    (
                                        <>
                                            <nav className="datatable-pagination">
                                                <ul className="datatable-pagination-list">
                                                    {Array.from({length: totalPages}, (_, index) => index + 1).map((page) => {
                                                            return (<li key={page} className={page === currentPage ? "active" : ""}
                                                                        onClick={() => goToPage(page)}></li>)
                                                        }
                                                    )}
                                                </ul>
                                            </nav>
                                            <nav aria-label="Page navigation">
                                                <ul className="pagination pagination-sm">
                                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={goToPreviousPage}
                                                            aria-label="Previous"
                                                        >
                                                            <span aria-hidden="true">«</span>
                                                        </button>
                                                    </li>
                                                    {Array.from({length: totalPages}, (_, index) => index + 1).map((page) => (<li
                                                            key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                                                            <button className="page-link" onClick={() => goToPage(page)}>
                                                                {page}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={goToNextPage}
                                                            aria-label="Next"
                                                        >
                                                            <span aria-hidden="true">»</span>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav></>)}
                            </div>)
                            }
                        </>
                    )
                    : (
                        <div className="mt-3">
                            <MessageComponent estilos={mensajeSinElementos}>
                                No se han encontrado resultados que coincidan con el filtro proporcionado.
                            </MessageComponent>
                        </div>
                    )

                }

            </div>
        </>);
};


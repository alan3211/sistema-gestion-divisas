import React, {useState} from "react";
import {MessageComponent} from "../MessageComponent";
import {FormatoMoneda, mensajeSinElementos} from "../../../utils";

import './table.css';
import {getTools} from "./operaciones/operaciones-tools";


export const TableComponent = ({data: {headers, result_set, total_rows}, options}) => {
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");

    const {
        showMostrar = false,
        buscar = false,
        paginacion = false,
        tools = [],
        filters=[],
        disabledColumns=[],
    } = options || {};


    if (total_rows === 0) {
        return (<MessageComponent estilos={mensajeSinElementos}>
                No se encontraron datos con los parametros especificados.
            </MessageComponent>);
    }

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
    const filteredData = result_set.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())));

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
            return FormatoMoneda(valor);
        }
    }

    return (<>
            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns"
                 style={{"fontSize": "12px"}}>
                <div className="datatable-top">
                    {
                        (showMostrar && (filteredData.length >= 5)) && (<div className="datatable-dropdown">
                        <label>
                            Mostrar
                            <select
                                className="datatable-selector m-2"
                                value={perPage}
                                onChange={handlePerPageChange}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="200">200</option>
                            </select>
                            por página
                        </label>
                    </div>)}
                    {  (buscar) && (<div className="datatable-search">
                        <div className="search-input-container">
                            <input
                                key="searchTable"
                                placeholder="Buscar en la tabla"
                                className="datatable-input"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <i className="bx bx-search p-2"></i>
                        </div>
                    </div>)}
                </div>
                <div className="datatable-container table-overflow">
                    <table className="table datatable-table table-responsive table-striped">
                        <thead className="table-blue">
                        <tr>
                            {headers.map((key, index) => {
                                if(disabledColumns.includes(key)){
                                    return;
                                }
                                return (<th
                                    key={index}
                                    data-sortable="true"
                                    className={sortColumn === key ? `sorted ${sortDirection} text-center` : "text-center"}
                                    onClick={() => handleSort(key)}
                                >
                                    <a className="datatable-sorter">
                                        {key}
                                    </a>
                                </th>)
                              }
                            )}
                        </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => {
                                return (<tr key={index} data-index={index}>
                                    {headers.map((key, index) => {
                                        if(disabledColumns.includes(key)){
                                            return;
                                        }else{
                                            // Busca el objeto tool correspondiente a la columna actual
                                            const toolInfo = tools.find(tool => tool.columna === key);
                                            // Si se encuentra un objeto tool, renderiza el componente correspondiente
                                            if (toolInfo) {
                                                return getTools(toolInfo,item,index)
                                            } else {
                                                const filterElement = filters.find(element => element.columna === key);

                                                if (filterElement) {
                                                    return (
                                                        <td key={index} className="text-center">
                                                            {applyFilter(filterElement.filter, parseFloat(item[key]))}
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td key={index} className="text-center">
                                                            {item[key]}
                                                        </td>
                                                    );
                                                }
                                            }
                                        }
                                    })}
                                </tr>)
                            }
                            )}
                        </tbody>
                    </table>
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
            </div>
        </>);
};


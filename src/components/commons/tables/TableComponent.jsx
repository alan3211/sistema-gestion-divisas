import React, { useState } from "react";
import {toast} from "react-toastify";

export const TableComponent = ({ data, tools,hacerOperacion}) => {
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");

    if (data.length === 0) {
        return <p>No hay datos disponibles</p>;
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
    const filteredData = data.filter((item) =>
        Object.values(item).some((value) =>
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Calcular el número total de páginas
    const totalPages = Math.ceil(filteredData.length / perPage);

    // Obtener los registros para la página actual
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    const keys = Object.keys(data[0]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const {selecciona} = tools;

    return (
        <>
        <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
            <div className="datatable-top">
                <div className="datatable-dropdown">
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
                        </select>{" "}
                        por página
                    </label>
                </div>
                <div className="datatable-search">
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
                </div>
            </div>
            <div className="datatable-container">
                <table className="table datatable datatable-table">
                    <thead>
                    <tr>
                        {keys.map((key, index) => (
                            <th
                                key={index}
                                data-sortable="true"
                                className={sortColumn === key ? `sorted ${sortDirection} text-center` : "text-center"}
                                onClick={() => handleSort(key)}
                            >
                                <a className="datatable-sorter">
                                    {key}
                                </a>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {currentData.map((item, index) => (
                        <tr key={index} data-index={index}>
                            {keys.map((key, index) => (
                                <td key={index} className="text-center">
                                    {
                                        (selecciona && key==='cliente')
                                        && <span className="badge bg-primary m-2 p-2 cursor-pointer" onClick={() => {
                                            navigator.clipboard.writeText(item.cliente)
                                                .then(() => {
                                                    toast.info('Cliente copiado al portapapeles', {
                                                        position: "top-center",
                                                        autoClose: 3000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        theme: "colored",
                                                    });
                                                })
                                                .catch(error => {
                                                    console.error('Error al copiar al portapapeles: ', error);
                                                });
                                        }}>
                                            <i className="ri-file-copy-line me-2"></i>
                                            Copiar
                                           </span>
                                    }
                                    {item[key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="datatable-bottom">
                <div className="datatable-info">
                    Mostrando página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> de <strong>{filteredData.length} </strong>registros
                </div>
                <nav className="datatable-pagination">
                    <ul className="datatable-pagination-list">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <li
                                key={page}
                                className={page === currentPage ? "active" : ""}
                                onClick={() => goToPage(page)}
                            >
                            </li>
                        ))}
                    </ul>
                </nav>
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={goToPreviousPage}
                                aria-label="Previous"
                            >
                                <span aria-hidden="true">«</span>
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <li
                                key={page}
                                className={`page-item ${page === currentPage ? "active" : ""}`}
                            >
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
                </nav>
            </div>
        </div>
        </>
    );
};


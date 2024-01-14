import {getTools} from "./operaciones/operaciones-tools";

export const Tabla = ({options}) => {

    const {
        headers,disabledColumns,sortColumn,sortDirection,handleSort,
        currentData,tools,filters,applyFilter
    } = options;

    return (<table className="table datatable-table table-responsive table-striped">
        <thead className="table-blue sticky top-0">
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
    </table>)
}
import {formattedDate} from "../../../../utils";
import {TableComponent} from "../../../commons/tables";

export const UltimosMovimientos = ({data}) => {

    const options = {
        showMostrar:true,
        paginacion: true,
        tools:[
            {columna:"Estatus",tool:"estatus"},
        ],
        filters:[
            {columna:"Monto",filter:'currency'},
            {columna:"Monto Entregado",filter:'currency'},
        ]
    }

    return (
        <div className="col-12">
            <div className="card recent-sales overflow-auto">

                <div className="card-body">
                    <h5 className="card-title">
                        <i className="bi bi-currency-exchange me-2"></i>
                        Últimos Movimientos <span>|  {formattedDate}</span>
                    </h5>

                    <TableComponent data={data} options={options} />
                </div>

            </div>
        </div>
    );
}
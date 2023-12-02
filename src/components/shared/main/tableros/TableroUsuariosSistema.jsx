import {formattedDate} from "../../../../utils";

export const TableroUsuariosSistema = () => {

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
                        <i className="bi bi-person-bounding-box me-2"></i>
                        Usuarios <span>|  {formattedDate}</span>
                    </h5>
                </div>

            </div>
        </div>
    );
}
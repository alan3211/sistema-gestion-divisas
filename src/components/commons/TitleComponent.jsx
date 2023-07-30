import {formattedDateDD} from "../../utils/utils";

export const TitleComponent = ({title,icon,fecha})=>{

    return (
        <h5 className="card-title">
            <div className="row">
                <div className="col-md-5 ">
                    {icon && <i className={icon}></i>}
                    <strong>{title}</strong>
                </div>
                {
                    fecha &&
                    <div className="col-md-5 offset-2">
                        <strong>Fecha: {formattedDateDD}</strong>
                    </div>
                }
            </div>
        </h5>
    );
}
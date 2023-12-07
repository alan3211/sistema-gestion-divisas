import {formattedDate} from "../../utils";

export const TitleComponent = ({title,icon})=>{

    return (
        <h5 className="card-title">
            <i className={icon}></i>
            {title} <span>|  {formattedDate}</span>
        </h5>
    );
}
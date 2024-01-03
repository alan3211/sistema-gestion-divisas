import {formattedDate} from "../../utils";

export const TitleComponent = ({title,icon,fecha=false})=>{

    return (
        <h5 className="card-title">
            <i className={icon}></i>
            {title} <span> { fecha && `| ${formattedDate}`}</span>
        </h5>
    );
}
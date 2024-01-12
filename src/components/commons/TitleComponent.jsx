export const TitleComponent = ({title,icon,fecha})=>{

    return (
        <h5 className="card-title">
            <i className={icon}></i>
            {title} <span> { fecha ? `| ${fecha}`:''}</span>
        </h5>
    );
}
import {TitleComponent} from "./TitleComponent";

export const CardLayout =  ({children,title,icon}) => {
    return (
        <div className="card shadow">
            <div className="card-body">
                <TitleComponent title={title} icon={icon} />
                {children}
            </div>
        </div>
    )
}
export const CustomBreadcumComponent = ({title,module}) => {
    return(
        <>
            <div className="pagetitle">
                <h1>{title}</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">{title}</li>
                        <li className="breadcrumb-item active">{module}</li>
                    </ol>
                </nav>
            </div>
        </>
    );

};
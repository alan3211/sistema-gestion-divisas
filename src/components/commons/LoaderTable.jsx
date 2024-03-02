import {CircleLoader} from "react-spinners";

export const LoaderTable = ({title='Cargando Información, espere un momento por favor ...'})=>{
    const showModal=true;
    return (<div className="row mt-3">
            <div className="justify-content-center mb-4">
                <div className="col-md-5 mx-auto">
                    <div className="text-center d-flex align-items-center justify-content-center">
                        {showModal && (
                            <CircleLoader
                                color="#012970"
                                loading={showModal}
                                size={80}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-5 mx-auto">
                    <div className="text-center d-flex align-items-center justify-content-center">
                        <span className="mb-4">{title}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
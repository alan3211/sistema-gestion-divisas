import {CardLayout, Layout} from "../../commons";
import {CajaProvider} from "../../../context/caja/CajaProvider";
import {DenominacionProvider} from "../../../context/denominacion/DenominacionProvider";
import {DotacionComponent,CierreComponent,TraspasoComponent} from "./index";
import {EntregaComponent} from "./EntregaComponent";

export const CajaComponent = () => {

    const optionModule ={
        title:'Operación',
        module:'Caja'
    }

    return(
        <CajaProvider>
            <Layout moduleName={optionModule}>
                <CardLayout title="Caja" icon="bi-box-seam p-2">
                    <ul className="nav nav-tabs nav-tabs-bordered d-flex" id="borderedTabJustified" role="tablist">
                        <li className="nav-item flex-fill" role="presentation">
                            <button className="nav-link w-100 active" id="home-tab" data-bs-toggle="tab"
                                    data-bs-target="#bordered-justified-home" type="button" role="tab"
                                    aria-controls="home" aria-selected="true">
                                <i className="bi bi-box p-2"></i>
                                <strong>Dotación</strong>
                            </button>
                        </li>
                        <li className="nav-item flex-fill" role="presentation">
                            <button className="nav-link w-100" id="profile-tab" data-bs-toggle="tab"
                                    data-bs-target="#bordered-justified-profile" type="button" role="tab"
                                    aria-controls="profile" aria-selected="false" tabIndex="-1">
                                <i className="bi bi-truck p-2"></i>
                                <strong>Entrega</strong>
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content" id="borderedTabJustifiedContent">
                        <div className="tab-pane fade active show" id="bordered-justified-home" role="tabpanel"
                             aria-labelledby="home-tab">
                            <DenominacionProvider>
                                <DotacionComponent/>
                            </DenominacionProvider>
                        </div>
                        <div className="tab-pane fade" id="bordered-justified-profile" role="tabpanel"
                             aria-labelledby="profile-tab">
                            <EntregaComponent/>
                        </div>
                    </div>
                </CardLayout>
            </Layout>
        </CajaProvider>
    );
}
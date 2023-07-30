import {DotacionComponent} from "./DotacionComponent";
import {CierreComponent} from "./CierreComponent";
import {TraspasoComponent} from "./TraspasoComponent";

export const CajaComponent = () => {
    return(
        <main id="main" className="h-100">
            <div className="pagetitle">
                <h1 className="card-title"><strong>Caja</strong></h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">Operación</li>
                        <li className="breadcrumb-item active">Caja</li>
                    </ol>
                </nav>
            </div>

            <section className="section">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Caja</h5>
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
                                    <i className="bi bi-lock p-2"></i>
                                    <strong>Cierre</strong>
                                </button>
                            </li>
                            <li className="nav-item flex-fill" role="presentation">
                                <button className="nav-link w-100" id="contact-tab" data-bs-toggle="tab"
                                        data-bs-target="#bordered-justified-contact" type="button" role="tab"
                                        aria-controls="contact" aria-selected="false" tabIndex="-1">
                                    <i className="bi bi-arrow-repeat p-2"></i>
                                    <strong>Traspaso</strong>
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="borderedTabJustifiedContent">
                            <div className="tab-pane fade active show" id="bordered-justified-home" role="tabpanel"
                                 aria-labelledby="home-tab">
                                    <DotacionComponent/>
                            </div>
                            <div className="tab-pane fade" id="bordered-justified-profile" role="tabpanel"
                                 aria-labelledby="profile-tab">
                                <CierreComponent/>
                            </div>
                            <div className="tab-pane fade" id="bordered-justified-contact" role="tabpanel"
                                 aria-labelledby="contact-tab">
                                <TraspasoComponent/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
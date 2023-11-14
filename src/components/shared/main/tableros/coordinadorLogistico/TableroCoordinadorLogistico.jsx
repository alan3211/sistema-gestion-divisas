import {Usuarios} from "../Usuarios";
import {CompraVentaProvider} from "../../../../../context/compraVenta/CompraVentaProvider";
import {TipoCambioComponent} from "../../../../operacion/compraVenta";

export const TableroCoordinadorLogistico = () => {

    return(

        <section className="section dashboard">
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Actividad Reciente <span>| Hoy</span></h5>
                            <div className="activity">
                                <div className="activity-item d-flex">
                                    <div className="activite-label">32 min</div>
                                    <i className="bi bi-circle-fill activity-badge text-success align-self-start"></i>
                                    <div className="activity-content">
                                        Quia quae rerum <a href="#" className="fw-bold text-dark">explicabo officiis</a> beatae
                                    </div>
                                </div>
                                <div className="activity-item d-flex">
                                    <div className="activite-label">56 min</div>
                                    <i className="bi bi-circle-fill activity-badge text-danger align-self-start"></i>
                                    <div className="activity-content">
                                        Voluptatem blanditiis blanditiis eveniet
                                    </div>
                                </div>
                                <div className="activity-item d-flex">
                                    <div className="activite-label">2 hrs</div>
                                    <i className="bi bi-circle-fill activity-badge text-primary align-self-start"></i>
                                    <div className="activity-content">
                                        Voluptates corrupti molestias voluptatem
                                    </div>
                                </div>
                                <div className="activity-item d-flex">
                                    <div className="activite-label">1 day</div>
                                    <i className="bi bi-circle-fill activity-badge text-info align-self-start"></i>
                                    <div className="activity-content">
                                        Tempore autem saepe <a href="#" className="fw-bold text-dark">occaecati voluptatem</a> tempore
                                    </div>
                                </div>
                                <div className="activity-item d-flex">
                                    <div className="activite-label">2 days</div>
                                    <i class="bi bi-circle-fill activity-badge text-warning align-self-start"></i>
                                    <div class="activity-content">
                                        Est sit eum reiciendis exercitationem
                                    </div>
                                </div>
                                <div class="activity-item d-flex">
                                    <div class="activite-label">4 weeks</div>
                                    <i class="bi bi-circle-fill activity-badge text-muted align-self-start"></i>
                                    <div class="activity-content">
                                        Dicta dolorem harum nulla eius. Ut quidem quidem sit quas
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <CompraVentaProvider><TipoCambioComponent/></CompraVentaProvider>
                </div>
            </div>
        </section>

    );
}
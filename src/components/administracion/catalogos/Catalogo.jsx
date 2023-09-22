import {Layout,CardLayout} from "../../commons";
import {Identificaciones} from "./Identificaciones";
import {Sucursales} from "./Sucursales";
import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook/useCatalogo";
import {Monedas} from "./Monedas";
import {Zonas} from "./Zonas";

export const Catalogo = () => {

    const moduleName = {
        title: 'Administración',
        module: 'Catalogos'
    }

    const catalogos = useCatalogo([0])
    const {register,watch,formState:{errors}} = useForm();

    const CATALOGOS = {
        Identificacion: <Identificaciones/>,
        Moneda: <Monedas/>,
        Sucursales: <Sucursales/>,
        Zonas: <Zonas/>,
    }



    return (
        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.module} icon="bi bi-list p-1">
                <div className="row">
                    <div className="col-md-4 mx-auto">
                        <p className="mb-4 text-blue">
                            <strong>Por favor, selecciona el tipo de catálogo que deseas cargar:</strong>
                        </p>
                        <div className="form-floating mb-3">
                            <select
                                {...register("catalogo", {
                                    required: {
                                        value: true,
                                        message: "Debes seleccionar al menos un tipo de catálogo.",
                                    },
                                })}
                                className={`form-select ${!!errors?.catalogo ? 'is-invalid' : ''}`}
                                id="catalogo"
                                name="catalogo"
                                aria-label="Catálogo"
                            >
                                <option value="0">Selecciona una opción</option>
                                {catalogos[0]?.map((ele) => (
                                    <option
                                        key={ele.id + "-" + ele.descripcion}
                                        value={ele.descripcion}
                                    >
                                        {ele.descripcion}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="catalogo">Catálogo</label>
                            {errors?.catalogo && (
                                <div className="invalid-feedback-custom">
                                    {errors?.catalogo.message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {CATALOGOS[watch("catalogo")]}
            </CardLayout>
        </Layout>
    );

}
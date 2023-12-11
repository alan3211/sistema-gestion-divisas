import {useEffect, useState} from "react";
import {encryptRequest} from "../../../../../utils";
import {getSucursalUsuarios} from "../../../../../services/inicio-services";
import {Progress} from "flowbite-react";

export const OperacionEstatus = ({ item, index }) => {
    const [dataSucUsu, setDataSucUsu] = useState([]);
    const [total_operacion, setTotalOperacion] = useState(0);
    const [semaforo, setSemaforo] = useState("");

    const fetchData = async () => {
        const valores = {
            opcion: 2,
            sucursal: item.Sucursal,
        };
        const encryptedData = encryptRequest(valores);

        const response = await getSucursalUsuarios(encryptedData);
        setDataSucUsu(response);

        let cantidad_usuarios = 0;

        if (item["No Usuarios"] !== 0 && response.result_set) {
            cantidad_usuarios = response.result_set.reduce((acc, valor) => {
                // Validar si el campo 'Activo' es 1 antes de sumar a la cantidad
                return valor.Activo === 1 ? acc + 1 : acc;
            }, 0);
        }

        const total_operacion = (cantidad_usuarios * 100) / 3;

        if (parseInt(total_operacion) > 0 && parseInt(total_operacion) <= 33) {
            setSemaforo("red");
        } else if (
            parseInt(total_operacion) > 33 &&
            parseInt(total_operacion) <= 66
        ) {
            setSemaforo("yellow");
        } else {
            setSemaforo("green");
        }

        setTotalOperacion(total_operacion);
    };

    fetchData();

    return (
        <td key={index} className="text-center">
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <Progress
                        progress={parseInt(total_operacion)}
                        progressLabelPosition="outside"
                        textLabel="Operando"
                        textLabelPosition="outside"
                        size="xl"
                        color={semaforo}
                        labelProgress
                        labelText
                    />
                </div>
            </div>
        </td>
    );
};

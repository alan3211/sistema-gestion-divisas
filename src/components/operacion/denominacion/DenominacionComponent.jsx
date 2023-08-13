import {useFetch} from "../../../hook/useFetch";
import {obtieneDenominaciones} from "../../../services/operaciones-services";
import {useState} from "react";

export const DenominacionComponent = ({title,handleInputChange,moneda,importe,setIsOkRecibido,setIsOkEntregado,type,cambio}) => {

    const {data} = useFetch({funcionAsync:obtieneDenominaciones,values:moneda});
    const [inputValues, setInputValues] = useState({});

    if(cambio){
        console.log("DATA", data)
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (parseFloat(data[key].denominacion).toPrecision(1) > importe) {
                    delete data[key];
                }
            }
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedValues = { ...inputValues };
        console.log(updatedValues)
        updatedValues[name] = value;

        // Calcula el total por fila (total por denominación)
        const denominacion = name.replace("denominacion_", "");
        const cantidad = parseInt(value);
        const totalPorFila = denominacion * cantidad;

        updatedValues[`total_${denominacion}`] = isNaN(totalPorFila) ? 0 : totalPorFila;

        setInputValues(updatedValues);

        // Calcula el total general
        let totalGeneral = 0.0;
        for (const key in updatedValues) {
            if (key.startsWith("total_")) {
                totalGeneral += parseFloat(updatedValues[key]);
            }
        }
        updatedValues["totalGeneral"] = isNaN(totalGeneral) ? 0.0 : totalGeneral;
        // Actualiza el estado de los totales y los valores individuales
        setInputValues(updatedValues);
        // Realiza las validaciones y actualiza los estados para habilitar o deshabilitar los botones
        if (type) {
            setIsOkRecibido(!(totalGeneral >= importe));
        } else {
            setIsOkEntregado(!(totalGeneral === importe));
        }

        // Llama a handleInputChange después de actualizar los estados
        handleInputChange(name,  {nombre:denominacion,cantidad:parseInt(updatedValues[name])});

    };

    const validaImporte = () => {
        if(parseFloat(inputValues.totalGeneral) === parseFloat(importe)){
            return 'text-success';
        }
        if((parseFloat(importe)-parseFloat(inputValues.totalGeneral))  <= 1.0 ){
            return 'text-success';
        }else if (parseFloat(inputValues.totalGeneral) > parseFloat(importe) || (parseFloat(importe)-parseFloat(inputValues.totalGeneral))  >= 1.0 ){
            return 'text-warning';
        }
        else {
            return 'text-danger';
        }

    }

    return (
        <div className="container text-center">
            <h2 className="card-title">{title}</h2>
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    <th>Denominación</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((elemento) => (
                    <tr key={`denominacion_${elemento.denominacion}`}>
                        <td>{elemento.denominacion}</td>
                        <td>
                            <input
                                type="text"
                                name={`denominacion_${elemento.denominacion}`}
                                className="form-control"
                                value={inputValues[`denominacion_${elemento.denominacion}`] || ""}
                                onChange={handleChange}
                            />
                        </td>
                        <td>{inputValues[`total_${elemento.denominacion}`] || 0}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <th colSpan="2">Total</th>
                    <th className={validaImporte()}>{inputValues.totalGeneral || 0.0}</th>
                </tr>
                </tfoot>
            </table>
        </div>
    );



}
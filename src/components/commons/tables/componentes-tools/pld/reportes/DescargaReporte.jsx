import {useEffect, useState} from "react";
import {encryptRequest} from "../../../../../../utils";
import {consultaAlarmas, consultaAnalisis} from "../../../../../../services/pld-services";

export const DescargaReporte = ({item, index}) => {

    const [showButton, setShowButton] = useState(true);
    const [analisis, setAnalisis] = useState('');

    const descargaReporte = () => {
        // Crear el contenido del archivo
        const contenido = `${item["No Usuario"]};${item.Nombre};${item["Apellido Paterno"]};${item["Apellido Materno"]};${item["Fecha Nacimiento"]};${item["No Operaciones"]};${item["Monto Operado"]};${analisis}`;

        // Crear un elemento <a> temporal para descargar el archivo
        const elementoTemporal = document.createElement("a");
        const archivo = new Blob([contenido], { type: "text/plain" });
        elementoTemporal.href = URL.createObjectURL(archivo);
        elementoTemporal.download = `Reporte - ${item["No Usuario"]}.txt`;
        elementoTemporal.click();
    };

    useEffect(() => {
        const validaAnalisis = async () => {

            const valores = {
                numero_usuario: item["No Usuario"]
            }
            const encryptedData =  encryptRequest(valores);
            const response = await consultaAnalisis(encryptedData);

            if(response.total_rows > 0) {
                setShowButton(false)
                setAnalisis(response.result_set[0].Analisis)
            }else{
                setShowButton(true);
            }

        }
        validaAnalisis();
    }, [item["No Usuario"]]);

    return (
        <>
            <td key={index} className="text-center">
                <button className="btn btn-success me-2"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Descargar Reporte"
                        disabled={showButton}
                        onClick={descargaReporte}>
                    <i className="bi bi-download"></i>
                </button>
            </td>
        </>
    );
}
import {connetor_plugin} from "../js/plugin_impresora_termica";
import {
    DENOMINACIONES, DENOMINACIONESM,
    encryptRequest,
    formattedDateDD2,
    getTextDivisa,
    opciones
} from "../utils";
import {useEffect, useState} from "react";
import {obtieneTicket} from "../services/tools-services";
import {numeroALetras} from "../utils/numerosANombre";

export const usePrinter = (datos) => {

    console.log("Datos HOOK",datos)

    const [dataTicket, setDataTicket] = useState({});

    const getEstructuraTicket = async () => {
        try {
            const valores = {
                usuario: datos["No Usuario"],
                ticket: datos["No Ticket"]
            }
            const encryptedData = encryptRequest(valores);
            const response = await obtieneTicket(encryptedData);
            console.log(response);
            setDataTicket(response.result_set[0]);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if(datos['No Usuario'] !== ''){
            getEstructuraTicket();
        }
    }, [datos['No Usuario']]);

    // Busca todas las impresoras que estan conectadas al equipo
    const mostrar_impresoras = () => {
        connetor_plugin.obtenerImpresoras()
            .then(impresoras => {
                console.log(impresoras)
            });
    }

    const ticket = (opcion, conector) => {

        const currency = {
            plural:"pesos mexicanos",
            singular: "peso mexicano",
            centPlural: "centavos",
            centSingular: "centavo"
        }

        if(Object.keys(dataTicket).length === 0){
            if(datos['No Usuario'] !== ''){
                getEstructuraTicket();
            }
        }

        if(dataTicket["Operación"] !== 'COMPRA'){
            currency.plural = getTextDivisa(dataTicket.Divisa).plural;
            currency.singular = getTextDivisa(dataTicket.Divisa).singular;
        }
        const valor = numeroALetras(parseFloat(dataTicket["Monto Entregado"]), currency);

        conector.fontsize("1")
        conector.textaling("center")
        conector.text(`${opcion === 0 ? '-- ORIGINAL --' : opcion === 1 ? '-- COPIA USUARIO --' : ' -- REIMPRESION --'}`)
        conector.img_url("https://grocerys-front--k83k6h5.wittysmoke-209c31ac.eastus.azurecontainerapps.io/static/media/logo.024785155dae25af5d6a.png")
        conector.fontsize("1")
        conector.text(dataTicket.Registro)
        conector.text(dataTicket.Nombre)
        conector.text(dataTicket.Domicilio)
        conector.text(`Sucursal: ${dataTicket.Sucursal}`)
        conector.textaling("left")
        conector.text("------------------------------------------")
        conector.text(`Fecha: ${formattedDateDD2}    Folio: ${dataTicket.Folio}`)
        conector.text(`${new Date().toLocaleTimeString('es-ES', opciones)} horas          # Usuario: ${dataTicket.Usuario}`)
        conector.text("------------------------------------------")
        conector.text(dataTicket["Operación"])
        conector.text(`Divisa: ${DENOMINACIONESM[dataTicket.Divisa]}           $ ${dataTicket["Operación"] === 'COMPRA' ? dataTicket["Total Recibido"] :dataTicket["Monto Entregado"]} ${dataTicket.Divisa} `)
        conector.text("------------------------------------------")
        conector.text(`Tipo de Cambio:         $ ${dataTicket["Tipo Cambio"]} MXN `)
        conector.text("------------------------------------------")
        conector.feed("1")
        conector.text(`Cantidad recibida:      $ ${dataTicket["Total Recibido"]} ${dataTicket["Operación"] === 'COMPRA' ? dataTicket.Divisa:'MXN'}`)
        conector.text(`Su cambio:              $ ${dataTicket.Cambio} ${dataTicket["Operación"] !== 'COMPRA' ?'MXN': dataTicket.Divisa}`)
        conector.feed("1")
        conector.text("------------------------------------------")
        conector.feed("1")
        conector.text(`Total:                  $ ${dataTicket["Monto Entregado"]} ${dataTicket["Operación"] !== 'COMPRA' ? dataTicket.Divisa:'MXN'}`)
        conector.text(`(${valor} 00/100)`)
        conector.feed("2")
        conector.text("------------------------------------------")
        conector.text(`Atendido por: ${dataTicket.Atendido}`)
        conector.text("------------------------------------------")
        conector.text(`${dataTicket["Nombre Cliente"]}${dataTicket.Protesta}`)
        conector.feed("2")
        conector.textaling("center")
        conector.text(`______________________`)
        conector.text(` Firma de conformidad `)
        conector.feed("1")
        conector.textaling("left")
        conector.text("------------------------------------------")
        conector.text(`${dataTicket.Factura}`)
        conector.text("------------------------------------------")
        conector.text(`${dataTicket.Nombre}, ubicado en ${dataTicket.Domicilio}. ${dataTicket.Obligacion}`)
        conector.feed("5")
        conector.cut("0")
    }

    const imprimeTicketNuevamente = (tipo) => imprimirDoc(tipo);

    const imprimirDoc = async (tipo) => {
        let nombreImpresora = "EPSON TM-T88VI Receipt";
        let api_key = "a3c8f13a-8722-4387-f0bf-0ac2e9dd74f7"


        const conector = new connetor_plugin()

        if (tipo === 0) {
            ticket(0, conector)
            ticket(1, conector)
        } else {
            ticket(2, conector)
        }

        const resp = await conector.imprimir(nombreImpresora, api_key);
        if (resp === true) {
            console.log("imprimir: " + resp)
        } else {
            console.log("Problema al imprimir: " + resp)

        }
    }

    return {
        imprimir:imprimirDoc,
        mostrar_impresoras,
        imprimeTicketNuevamente,
    }
}

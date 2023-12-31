import {useContext, useEffect, useState} from "react";
import {DenominacionContext} from "../context/denominacion/DenominacionContext";
import {obtieneDenominaciones} from "../services";
import {dataG} from "../App";
import {encryptRequest, redondearNumero} from "../utils";

export const useDenominacion = ({type,moneda,options}) => {
    const {
        denominacionR,
        denominacionE,
        denominacionC,
        denominacionD,
    } = useContext(DenominacionContext);

    const {title,importe,importeFinal,calculaValorMonto,habilita,setHabilita,setTotalMonto,setFinalizaOperacion,ticket} =  options;
    let denominacion = {};

    if(type === 'R'){
        denominacion = denominacionR;
    }else if(type === 'E'){
        denominacion = denominacionE;
    }else if(type === 'C'){
        denominacion = denominacionC;
    }else{
        denominacion = denominacionD;
    }

    const {register,formState:{errors},watch,trigger,reset,setValue} = denominacion;
    const watchAllInputs = watch();

    const [data,setData] = useState([]);

    const denominacionMappings = {
        '.05': 'p05',
        '.10': 'p1',
        '.20': 'p2',
        '.50': 'p5'
    };

    // Función para calcular el total de una denominación parcial
    const calculateTotal = (elemento) => {
        let name = denominacionMappings[elemento.Denominacion] || elemento.Denominacion;
        const cantidad = parseFloat(watchAllInputs[`denominacion_${name}`]) || 0;
        const denominacionValue = parseFloat(elemento.Denominacion);
        if(elemento.hasOwnProperty("Billetes Disponibles")){
            if(dataG.perfil === 'Supervisor'){
                return redondearNumero(parseFloat(cantidad * denominacionValue));
            }else{
                if(elemento["Billetes Disponibles"] >= cantidad){
                    return redondearNumero(parseFloat(cantidad * denominacionValue));
                }else{
                    return redondearNumero(0.0);
                }
            }
        }else{
            return redondearNumero(parseFloat(cantidad * denominacionValue));
        }
    };

    // Calcula el total acumulado de todas las denominaciones
    const calculateGrandTotal = () => {
        let grandTotal = 0.0;
        data?.forEach((elemento) => {
            grandTotal += parseFloat(calculateTotal(elemento));
        });

        if(setTotalMonto){
            setTotalMonto(grandTotal);
        }

        if(options.hasOwnProperty('setFinalizaOperacion')){
            if(importe === grandTotal){
                setFinalizaOperacion(false);
            }else{
                setFinalizaOperacion(true);
            }
        }
        return grandTotal;
    };

    if(type === 'R'){
        denominacionR.calculateGrandTotal = calculateGrandTotal;
    }else{
        denominacionE.calculateGrandTotal = calculateGrandTotal;
        denominacionD.calculateGrandTotal = calculateGrandTotal;
        denominacion.calculateGrandTotal = calculateGrandTotal;
    }


    // Valida solo cuando hace la operacion del cliente y entrega billetes
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const denominacionValue = parseFloat(data[key].Denominacion);
            // || type === 'SD'
            if ((type === 'E' || type === 'C' || type === 'SD') && denominacionValue > parseFloat(importe)) {
                delete data[key];
            }
        }
    }


    const validacionColor = () => {
        const grandTotal = calculateGrandTotal();
        if (type === 'R') {
            if (grandTotal === calculaValorMonto) {
                return 'text-success';
            } else if (grandTotal > calculaValorMonto) {
                return 'text-warning';
            } else {
                return 'text-danger';
            }
        } else if (type === 'C') {
            if (grandTotal === parseFloat(importe)) {
                denominacionC.calculateGrandTotal = grandTotal;
                return 'text-success';
            } else {
                return 'text-danger';
            }
        } else if (type === 'SD') {
            if (grandTotal === parseFloat(importeFinal)) {
                return 'text-success';
            } else {
                return 'text-danger';
            }
        } else {
            if (grandTotal === parseFloat(importe)) {
                return 'text-success';
            } else {
                return 'text-danger';
            }
        }
    };


    // Me ayuda a validar cuando las cantidades de las monedas se deben de seleccionar.
    useEffect(() => {
        const newHabilita = { ...habilita };
        let isValid;

        if(type === 'C'){
            isValid = calculateGrandTotal() >= importe;
            newHabilita.recibe = !isValid;
        }

        if (type === 'R') {
            isValid = calculateGrandTotal() >= calculaValorMonto;
            newHabilita.recibe = !isValid;
        } else {
            isValid = calculateGrandTotal() === importe;
            newHabilita.entrega = !isValid;
        }
        setHabilita(newHabilita);
    }, [calculateGrandTotal(), type]);


    const fetchData = async () => {

        const valores = {
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            moneda: moneda,
            tipo_movimiento: type
        }

        console.log("DATA")
        console.log(valores);

        const encryptedData = encryptRequest(valores);

        if(moneda !== '0'){
            const denominaciones = await obtieneDenominaciones(encryptedData);

            if(type === 'SD'){
                console.log("IMPORTE: ",importe)
                for (const key in denominaciones.result_set) {
                    if (denominaciones.result_set.hasOwnProperty(key)) {
                        const denominacionValue = parseFloat(denominaciones.result_set[key].Denominacion);
                        if (denominacionValue >= parseFloat(importe)) {
                            delete denominaciones.result_set[key];
                        }
                    }
                }
            }

            setData(denominaciones.result_set);
        }
        reset();
    };

    // Sirve para cargar la denominacion de la moneda que se envia
    useEffect(() => {
        fetchData();
    },[moneda,type])

    useEffect(() => {
        console.log("RERENDER")
        fetchData();
    }, [options.reRender]);

    return {
        title,data,denominacionMappings,register,trigger,errors,setValue,reset,calculateTotal,
        validacionColor,calculateGrandTotal};
}
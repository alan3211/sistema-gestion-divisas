import {useContext, useEffect, useState} from "react";
import {DenominacionContext} from "../context/denominacion/DenominacionContext";
import {obtieneDenominaciones, obtieneDenominacionesNota} from "../services";
import {dataG} from "../App";
import {encryptRequest, redondearNumero} from "../utils";

export const useDenominacion = ({type,moneda,options}) => {
    const {
        denominacionR,
        denominacionE,
        denominacionC,
        denominacionD,
        denominacionB,
    } = useContext(DenominacionContext);

    const {
        title,importe,importeFinal,calculaValorMonto,habilita,setHabilita,setRedondeo,setTotalMonto,setFinalizaOperacion,sucursal,
        item
    } =  options;
    let denominacion = {};

    if(type === 'R'){
        denominacion = denominacionR;
    }else if(type === 'E'){
        denominacion = denominacionE;
    }else if(type === 'C'){
        denominacion = denominacionC;
    }else if(type === 'B'){
        denominacion = denominacionB;
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
            if(type === 'CNC'){
                return parseFloat(cantidad * denominacionValue);
            }else if([6].includes(dataG.id_perfil)){
                if (parseFloat(cantidad) < 0.0){
                    return 0.0;
                }else{
                    return parseFloat(cantidad * denominacionValue);
                }
            }else{
                if(elemento["Billetes Disponibles"] >= cantidad){
                    if (parseFloat(cantidad) < 0.0){
                        return 0.0;
                    }else{
                        return parseFloat(cantidad * denominacionValue);
                    }
                }else{
                    return 0.0;
                }
            }
        }else{
            return parseFloat(cantidad * denominacionValue);
        }
    };

    // Calcula el total acumulado de todas las denominaciones
    const calculateGrandTotal = () => {
        let grandTotal = 0.0;
        data?.forEach((elemento) => {
            grandTotal += parseFloat(calculateTotal(elemento));
        });

        if(setTotalMonto){
            setTotalMonto(parseFloat(grandTotal.toFixed(2)));
        }

        if(options.hasOwnProperty('setFinalizaOperacion')){
            if(parseFloat(importe) === parseFloat(grandTotal.toFixed(2))){
                setFinalizaOperacion(false);
            }else{
                setFinalizaOperacion(true);
            }
        }
        return grandTotal.toFixed(2);
    };

    // Valida solo cuando hace la operacion del cliente y entrega billetes
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const denominacionValue = parseFloat(data[key].Denominacion);
            // || type === 'SD'
            if ((type === 'E' || type === 'C' || type === 'SD') && denominacionValue >= parseFloat(importe) +0.30) {
                delete data[key];
            }
        }
    }


    const validacionColor = () => {
        const grandTotal = calculateGrandTotal();

        if (type === 'R') {
            if (parseFloat(grandTotal) === parseFloat(calculaValorMonto)) {
                return 'text-success';
            } else if (parseFloat(grandTotal) > parseFloat(calculaValorMonto)) {
                return 'text-warning';
            } else {
                return 'text-danger';
            }
        } else if (type === 'C') {
            if(moneda === 'MXP'){
                // Valida diferencia en pesos
                let diferencia = parseFloat(grandTotal) - parseFloat(importe);
                if (diferencia.toFixed(2) > -0.30 && diferencia.toFixed(2) < 0.30){
                    if(parseFloat(diferencia.toFixed(2)) === 0.00){
                     return "text-success";
                    }
                    return 'text-warning';
                }else {
                    return 'text-danger';
                }
            }else{
                if (parseFloat(grandTotal) === parseFloat(importe)) {
                    denominacionC.calculateGrandTotal = parseFloat(grandTotal);
                    return 'text-success';
                } else {
                    return 'text-danger';
                }
            }
        } else if (type === 'SD') {

            if (grandTotal === parseFloat(importeFinal) || grandTotal === parseFloat(importe)) {
                return 'text-success';
            } else {
                return 'text-danger';
            }
        } else {
            if(type === "E" && moneda === 'MXP'){
                // Valida diferencia en pesos
                let diferencia = parseFloat(grandTotal) - parseFloat(importe);
                if (diferencia.toFixed(2) > -0.30 && diferencia.toFixed(2) < 0.30){
                    if(parseFloat(diferencia.toFixed(2)) === 0.00){
                        return "text-success";
                    }
                    return 'text-warning';
                }else {
                    return 'text-danger';
                }
            }else{
                if (parseFloat(grandTotal) === parseFloat(importe)) {
                    return 'text-success';
                } else {
                    return 'text-danger';
                }
            }

        }
    };


    // Me ayuda a validar cuando las cantidades de las monedas se deben de seleccionar.
    useEffect(() => {
        const newHabilita = { ...habilita };
        let isValid;

        if(type === 'C'){
            if(moneda === 'MXP') {
                // Valida diferencia en pesos
                let diferencia = parseFloat(calculateGrandTotal()) - parseFloat(importe);
                isValid = parseFloat(diferencia.toFixed(2)) > -0.30 && parseFloat(diferencia.toFixed(2)) < 0.30
                newHabilita.entrega = !isValid;
                newHabilita.recibe = !isValid;
                setRedondeo(diferencia);
            }else {
                isValid = parseFloat(calculateGrandTotal()) >= parseFloat(importe);
                newHabilita.recibe = !isValid;
            }
        }else if (type === 'R') {
            isValid = parseFloat(calculateGrandTotal()) >= parseFloat(calculaValorMonto);
            newHabilita.recibe = !isValid;
        } else if (type === 'E') {
            if(moneda === 'MXP') {
                // Valida diferencia en pesos
                let diferencia = parseFloat(calculateGrandTotal()) - parseFloat(importe);
                isValid = parseFloat(diferencia.toFixed(2)) > -0.30 && parseFloat(diferencia.toFixed(2)) < 0.30
                newHabilita.entrega = !isValid;
                newHabilita.recibe = !isValid;
                setRedondeo(diferencia);
            }else{
                isValid = parseFloat(calculateGrandTotal()) === parseFloat(importe);
                newHabilita.entrega = !isValid;
            }
        }else if(type === 'B'){
            isValid = parseFloat(calculateGrandTotal()) >= parseFloat(importe);
            newHabilita.recibe = !isValid;
        }

        setHabilita(newHabilita);
    }, [parseFloat(calculateGrandTotal()), type]);


    const fetchData = async () => {

        const valores = {
            usuario: dataG.usuario,
            sucursal: sucursal || dataG.sucursal,
            moneda: moneda,
            tipo_movimiento: type
        }

        if(type === 'CNC'){
            valores.no_movimiento = item["No Movimiento"];
        }

        const encryptedData = encryptRequest(valores);

        if(moneda !== '0'){

            let denominaciones= [];

            if(type === 'CNC'){
                denominaciones = await obtieneDenominacionesNota(encryptedData);
            }else{
                denominaciones = await obtieneDenominaciones(encryptedData);
            }


            if(type === 'SD'){
                for (const key in denominaciones.result_set) {
                    if (denominaciones.result_set.hasOwnProperty(key)) {
                        const denominacionValue = parseFloat(denominaciones.result_set[key].Denominacion);
                        if (denominacionValue + 0.30 >= parseFloat(importe)) {
                            delete denominaciones.result_set[key];
                        }
                    }
                }
            }else if(type === 'D'){
                for (const key in denominaciones.result_set) {
                    if (denominaciones.result_set.hasOwnProperty(key)) {
                        const denominacionValue = parseFloat(denominaciones.result_set[key]["Billetes Disponibles"]);
                        if (denominacionValue === 0) {
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
        fetchData();
    }, [options.reRender]);

    if(type === 'R'){
        denominacionR.calculateGrandTotal = calculateGrandTotal;
    }else{
        denominacionE.calculateGrandTotal = calculateGrandTotal;
        denominacionD.calculateGrandTotal = calculateGrandTotal;
        denominacionB.calculateGrandTotal = calculateGrandTotal;
        denominacion.calculateGrandTotal = calculateGrandTotal;
    }

    return {
        title,data,denominacionMappings,register,trigger,errors,setValue,reset,calculateTotal,
        validacionColor,calculateGrandTotal};
}
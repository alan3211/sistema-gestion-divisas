import {useContext, useEffect, useState} from "react";
import {DenominacionContext} from "../context/denominacion/DenominacionContext";
import {obtieneDenominaciones} from "../services";
import {dataG} from "../App";
import {encryptRequest} from "../utils";

export const useDenominacion = ({type,moneda,options}) => {
    const {
        denominacionR,
        denominacionE,
        denominacionC,
        denominacionD,
    } = useContext(DenominacionContext);

    const {title,importe,calculaValorMonto,habilita,setHabilita,setTotalMonto,setFinalizaOperacion} =  options;
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

    const {register,formState:{errors},watch,trigger,reset} = denominacion;
    const watchAllInputs = watch();

    const [data,setData] = useState([]);

    const denominacionMappings = {
        '.05': 'p05',
        '.10': 'p1',
        '.20': 'p2',
        '.50': 'p5'
    };

    // Función para calcular el total de una denominación parcial
    const calculateTotal = (denominacion) => {
        let name = denominacionMappings[denominacion] || denominacion;
        const cantidad = parseFloat(watchAllInputs[`denominacion_${name}`]) || 0;
        const denominacionValue = parseFloat(denominacion);
        return (cantidad * denominacionValue);
    };


    // Calcula el total acumulado de todas las denominaciones
    const calculateGrandTotal = () => {
        let grandTotal = 0;
        data?.forEach((elemento) => {
            grandTotal += parseFloat(calculateTotal(elemento.Denominacion));
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

        if(type === 'R'){
            denominacionR.calculateGrandTotal = calculateGrandTotal;
        }else{
            denominacionE.calculateGrandTotal = calculateGrandTotal;
        }

        return grandTotal;
    };



    // Valida solo cuando hace la operacion del cliente y entrega billetes
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const denominacionValue = parseFloat(data[key].Denominacion);
            if ((type === 'E' || type === 'C') && denominacionValue > parseFloat(importe)) {
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
            if (grandTotal === importe) {
                return 'text-success';
            } else if (grandTotal > importe) {
                return 'text-warning';
            } else {
                return 'text-danger';
            }
        } else {
            if (grandTotal === importe) {
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

    // Sirve para cargar la denominacion de la moneda que se envia
    useEffect(() => {
        const fetchData = async () => {

            const valores = {
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
                moneda: moneda,
                tipo_movimiento: type
            }

            const encryptedData = encryptRequest(valores);

            if(moneda !== '0'){
                const denominaciones = await obtieneDenominaciones(encryptedData);
                setData(denominaciones.result_set);
            }
            reset();
        };
        fetchData();
    },[moneda])


    return {
        title,data,denominacionMappings,register,trigger,errors,calculateTotal,
        validacionColor,calculateGrandTotal};
}
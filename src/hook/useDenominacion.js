import {useContext, useEffect, useState} from "react";
import {DenominacionContext} from "../context/denominacion/DenominacionContext";
import {obtieneDenominaciones} from "../services";

export const useDenominacion = ({type,moneda,options}) => {
    const {
        denominacionR,
        denominacionE,
        denominacionC,
        denominacionD,
    } = useContext(DenominacionContext);

    const {title,importe,calculaValorMonto,habilita,setHabilita,setTotalMonto} =  options;
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

    const {register,formState:{errors},watch,trigger} = denominacion;
    const watchAllInputs = watch();

    const [data,setData] = useState([]);

    const denominacionMappings = {
        '.10': 'p1',
        '.20': 'p2',
        '.50': 'p5'
    };


    // Función para calcular el total de una denominación parcial
    const calculateTotal = (denominacion) => {
        let name = denominacionMappings[denominacion] || denominacion;
        const cantidad = parseFloat(watchAllInputs[`denominacion_${name}`]) || 0.0;
        const denominacionValue = parseFloat(denominacion);
        return (cantidad * denominacionValue).toFixed(2); // Asegura que el resultado tenga 2 decimales
    };


    // Calcula el total acumulado de todas las denominaciones
    const calculateGrandTotal = () => {
        let grandTotal = 0.0;
        data?.forEach((elemento) => {
            grandTotal += parseFloat(calculateTotal(elemento.denominacion));
        });

        if(setTotalMonto){
            setTotalMonto(grandTotal.toFixed(2));
        }

        return grandTotal.toFixed(2); // Asegura que el resultado tenga 2 decimales
    };



    // Valida solo cuando hace la operacion del cliente y entrega billetes
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const denominacionValue = parseFloat(data[key].denominacion);
            if ((type === 'E' || type === 'C') && denominacionValue > parseFloat(importe).toFixed(2)) {
                delete data[key];
            }
        }
    }


    const validacionColor = () => {
        const grandTotal = parseFloat(calculateGrandTotal());

        if (type === 'R') {
            if (grandTotal.toFixed(2) === calculaValorMonto) {
                return 'text-success';
            } else if (grandTotal > calculaValorMonto) {
                return 'text-warning';
            } else {
                return 'text-danger';
            }
        } else if (type === 'C') {
            if (grandTotal.toFixed(2) === importe) {
                return 'text-success';
            } else if (grandTotal > importe) {
                return 'text-warning';
            } else {
                return 'text-danger';
            }
        } else {
            if (grandTotal.toFixed(2) === importe) {
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
            isValid = calculateGrandTotal() >= parseFloat(importe);
            newHabilita.recibe = !isValid;
        }

        if (type === 'R') {
            isValid = calculateGrandTotal() >= parseFloat(calculaValorMonto);
            newHabilita.recibe = !isValid;
        } else {
            isValid = calculateGrandTotal() === parseFloat(importe).toFixed(2);
            newHabilita.entrega = !isValid;
        }
        setHabilita(newHabilita);
    }, [calculateGrandTotal(), type]);

    // Sirve para cargar la denominacion de la moneda que se envia
    useEffect(() => {
        const fetchData = async () => {
            if(moneda !== '0'){
                const denominaciones = await obtieneDenominaciones(moneda);
                setData(denominaciones);
            }
        };
        fetchData();
    },[moneda])


    return {
        title,data,denominacionMappings,register,trigger,errors,calculateTotal,
        validacionColor,calculateGrandTotal};
}
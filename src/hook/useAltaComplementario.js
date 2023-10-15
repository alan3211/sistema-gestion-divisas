import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {useOperaCliente} from "./useOperaCliente";
import {guardaCliente} from "../services";
import {dataG} from "../App";

export const useAltaComplementario = () => {

    const { showModal, setShowModal, closeModal } = useOperaCliente();
    const navigate = useNavigate(); // Asegúrate de importar useNavigate si es necesario

    const hacerOperacion = (item) => {
        navigate("/compraVenta", {
            state: {
                cliente: item.Cliente,
                clienteActivo: true,
            },
        });
    };

    return {
        showModal,
        setShowModal,
        closeModal,
        hacerOperacion,
    };
};

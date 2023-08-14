import {useState} from "react";

export const useOperaCliente = ()=>{
    const [showModal, setShowModal] = useState(false);

    const openModal = (item) => {
        console.log("ITEM  !:",item);
        setShowModal(true);
    }
    const closeModal = () => {
        setShowModal(false);
    }


    return {
        showModal,
        setShowModal,
        openModal,
        closeModal,
    }
}
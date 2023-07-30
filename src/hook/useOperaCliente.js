import {useState} from "react";

export const useOperaCliente = ()=>{
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const openModal = (item) => {
        console.log("ITEM  !:",item);
        setSelectedItem(item);
        setShowModal(true);
    }
    const closeModal = () => {
        setShowModal(false);
    }


    return {
        showModal,
        setShowModal,
        selectedItem,
        setSelectedItem,
        openModal,
        closeModal,
    }
}
import { useState } from "react";
import { dataG } from "../App";
import {useNavigate} from "react-router-dom";

const recursiveSearch = (options, inputValue) => {
    const result = [];
    for (const option of options) {
        if (
            option.Nombre &&
            option.Nombre.toLowerCase().includes(inputValue) &&
            option.Mapeo !== ''
        ) {
            result.push(option);
        }
        if (option.subMenus) {
            const subMenuResults = recursiveSearch(option.subMenus, inputValue);
            const filteredSubMenuResults = subMenuResults.filter(
                (subOption) => subOption.Mapeo !== ''
            );
            result.push(...filteredSubMenuResults);
        }
    }

    if (result.length === 0) {
        // Agrega un elemento especial para mostrar la leyenda
        result.push({ Nombre: "No se encontraron resultados", Mapeo: "" });
    }

    return result;
};


export const useSearchModule = () => {
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigator = useNavigate();

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setInputValue(inputValue);
        if (inputValue === "") {
            setFilteredOptions([]);
            setShowDropdown(false);
            return;
        }

        const filteredOptions = recursiveSearch(dataG.menus, inputValue);
        setFilteredOptions(filteredOptions);
        setShowDropdown(filteredOptions.length > 0);
    };

    const handleOptionClick = (option) => {

        if(option.Mapeo === '/compraVenta'){
            navigator(option.Mapeo, {
                state: {
                    cliente: '',
                    clienteActivo: false,
                },
            });
        }else{
            navigator(option.Mapeo);
        }

        setInputValue('');
        setShowDropdown(false);
    };

    return {
        inputValue,
        handleInputChange,
        showDropdown,
        filteredOptions,
        handleOptionClick,
    };
};

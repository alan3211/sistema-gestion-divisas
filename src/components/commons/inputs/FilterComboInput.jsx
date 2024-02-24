import './CombosComponent.css';
import {useContext, useState} from "react";
import {AltaClienteContext} from "../../../context/AltaCliente/AltaClienteContext";
import {Select} from "flowbite-react";

export const FilterComboInput = ({ propFormulario,name, label, options,input,tabIndex,selectedOptionIndex, setSelectedOptionIndex}) => {
    const {propForm} =  useContext(AltaClienteContext) || { propForm: propFormulario };
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [inputValue, setInputValue] = useState(input);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (e) => {
        const inputValue = e.target.value.toUpperCase();
        setInputValue(inputValue);

        console.log("INPUT:", inputValue)
        if (inputValue === '') return;

        console.log("OPTIONS:", options)
        const filteredOptions = options.filter((option) =>
            option.descripcion.trim().toUpperCase().includes(inputValue.toUpperCase())
        );
        console.log("FILTER:",filteredOptions)
        // Establecer el error en errors[name] si no hay opciones coincidentes
        if (filteredOptions.length === 0) {
            propForm.errors[name] = {
                type: 'manual',
                message: `No se encontró ${name === 'sucursal' ? 'una':'un'} ${name} con el filtro ingresado.`
            };
            setInputValue('');
        } else {
            delete propForm.errors[name]; // Borrar el error si hay opciones coincidentes
        }

        setFilteredOptions(filteredOptions);
        setShowDropdown(filteredOptions.length > 0);
        propForm.trigger(name);
    };

    const handleOptionClick = (option) => {
        setInputValue(option.descripcion);
        setShowDropdown(false);
        propForm.setValue(name, option.id); // Establece el valor en el formulario
        propForm.trigger(name);
    };

    const handleKeyDown = (e) => {
        // Manejar las teclas de flecha
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedOptionIndex((prevIndex) => (prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedOptionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        } else if (e.key === 'Enter' && selectedOptionIndex !== -1) {
            handleOptionClick(filteredOptions[selectedOptionIndex]);
        }
    };

    return (
        <form className="form-floating mb-3" onSubmit={(e) => e.preventDefault()}>
            <Select
                options={options}
                value={options.find(option => option.descripcion === inputValue)} // Ajusta esto según tus necesidades
                onChange={(selectedOption) => handleOptionClick(selectedOption)}
                onInputChange={(inputValue) => setInputValue(inputValue.toUpperCase())}
                onKeyDown={handleKeyDown}
                className={`${propForm.errors[name] ? 'is-invalid' : ''}`}
                placeholder={`Filtrar por ${name}`}
                tabIndex={tabIndex}
            />
            <label htmlFor={name}>{label}</label>
            {propForm.errors[name] && (
                <div className="invalid-feedback-custom">{propForm.errors[name].message}</div>
            )}
        </form>
    );

    /*return (
        <form className="form-floating mb-3" onSubmit={(e) => e.preventDefault()}>
            <input
                type="text"
                {...propForm.register(name, {
                    required: `El campo ${name} es requerido.`,
                    maxLength:{
                        value: name === 'sucursal' ? 5:3,
                        message:`El campo ${name} como máximo debe de tener no mas de ${name === 'sucursal' ? 5:3} caracteres.`
                    },
                })}
                value={inputValue}
                onChange={handleInputChange}
                className={`form-control ${propForm.errors[name] ? 'is-invalid' : ''}`}
                placeholder={`Filtrar por ${name}`}
                autoComplete="off"
                tabIndex={tabIndex}
            />
            {showDropdown && (
                <div className="combo-dropdown" onKeyDown={handleKeyDown}>
                    {filteredOptions.map((option, index) => (
                        <div
                            key={option.id}
                            className={`option ${index === selectedOptionIndex ? 'selected' : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.descripcion.toUpperCase()}
                        </div>
                    ))}
                </div>
            )}
            <label htmlFor={name}>{label}</label>
            {propForm.errors[name] && (
                <div className="invalid-feedback-custom">{propForm.errors[name].message}</div>
            )}
        </form>
    );*/
};
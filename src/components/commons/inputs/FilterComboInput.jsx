import './CombosComponent.css';
import {useContext, useState} from "react";
import {AltaClienteContext} from "../../../context/AltaCliente/AltaClienteContext";

export const FilterComboInput = ({ name, label, options }) => {

    const {propForm} =  useContext(AltaClienteContext);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (e) => {
        const inputValue = e.target.value.toUpperCase();
        setInputValue(inputValue);
        if (inputValue === '') return;
        const filteredOptions = options.filter((option) =>
            option.descripcion.toUpperCase().startsWith(inputValue.toUpperCase())
        );

        // Establecer el error en errors[name] si no hay opciones coincidentes
        if (filteredOptions.length === 0) {
            propForm.errors[name] = {
                type: 'manual',
                message: 'No se encontró un país con el filtro ingresado.'
            };
            setInputValue('');
        } else {
            delete propForm.errors[name]; // Borrar el error si hay opciones coincidentes
        }

        setFilteredOptions(filteredOptions);
        setShowDropdown(filteredOptions.length > 0);
    };

    const handleOptionClick = (option) => {
        setInputValue(option.descripcion);
        setShowDropdown(false);
        propForm.setValue(name, option.id); // Establece el valor en el formulario
    };

    return (
        <div className="form-floating mb-3">
            <input
                type="text"
                {...propForm.register(name, {
                    required: 'Debes escribir un país válido.',
                })}
                value={inputValue}
                onChange={handleInputChange}
                className={`form-control ${propForm.errors[name] ? 'is-invalid' : ''}`}
                placeholder="Filtrar por país"
            />
            {showDropdown && (
                <div className="combo-dropdown">
                    {filteredOptions.map((option) => (
                        <div
                            key={option.id}
                            className="option"
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
        </div>
    );
};
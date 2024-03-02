import React, { useContext, useState, useEffect } from "react";
import { AltaClienteContext } from "../../../context/AltaCliente/AltaClienteContext";
import Select from "react-select";

export const FilterComboInput = ({ propFormulario, name, label, options, tabIndex }) => {
    // Obtener propForm del contexto o utilizar un valor por defecto
    const { propForm:{register,values, setValue, errors, trigger}} = useContext(AltaClienteContext) || { propForm: propFormulario };

    // Estado local para opciones filtradas y valor del input
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // Transformar las opciones al formato requerido
    const transformedOptions = options.map(option => ({
        value: option.id,
        label: option.descripcion
    }));

    // Efecto para limpiar el valor si hay un error
    useEffect(() => {
        if (errors[name]) {
            setInputValue('');
        }
    }, [errors[name], name]);

    // Manejar cambio en el input
    const handleInputChange = (newValue) => {
        const inputValue2 = newValue ? newValue.toUpperCase() : '';
        setInputValue(inputValue2);

        // Filtrar opciones
        const filteredOptions2 = transformedOptions.filter((option) =>
            option.label.trim().toUpperCase().includes(inputValue2)
        );

        setFilteredOptions(filteredOptions2);

        // Establecer el error si no hay opciones coincidentes
        if (filteredOptions2.length === 0) {
            errors[name] = {
                type: 'manual',
                message: `No se encontró ${name === 'sucursal' ? 'una' : 'un'} ${name} con el filtro ingresado.`
            };
        } else {
            delete errors[name]; // Borrar el error si hay opciones coincidentes
        }

        trigger(name); // Activar validación
    };

    // Manejar cambio de opción seleccionada
    const handleChange = (selectedOption, actionMeta) => {
        if (actionMeta.action === 'select-option' && selectedOption) {
            setInputValue(selectedOption.label.toUpperCase());
            setValue(name, selectedOption.value); // Establecer valor en el formulario
            trigger(name); // Activar validación
        } else if (actionMeta.action === 'clear') {
            setInputValue('');
            setValue(name, ''); // Limpiar valor en el formulario si se deselecciona
            trigger(name); // Activar validación
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-floating mb-3">
                <Select
                    {...register(name, {
                        required: `El campo ${label} es requerido.`,
                        maxLength: {
                            value: name === 'sucursal' ? 5 : 3,
                            message: `El campo ${name} como máximo debe de tener no más de ${
                                name === 'sucursal' ? 5 : 3
                            } caracteres.`,
                        },
                    })}
                    className={`form-select-custom ${errors[name] ? 'is-invalid' : ''}`} // Elimina la clase 'is-invalid' de aquí
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    options={transformedOptions}
                    placeholder={label}
                    tabIndex={tabIndex}
                    value={values && transformedOptions.find((option) => option.value === values[name])}
                    noOptionsMessage={() => 'No hay opciones disponibles'}
                    isClearable
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            display: 'flex',
                            padding: '0.575rem 0.25rem',
                            fontSize: '1rem',
                            fontWeight: 400,
                            lineHeight: 1.5,
                            color: 'var(--bs-body-color)',
                            borderColor: state.isFocused ? 'var(--bs-primary)' : 'var(--bs-gray-400)',
                            boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(0, 123, 255, 0.25)' : 'none',
                            border: errors[name] ? '1px solid red' : '1px solid #ced4da', // Aplica un borde rojo en caso de error
                        }),
                        menu: (provided, state) => ({
                            ...provided,
                            zIndex: 9999,
                        }),
                    }}
                />
                {errors[name] && <div className="invalid-feedback-custom">{errors[name].message}</div>}
            </div>
        </form>

    );
};

import {useSearchModule} from "../../../hook/useSearchModule";

export const SearchModules = () =>{
    const {inputValue,handleInputChange,showDropdown,filteredOptions,handleOptionClick} = useSearchModule();

    return (
        <div className="search-bar">
            <div className="search-form d-flex align-items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Búsqueda de modulos..."
                    autoComplete="off"
                />
                {showDropdown && (
                    <div className="combo-dropdown-search">
                        {filteredOptions.map((option) => (
                            <div
                                key={option.IdModulo}
                                className="option"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.Nombre}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

}
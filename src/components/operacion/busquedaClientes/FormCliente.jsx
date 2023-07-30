import {InputComponent} from "../../commons/inputs/InputComponent";

export const FormCliente = ({handleInputChange,options}) => {

    return(
        <form className="row g-3 needs-validation was-validated" noValidate>
            {
                options.map((elemento) => {
                    return (
                        <>
                            <InputComponent
                                {...elemento}
                                key={elemento.name}
                                onInputChange={handleInputChange}
                            />
                        </>);
                })
            }
        </form>
    );
}
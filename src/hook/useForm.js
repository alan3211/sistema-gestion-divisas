import {useState} from "react";

export const useForm = (initialValue={},OnValidate) =>{

    const [formState,setFormState] =  useState(initialValue);
    const [loading, setLoading] = useState(false);
    const [errors,setErrors] = useState({});

    const handleInputChange = (model, valor) => {
        setFormState((prevFormValues) => ({
            ...prevFormValues,
            [model]: valor
        }));
    };

    const handleSubmit = (event) =>{
        event.preventDefault();

        const err =  OnValidate(formState);
        if(err === null){
            console.log("Enviando Formulario...");
        }else{
            setErrors(err);
        }
    }

    const resetForm = () => {
        setFormState(initialValue);
    }

    return{
        formValues:formState,
        resetForm,
        setFormValues:setFormState,
        handleInputChange,
        loading,
        errors,
        handleSubmit
    }


}
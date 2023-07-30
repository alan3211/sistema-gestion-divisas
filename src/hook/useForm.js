import {useState} from "react";

export const useForm = (initialValue={}) =>{

    const [formState,setFormState] =  useState(initialValue);

    const handleInputChange = (model, valor) => {
        setFormState((prevFormValues) => ({
            ...prevFormValues,
            [model]: valor
        }));
    };

    const resetForm = () => {
        setFormState(initialValue);
    }

    return{
        formValues:formState,
        resetForm,
        setFormValues:setFormState,
        handleInputChange,
    }


}
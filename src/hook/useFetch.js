import {useEffect, useState} from "react";

export const useFetch = ({funcionAsync,values={}}) => {

    const [state,setState] = useState({
        isLoading: false,
        isActive: false,
        data: null,
        error:null,
    });

    const getFetch = async () => {
        setState({
            ...state,
            isLoading: true,
        });

        const data = await funcionAsync(values);

        setState({
            ...state,
            isLoading: false,
            data,
        })
    }


    useEffect( () => {
        getFetch();
    },[values]);

    return {
        ...state
    }
}
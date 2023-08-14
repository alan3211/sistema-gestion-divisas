import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect} from "react";

export const ToastComponent = ({type,title}) => {

    const configuration = {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
    }

    useEffect(() => {
        console.log(type);
        if (type) {
            const toastFunction = toast[type];
            if (toastFunction) {
                toastFunction(title, configuration);
            }
        }
    }, [title, type]);

    return (
        <ToastContainer />
    );
}
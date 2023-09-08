import {useState} from "react";
import {TesoreriaContext} from "./TesoreriaContext";


export const TesoreriaProvider = ({children}) => {

    const [showTab,setShowTab] = useState({
        tab1: true,
        tab2: false,
        tab3: false,
    });

    const [tipo,setTipo] = useState(3);

    const changePestania = (pestania) => {
        const showTabObj = {
            tab1: false,
            tab2: false,
            tab3: false,
        };

        switch (pestania) {
            case 0:
                showTabObj.tab1 = true;
                setTipo(3);
                break;
            case 1:
                showTabObj.tab2 = true;
                setTipo(2);
                break;
            default:
                showTabObj.tab3 = true;
                setTipo(1);
        }

        setShowTab(showTabObj);
    }

    const tesoreria = {
        tipo,
        showTab,
    }


    return(
        <TesoreriaContext.Provider value={tesoreria}>
            {children}
        </TesoreriaContext.Provider>
    )
}
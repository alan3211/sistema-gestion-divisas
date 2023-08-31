import {HeaderComponent} from "./header/HeaderComponent";
import {AsideComponent} from "./aside/AsideComponent";
import {FooterComponent} from "./footer/FooterComponent";
import {useAuth} from "../../hook/useAuth";

export const MainLayout = ({children}) => {
    const authenticated = useAuth();
    return(
        <>
            {
                authenticated &&
                (
                    <>
                        <HeaderComponent/>
                        <AsideComponent/>
                        {children}
                        <FooterComponent/>
                    </>
                )
            }
        </>
    );
}
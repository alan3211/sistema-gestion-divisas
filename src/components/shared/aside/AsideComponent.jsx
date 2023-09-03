import {Link } from 'react-router-dom';
import MenuComponent from "./MenuComponent";

export const AsideComponent = () => {
    return (
           <aside id="sidebar" className="sidebar">
                   <MenuComponent/>
           </aside>
    );
}
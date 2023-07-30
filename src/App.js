import {HeaderComponent} from "./components/shared/header/HeaderComponent";
import {AsideComponent} from "./components/shared/aside/AsideComponent";
import {FooterComponent} from "./components/shared/footer/FooterComponent";
import {MainComponent} from "./components/shared/main/MainComponent";
import {BrowserRouter as Router,Route, Routes} from "react-router-dom";
import {AltaClientesComponent} from "./components/operacion/altaClientes/AltaClientesComponent";
import {CompraVentaComponent} from "./components/operacion/compraVenta/CompraVentaComponent";
import {LoginComponent} from "./components/login/LoginComponent";
import {useState} from "react";
import {getUser} from "./services/login-services";
import {CajaComponent} from "./components/operacion/caja/CajaComponent";

export const dataG = {
    sucursal:0,
    username:"",
    perfil:"",
    usuario:"",
    direccion:"",
    nombre_sucursal:""
};

const App = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);


    // Función para manejar el inicio de sesión
    const handleLogin = async(username, password) => {
        const datos = await getUser(username,password);
        if (datos) {
            dataG.sucursal = parseInt(datos.sucursal);
            dataG.username = datos.nombre;
            dataG.perfil = datos.perfil;
            dataG.usuario = datos.usuario;
            dataG.direccion = datos.direccion;
            dataG.nombre_sucursal = datos.nombre_sucursal;
            setIsLoggedIn(true);
        } else {
            alert('Credenciales incorrectas');
        }
    };

    return (
        <Router>
            {isLoggedIn && <HeaderComponent setIsLoggedIn={setIsLoggedIn} />}
            {isLoggedIn && <AsideComponent />}
            <Routes>
                <Route
                    exact
                    path="/"
                    element={<LoginComponent onLogin={handleLogin} isLoggedIn={isLoggedIn} />}
                />

                {
                    isLoggedIn ? (
                        <Route exact path="/inicio" element={<MainComponent />} />
                    )
                    : null
                }

                <Route exact path="/altaClientes" element={<AltaClientesComponent />} />
                <Route exact path="/compraVenta" element={<CompraVentaComponent />} />
                <Route exact path="/caja" element={<CajaComponent />} />

                <Route element={<MainComponent />} />
            </Routes>
            {isLoggedIn && <FooterComponent />}
        </Router>
  );
}
export default App;

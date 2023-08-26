import logo from '../../../assets/logo.png';
import './logo.css'
export const LogoGrocerys = () => {

    return (
        <main id="main" className="main">
            <div className="logo-container">
                <img src={logo} alt="Imagen centrada" className="img-fluid" />
            </div>
        </main>
    );
}


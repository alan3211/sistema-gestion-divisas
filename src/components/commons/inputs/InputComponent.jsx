import {getCatalogo} from "../../../services/catalogos-services";
import {useEffect, useState} from "react";

export const InputComponent = (
    {
      nombre,
      texto,
      tipo,
      estilo,
      estiloBtn,
      fn,
      onInputChange,
      name,
      isLoading,
      icon,
      seleccionado,
      id_catalogo = 0},
      resetForm) => {

    const [valorInput, setValorInput] = useState('');
    const [catalogo, setCatalogo] = useState([]);

    useEffect(() => {
        console.log("USE EFFECT CATALOGO: ", id_catalogo)
        const fetchData = async () => {
            if (id_catalogo !== 0) {
                try {
                    const result = await getCatalogo(id_catalogo);
                    setCatalogo(result);
                } catch (error) {
                    // Manejar el error de obtener los datos del catálogo
                    console.error(error);
                }
            }
        };

        fetchData();
    }, [id_catalogo]);

    const handleChange = (event) => {
        const valor = event.target.value;
        setValorInput(valor);
        if(
            name === 'tipo_identificacion' ||
            name === 'id_actividad_economica' ||
            name === 'monto' ||
            name === 'frecuencia' ||
            name === 'numero_operaciones' ||
            name === 'origen_recursos' ||
            name === 'destino_recursos'
        ){
            onInputChange(name, parseInt(valor));
        }
        else{
            onInputChange(name, valor);
        }
    };

    if (tipo === 'text'){
        return(
            <div className={estilo}>
                <div className="form-floating">
                    <input type={tipo}
                           className="form-control input-group has-validation"
                           id={name}
                           name={name}
                           placeholder={texto}
                           value={valorInput}
                           onChange={handleChange}
                           onReset={resetForm}
                           required
                    />
                    <label htmlFor={name}>{nombre}</label>
                </div>
            </div>
        );
    }

    if (tipo === 'search'){
        return(
            <input type={tipo}
                   className={estilo}
                   id={name}
                   placeholder={nombre}
                   value={valorInput}
            />
        );
    }

    if (tipo === 'date'){
        return (
            <div className={estilo}>
                <div className="form-floating">
                    <input type={tipo}
                           className="form-control input-group has-validation"
                           id={name}
                           name={name}
                           value={valorInput}
                           onChange={handleChange}
                           onReset={resetForm}
                           required
                    />
                    <label htmlFor={name}>{nombre}</label>
                </div>
            </div>
        );
    }

    if (tipo === 'select'){
        return (
            <div className={estilo}>
                <div className="form-floating mb-3">
                    <select className="form-select input-group has-validation"
                            id={name}
                            name={name}
                            aria-label={texto}
                            value={valorInput}
                            onChange={handleChange}
                            onReset={resetForm}
                            required
                    >
                        <option value="">Selecciona una opción</option>
                        {
                            catalogo?.map((ele) => (
                                <option key={ele.id + '-' + ele.descripcion}
                                        value={ele.id}>
                                    {ele.descripcion}
                                </option>
                            ))
                        }
                    </select>
                    <label htmlFor={name}>{nombre}</label>
                </div>
            </div>
        );
    }


    if (tipo === 'button' || tipo === 'submit'){
        return (
            <div className={estilo}>
                <div className="form-floating">
                <button
                    type={tipo}
                    className={estiloBtn}
                    onClick={fn}
                    disabled={isLoading}
                >
            <span>
              {
                  isLoading && (
                  <span
                      className={icon}
                      role="status"
                      aria-hidden="true">
                  </span>
                  )
              }
                    &nbsp;
                    {nombre}
                    </span>
                </button>
                </div>
            </div>
        );
    }

    if(tipo === 'radio'){
        return(
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name={name}
                    id={name}
                    value={valorInput}
                    onChange={() => seleccionado.setShowControl({ busquedaCliente: name })}
                    onReset={resetForm}
                    checked={seleccionado.showControl.busquedaCliente === name}
                />
                <label className="form-check-label" htmlFor={name}>
                    {nombre}
                </label>
            </div>
        );
    }
}

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
      name,
      isLoading,
      icon,
      seleccionado,
      id_catalogo = 0},
        register,
    ) => {

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

    if (tipo === 'text'){
        return(
            <div className={estilo}>
                <div className="form-floating">
                    <input
                            {...register(name)}
                           type={tipo}
                           className="form-control input-group has-validation"
                           id={name}
                           name={name}
                           placeholder={texto}
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
            />
        );
    }

    if (tipo === 'date'){
        return (
            <div className={estilo}>
                <div className="form-floating">
                    <input
                           {...register(name)}
                           type={tipo}
                           className="form-control input-group has-validation"
                           id={name}
                           name={name}
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
                    <select
                            {...register(name)}
                            className="form-select input-group has-validation"
                            id={name}
                            name={name}
                            aria-label={texto}
                    >
                        <option value="">SELECCIONA UNA OPCIÓN</option>
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

    if(tipo === 'radio'){
        return(
            <div className="form-check">
                <input
                    {...register(name)}
                    className="form-check-input"
                    type="radio"
                    name={name}
                    id={name}
                    checked={seleccionado.showControl.busquedaCliente === name}
                />
                <label className="form-check-label" htmlFor={name}>
                    {nombre}
                </label>
            </div>
        );
    }
}

/*Herramienta para mostrar el estatus*/
import {useEffect, useState} from "react";
import {encryptRequest} from "../../../../../utils";
import {getSucursalUsuarios} from "../../../../../services/inicio-services";
import {Avatar, Dropdown} from "flowbite-react";
import {dataG} from "../../../../../App";

export const UsuariosSistema = ({item, index}) => {

    const [dataSucUsu,setDataSucUsu] = useState([]);

    useEffect(() => {
        const valores = {
            opcion: 2,
            sucursal: item.Sucursal,
        }

        const encryptedData = encryptRequest(valores);

        const getSucursales = async (data) => {
            const response = await getSucursalUsuarios(data);
            setDataSucUsu(response);
        }

        getSucursales(encryptedData);
    }, [dataSucUsu,item.Sucursal]);


    return (
        <td key={index} className="text-center">
            <div className="row justify-content-center">
                <div className="col-md-6">
                        <Avatar.Group>
                            {
                                dataSucUsu?.result_set?.map(ele => {
                                    return (
                                        <Dropdown
                                            label={
                                                <Avatar alt={ele.Usuario}
                                                        size="md"
                                                        rounded
                                                        status={ele.Activo ? 'online':'busy'}
                                                        stacked
                                            />}
                                            arrowIcon={false}
                                            inline>
                                            <Dropdown.Header>
                                                <span className="block text-sm">
                                                    <strong>{ele.Nombre}</strong>
                                                </span>
                                            </Dropdown.Header>
                                            <Dropdown.Item>{ele.Perfil}</Dropdown.Item>
                                            <Dropdown.Divider />
                                        </Dropdown>
                                    )
                                })
                            }
                        </Avatar.Group>
                </div>
            </div>
        </td>
    );
};
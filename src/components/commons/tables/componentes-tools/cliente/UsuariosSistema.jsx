import { Avatar, Dropdown } from "flowbite-react";
import { useGetUsuariosSistema } from "../../../../../hook/useGetUsuariosSistema";
import {useEffect, useState} from "react";
import {encryptRequest} from "../../../../../utils";
import {getSucursalUsuarios} from "../../../../../services/inicio-services";

export const UsuariosSistema = ({ item, index }) => {
    const [dataSucUsu, setDataSucUsu] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const valores = {
                opcion: 2,
                sucursal: item.Sucursal,
            };
            const encryptedData = encryptRequest(valores);

            const response = await getSucursalUsuarios(encryptedData);
            setDataSucUsu(response);
        };

        fetchData();
    }, [item.Sucursal, item["No Usuarios"]]);


    return (
        <td key={index} className="text-center">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <Avatar.Group>
                        {dataSucUsu?.result_set?.map((ele) => (
                            <Dropdown
                                key={ele.Usuario}
                                label={
                                    <Avatar
                                        alt={ele.Usuario}
                                        size="md"
                                        rounded
                                        status={ele.Activo ? "online" : "busy"}
                                        stacked
                                    />
                                }
                                arrowIcon={false}
                                inline
                            >
                                <Dropdown.Header>
                                    <span className="block text-sm">
                                        <strong>{ele.Nombre}</strong>
                                    </span>
                                </Dropdown.Header>
                                <Dropdown.Item>{ele.Perfil}</Dropdown.Item>
                                <Dropdown.Divider />
                            </Dropdown>
                        ))}
                    </Avatar.Group>
                </div>
            </div>
        </td>
    );
};

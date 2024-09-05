import { createContext, useContext } from "react";
import { api } from "~/utils/api";
import { useBranch } from "./BranchContext";

interface WareHouse{
    id:string;
    name:string;
}

interface WareHouseContextProps {
    warehouses : WareHouse[];

}

interface WareHouseProviderProps{
    children: React.ReactNode;
}

const WareHouseContext =  createContext({} as WareHouseContextProps);

export const WareHouseProvider = (props: WareHouseProviderProps) => {
    const {children} = props;
    const {branch} = useBranch();


    const {data: warehouses} =   
        api.warehouses.getWareHousesByIndustry.useQuery({
            branchId: branch ? branch.id : "",
        }) as {data : WareHouse[]};

    const context : WareHouseContextProps = {
        warehouses
    };

    return(
        <WareHouseContext.Provider value={context}>
            {children}
        </WareHouseContext.Provider>
    );
};

export const useWareHouse = () => {
    const context = useContext(WareHouseContext);

    if(context === undefined) {
        throw new Error(
            "useWareHouse must be within a BrachProdider and WareHouseProvider"
        );
    }
    return {
        ...context,
    };
};
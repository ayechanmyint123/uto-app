import { createContext, useContext } from "react";
import { api } from "~/utils/api";
import { useWareHouse } from "./WareHouseContext";
import { useBranch } from "./BranchContext";


interface Shelves{
    name:string;
}

interface ShelvesContextProps {
    shelves : Shelves[] | undefined;

}

interface ShelvesProviderProps{
    children: React.ReactNode;
}

const ShelvesContext =  createContext({} as ShelvesContextProps);

export const ShelvesProvider = (props: ShelvesProviderProps) => {
    const {children} = props;
    const {branch} = useBranch();

    const {data: shelves} = api.sheleves.getShelvesByWarehouse.useQuery({
        branchId : branch ? branch.id : ''
    });

    const context : ShelvesContextProps = {
        shelves
    };
    
    return(
        <ShelvesContext.Provider value={context}>
            {children}
        </ShelvesContext.Provider>
    );
};

export const useShelves = () => {
    const context = useContext(ShelvesContext);

    if(context === undefined) {
        throw new Error(
            "useWareHouse must be within a WarehouseProdider and ShelvesProvider"
        );
    }
    return {
        ...context,
    };
};
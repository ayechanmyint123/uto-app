import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "~/utils/api";
import type { Branch } from "@prisma/client";

interface BranchContextProps {
  branchName: string;
  changeBranch: (name: string) => void;
  branch: Branch | undefined;
  setBranch: React.Dispatch<React.SetStateAction < Branch | undefined >>;
}

interface BranchProviderProps {
  children: React.ReactElement;
}

const BranchContext = createContext({} as BranchContextProps);

export const BranchProvider = (props: BranchProviderProps) => {
  const { children } = props;
  const [branchName, setBranchName] = useState<string>("Medical YGN");
  const [branch, setBranch] = useState<Branch>();
  const [type, location] = branchName.split(" ");
  const { data } = api.branches.getByLocationAndIndustry.useQuery({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    type: type,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    location: location,
  });

  useEffect(() => {
    if (data) {
      setBranch(data);
    }
  }, [data]);

  const context: BranchContextProps = {
    branchName,
    changeBranch: (name) => {
      setBranchName(name);
    },
    branch,
    setBranch,
  };

  return (
    <BranchContext.Provider value={context}>{children}</BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);

  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider");
  }

  return {
    ...context,
  };
};

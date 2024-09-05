import React, { createContext, useContext, useState } from "react";
import { api } from "../utils/api";
import { useBranch } from "../contexts";
import { type Product } from "../components";
import { DEFAULT_PRODUCT } from "../components";

interface ProductContextProps {
  products: Product[] | undefined;
  isLoadingProducts: boolean;
  currentProduct: Product;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
}

interface ProductProviderProps {
  children: React.ReactElement;
}

const ProductContext = createContext({} as ProductContextProps);

export const ProductProvider = (props: ProductProviderProps) => {
  const { children } = props;
  const { branch } = useBranch();
  const [currentProduct, setCurrentProduct] = useState(DEFAULT_PRODUCT);

  // Get all products based on branch
  const {
    data: { products } = { products: [] },
    isLoading: isLoadingProducts,
  } = api.products.getProductsByIndustry.useQuery({
    industryId: branch ? branch.industryId : "",
    limit: 10,
  });

  // Delete a particulat item
  // const { mutate: deleteProduct, isLoading: isDeletingProducts } =
  //   api.products.deleteByCode.useMutation({});

  // useEffect(() => {
  //   deleteProduct({ code: "5Z-SU44" });
  // }, []);

  const context: ProductContextProps = {
    products,
    isLoadingProducts,
    currentProduct,
    setCurrentProduct,
  };

  return (
    <ProductContext.Provider value={context}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);

  if (context === undefined) {
    throw new Error(
      "useProduct must be used within a BranchProdider and ProductProvider"
    );
  }
  return {
    ...context,
  };
};

import {useQuery,useMutation } from "@tanstack/react-query";
import {deleteProduct, getAllProducts, createProduct, getProductById} from "../lib/api";

export const useProducts = () => {
    const result= useQuery({queryKey: ["products"], queryFn: getAllProducts });
    return result;

}

export const useCreateProduct = () => {
    return useMutation({mutationFn: createProduct})
}


export const useProduct = (id) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: ()=> getProductById(id),
        enabled: !!id,
    });

}


export const useDeleteProduct = () => {
    return useMutation({mutationFn: deleteProduct})
}
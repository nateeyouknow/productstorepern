import {useAuth} from "@clerk/react";
import {useEffect} from "react";
import api from "../lib/axios";

let isInterceptorRegistered = false;

const useAuthReq = () => {
  
    const { isSignedIn, getToken, isLoaded } = useAuth();

    useEffect(()=>{
        if(isInterceptorRegistered) return;
        isInterceptorRegistered = true;
        
    const interceptor=  api.interceptors.request.use(async(config) => {
        if(isSignedIn){
        const token = getToken();
        if(token){
            config.headers.Authorization = `Bearer ${token}`
                }
            }
        return config;
    });

    return () => {api.interceptors.request.eject(interceptor);}, 
    [isSignedIn, getToken]});

    return {isSignedIn, isClerkLoaded: isLoaded};
}

export default useAuthReq;
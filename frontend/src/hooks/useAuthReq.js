import {useAuth} from "@clerk/react";
import {useEffect, useRef} from "react";
import api from "../lib/axios";

// let isInterceptorRegistered = false; 1

const useAuthReq = () => {
    const interceptorIdRef = useRef(null);
    const { isSignedIn, getToken, isLoaded } = useAuth();

    useEffect(()=>{
        // if(isInterceptorRegistered) return; 1
        // isInterceptorRegistered = true; 1
        if(interceptorIdRef.current!==null) return;
    // const interceptor=  api.interceptors.request.use(async (config) => {
        
        interceptorIdRef.current = api.interceptors.request.use(async (config)=>{
        if(isSignedIn){
        const token = await getToken();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
                }
            }
        return config;
    });

    return () => {
        // api.interceptors.request.eject(interceptor);
        // isInterceptorRegistered = false;
        if(interceptorIdRef.current!==null){
            api.interceptors.request.eject(interceptorIdRef.current);
            interceptorIdRef.current = null;
        }
    };
},  [/*{isSignedIn, }*/getToken]);

    return {isSignedIn, isClerkLoaded: isLoaded};
}

export default useAuthReq;
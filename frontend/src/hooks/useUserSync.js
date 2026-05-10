import {useAuth, useUser } from "@clerk/react";
import {useMutation} from "@tanstack/react-query";
import {useEffect} from "react";
import {syncUser} from "../lib/api";
//best implementation of this is by web hooks


function useUserSync() {
    const {isSignedIn } = useAuth();
    const {user } = useUser();
    
    const {mutate: syncUserMutation, isPending, isSuccess } = useMutation({ mutationFn: syncUser});

    useEffect(()=>{
        if(isSignedIn && user&& !isPending && !isSuccess) {
            syncUserMutation({
                email: user.primaryEmailAddress?.emailAddress,
                name:    user.fullName || user.firstName,
                imageUrl: user.imageUrl,
            })
        }

    }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);
    
    return {isSynced: isSuccess};
}

export default useUserSync;
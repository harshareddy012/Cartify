import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { syncUser } from "../lib/api";

// the best way to implement this is by using webhooks
function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const { mutate: syncUserMutation, isPending, isSuccess } = useMutation({ mutationFn: syncUser });

  useEffect(() => {
    if (isSignedIn && user && !isPending && !isSuccess) { // here !pending means that the mutation is not currently running, and !isSuccess means that it has not already succeeded. This check prevents multiple calls to syncUserMutation while the user data is being synchronized or after it has already been successfully synchronized.
      syncUserMutation({
        email: user.primaryEmailAddress?.emailAddress,  // here primaryEmailAddress?.emailAddress means that we are trying to access the emailAddress property of the primaryEmailAddress object. The optional chaining operator (?.) is used to safely access the emailAddress property, which means that if primaryEmailAddress is null or undefined, it will not throw an error and will instead return undefined for the email field.
        name: user.fullName || user.firstName,
        imageUrl: user.imageUrl,
      });
    }
  }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);

  return { isSynced: isSuccess };
}

export default useUserSync;

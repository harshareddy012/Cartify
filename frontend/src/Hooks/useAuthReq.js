import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import api from "../lib/axios";

let isInterceptorRegistered = false;

function useAuthReq() {
  const { isSignedIn, getToken, isLoaded } = useAuth();
  // include the token to the request headers
  useEffect(() => {
    if (isInterceptorRegistered) return;
    isInterceptorRegistered = true;

// interceptor are the funtions that are used to inject the any information (in our case the authentication token , user headers  ) on incoming or outgoing requests.


//  these interceptors are of two types : request interceptors and response interceptors. Request interceptors are used to modify the request before it is sent to the server, while response interceptors are used to modify the response before it is returned to the client. In our case we are using request interceptor to inject the authentication token in the request headers before sending the request to the server.
   
const interceptor = api.interceptors.request.use(async (config) => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`; // a bearer token is an HTTP security token , here we are setting the Authorization header with the value of Bearer token, which is the standard way to include a token in the request headers for authentication purposes. The server can then extract the token from the Authorization header and verify it to authenticate the user making the request.
        }
      }
      return config; // this will return the modified config object with the Authorization header included, which will be used to make the API request to the server.
    });

    return () => {
      api.interceptors.request.eject(interceptor); // this will remove the interceptor when the component unmounts, which is important to prevent memory leaks and ensure that the interceptor is not applied to other requests that do not require authentication.   ., clearInterval()). is also one of the ways to clean up the side effects in useEffect, but in this case we are using the eject method of the axios instance to remove the interceptor without memory leaks.
      isInterceptorRegistered = false;
    };
  }, [isSignedIn, getToken]);

  return { isSignedIn, isClerkLoaded: isLoaded };
}

export default useAuthReq;

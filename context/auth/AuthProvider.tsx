import Cookies from "js-cookie";
import { FC, useEffect, useReducer } from "react";
import axios, { AxiosError } from "axios";

import { tesloApi } from "../../api";
import { IUser } from "../../interfaces";
import { AuthContext, authReducer } from "./";
import { useRouter } from "next/router";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

interface RegisterUser{ 
  hasError: boolean; 
  message?: string; 
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const router = useRouter();

  useEffect(() => {
    checkToken();
  }, [])

  const checkToken = async() => {

    if( !Cookies.get('token')){
      return;
    }

    try {
      const { data } = await tesloApi.post('/user/validate-token');
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[AUTH] - Login', payload: user });
    } catch (error) {
      Cookies.remove('token');
    }
  }

  const loginUser = async( email: string, password: string ):Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[AUTH] - Login', payload: user });
      return true; 
    } catch (error) {
      return false;
    }
  }

  const registerUser = async( name: string, email: string, password: string ): Promise<RegisterUser> => {
    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[AUTH] - Login', payload: user });
      return {
        hasError: false
      }
    } catch (error) {
      if( axios.isAxiosError(error) ) {
        return {
          hasError: true,
          message: error.response?.data?.message
        }
      }
      return {
        hasError: true,
        message: 'No se pudo crear el usuario - intente de nuevo'
      }
    }
  }

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('cart');
    router.reload();
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

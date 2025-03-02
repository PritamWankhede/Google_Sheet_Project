import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { signInUser, signUpUser } from "@/services/User";
import { cookie } from "@/utils";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = cookie.get("auth_token");
    if (authToken) {
      setUser(jwtDecode(authToken));
    }
    document.addEventListener("unauthorized", logout);
    return () => {
      document.removeEventListener("unauthorized", logout);
    };
  }, []);

  const handleAuthResponse = (token) => {
    cookie.set({ name: "auth_token", value: token, days: 14 });
    setUser(jwtDecode(token));
    navigate("/sheet/list");
  };

  const signIn = async (data) => {
    try {
      const response = await signInUser(data);
      const token = response?.data?.data?.token;
      if (token) handleAuthResponse(token);
    } catch (error) {
      toast.error(error?.message);
      if (error?.message === "User not exist") navigate("/auth/sign-up");
    }
  };

  const signUp = async (data) => {
    try {
      const response = await signUpUser(data);
      const token = response?.data?.data?.token;
      if (token) handleAuthResponse(token);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const logout = () => {
    cookie.remove("auth_token");
    navigate("/");
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

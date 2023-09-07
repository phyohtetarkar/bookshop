import { createContext } from "react";

export const LoadingContext = createContext({
  loading: false,
  setLoading: (value) => {},
});

export const AuthContext = createContext({
  user: {
    displayName: "",
  },
  setUser: (user) => {},
});

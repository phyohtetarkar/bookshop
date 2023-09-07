import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import SignIn from "./authentication/SignIn";
import AuthorList from "./author/AuthorList";
import Banners from "./banner/Banners";
import CategoryList from "./category/CategoryList";
import { AuthContext, LoadingContext } from "./common/Contexts";
import Dashboard from "./dashboard/Dashboard";
import NotFound from "./error/404";
import { firebaseAuth } from "./firebase.config";
import NotificationList from "./notification/NotificationList";
import OrderDetail from "./order/OrderDetail";
import OrderList from "./order/OrderList";
import ProductEdit from "./product/ProductEdit";
import ProductList from "./product/ProductList";
import Settings from "./setting/Settings";
import Template from "./template/Template";

export const baseImagePath = process.env.REACT_APP_FIREBASE_STORAGE_PATH;

function App() {
  const setUser = (value) => {
    setAuth({
      ...auth,
      user: value,
    });
  };

  const setLoading = (value) => {
    setIsLoading({
      ...isLoading,
      loading: value,
    });
  };

  const [auth, setAuth] = useState({
    user: null,
    setUser: setUser,
  });

  const [isLoading, setIsLoading] = useState({
    loading: false,
    setLoading: setLoading,
  });

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const auth = firebaseAuth;
    let unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ displayName: user.email ?? "Admin" });
      } else {
        setUser(null);
      }
      setInitializing(false);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initializing) {
    return <div className="h-full w-full bg-white"></div>;
  }

  return (
    <AuthContext.Provider value={auth}>
      <LoadingContext.Provider value={isLoading}>
        <Routes>
          <Route path="/" element={<Template />}>
            <Route index element={<Dashboard />} />
            <Route path="banners" element={<Banners />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="authors" element={<AuthorList />} />
            <Route path="books">
              <Route index element={<ProductList />} />
              <Route path="new" element={<ProductEdit />} />
              <Route path=":id" element={<ProductEdit />} />
            </Route>
            <Route path="orders">
              <Route index element={<OrderList />} />
              <Route path=":id" element={<OrderDetail />} />
            </Route>
            <Route path="app-notifications" element={<NotificationList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LoadingContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

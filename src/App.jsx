import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

import { useAppContext } from "./context/AppContext";
import Auth from "./modals/Auth";
import SellerLogin from "./components/seller/SellerLogin";


const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();
  return (
    <div className="text-default min-h-screen">
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Auth /> : null}
      <Toaster />
      <div
        className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/seller"
            element={isSeller ? <SellerLayout /> : <SellerLogin />}
          >
            <Route index element={isSeller ? <AddProduct /> : null} />
          </Route>
        </Routes>
      </div>
     
    </div>
  );
};
export default App;

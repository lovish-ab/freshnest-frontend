import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import React, { useState, useEffect } from "react";

const SellerLogin = () => {
  const { isSeller, navigate, axios, saveLogin } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (!data) {
        toast.error("Unexpected response from server");
        return;
      }

      if (data.token || data.user) {
        const role = (data.user?.role || data.role || "").toString().toUpperCase();
        if (role !== "SELLER") {
          toast.error("Seller account required");
          return;
        }

        saveLogin(data.token ?? null, data.user ?? data.userData ?? null, role);
        navigate("/seller");
        toast.success(data.message || "Logged in as seller");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        "Login failed";
      toast.error(errorMessage);
    }
  };
  return (
    !isSeller && (
      <div className="fixed top-0 left-0 bottom-0 right-0 z-30 flex items-center justify-center  bg-black/50 text-gray-600">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
        >
          <p className="text-2xl font-medium m-auto">
            <span className="text-indigo-500">Seller</span>
            Login
          </p>

          <div className="w-full ">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="email"
              required
            />
          </div>
          <div className="w-full ">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="password"
              required
            />
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
            Login
          </button>
        </form>
      </div>
    )
  );
};
export default SellerLogin;

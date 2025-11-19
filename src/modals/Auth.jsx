


import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Auth = () => {
  const [mode, setMode] = useState("login"); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); 
  const [loading, setLoading] = useState(false);


  const {
    saveLogin, 
    setShowUserLogin,
    navigate,
    fetchProducts, 
  } = useAppContext();

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("USER");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {

        const payload = { name, email, password, role };

        const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const resp = await fetch(`${base}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        const data = await resp.json();

        if (resp.ok && data) {

          if (data.token || data.user) {
            saveLogin(
              data.token ?? null,
              data.user ?? data.userData ?? null,
              role
            );
            toast.success(data.message || "Registered successfully");
            setShowUserLogin(false);
            resetForm();
            try {
              fetchProducts?.();
            } catch (e) {}
            navigate("/");
          } else {

            toast.success(data.message || "Registered — please login");
            setMode("login");
          }
        } else {
    
          const msg = data?.message || data?.errors || "Registration failed";
          toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
        }
      } else {
      
        const payload = { email, password };
        const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const resp = await fetch(`${base}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        const data = await resp.json();

        if (resp.ok && data) {
          if (data.token || data.user) {
            const inferredRole = data.user?.role ?? data.role ?? undefined;
            saveLogin(
              data.token ?? null,
              data.user ?? data.userData ?? null,
              inferredRole
            );
            toast.success(data.message || "Logged in");
            setShowUserLogin(false);
            resetForm();
            try {
              fetchProducts?.();
            } catch (e) {}
            navigate("/");
          } else {
            toast.error(data.message || "Login failed");
          }
        } else {
          const msg = data?.message || "Login failed";
          toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      const msg = err?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-8 w-80 shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        {mode === "register" && (
          <>
            <label className="block text-sm">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Your name"
            />

            <div className="flex gap-3 mt-3 text-sm items-center">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  checked={role === "USER"}
                  onChange={() => setRole("USER")}
                />
                User
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  checked={role === "SELLER"}
                  onChange={() => setRole("SELLER")}
                />
                Seller
              </label>
            </div>
          </>
        )}

        <label className="block text-sm mt-3">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded mt-1"
          placeholder="you@example.com"
        />

        <label className="block text-sm mt-3">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded mt-1"
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between gap-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? (mode === "login" ? "Logging in..." : "Registering...") : mode === "login" ? "Login" : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="px-3 py-2 border rounded text-sm"
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;

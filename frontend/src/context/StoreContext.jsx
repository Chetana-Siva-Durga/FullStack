import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  console.log("VITE_API_URL is:", import.meta.env.VITE_API_URL);

  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  // Restore user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch cart and addresses when user changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user && token) {
      fetchCartFromBackend(token);
      fetchAddresses(token);
    }
  }, [user]);

  // Save cart when it changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user && token) {
      saveCartToBackend(token);
    }
  }, [cartItems]);

  // Recalculate grand total when cart or food list changes
  useEffect(() => {
    const total = calculateGrandTotal();
    setGrandTotal(total);
  }, [cartItems, food_list]);

  const fetchCartFromBackend = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.cart || {});
      } else {
        console.error("Fetch cart failed:", data.message);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  const saveCartToBackend = async (token) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      });
    } catch (err) {
      console.error("Save cart error:", err);
    }
  };

  const fetchAddresses = async (token = localStorage.getItem('token')) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses || []);
      } else {
        console.error("Fetch addresses failed:", data.message);
      }
    } catch (error) {
      console.error("Fetch addresses error:", error);
    }
  };

  const addAddress = async (address) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });
      const data = await response.json();
      if (response.ok) {
        await fetchAddresses(token);
        return data.addresses[data.addresses.length - 1];
      } else {
        alert(data.message || "Failed to add address.");
      }
    } catch (error) {
      console.error("Add address error:", error);
    }
  };

  const updateAddress = async (addressId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/address/${addressId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update address");
      }
      await fetchAddresses(token);
      return true;
    } catch (error) {
      console.error("Update address failed:", error.message);
      return false;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/address/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete address');
      setAddresses(data.addresses);
      console.log('Address deleted successfully ✅');
    } catch (error) {
      console.error('Delete address failed:', error.message);
    }
  };

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;
      const updated = { ...prev, [itemId]: prev[itemId] - 1 };
      if (updated[itemId] <= 0) delete updated[itemId];
      return updated;
    });
  };

  const clearCart = () => setCartItems({});

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartItems({});
    setAddresses([]);
  };

  const calculateGrandTotal = () => {
    let total = 0;
    for (const id in cartItems) {
      const item = food_list.find(f => f._id === id);
      if (item) {
        const priceNum = parseFloat(item.price.toString().replace(/[^0-9.]/g, ""));
        total += cartItems[id] * priceNum;
      }
    }
    // Add delivery charge if cart has items
    if (Object.keys(cartItems).length) total += 50;
    return total;
  };

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    user,
    setUser,
    logout,
    addresses,
    fetchAddresses,
    addAddress,
    deleteAddress,
    updateAddress,
    grandTotal,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

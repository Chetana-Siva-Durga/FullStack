import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const {
    cartItems, food_list, addresses, fetchAddresses,
    addAddress, deleteAddress, updateAddress
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressIdToDelete, setAddressIdToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  let subtotal = 0;
  food_list.forEach((item) => {
    const quantity = cartItems[item._id];
    if (quantity > 0) {
      const priceNum = parseFloat(item.price.toString().replace(/[^0-9.]/g, ""));
      subtotal += priceNum * quantity;
    }
  });

  const deliveryFee = subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal + deliveryFee;
  const hasItemsInCart = Object.values(cartItems).some((qty) => qty > 0);

  const cityZipMap = {
    Visakhapatnam: "530001", Vijayawada: "520001", Guntur: "522001", Nellore: "524001",
    Kurnool: "518001", Rajahmundry: "533101", Tirupati: "517501", Kadapa: "516001",
    Anantapur: "515001", Ongole: "523001", Eluru: "534001", Srikakulam: "532001",
    Vizianagaram: "535001", Machilipatnam: "521001", Chittoor: "517001",
  };
  const allowedCities = Object.keys(cityZipMap);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "Andhra Pradesh", zip: "", country: "India", phone: "",
  });
  const [showForm, setShowForm] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPhoneValid = /^\d{10}$/.test(formData.phone);
  const areFieldsFilled = Object.values(formData).every((val) => val.trim() !== "");
  const isCityValid = allowedCities.includes(formData.city);
  const isFormValid = isEmailValid && isPhoneValid && areFieldsFilled && isCityValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (value === "" || (/^\d+$/.test(value) && value.length <= 10)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "city") {
      const trimmedCity = value.trim();
      setFormData((prev) => ({ ...prev, city: trimmedCity, zip: cityZipMap[trimmedCity] || "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOrUpdateAddress = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (editMode && selectedAddressId) {
      const success = await updateAddress(selectedAddressId, formData);
      if (success) {
        setEditMode(false);
        setShowForm(false);
      }
    } else {
      const addedAddress = await addAddress(formData);
      if (addedAddress) {
        setSelectedAddressId(addedAddress._id);
        setShowForm(false);
      }
    }

    setFormData({
      firstName: "", lastName: "", email: "", street: "",
      city: "", state: "Andhra Pradesh", zip: "", country: "India", phone: "",
    });
  };

  const handleEditClick = (addr) => {
    setFormData({
      firstName: addr.firstName, lastName: addr.lastName, email: addr.email, street: addr.street,
      city: addr.city, state: addr.state, zip: addr.zip, country: addr.country, phone: addr.phone,
    });
    setSelectedAddressId(addr._id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDeleteClick = (addressId) => {
    setAddressIdToDelete(addressId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteAddress(addressIdToDelete);
    setShowDeleteModal(false);
    setAddressIdToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAddressIdToDelete(null);
  };

  return (
    <div className="place-order">
      <div className="place-order-container">
        <div className="delivery-form">
          <h2>Delivery Information</h2>
          {addresses.length > 0 && !showForm ? (
            <div className="saved-addresses">
              {addresses.map((addr, idx) => (
                <div key={idx} className="address-card">
                  <p className="address-name"><b>{addr.firstName} {addr.lastName}</b></p>
                  <p className="address-text">{addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</p>
                  <p className="address-text">📧 {addr.email} | 📞 {addr.phone}</p>
                  <div className="address-buttons">
                    <button
                      className="use-address-btn"
                      onClick={() => setSelectedAddressId(addr._id)}
                      style={{
                        background: selectedAddressId === addr._id ? 'var(--primary-color)' : 'var(--accent-color)',
                        color: '#fff'
                      }}
                    >
                      {selectedAddressId === addr._id ? "Address Selected ✅" : "Use Address"}
                    </button>
                    <button className="edit-address-btn" onClick={() => handleEditClick(addr)}>✏️ Edit</button>
                    <button className="delete-address-btn" onClick={() => handleDeleteClick(addr._id)}>🗑 Delete</button>
                  </div>
                </div>
              ))}
              {addresses.length < 3 && (
                <button className="add-new-btn payment-button" onClick={() => { setShowForm(true); setEditMode(false); }}>
                  + Add New Address
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleAddOrUpdateAddress}>
  <div className="form-header">
    {showForm && (
      <button
        type="button"
        className="back-arrow-btn"
        onClick={() => {
          setShowForm(false);
          setEditMode(false);
          setFormData({
            firstName: "", lastName: "", email: "", street: "",
            city: "", state: "Andhra Pradesh", zip: "", country: "India", phone: "",
          });
        }}
      >
        ←
      </button>
    )}
    <h3>{editMode ? "Edit Address" : "Add New Address"}</h3>
  </div>

  <div className="form-row">
    <input type="text" placeholder="First name" name="firstName" value={formData.firstName} onChange={handleChange} required />
    <input type="text" placeholder="Last name" name="lastName" value={formData.lastName} onChange={handleChange} required />
  </div>
  <input type="email" placeholder="Email address" name="email" value={formData.email} onChange={handleChange} required />
  {!isEmailValid && formData.email && <p className="error-text">Enter a valid email address.</p>}
  <input type="text" placeholder="Street" name="street" value={formData.street} onChange={handleChange} required />
  <div className="form-row">
    <input type="text" placeholder="City" list="cities" name="city" value={formData.city} onChange={handleChange} required />
    <input type="text" placeholder="State" name="state" value={formData.state} readOnly />
  </div>
  {!isCityValid && formData.city && <p className="error-text">Sorry, we do not deliver to your city.</p>}
  <div className="form-row">
    <input type="text" placeholder="Zip code" name="zip" value={formData.zip} readOnly />
    <input type="text" placeholder="Country" name="country" value={formData.country} readOnly />
  </div>
  <input type="text" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
  {!isPhoneValid && formData.phone && <p className="error-text">Phone number must be 10 digits.</p>}
  <button type="submit" className="payment-button" disabled={!isFormValid}>
    {editMode ? "Update Address" : "Save Address"}
  </button>
</form>

          )}
          <datalist id="cities">
            {allowedCities.map((city, idx) => (
              <option key={idx} value={city} />
            ))}
          </datalist>
        </div>

        <div className="order-summary">
          <h2>Cart Totals</h2>
          {!hasItemsInCart ? (
            <p className="empty-cart">Your cart is empty. Please add items before placing an order.</p>
          ) : (
            <>
              <div className="summary-details">
                <div className="summary-line"><p>Subtotal</p><p>₹ {subtotal.toFixed(2)}</p></div>
                <div className="summary-line"><p>Delivery Fee</p><p>₹ {deliveryFee.toFixed(2)}</p></div>
                <hr />
                <div className="summary-line total"><b>Total</b><b>₹ {grandTotal.toFixed(2)}</b></div>
              </div>
              <div className="tooltip-container">
  <button
    disabled={!selectedAddressId || subtotal === 0}
    onClick={() => navigate('/payment')}
    className="payment-button"
    style={{ opacity: !selectedAddressId || subtotal === 0 ? 0.6 : 1 }}
  >
    Proceed To Payment
  </button>
  {(!selectedAddressId || subtotal === 0) && (
    <div className="tooltip-text">Please select a delivery address</div>
  )}
</div>

            
              <button
                onClick={() => navigate('/cart')}
                className="back-button"
              >
                Back to Cart
              </button>
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this address?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmDelete}>Yes, Delete</button>
              <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;

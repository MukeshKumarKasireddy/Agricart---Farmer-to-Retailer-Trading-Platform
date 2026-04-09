import { useCart } from "../../../context/CartContext";
import api from "../../../api/axios";

const Cart = () => {
  const cartContext = useCart();

  if (!cartContext) {
    return (
      <div>
        <h2>Cart</h2>
        <p style={{ color: "red" }}>
          Cart context is not available. Please ensure CartProvider wraps the app.
        </p>
      </div>
    );
  }

  const { cartItems, removeFromCart, clearCart } = cartContext;
  const retailerId = localStorage.getItem("id");

  const handlePlaceOrder = async () => {
    if (!retailerId) {
      alert("Retailer not logged in");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      for (const item of cartItems) {
        if (!item.quantity || item.quantity <= 0) {
          alert(`Invalid quantity for ${item.name}`);
          return;
        }

        if (
          item.availableStock !== undefined &&
          item.quantity > item.availableStock
        ) {
          alert(
            `Only ${item.availableStock} kg available for ${item.name}`
          );
          return;
        }

        if (!item.productId) {
          alert(`Product ID missing for ${item.name}`);
          console.error("Invalid cart item:", item);
          return;
        }

        await api.post(
          "/orders/retailer/place",
          null,
          {
            params: {
              productId: item.productId,   // ✅ FIXED HERE
              retailerId: Number(retailerId),
              quantity: Number(item.quantity),
            },
          }
        );
      }

      alert("Order placed successfully");
      clearCart();

    } catch (error) {
      console.error("Order placement failed:", error);

      let msg = "Order failed";

if (error.response?.data) {
  if (typeof error.response.data === "string") {
    msg = error.response.data;
  } else if (error.response.data.message) {
    msg = error.response.data.message;
  } else {
    msg = JSON.stringify(error.response.data);
  }
} else if (error.message) {
  msg = error.message;
}

alert(msg);

    }
  };

  return (
    <div>
      <h2>My Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#ffffff",
                padding: "16px",
                borderRadius: "10px",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4>{item.name}</h4>
                <p>
                  {item.quantity} kg × ₹{item.pricePerKg}
                </p>
                <strong>
                  Total: ₹{item.quantity * item.pricePerKg}
                </strong>
              </div>

              <button
                onClick={() => removeFromCart(index)}
                style={{
                  backgroundColor: "#d32f2f",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={handlePlaceOrder}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "14px",
              backgroundColor: "#2A7D3E",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;

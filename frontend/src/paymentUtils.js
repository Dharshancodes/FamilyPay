import { createRazorpayOrder, verifyRazorpayPayment } from "./api.js";

// Utility to handle Razorpay UI flow
export async function initializeRazorpayPayment({ amount, memberId, merchant, userName, userPhone, onSuccess, onError }) {
  try {
    // 1. Create order on backend
    const { data } = await createRazorpayOrder(amount, memberId, merchant);
    const order = data.order;

    // 2. Setup Razorpay options
    const options = {
      key: "dummy_key_id", // Replace with real key in production frontend, or fetch from backend
      amount: order.amount,
      currency: order.currency,
      name: "FamilyPay",
      description: `Payment for ${merchant}`,
      order_id: order.id,
      handler: async function (response) {
        // 3. Verify payment on backend
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: amount,
            memberId: memberId,
            merchant: merchant
          };
          
          await verifyRazorpayPayment(verifyData);
          if (onSuccess) onSuccess(response);
        } catch (err) {
          console.error("Verification failed", err);
          if (onError) onError(err);
        }
      },
      prefill: {
        name: userName || "FamilyPay User",
        email: "user@example.com",
        contact: userPhone || "9999999999"
      },
      theme: {
        color: "#1F4E79"
      }
    };

    // 4. Open Razorpay modal
    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      if (onError) onError(response.error);
    });
    rzp1.open();
    
  } catch (error) {
    console.error("Failed to initialize Razorpay", error);
    if (onError) onError(error);
  }
}

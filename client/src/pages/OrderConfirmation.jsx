import MessageDisplay from "../components/MessageDisplay";
import DynamicTitle from "../components/DynamicTitle";

export default function OrderConfirmation() {
  return (
    <>
      <DynamicTitle title="Order confirmation" />
      <MessageDisplay
        title="Success!"
        message="Your order is being processed. The confirmation email with the receipt for your purchase was sent to the email associated with your account. Please allow 3 to 5 business days for delivery. For any questions, please use our contact form or give us a call at 1 800 777 7777. Thank you for shopping at e-commerce"
        className="alert-success"
      />
    </>
  );
}

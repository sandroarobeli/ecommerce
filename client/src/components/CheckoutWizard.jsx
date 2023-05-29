export default function CheckoutWizard({ activeStep = 0, children }) {
  return (
    <section>
      <nav className="mb-5 flex flex-wrap">
        {[
          "User Login",
          "Shipping Address",
          "Payment Method",
          "Place Order",
        ].map((step, index) => (
          <div
            key={step}
            className={`flex-1 border-b-2 text-center ${
              index <= activeStep
                ? "border-indigo-700 text-indigo-700"
                : "border-gray-500 text-gray-500"
            }`}
          >
            {step}
          </div>
        ))}
      </nav>
      {children}
    </section>
  );
}

// import MessageDisplay from "../components/MessageDisplay";
// import Spinner from "../components/Spinner";
import { useState } from "react";
import DynamicTitle from "../components/DynamicTitle";
import Alert from "../components/Alert";

export default function Cart() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className="relative">
      <DynamicTitle title="Cart" />
      <button aria-label="Some text one" className="primary-button">
        Add to Card
      </button>
      <button aria-label="Some text two" className="outline-button mt-4">
        Cancel
      </button>
      <button
        aria-label="Some text three"
        className="error-button m-4"
        onClick={() => setShowAlert(true)}
      >
        ok
      </button>
      <Alert
        message="This is a success alert — check it out!"
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
}

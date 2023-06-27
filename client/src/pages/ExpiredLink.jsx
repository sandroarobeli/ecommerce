import { Link } from "react-router-dom";

import MessageDisplay from "../components/MessageDisplay";
import DynamicTitle from "../components/DynamicTitle";

export default function ExpiredLink() {
  return (
    <>
      <DynamicTitle title="Link expired" />
      <div className="font-oswald mb-8">
        <h1 className="text-3xl">e-commerce</h1>
        <h2 className="text-lg">Online shopping made easy</h2>
      </div>
      <MessageDisplay
        title="The link has expired"
        message="This link has expired. Please resubmit your email and follow the link
        in your email within the next 15 minutes."
        className="alert-error"
      />
      <Link
        to="/password-reset-email"
        className="text-lg mt-6 text-blue-800 hover:text-blue-900"
      >
        Reset Password
      </Link>
    </>
  );
}

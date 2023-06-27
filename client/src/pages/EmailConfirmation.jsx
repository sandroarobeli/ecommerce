import MessageDisplay from "../components/MessageDisplay";
import DynamicTitle from "../components/DynamicTitle";

export default function EmailConfirmation() {
  return (
    <>
      <DynamicTitle title="Email confirmation" />
      <div className="font-oswald mb-8">
        <h1 className="text-3xl">e-commerce</h1>
        <h2 className="text-lg">Online shopping made easy</h2>
      </div>
      <MessageDisplay
        title="Check you inbox"
        message="We've sent an email with the link to reset your password. If you don't
        receive this email within a few minutes, then check your spam and junk
        folders. Otherwise you might have signed up with a different address.
        The link will remain active for 15 minutes."
        className="alert-success"
      />
    </>
  );
}

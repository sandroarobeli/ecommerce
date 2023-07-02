import MessageDisplay from "../components/MessageDisplay";
import DynamicTitle from "../components/DynamicTitle";

export default function ContactConfirmation() {
  return (
    <>
      <DynamicTitle title="Contact confirmation" />
      <div className="font-oswald mb-8">
        <h1 className="text-3xl">e-commerce</h1>
        <h2 className="text-lg">Online shopping made easy</h2>
      </div>
      <MessageDisplay
        title="Message sent"
        message="Thank you for contacting e-commerce. We received your message and will be in touch soon"
        className="alert-success"
      />
    </>
  );
}

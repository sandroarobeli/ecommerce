import TwitterIcon from "./icons/TwitterIcon";
import FacebookIcon from "./icons/FacebookIcon";
import PhoneIcon from "./icons/PhoneIcon";
import EmailIcon from "./icons/EmailIcon";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center sm:flex-row sm:justify-around p-4 bg-black text-white font-roboto">
      <p className="text-lg">
        Copyright &#169; {new Date().getFullYear()} e-commerce
      </p>

      <div className="w-3/4 p-2 flex justify-around items-center sm:w-1/4">
        <TwitterIcon />
        <FacebookIcon />
        <PhoneIcon />
        <EmailIcon />
      </div>
    </footer>
  );
}

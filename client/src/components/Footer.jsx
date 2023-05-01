import Logo from "./icons/Logo";
import TwitterIcon from "./icons/TwitterIcon";
import FacebookIcon from "./icons/FacebookIcon";
import PhoneIcon from "./icons/PhoneIcon";
import EmailIcon from "./icons/EmailIcon";

export default function Footer() {
  return (
    <footer className="footer flex flex-col items-center sm:flex-row sm:justify-between p-4 bg-black text-white">
      <div className="items-center grid-flow-col">
        <Logo />
        <p className="text-lg ml-4">
          Copyright &#169; {new Date().getFullYear()} e-commerce
        </p>
      </div>
      <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <TwitterIcon />
        <FacebookIcon />
        <PhoneIcon />
        <EmailIcon />
      </div>
    </footer>
  );
}

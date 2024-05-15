import Image from "next/image";
import Link from "next/link";
import './styles.css'
const Footer = () => {
  return (
    <>
      <footer className="wow fadeInUp dark:bg-gray-dark relative z-10 bg-white pt-16 md:pt-20 lg:pt-24" data-wow-delay=".1s">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-8 max-w-[360px] lg:mb-10">
                <Link href="/" className="mb-8 inline-block">
                  <Image
                    src="/images/logo/logo2.jpg"
                    alt="logo"
                    className="w-full dark:hidden"
                    width={140}
                    height={40}
                  />
                  <Image
                    src="/images/logo/logo1.png"
                    alt="logo"
                    className="hidden w-full dark:block"
                    width={140}
                    height={30}
                  />
                </Link>
                <p className="dark:text-body-color-dark mb-9 mt-0 text-base leading-relaxed text-body-color font-bold font-large ">
                  Decentralized AI based solution for EVs
                </p>
                <div className="flex space-x-7">
  <a
    href="https://twitter.com/mayanksharmaa03"
    aria-label="Twitter"
    className="social-link transition-transform duration-300 hover:scale-150"
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      className="fill-current text-primary dark:text-primary duration-300 hover:text-secondary dark:hover:text-secondary"
    >
      <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.098-.611-.098-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
    </svg>
  </a>

  <a
    href="https://www.youtube.com/channel/UCZXDhOe6_Imp5ERSLDfaigg"
    aria-label="YouTube"
    className="social-link transition-transform duration-300 hover:scale-150"
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      className="fill-current text-primary dark:text-primary duration-300 hover:text-secondary dark:hover:text-secondary"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  </a>

  <a
    href="https://www.linkedin.com/in/mayanksharma2808/"
    aria-label="LinkedIn"
    className="social-link transition-transform duration-300 hover:scale-150"
  >
    <svg
      width="32"
      height="29"
      viewBox="0 0 24 24"
      className="fill-current text-primary dark:text-primary duration-300 hover:text-secondary dark:hover:text-secondary"
    >
      <path d="M19.988 0H4.012C1.796 0 0 1.796 0 4.012v15.976C0 22.204 1.796 24 4.012 24h15.976c2.216 0 4.012-1.796 4.012-4.012V4.012C24 1.796 22.204 0 19.988 0zM7.208 20.52H3.752V9.072h3.456v11.448zM5.48 7.56c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2zm15.04 12.96h-3.456V13.92c0-1.528-.536-2.568-1.88-2.568-1.024 0-1.632.696-1.9 1.368-.096.24-.12.576-.12.912v7.888H9.64V9.072h3.456v1.56l.024.048c.48-.72 1.336-1.752 3.256-1.752 2.376 0 4.16 1.552 4.16 4.888v7.704z" />
    </svg>
  </a>
</div>
              </div>
            </div>
            <div className="same-line-container">
  <div className="w-full px-2 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
    <div className="mb-12 ml-0 lg:mb-16">
      <h2 className="mb-6 text-xl font-bold text-black dark:text-white hover:underline">Imp Links</h2>
      <ul>
        <li><a href="https://push.org/" className="link">Push Protocol</a></li>
        <li><a href="https://ipfs.tech/" className="link">IPFS</a></li>
        <li><a href="https://ipfs.tech/" className="link">About Us</a></li>
        <li><a href="https://ipfs.tech/" className="link">Contact Us</a></li>
      </ul>
    </div>
  </div>
  <div className="vertical-line"></div>
  <div className="w-full px-2 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
    <div className="mb-12 lg:mb-16">
      <h2 className="mb-6 text-xl font-bold text-black dark:text-white hover:underline">Terms</h2>
      <ul>
        <li><a href="#" className="link">TOS</a></li>
        <li><a href="#" className="link">Privacy Policy</a></li>
        <li><a href="#" className="link">Services</a></li>
        <li><a href="#" className="link">Addresses</a></li>
      </ul>
    </div>
  </div>
  <div className="vertical-line"></div>
  <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
    <div className="mb-12 lg:mb-16">
      <h2 className="mb-6 text-xl font-bold text-black dark:text-white hover:underline">Support & Help</h2>
      <ul>
        <li><a href="#" className="link">Open Support Ticket</a></li>
        <li><a href="#" className="link">Terms of Use</a></li>
      </ul>
    </div>
  </div>
</div>
         
       
          
          
          </div>

          
        </div>

       
      </footer>
    </>
  );
};

export default Footer;

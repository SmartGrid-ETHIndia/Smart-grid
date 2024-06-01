import Image from "next/image";
import Link from "next/link";
import './styles.css';

const Footer = () => {
  return (
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
              <p className="dark:text-body-color-dark mb-9 mt-0 text-base leading-relaxed text-body-color font-bold font-large">
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
        viewBox="0 0 224 224"
        className="fill-current text-primary dark:text-primary duration-300 hover:text-secondary dark:hover:text-secondary"
    >
        <path d="M146 225H1V1h224v224h-79m18.391-59.491h9.428l-47.595-63.725 43.538-46.735c-6.14-1.462-10.298-.211-14.12 4.416-6.144 7.436-13.059 14.236-19.667 21.286-4.632 4.94-9.296 9.85-14.209 15.05-9.787-13.064-19.229-25.723-28.765-38.31-.922-1.215-2.417-2.801-3.676-2.828-10.59-.227-21.189-.13-32.57-.13l46.03 61.654-45.559 48.746c6.105 1.666 10.239.234 14.02-4.325 5.733-6.914 12.16-13.254 18.31-19.82 5.78-6.172 11.582-12.322 17.564-18.682 1.1 1.352 1.954 2.327 2.728 3.362 8.87 11.873 17.873 23.652 26.498 35.7 2.437 3.404 4.996 4.665 9.08 4.43 5.98-.346 11.994-.09 18.965-.09z"/>
        <path fill="#FFFFFF" d="M163.906 165.509c-6.486 0-12.5-.257-18.48.088-4.084.236-6.643-1.025-9.08-4.429-8.625-12.048-17.628-23.827-26.498-35.7-.774-1.035-1.627-2.01-2.728-3.362-5.982 6.36-11.785 12.51-17.564 18.681-6.15 6.567-12.577 12.907-18.31 19.82-3.781 4.56-7.915 5.992-14.02 4.326l45.56-48.746-46.031-61.653c11.381 0 21.98-.098 32.57.129 1.259.027 2.754 1.613 3.676 2.828 9.536 12.587 18.978 25.246 28.765 38.31 4.913-5.2 9.577-10.11 14.209-15.05 6.608-7.05 13.523-13.85 19.666-21.286 3.823-4.627 7.98-5.878 14.121-4.416l-43.538 46.735 47.595 63.725h-9.913M77.028 69.445c21.138 28.212 42.259 56.437 63.46 84.6 1.2 1.594 2.957 3.624 4.648 3.826 4.494.536 9.094.182 13.641.182 0-.728.062-.92-.008-1.015-23.214-31.024-46.425-62.05-69.715-93.016-.763-1.014-2.31-1.942-3.54-2.01-4.4-.24-8.82-.094-14.035-.094 2.036 2.772 3.574 4.865 5.55 7.527z"/>
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
  );
};

export default Footer;

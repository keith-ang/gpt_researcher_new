import React from 'react';
import Image from "next/image";
import Link from "next/link";
import Modal from './Settings/Modal';
import { ChatBoxSettings } from '@/types/data';

interface FooterProps {
  chatBoxSettings: ChatBoxSettings;
  setChatBoxSettings: React.Dispatch<React.SetStateAction<ChatBoxSettings>>;
}

const Footer: React.FC<FooterProps> = ({ chatBoxSettings, setChatBoxSettings }) => {
  // Add domain filtering from URL parameters
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const urlDomains = urlParams.get("domains");
    if (urlDomains) {
      // Split domains by comma if multiple domains are provided
      const domainArray = urlDomains.split(',').map(domain => ({
        value: domain.trim()
      }));
      localStorage.setItem('domainFilters', JSON.stringify(domainArray));
    }
  }

  return (
    <>
      <div className="container flex flex-col sm:flex-row min-h-[60px] sm:min-h-[72px] mt-2 items-center justify-center sm:justify-between border-t border-gray-700/30 px-4 pb-3 pt-4 sm:py-5 lg:px-0 bg-transparent backdrop-blur-sm gap-3 sm:gap-0">
        <Modal setChatBoxSettings={setChatBoxSettings} chatBoxSettings={chatBoxSettings} />
        <div className="text-sm text-gray-100">
            © {new Date().getFullYear()} Quest Language. All rights reserved.
        </div>
        <div className="flex items-center gap-3">
          <Link href={"https://www.facebook.com/questlanguage/"} target="_blank">
            <Image
              src={"/img/facebook.svg"}
              alt="facebook"
              width={30}
              height={30}
              style={{ filter: 'brightness(0) invert(1)' }}
            />{" "}
          </Link>
          <Link href={"https://www.instagram.com/questlanguage/?hl=en"} target="_blank">
              <Image
                src={"/img/instagram.svg"}
                alt="instagram"
                width={30}
                height={30}
                style={{ filter: 'brightness(0) invert(1)' }}
              />{" "}
          </Link>
          <Link href={"https://www.linkedin.com/company/questlanguage/"} target="_blank">
              <Image
                src={"/img/linkedin.svg"}
                alt="linkedin"
                width={30}
                height={30}
                style={{ filter: 'brightness(0) invert(1)' }}
              />{" "}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-12 px-4 sm:px-[5%] text-center border-t border-white/10 bg-black/30">
      <div className="max-w-4xl mx-auto">
        <p className="text-white/60 mb-6">
          <strong className="font-semibold text-white/80">EchoMasters</strong> - Where Excellence Meets Innovation
        </p>

        <div className="flex justify-center items-center gap-6 mb-8">
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter" className="text-white/60 hover:text-[#d4af37] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="Connect with us on LinkedIn" className="text-white/60 hover:text-[#d4af37] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
            </svg>
          </a>
          <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to our YouTube channel" className="text-white/60 hover:text-[#d4af37] transition-colors">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
            </svg>
          </a>
        </div>

        <div className="flex justify-center items-center gap-4 sm:gap-8 text-sm text-white/50">
          <a href="javascript:void(0);" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="javascript:void(0);" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="javascript:void(0);" className="hover:text-white transition-colors">Contact Us</a>
        </div>

        <p className="text-sm text-white/50 mt-8">
          © 2025 EchoMasters Academy. Premium Ultrasound Education Platform.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
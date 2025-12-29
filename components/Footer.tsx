
import React from 'react';

interface FooterProps {
    onHomeClick: () => void;
    onDirectoryClick: () => void; 
    onAboutClick: () => void;
    onContactClick: () => void;
    onLegalClick: (section: 'privacy' | 'terms' | 'disclaimer') => void;
}

const Footer: React.FC<FooterProps> = ({ onHomeClick, onDirectoryClick, onAboutClick, onContactClick, onLegalClick }) => {
    // Social links as seen in the reference image
    const socialLinks = [
        { name: 'LinkedIn', href: 'https://www.linkedin.com/company/independent-directors-hubs/', icon: <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path><path d="M2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></> },
        { name: 'Instagram', href: 'https://www.instagram.com/independentdirector/?igsh=dzNqZnF4bWVnZHln#', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664 4.771 4.919 4.919C8.356 2.175 8.744 2.163 12 2.163m0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947C21.728 2.69 19.306.273 14.947.072 13.667.014 13.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"></path> },
        { name: 'Facebook', href: 'https://www.facebook.com/share/1DfSHkfmuH/', icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"></path> },
    ];
    
     const quickLinks = [
        { name: 'Home', action: onHomeClick },
        { name: 'Directory', action: onDirectoryClick },
        { name: 'About', action: onAboutClick },
        { name: 'Contact', action: onContactClick },
    ];

    const legalLinks = [
        { name: 'Privacy Policy', section: 'privacy' as const },
        { name: 'Terms & Conditions', section: 'terms' as const },
        { name: 'Disclaimer', section: 'disclaimer' as const },
    ];


    return (
        <footer className="bg-[#0A192F] text-gray-200 dark:bg-gray-900/50 dark:glass-card relative z-10 mt-auto">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Column 1: Brand Info */}
                    <div className="space-y-4">
                        <div 
                            className="cursor-pointer group"
                            onClick={onHomeClick}
                        >
                            <img 
                                src="https://i.postimg.cc/T1RnvJWX/Untitled-design-1-removebg-preview.png" 
                                alt="Independent Director" 
                                className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
                            />
                        </div>
                        <p className="text-sm">Discover. Connect. Grow with Verified Independent Directors.</p>
                         <img src="https://i.postimg.cc/TYLM4HBX/Whats-App-Image-2025-10-15-at-10-26-35-AM-1.jpg" alt="Aviyana RPG Group Logo" className="h-14"/>
                        <p className="text-sm">Established in 2013, the Aviyana RPG Group continues to strive for excellence and service orientation, fostering trust and innovation across every vertical it serves.</p>
                        <div className="flex space-x-4">
                            {socialLinks.map(link => (
                                <a key={link.name} href={link.href} className="text-gray-300 hover:text-white transition-colors" aria-label={link.name}>
                                    <svg fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
                                        {link.icon}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map(link => (
                                <li key={link.name}>
                                     <button onClick={link.action} className="text-gray-300 hover:text-white transition-colors">{link.name}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                     {/* Column 3: Legal Links */}
                     <div>
                        <h3 className="font-bold text-white text-lg mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {legalLinks.map(link => (
                                <li key={link.name}>
                                     <button onClick={() => onLegalClick(link.section)} className="text-gray-300 hover:text-white transition-colors text-left">{link.name}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Us */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-white text-lg mb-4">Contact Us</h3>
                        <div className="text-sm">
                            <p className="font-semibold">Head Office – West</p>
                            <p className="text-gray-300">Aviyana House, 609-Parth Solitaire, Plot No. 2, Sector-9E, Kalamboli, Navi Mumbai – 410218</p>
                        </div>
                         <div className="text-sm">
                            <p className="font-semibold">Regional Office – North</p>
                            <p className="text-gray-300">Aviyana House, 303-A, Mansingh Palace, Ambedkar Road, Ghaziabad – NCR 201001</p>
                        </div>
                         <div className="text-sm">
                            <p className="font-semibold">Regional Office – South</p>
                            <p className="text-gray-300">Aviyana House, ARS Arcade – 707, Akashvani Road, Yelahanka, Bengaluru – 560064</p>
                        </div>
                        <div className="text-sm">
                           <p>Phone: <a href="tel:+918779101817" className="text-gray-300 hover:text-white transition-colors">+91 87791 01817</a></p>
                           <p>Email: <a href="mailto:connect@aviyanaventures.com" className="text-gray-300 hover:text-white transition-colors">connect@aviyanaventures.com</a></p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p className="text-gray-300 text-center md:text-left mb-4 md:mb-0">
                        © {new Date().getFullYear()} Independent Director, a division of Aviyana Ventures Pvt. Ltd. All Rights Reserved.
                    </p>
                    <p className="text-gray-300">
                        Developed by <a href="https://aviyanamedia.com/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Aviyana media</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

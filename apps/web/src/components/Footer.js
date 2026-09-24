import Link from "next/link";
import { Brain, Twitter, Instagram, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-emerald-700 text-emerald-50 py-10 border-t border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-emerald-200" />
              <div className="flex flex-col">
                <div className="font-black text-3xl tracking-tighter drop-shadow-md leading-none flex bg-black px-3 py-1.5 rounded-xl w-fit">
                  <span className="text-red-400">V</span>
                  <span className="text-orange-400">I</span>
                  <span className="text-yellow-400">E</span>
                  <span className="text-emerald-400">B</span>
                  <span className="text-blue-400">R</span>
                  <span className="text-indigo-400">A</span>
                  <span className="text-violet-400">I</span>
                  <span className="text-pink-400">N</span>
                </div>
                <span className="text-[0.70rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase tracking-[0.2em] mt-1 ml-0.5">
                  Elevate Your Mind
                </span>
              </div>
            </div>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Empowering minds across all ages through scientifically-designed, engaging cognitive training exercises. Unlock your true potential today.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-white hover:text-emerald-700 transition-all duration-300 group">
                <Twitter className="w-5 h-5 text-emerald-200 group-hover:text-emerald-700 transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-white hover:text-emerald-700 transition-all duration-300 group">
                <Instagram className="w-5 h-5 text-emerald-200 group-hover:text-emerald-700 transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-white hover:text-emerald-700 transition-all duration-300 group">
                <Linkedin className="w-5 h-5 text-emerald-200 group-hover:text-emerald-700 transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-white hover:text-emerald-700 transition-all duration-300 group">
                <Github className="w-5 h-5 text-emerald-200 group-hover:text-emerald-700 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-emerald-200 hover:text-white transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 -ml-3 transition-all"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-emerald-200 hover:text-white transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 -ml-3 transition-all"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-emerald-200 hover:text-white transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 -ml-3 transition-all"></span>
                  Training Games
                </Link>
              </li>
              <li>
                <Link href="/mega-milestone" className="text-emerald-200 hover:text-white transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 -ml-3 transition-all"></span>
                  Mega Milestone
                </Link>
              </li>
              <li>
                <Link href="/media-center" className="text-emerald-200 hover:text-white transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 -ml-3 transition-all"></span>
                  Media Center
                </Link>
              </li>
              <li>
                <Link href="/founder" className="text-emerald-200 hover:text-white transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 -ml-3 transition-all"></span>
                  Our Founder
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-emerald-200 hover:text-white transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 -ml-3 transition-all"></span>
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-emerald-200 hover:text-white transition-colors">Help Center</Link>
              </li>
              <li>
                <Link href="/faq" className="text-emerald-200 hover:text-white transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="#" className="text-emerald-200 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="text-emerald-200 hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-emerald-200">
                <MapPin className="w-5 h-5 text-emerald-100 shrink-0 mt-0.5" />
                <span>11A, 2ND FLOOR, STATION SQUARE, MASTER CANTEEN,<br/>BHUBANESWAR-751001. ODISHA.</span>
              </li>
              <li className="flex items-center gap-3 text-emerald-200">
                <Phone className="w-5 h-5 text-emerald-100 shrink-0" />
                <span>+91- 9583075319</span>
              </li>
              <li className="flex items-center gap-3 text-emerald-200">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-100 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span>+91- 9583075319</span>
              </li>
              <li className="flex items-center gap-3 text-emerald-200">
                <Mail className="w-5 h-5 text-emerald-100 shrink-0" />
                <span>support@viebrain.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-emerald-200 text-sm text-center md:text-left">
            &copy; {currentYear} VieBrain Institute. All rights reserved.
            <span className="hidden md:inline"> | </span>
            <br className="block md:hidden" />
            <a href="https://adnibog.com" target="_blank" rel="noopener noreferrer" className="text-emerald-100 font-medium hover:text-white hover:underline transition-colors">Powered by Adnibog Systems</a>
          </p>
          <div className="flex items-center gap-6 text-sm text-emerald-200">
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>

      {/* Global styles for bullet hover effect */}
      <style dangerouslySetInnerHTML={{__html: `
        ul li:hover span { opacity: 1; margin-left: 0; }
      `}} />
    </footer>
  );
}

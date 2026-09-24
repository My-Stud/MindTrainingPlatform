"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Brain, LayoutDashboard, Gamepad2, UserCircle, Info, Home, BookOpen, Mail, PlayCircle, Zap, Star, Users, MessageCircle, Briefcase, Rocket, HelpCircle, Activity, Settings, Trophy, LogIn, UserPlus, LogOut, MapPin, Phone, Database } from "lucide-react";
import { getApiBaseValue } from "@/api/questions";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Fix hydration mismatch by only rendering user-specific links after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isAuthenticated = mounted && session;

  const topNavItems = [
    { name: "Home", href: "/", icon: Home, dropdown: [
      { name: "Overview", href: "/#overview", icon: LayoutDashboard },
      { name: "Features", href: "/#features", icon: Zap },
      { name: "Testimonials", href: "/#testimonials", icon: Star },
    ] },
    { name: "About Us", href: "/about", icon: Info, dropdown: [
      { name: "Our Story", href: "/about#story", icon: BookOpen },
      { name: "Dr. Atal Bihari Mallick's Profile", href: "/founder", icon: UserCircle },
      { name: "Media Coverage", href: "/media-coverage", icon: PlayCircle },
      { name: "Mega Milestone", href: "/mega-milestone", icon: Trophy },
    ] },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Account", href: isAuthenticated ? "/dashboard" : "/sign-in", icon: UserCircle, dropdown: isAuthenticated ? [
      { name: "Dashboard", description: "Track your progress", href: "/dashboard", icon: Activity },
      { name: "Settings", description: "Manage your preferences", href: "/profile", icon: Settings },
      { name: "Sign Out", description: "Log out of your account", href: "#", onClick: () => signOut({ callbackUrl: '/' }), icon: LogOut },
    ] : [
      { name: "Sign In", description: "Access your account", href: "/sign-in", icon: LogIn },
    ] },
    { name: "Contact Us", href: "/contact", icon: Mail, dropdown: [
      { name: "Careers", description: "Join our growing team", href: "/careers", icon: Rocket },
      { name: "FAQ", description: "Answers to common questions", href: "/faq", icon: HelpCircle },
    ] },
  ];

  const [mindGymModules, setMindGymModules] = useState([
    {
      title: "Module 1",
      items: [
        { name: "Loading Games...", href: "#" }
      ]
    }
  ]);

  useEffect(() => {
    const apiBase = getApiBaseValue();
    fetch(`${apiBase}/api/public/projects`)
      .then(res => res.json())
      .then(data => {
        if (data && data.projects) {
          const items = data.projects.map(p => ({
            name: p.name,
            href: "/games/" + p.slug
          }));
          const chunkSize = 7;
          const newModules = [];
          for (let i = 0; i < items.length; i += chunkSize) {
            newModules.push({
              title: "Module " + (Math.floor(i / chunkSize) + 1),
              items: items.slice(i, i + chunkSize)
            });
          }
          if (newModules.length > 0) {
            setMindGymModules(newModules);
          }
        }
      })
      .catch(err => {
        console.warn('Failed to load mind gym modules:', err.message);
        setMindGymModules([{
          title: "Status",
          items: [{ name: "Games Unavailable (API Down)", href: "#" }]
        }]);
      });
  }, []);

  const bottomNavItems = [
    { name: "Courses", href: "/courses", icon: BookOpen, dropdown: [
      { name: "Fundamental Programs", href: "/courses" },
      { name: "Advance Programs", href: "/courses/advance-programs" },
      { name: "Free Programs", href: "/courses/free-programs" },
    ] },
    { name: "Mind Gym", href: "/games", icon: Gamepad2, modules: mindGymModules },
    { name: "Media Center", href: "/media-center", icon: PlayCircle, dropdown: [
      { name: "Videos", href: "/media-center/videos" },
      { name: "Podcasts", href: "/media-center/podcasts" },
      { name: "Gallery", href: "/media-center/gallery" },
    ] },
  ];

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 group">
      {/* Background for top bar */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-emerald-700 border-b border-emerald-800 shadow-sm pointer-events-none z-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-30">
        {/* Top Navbar */}
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group/logo w-auto sm:w-64">
            <Brain className="h-10 w-10 md:h-12 md:w-12 text-white group-hover/logo:scale-110 transition-transform" />
            <div className="hidden sm:flex flex-col">
              <div className="font-black text-3xl md:text-4xl tracking-tighter drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] leading-none flex bg-white px-3 py-1.5 rounded-xl w-fit group-hover/logo:bg-gray-100 transition-colors">
                <span className="text-red-500">V</span>
                <span className="text-orange-500">I</span>
                <span className="text-yellow-500">E</span>
                <span className="text-emerald-500">B</span>
                <span className="text-blue-500">R</span>
                <span className="text-indigo-500">A</span>
                <span className="text-violet-500">I</span>
                <span className="text-pink-500">N</span>
              </div>
              <span className="text-[0.75rem] font-black text-emerald-100 uppercase tracking-[0.2em] mt-1 ml-1 drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]">
                Elevate Your Mind
              </span>
            </div>
          </Link>

          {/* Centered Top Nav (after Logo) */}
          <div className="flex-1 flex justify-center pointer-events-none overflow-hidden">
            <div className="flex items-center justify-center w-full sm:w-auto gap-1 sm:gap-6 pointer-events-auto px-1">
              {topNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href !== "/" && (pathname === item.href || pathname?.startsWith(item.href + "/"));

                return (
                  <div key={item.name} className="relative group/navitem">
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-1 lg:gap-2 px-1 sm:px-3 lg:px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                        ${isActive
                          ? "text-emerald-700 bg-white"
                          : "text-emerald-50 hover:text-white hover:bg-emerald-600"}
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="hidden sm:inline">{item.name}</span>
                    </Link>

                    {/* Dropdown Menu */}
                    {item.dropdown && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-72 opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible transition-all duration-300 z-50">
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-emerald-100 p-3 transform translate-y-2 group-hover/navitem:translate-y-0 transition-all duration-300">
                          {item.dropdown.map((subItem, idx) => {
                            const SubIcon = subItem.icon;
                            return (
                              <Link
                                key={idx}
                                href={subItem.href}
                                onClick={(e) => {
                                  if (subItem.onClick) {
                                    e.preventDefault();
                                    subItem.onClick();
                                    return;
                                  }
                                  if (subItem.href.startsWith('/#') && pathname === '/') {
                                    e.preventDefault();
                                    const targetId = subItem.href.replace('/#', '');
                                    const element = document.getElementById(targetId);
                                    if (element) {
                                      element.scrollIntoView({ behavior: 'smooth' });
                                      window.history.pushState(null, '', subItem.href);
                                    }
                                  }
                                }}
                                className="flex items-start gap-3 p-3 text-sm font-bold text-emerald-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors group/subitem"
                              >
                                {SubIcon && (
                                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 group-hover/subitem:bg-white group-hover/subitem:text-orange-500 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                                    <SubIcon className="w-4 h-4" />
                                  </div>
                                )}
                                <div className="flex flex-col text-left justify-center">
                                  <span>{subItem.name}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Navbar (Always visible on mobile, shown on hover on desktop) */}
          <div className={`fixed md:absolute left-0 right-0 bottom-6 md:top-20 md:bottom-auto pt-2 flex items-center justify-center transition-all duration-300 transform z-10 pointer-events-auto ${pathname?.match(/^\/games\/[^\/]+$/) ? "hidden" : "translate-y-0 opacity-100 visible md:-translate-y-4 md:opacity-0 md:invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible md:pointer-events-none group-hover:pointer-events-auto"}`}>
            <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-orange-500 to-amber-500 p-1.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-orange-400/60 backdrop-blur-sm pointer-events-auto">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href !== "/" && (pathname === item.href || pathname?.startsWith(item.href + "/"));

              return (
                <div key={item.name} className="relative group/navitem">
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-1.5 lg:gap-2 px-3 lg:px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                      ${isActive
                        ? "bg-white text-orange-600 shadow-sm ring-1 ring-orange-200"
                        : "text-orange-50 hover:text-white hover:bg-white/20"}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>

                  {/* Dropdown Menu with Modules (Mind Gym) */}
                  {item.modules && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[95vw] max-w-[1200px] opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible transition-all duration-300 z-50">
                      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-emerald-100 p-3 sm:p-4 transform translate-y-2 group-hover/navitem:translate-y-0 transition-all duration-300 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {item.modules.map((module, mIdx) => (
                          <div key={mIdx} className="flex flex-col gap-2 bg-emerald-50/30 p-2 rounded-2xl border border-emerald-100/70 shadow-xs">
                            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-black text-xs sm:text-sm py-1.5 px-3 rounded-xl text-center shadow-sm tracking-wider uppercase">
                              {module.title}
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {module.items.map((subItem, idx) => (
                                <Link
                                  key={idx}
                                  href={subItem.href}
                                  className="block px-2 py-1.5 text-xs sm:text-sm font-bold text-orange-600 hover:text-emerald-600 hover:bg-emerald-50 bg-white rounded-xl transition-all text-center border border-orange-100/80 hover:border-emerald-200 shadow-sm"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Standard Dropdown Menu */}
                  {item.dropdown && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-48 opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible transition-all duration-300 z-50">
                      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-orange-100 p-2 transform translate-y-2 group-hover/navitem:translate-y-0 transition-all duration-300">
                        {item.dropdown.map((subItem, idx) => (
                          <Link
                            key={idx}
                            href={subItem.href}
                            className="block px-4 py-2.5 text-xs sm:text-sm font-bold text-orange-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}




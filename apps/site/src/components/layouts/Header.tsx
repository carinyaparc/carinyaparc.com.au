'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NavItem } from '@/src/app/navigation';
import SubscribeModal from '@/src/components/forms/SubscribeModal';
import { cn } from '@/src/lib/cn';

interface HeaderProps {
  navigation: NavItem[];
}

export default function Header({ navigation }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === '/';

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Detect scroll position to change header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Initialize scroll state - if not homepage, consider "scrolled"
    setIsScrolled(!isHomePage);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  // Apply styles based on scroll position or page
  const headerClass =
    isScrolled || !isHomePage
      ? 'fixed top-4 left-0 right-0 bg-white/80 text-charcoal-300 backdrop-blur-sm shadow-md'
      : 'absolute top-4 left-0 right-0 bg-transparent text-white';

  const hoverClass = 'hover:bg-eucalyptus-100 rounded-lg';

  return (
    <>
      <header className={cn('z-40 transition-all duration-300', headerClass)}>
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Link href="/" className="hover:opacity-80 transition-opacity duration-300">
                <span className="text-2xl font-bold text-eucalyptus-600 transition-colors duration-300">
                  Carinya Parc
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex flex-1 justify-evenly max-w-3xl mx-auto">
            {navigation
              .filter((item) => item.visible !== false)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'transition-colors duration-300 flex flex-col items-start text-left px-2 py-1',
                    hoverClass,
                    { 'text-eucalyptus-100': pathname === item.href },
                  )}
                >
                  {item.label ? (
                    item.label
                  ) : (
                    <>
                      <span className="text-base font-bold text-eucalyptus-400">{item.verb}</span>
                      <span className="text-xs font-normal mt-1 whitespace-nowrap">
                        {item.rest}
                      </span>
                    </>
                  )}
                </Link>
              ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={() => setSubscribeModalOpen(true)}
              className={`rounded-md bg-eucalyptus-600 text-white hover:bg-eucalyptus-200 hover:text-eucalyptus-600 px-3 py-2 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus-600 transition-colors duration-300`}
            >
              Follow our Journey
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.nav
                id="mobile-menu"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-charcoal-900 shadow-lg p-6 sm:max-w-sm sm:ring-1 sm:ring-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <Link href="/" className="hover:opacity-80 transition-opacity duration-300">
                      <span className="text-xl font-bold text-white">Carinya Parc</span>
                    </Link>
                  </div>
                  <button
                    className="-m-2.5 rounded-md p-2.5 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-charcoal-100/25">
                    <div className="space-y-2 py-6">
                      {navigation
                        .filter((item) => item.visible !== false)
                        .map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-gray-800"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.label ? (
                              item.label
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-base font-bold text-eucalyptus-400">
                                  {item.verb}
                                </span>
                                <span className="text-sm font-normal">{item.rest}</span>
                              </div>
                            )}
                          </Link>
                        ))}
                    </div>
                    <div className="py-6">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSubscribeModalOpen(true);
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800 w-full text-left"
                      >
                        Follow our Journey
                      </button>
                    </div>
                  </div>
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SubscribeModal open={subscribeModalOpen} onOpenChange={setSubscribeModalOpen} />
    </>
  );
}

import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { StoreProvider } from './context/StoreContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { CountdownBanner, ScrollProgress } from './components/ui.jsx';

import Home from './pages/Home.jsx';
import { ShopAll, DropPage, StylingPage, CollectionPage } from './pages/Shop.jsx';
import ProductPage from './pages/Product.jsx';
import Uniform from './pages/Uniform.jsx';
import Account from './pages/Account.jsx';
import {
  About, Construction, FitGuide, Contact, FAQ, Shipping, Returns,
  Privacy, Terms, Creators, Journal, JournalPost,
} from './pages/Info.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

/** Wraps the routed page in a keyed element so each navigation replays page-enter motion. */
function RoutedMain({ children }) {
  const { pathname } = useLocation();
  return (
    <div id="main" className="flex-1">
      <div key={pathname} className="page-enter">{children}</div>
    </div>
  );
}

function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest2 text-ink/50">404</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase">Wrong tide.</h1>
      <p className="mt-3 font-mono text-sm text-ink/60">That page doesn't exist. Try the shop instead.</p>
      <a href="#/shop" className="mt-6 inline-block bg-ink px-6 py-3 font-display text-xs font-bold uppercase tracking-widest2 text-bone hover:bg-cobalt">
        Shop all
      </a>
    </main>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <ScrollProgress />
        <div className="flex min-h-screen flex-col bg-bone text-ink">
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:bg-cobalt focus:px-4 focus:py-2 focus:text-bone">
            Skip to content
          </a>
          <CountdownBanner />
          <Header />
          <RoutedMain>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopAll />} />
              <Route path="/drop/first-light" element={<DropPage />} />
              <Route path="/uniform" element={<Uniform />} />
              <Route path="/mens" element={<StylingPage variant="mens" />} />
              <Route path="/womens" element={<StylingPage variant="womens" />} />
              <Route path="/collections/:handle" element={<CollectionPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/construction" element={<Construction />} />
              <Route path="/fit-guide" element={<FitGuide />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:postId" element={<JournalPost />} />
              <Route path="/creators" element={<Creators />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RoutedMain>
          <Footer />
          <CartDrawer />
        </div>
      </HashRouter>
    </StoreProvider>
  );
}

import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "@/components/site/ScrollToTop";
import SiteLayout from "@/components/site/SiteLayout";
import Home from "@/pages/Home";
import HowItWorks from "@/pages/HowItWorks";
import ForParents from "@/pages/ForParents";
import ForYoungPeople from "@/pages/ForYoungPeople";
import OurMethod from "@/pages/OurMethod";
import Coaches from "@/pages/Coaches";
import CoachDetail from "@/pages/CoachDetail";
import Pricing from "@/pages/Pricing";
import Faq from "@/pages/Faq";
import Blog from "@/pages/Blog";
import BookACall from "@/pages/BookACall";
import Safeguarding from "@/pages/Safeguarding";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cookies from "@/pages/Cookies";
import NotFound from "@/pages/NotFound";

// The admin area is its own chunk: public visitors never download it.
const AdminApp = React.lazy(() => import("@/admin/AdminApp"));

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <React.Suspense fallback={null}>
              <AdminApp />
            </React.Suspense>
          }
        />
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/for-parents" element={<ForParents />} />
          <Route path="/for-young-people" element={<ForYoungPeople />} />
          <Route path="/our-method" element={<OurMethod />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/coaches/:slug" element={<CoachDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/blog" element={<Blog />} />
          {/* Posts now live on the external blog; old /blog/... links land on the list. */}
          <Route path="/blog/:slug" element={<Navigate to="/blog" replace />} />
          <Route path="/book-a-call" element={<BookACall />} />
          <Route path="/safeguarding" element={<Safeguarding />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

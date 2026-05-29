import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";

const faqs = [
  {
    category: "General",
    items: [
      {
        q: "What is Sudan Export Platform?",
        a: "Sudan Export Platform is a B2B marketplace that connects verified Sudanese agricultural exporters and suppliers with international buyers. We facilitate transparent RFQ (Request for Quotation) workflows, secure communication, and document management for commodity trade.",
      },
      {
        q: "What commodities are available on the platform?",
        a: "We currently support five core Sudanese agricultural commodities: Sesame Seeds, Gum Arabic, Groundnuts (Peanuts), Hibiscus (Karkadeh), and Cotton. We are continuously expanding our product range.",
      },
      {
        q: "Is the platform free to use?",
        a: "Registration and browsing are free. Trading fees and subscription details are available upon registration. Contact us for enterprise pricing.",
      },
    ],
  },
  {
    category: "For Buyers",
    items: [
      {
        q: "How do I post a Request for Quotation (RFQ)?",
        a: "After registering as a buyer and completing your company profile, navigate to the Buyer Portal and click 'New RFQ'. Fill in the product details, required quantity, delivery terms, and submission deadline. Your RFQ will be visible to verified suppliers who can then submit competitive quotations.",
      },
      {
        q: "How do I compare and award quotations?",
        a: "Once suppliers submit quotations, you can view all responses in your RFQ detail page. The platform provides a side-by-side comparison view. When satisfied, click 'Award' on the preferred quotation. The winning supplier is notified automatically.",
      },
      {
        q: "Are suppliers on the platform verified?",
        a: "Yes. All suppliers must submit company registration documents and go through an admin verification process before they can submit quotations. Only verified suppliers are marked with a verified badge.",
      },
      {
        q: "Can I communicate directly with suppliers?",
        a: "Yes. Once you post an RFQ or receive quotations, you can message suppliers directly through the built-in messaging system in your buyer portal.",
      },
    ],
  },
  {
    category: "For Suppliers",
    items: [
      {
        q: "How do I register as a supplier?",
        a: "Click 'Become a Supplier' or 'Get Started', complete the registration form, then upload your company registration documents and commodity export certificates. Our admin team will review and verify your profile, typically within 2 business days.",
      },
      {
        q: "How do I find and bid on RFQs?",
        a: "After verification, log in to your supplier portal and browse open RFQs from international buyers. Filter by commodity type, quantity, or deadline. Click any RFQ to view full details and submit a competitive quotation.",
      },
      {
        q: "What documents do I need to register?",
        a: "You'll need: company registration certificate, tax ID, export licence (where applicable), and commodity-specific certificates (e.g. phytosanitary certificates for agricultural goods). Detailed requirements are listed during registration.",
      },
    ],
  },
  {
    category: "Platform & Security",
    items: [
      {
        q: "How does the platform protect my data?",
        a: "We use industry-standard encryption for all data in transit and at rest. Authentication is handled by Clerk, a leading identity platform. We never store payment card information and all API communications are secured with HTTPS.",
      },
      {
        q: "What currencies does the platform support?",
        a: "Quotations can be submitted in USD, EUR, GBP, and SAR. The system displays amounts in the currency chosen by the supplier. Currency conversion is not performed on-platform.",
      },
      {
        q: "How do I contact support?",
        a: "You can reach our support team through the Contact page, or email support@sudanexport.com. We aim to respond within one business day.",
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full text-left flex items-center justify-between py-5 gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-gray-900 text-sm sm:text-base">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-primary shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-5 text-sm text-gray-600 leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <PublicLayout>
      <section className="pt-16 pb-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              FAQ
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">
              Everything you need to know about trading on Sudan Export Platform.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-10">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-lg font-bold text-primary mb-4 pb-2 border-b-2 border-primary/20">
                  {section.category}
                </h2>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100 px-6">
                  {section.items.map((item) => (
                    <AccordionItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Still have questions?</h2>
          <p className="text-green-200 mb-6">Our team is happy to help.</p>
          <Button asChild variant="outline" className="bg-white text-primary hover:bg-white/90 border-white">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}

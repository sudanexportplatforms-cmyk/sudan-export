import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@sudanexport.com",
    detail: "We reply within 1 business day",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+249 (0) 18 000 0000",
    detail: "Sun–Thu, 8:00 – 17:00 (EAT)",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Khartoum, Sudan",
    detail: "Export Trade Tower, Block 7",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Sun – Thu, 8:00 – 17:00",
    detail: "Eastern Africa Time (UTC+3)",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <section className="pt-16 pb-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Contact Us
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600">
              Have questions about trading on Sudan Export Platform? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              {submitted ? (
                <Card className="border-none shadow-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                    <p className="text-gray-600">
                      Thank you for reaching out. Our team will get back to you within one business day.
                    </p>
                    <Button
                      className="mt-6 bg-primary hover:bg-primary/90"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", subject: "", message: "" });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="John Smith"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@company.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="How can we help?"
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your enquiry..."
                          rows={6}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div key={info.label} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                        {info.label}
                      </p>
                      <p className="font-medium text-gray-900 text-sm">{info.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{info.detail}</p>
                    </div>
                  </div>
                );
              })}

              <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                <h3 className="font-semibold text-gray-900 mb-2">Trade Enquiries</h3>
                <p className="text-sm text-gray-600">
                  For bulk trade, partnership, or investment enquiries, please email{" "}
                  <a href="mailto:trade@sudanexport.com" className="text-primary font-medium">
                    trade@sudanexport.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: Mail, label: t("contact.info.emailLabel"), value: t("contact.info.emailVal"), detail: t("contact.info.emailSub") },
    { icon: Phone, label: t("contact.info.phoneLabel"), value: t("contact.info.phoneVal"), detail: t("contact.info.phoneSub") },
    { icon: MapPin, label: t("contact.info.addressLabel"), value: t("contact.info.addressVal"), detail: t("contact.info.addressSub") },
    { icon: Clock, label: t("contact.info.hoursLabel"), value: t("contact.info.hoursVal"), detail: t("contact.info.hoursSub") },
  ];

  return (
    <PublicLayout>
      <section className="pt-16 pb-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              {t("contact.badge")}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("contact.title")}</h1>
            <p className="text-lg text-gray-600">{t("contact.subtitle")}</p>
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("contact.form.success")}</h2>
                    <Button
                      className="mt-6 bg-primary hover:bg-primary/90"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", subject: "", message: "" });
                      }}
                    >
                      {t("contact.form.submit")}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{t("contact.form.title")}</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="name">{t("contact.form.name")}</Label>
                          <Input
                            id="name"
                            placeholder={t("contact.form.namePh")}
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email">{t("contact.form.email")}</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t("contact.form.emailPh")}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="subject">{t("contact.form.subject")}</Label>
                        <Input
                          id="subject"
                          placeholder={t("contact.form.subjectPh")}
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="message">{t("contact.form.message")}</Label>
                        <Textarea
                          id="message"
                          placeholder={t("contact.form.messagePh")}
                          rows={6}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11">
                        <Send className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                        {t("contact.form.submit")}
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

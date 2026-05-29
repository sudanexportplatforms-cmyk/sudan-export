import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "ghost" | "outline";
}

export function LanguageSwitcher({ className = "", variant = "ghost" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");

  const toggle = () => {
    i18n.changeLanguage(isAr ? "en" : "ar");
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={toggle}
      className={`font-semibold text-sm min-w-[52px] ${className}`}
      aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
    >
      {isAr ? "EN" : "عربي"}
    </Button>
  );
}

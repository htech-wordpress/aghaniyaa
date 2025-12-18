import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEFAULT_MESSAGE = "Hi, I'm interested in your loan services. Can you help me?";

export function WhatsAppButton() {
  const phoneNumber = "919029059005"; // Replace with your WhatsApp business number
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
      aria-label="Contact us on WhatsApp"
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </a>
  );
}



import { ContactForm } from '@/components/forms/ContactForm';
import { submitContactForm } from '@/lib/server/services/contactService';

const ContactPage = () => {
  return (
    <ContactForm submitFn={submitContactForm} callbackUrl="/contact/success" />
  );
};

export default ContactPage;

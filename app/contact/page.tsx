import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="border-b border-gray-200 pb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Contact us</h1>
        <p className="mt-3 text-gray-600">
          Questions about classes, memberships, or anything else? We&apos;d
          love to hear from you.
        </p>
      </header>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">Studio info</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>123 Placeholder Street, Calgary, AB</p>
            <p>(403) 555-0100</p>
            <p>hello@stillwateryoga.com</p>
            <p>
              Mon–Fri: 6am–8pm
              <br />
              Sat–Sun: 8am–4pm
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
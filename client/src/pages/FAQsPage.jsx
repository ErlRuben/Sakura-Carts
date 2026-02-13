import { useState } from 'react';

const faqs = [
  {
    question: 'Where do you source your products?',
    answer:
      'All of our products are sourced directly from Japan. We work with trusted suppliers and local shops across Tokyo, Osaka, Kyoto, and other regions to bring you authentic Japanese goods.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Standard shipping takes 7–14 business days depending on your location. Express shipping (3–5 business days) is available at checkout for an additional fee.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes! We ship to most countries worldwide. Shipping rates and estimated delivery times vary by destination and are calculated at checkout.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and GCash. All payments are processed securely.',
  },
  {
    question: 'Can I request a specific item from Japan?',
    answer:
      'Absolutely! Visit our Request page to submit a product request. We\'ll do our best to source it for you and get back to you within 2–3 business days.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 14-day return policy for unopened and undamaged items. Food and beverage items cannot be returned for safety reasons. Please contact us to initiate a return.',
  },
  {
    question: 'Are the food products safe and within expiration?',
    answer:
      'Yes, all food and beverage products are checked for quality and have at least 3 months before expiration at the time of shipping.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Once your order ships, you\'ll receive a tracking number via email. You can use this to track your package on the carrier\'s website.',
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-sakura-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-sakura-50/50 transition-colors"
      >
        <span className="font-medium text-dark pr-4">{faq.question}</span>
        <svg
          className={`w-5 h-5 text-sakura-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-600 leading-relaxed">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

function FAQsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-sakura-400">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-600 mt-2">
        Find answers to common questions about our products, shipping, and
        policies.
      </p>

      <div className="mt-8 space-y-3">
        {faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} />
        ))}
      </div>

      <div className="mt-10 bg-sakura-50 rounded-2xl p-8 text-center">
        <h3 className="text-lg font-serif font-bold text-dark">
          Still have questions?
        </h3>
        <p className="text-gray-600 mt-2">
          Feel free to reach out to us — we&apos;re happy to help!
        </p>
        <a href="/contacts" className="btn-primary inline-block mt-4">
          Contact Us
        </a>
      </div>
    </div>
  );
}

export default FAQsPage;

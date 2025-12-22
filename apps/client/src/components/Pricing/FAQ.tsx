import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Can I use the Free plan forever?",
    a: `Yes! The free plan stays free forever and does not expire.
        You can upgrade anytime if you need more rooms or members.`
  },
  {
    q: "Do I need to add payment details for the Free plan?",
    a: `No, you don't need to add any payment information to get started.
        Payment details are only required when you subscribe to a paid plan.`
  },
  {
    q: "Can I change my plan later?",
    a: `Absolutely. You can upgrade or downgrade your plan at any time.
        All your rooms and data stay safe even when you switch plans.`
  },
  {
    q: "Is there a limit on how many people can join?",
    a: `Each plan has its own member limit depending on the features provided.
        The Business plan supports up to 50 members per room for team collaboration.`
  },
  {
    q: "Do you support custom room passwords?",
    a: `Yes, room passwords are available in the Basic and Business plans.
        This helps you protect private rooms and control who can join.`
  }
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h2 className="text-center text-3xl font-bold mb-10 font-bricogrotesque">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((item, index) => {
          const isOpen = open === index;

          return (
            <div
              key={index}
              className="border rounded-2xl p-5 cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold font-bricogrotesque">{item.q}</h3>
                <ChevronDown
                  className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Smooth expand animation */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed font-bricogrotesque">
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

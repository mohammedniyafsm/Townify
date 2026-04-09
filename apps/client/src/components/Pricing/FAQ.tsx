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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-24">
      <div className="max-w-4xl lg:max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-bricogrotesque mb-4 lg:mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Get answers to common questions about our pricing plans and features
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {faqs.map((item, index) => {
            const isOpen = open === index;

            return (
              <div
                key={index}
                className="border rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <div className="flex justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold font-bricogrotesque flex-1 leading-tight sm:leading-normal">
                    {item.q}
                  </h3>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 transition-transform duration-300 mt-1 sm:mt-0 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>

                {/* Smooth expand animation */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen
                    ? "max-h-96 sm:max-h-80 lg:max-h-72 opacity-100 mt-3 sm:mt-4"
                    : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="text-sm sm:text-base text-gray-600 lg:text-gray-700 whitespace-pre-line leading-relaxed sm:leading-loose font-bricogrotesque">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
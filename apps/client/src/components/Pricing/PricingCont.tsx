import { CheckCircleIcon } from "../icons/CheckCircleIcon"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { RainbowButton } from "../ui/rainbow-button"
import { BorderBeam } from "../ui/border-beam"

const pricingPlans = [
  {
    title: "Free",
    price: "$0",
    tagline: "Free for everyone",
    features: [
      "1 Room",
      "Up to 5 members",
      "Basic avatars",
      "Text chat",
      "30-minute sessions",
      "Limited screen sharing",
      "Join via invite link",
    ],
  },
  {
    title: "Basic",
    price: "$8 / user",
    tagline: "Essential features for small teams",
    features: [
      "5 Rooms",
      "Up to 20 members",
      "Custom avatars",
      "Video & voice calls",
      "Room passwords",
      "Custom backgrounds",
      "Saved room layouts",
    ],
  },
  {
    title: "Business",
    price: "$15 / user",
    tagline: "Advanced features for growing teams",
    features: [
      "Unlimited Rooms",
      "Up to 50 members",
      "Admin & Moderator roles",
      "Private rooms",
      "Full chat history",
      "Moderation tools",
      "Integrations (Slack, Notion, Discord)",
    ],
  },
];

function PricingCont() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Optional Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Flexible pricing for teams of all sizes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className="relative w-full max-w-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl md:text-3xl">{plan.title}</CardTitle>
                <CardDescription className="text-black font-semibold text-lg sm:text-xl md:text-2xl mt-2">
                  {plan.price}
                </CardDescription>
              </CardHeader>

              <hr className="mx-4 sm:mx-6" />

              <CardContent className="py-4 sm:py-6">
                <p className="font-Inter text-sm sm:text-base font-semibold text-center">
                  {plan.tagline}
                </p>
              </CardContent>

              <hr className="mx-4 sm:mx-6" />

              <CardContent className="py-4 sm:py-6 flex-grow">
                <ul className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 sm:gap-3 font-bricogrotesque text-xs sm:text-sm md:text-base"
                    >
                      <CheckCircleIcon
                        size={16}
                        className="text-green-500 flex-shrink-0 mt-0.5 sm:mt-1"
                      />
                      <span className="leading-tight sm:leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <hr className="mx-4 sm:mx-6" />

              <CardFooter className="py-6 sm:py-8">
                <RainbowButton className="w-full text-sm sm:text-base px-4 py-3 sm:py-4">
                  Get Started
                </RainbowButton>
              </CardFooter>

              {/* Border effects - responsive size */}
              <BorderBeam
                duration={6}
                size={300}
                className="from-transparent via-red-500 to-transparent hidden sm:block"
              />
              <BorderBeam
                duration={6}
                delay={3}
                size={300}
                borderWidth={2}
                className="from-transparent via-blue-500 to-transparent hidden sm:block"
              />
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}

export default PricingCont;
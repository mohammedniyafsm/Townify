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
    <div className="flex justify-center gap-8 items-start h-full py-4">
      {pricingPlans.map((plan, index) => (
        <Card key={index} 
          className="relative w-[330px] overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105"
>
          <CardHeader>
            <CardTitle className="text-2xl">{plan.title}</CardTitle>
            <CardDescription className="text-black font-semibold text-lg">
              {plan.price}
            </CardDescription>
          </CardHeader>

          <hr />

          <CardContent>
            <h1 className="font-Inter text-sm font-semibold">{plan.tagline}</h1>
          </CardContent>

          <hr />

          <CardContent>
            <div>
              {plan.features.map((feature, i) => (
                <h1
                  key={i}
                  className="flex gap-2 font-bricogrotesque text-sm py-1 font-semibold"
                >
                  <CheckCircleIcon size={20} className="inline-block" />
                  {feature}
                </h1>
              ))}
            </div>
          </CardContent>

          <hr />

          <CardFooter className="flex justify-center">
            <RainbowButton className="w-72">Get Started</RainbowButton>
          </CardFooter>

          {/* Border effects */}
          <BorderBeam
            duration={6}
            size={400}
            className="from-transparent via-red-500 to-transparent"
          />
          <BorderBeam
            duration={6}
            delay={3}
            size={400}
            borderWidth={2}
            className="from-transparent via-blue-500 to-transparent"
          />
        </Card>
      ))}
    </div>
  );
}

export default PricingCont;

import { Card } from "@/components/ui/card";
import { FiUsers, FiMap, FiUser, FiGrid } from "react-icons/fi";
import React from "react";

// Define the type for stats
interface StatItem {
  title: string;
  value: string;
  icon: React.ReactNode; // Changed from IconType to React.ReactNode
  change: string;
  color: "emerald" | "blue" | "purple" | "amber";
}

function AdminDashboard() {
  const stats: StatItem[] = [
    {
      title: "Total Users",
      value: "2,148",
      icon: <FiUsers className="h-5 w-5" />,
      change: `+12%`,
      color: "emerald",
    },
    {
      title: "Active Maps",
      value: "48",
      icon: <FiMap className="h-5 w-5" />,
      change: "+3",
      color: "blue",
    },
    {
      title: "Avatars Created",
      value: "892",
      icon: <FiUser className="h-5 w-5" />,
      change: "Today",
      color: "purple",
    },
    {
      title: "Spaces",
      value: "24",
      icon: <FiGrid className="h-5 w-5" />,
      change: "Active",
      color: "amber",
    },
  ];

  const colorMap: Record<StatItem["color"], string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };
  // Helper function to get progress bar color
  const getProgressColor = (color: StatItem["color"]): string => {
    switch (color) {
      case "emerald":
        return "bg-emerald-500";
      case "blue":
        return "bg-blue-500";
      case "purple":
        return "bg-purple-500";
      case "amber":
        return "bg-amber-500";
      default:
        return "bg-emerald-500";
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #10b981 100%)
      `,
          backgroundSize: "100% 100%",
        }}
      >
        <div className="min-h-screen w-full from-white to-emerald-50/30">
          {/* Main Content */}
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Overview
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back! Here's what's happening with your virtual spaces.
              </p>
            </div>

            {/* Stats Grid - Enhanced but simple */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const colorClasses = colorMap[stat.color];
                const progressColor = getProgressColor(stat.color);

                return (
                  <Card
                    key={index}
                    className={`p-5 border ${colorClasses} hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`p-2 rounded-lg ${colorClasses.split(" ")[0]}`}
                      >
                        {stat.icon}
                      </div>
                    </div>

                    {/* Simple progress indicator */}
                    <div className="mt-4">
                      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${progressColor}`}
                          style={{
                            width: `${Math.min(100, 70 + index * 10)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

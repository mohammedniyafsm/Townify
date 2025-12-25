import { Card } from "@/components/ui/card";
import { FiUsers, FiMap, FiUser, FiGrid } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import type { RootState } from "@/Redux/stroe";
import { useSelector } from "react-redux";

// Define the type for stats
interface StatItem {
  title: string;
  value: number | string;
  icon: React.ReactNode; // Changed from IconType to React.ReactNode
  change: string;
  color: "emerald" | "blue" | "purple" | "amber";
}

function ShimmerStatCard() {
  return (
    <Card 
      className="p-5 border border-gray-200 animate-pulse"
      aria-label="Loading statistic..."
      role="status"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title shimmer */}
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          {/* Value shimmer */}
          <div className="h-8 bg-gray-200 rounded w-16 mt-2"></div>
        </div>
        {/* Icon container shimmer */}
        <div className="p-2 rounded-lg bg-gray-100">
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Progress bar shimmer */}
      <div className="mt-4">
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gray-200 rounded-full w-3/4"></div>
        </div>
      </div>
    </Card>
  );
}

function AdminDashboard() {
  const users=useSelector((state: RootState) => state.users);
  const space=useSelector((state: RootState) => state.spaces);
  const maps=useSelector((state: RootState) => state.maps);
  const avatars=useSelector((state: RootState) => state.avatars);
  const auth=useSelector((state: RootState) => state.user);
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    const isLoading=users.status==='loading'||space.status==='loading'||maps.status==='loading'||avatars.status==='loading'||auth.status==='loading'
    setLoading(isLoading)
  },[users.status,space.status,maps.status,avatars.status,auth.status])


  const stats: StatItem[] = [
    {
      title: "Total Users",
      value: users.users.length||0,
      icon: <FiUsers className="h-5 w-5" />,
      change: `+12%`,
      color: "emerald",
    },
    {
      title: "Active Maps",
      value: maps.maps.length||0,
      icon: <FiMap className="h-5 w-5" />,
      change: "+3",
      color: "blue",
    },
    {
      title: "Avatars Created",
      value: avatars.avatars.length||0,
      icon: <FiUser className="h-5 w-5" />,
      change: "Today",
      color: "purple",
    },
    {
      title: "Spaces",
      value: space.spaces.length||0,
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
             {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <ShimmerStatCard key={`shimmer-${index}`} />
                ))
              ) : (
                // Show actual stat cards
                stats.map((stat, index) => {
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
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

"use client";
import React from "react";
import {
  Rocket,
  Crown,
  Building2,
  CheckCircle,
} from "lucide-react";

const subscriptions = () => {
  const plans = [
    {
      title: "Basic Plan",
      icon: <Rocket className="w-8 h-8 text-blue-500" />,
      price: "$9/mo",
      features: ["10 AI Generations", "Basic Support", "Limited Access"],
      popular: false,
      color: "blue",
    },
    {
      title: "Pro Plan",
      icon: <Crown className="w-8 h-8 text-yellow-500" />,
      price: "$29/mo",
      features: ["Unlimited Generations", "Priority Support", "All Features"],
      popular: true,
      color: "yellow",
    },
    {
      title: "Enterprise Plan",
      icon: <Building2 className="w-8 h-8 text-purple-500" />,
      price: "$99/mo",
      features: ["Team Access", "Dedicated Manager", "Custom Integrations"],
      popular: false,
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-center text-4xl font-bold text-gray-800 mb-4">
        Choose Your Plan
      </h2>
      <p className="text-center text-gray-500 mb-12">
        Flexible options that scale with your growth.
      </p>

      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-3xl p-6 shadow-xl bg-white transition-transform duration-300 hover:scale-105 hover:shadow-2xl ${
              plan.popular
                ? "ring-2 ring-blue-400 bg-blue-50"
                : "hover:ring-1 hover:ring-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                Most Popular
              </div>
            )}

            <div className="mb-4 flex items-center gap-3">
              {plan.icon}
              <h3 className="text-xl font-semibold text-gray-800">
                {plan.title}
              </h3>
            </div>

            <p className="text-3xl font-bold text-gray-900 mb-4">
              {plan.price}
            </p>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 px-4 rounded-xl font-medium text-white transition
                ${
                  plan.color === "blue"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : plan.color === "yellow"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default subscriptions;

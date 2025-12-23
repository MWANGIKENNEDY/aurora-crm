"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "Up to 50 leads",
      "Basic pipeline",
      "Email support",
      "1 workspace",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 29,
    description: "For growing teams",
    features: [
      "Unlimited leads",
      "Advanced pipeline",
      "Priority support",
      "5 workspaces",
      "CSV import/export",
      "Custom fields",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    description: "For large organizations",
    features: [
      "Everything in Professional",
      "Unlimited workspaces",
      "Dedicated support",
      "API access",
      "Custom integrations",
      "Advanced analytics",
    ],
    popular: false,
  },
];

export default function BillingPage() {
  const { leads } = useStore();
  const [currentPlan, setCurrentPlan] = React.useState("Professional");

  const usage = {
    leads: leads.length,
    limit: currentPlan === "Starter" ? 50 : Infinity,
    percentage: currentPlan === "Starter" ? (leads.length / 50) * 100 : 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{currentPlan}</h3>
              <p className="text-muted-foreground">
                {currentPlan === "Starter"
                  ? "Free"
                  : `${formatCurrency(
                      plans.find((p) => p.name === currentPlan)?.price || 0
                    )}/month`}
              </p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Leads</span>
              <span className="text-sm text-muted-foreground">
                {usage.leads}
                {usage.limit !== Infinity && ` / ${usage.limit}`}
              </span>
            </div>
            {usage.limit !== Infinity && (
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(usage.percentage, 100)}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                variant="glass"
                className={`relative h-full ${
                  plan.popular
                    ? "border-2 border-purple-500 shadow-lg"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {currentPlan === plan.name ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Method</CardTitle>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/25</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div>
                  <p className="font-medium">Invoice #{1000 + i}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(2024, 5 - i, 15).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{formatCurrency(29)}</span>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


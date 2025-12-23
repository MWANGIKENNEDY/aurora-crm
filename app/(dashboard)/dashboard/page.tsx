"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, TrendingUp, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#94a3b8", "#60a5fa", "#a78bfa", "#fbbf24", "#34d399", "#f87171"];

export default function DashboardPage() {
  const { leads, pipelineStages } = useStore();

  // Calculate metrics
  const totalLeads = leads.length;
  const leadsByStage = pipelineStages.map((stage) => ({
    name: stage.name,
    value: leads.filter((lead) => lead.status === stage.id).length,
    color: stage.color,
  }));

  const conversionData = [
    { month: "Jan", leads: 45, converted: 12 },
    { month: "Feb", leads: 52, converted: 18 },
    { month: "Mar", leads: 48, converted: 15 },
    { month: "Apr", leads: 61, converted: 22 },
    { month: "May", leads: 55, converted: 19 },
    { month: "Jun", leads: 67, converted: 25 },
  ];

  const sourceData = [
    { name: "Website", value: 35, color: "#60a5fa" },
    { name: "Referral", value: 25, color: "#a78bfa" },
    { name: "Social", value: 20, color: "#fbbf24" },
    { name: "Email", value: 15, color: "#34d399" },
    { name: "Other", value: 5, color: "#94a3b8" },
  ];

  const totalRevenue = leads
    .filter((lead) => lead.dealSize)
    .reduce((sum, lead) => sum + (lead.dealSize || 0), 0);

  const conversionRate = totalLeads > 0
    ? ((leads.filter((l) => l.status === "5").length / totalLeads) * 100).toFixed(1)
    : "0";

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      change: "+12%",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      change: "+2.5%",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+18%",
      icon: DollarSign,
      color: "text-purple-500",
    },
    {
      title: "Active Deals",
      value: leads.filter((l) => l.status !== "5" && l.status !== "6").length,
      change: "+8%",
      icon: Activity,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening with your leads.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Leads by Stage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Leads by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadsByStage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {leadsByStage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conversion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    name="Leads"
                  />
                  <Line
                    type="monotone"
                    dataKey="converted"
                    stroke="#34d399"
                    strokeWidth={2}
                    name="Converted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lead Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="md:col-span-2"
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


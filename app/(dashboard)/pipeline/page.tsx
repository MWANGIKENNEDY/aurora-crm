"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MoreVertical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useStore, Lead, PipelineStage } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import { KanbanColumn } from "@/components/pipeline/kanban-column";
import { LeadCard } from "@/components/pipeline/lead-card";

export default function PipelinePage() {
  const { leads, pipelineStages, moveLeadToStage } = useStore();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query)
    );
  });

  const handleDragEnd = (leadId: string, newStageId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const oldStage = pipelineStages.find((s) => s.id === lead.status);
    const newStage = pipelineStages.find((s) => s.id === newStageId);

    moveLeadToStage(leadId, newStageId);

    if (newStage?.name === "Won") {
      // Celebration effect
      addToast({
        type: "success",
        message: `🎉 ${lead.name} moved to Won!`,
        duration: 4000,
      });
    } else {
      addToast({
        type: "success",
        message: `${lead.name} moved to ${newStage?.name || "new stage"}`,
      });
    }
  };

  const leadsByStage = pipelineStages.map((stage) => ({
    stage,
    leads: filteredLeads.filter((lead) => lead.status === stage.id),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pipeline</h1>
          <p className="text-muted-foreground mt-2">
            Drag and drop leads between stages to track your sales process
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        <AnimatePresence>
          {leadsByStage.map(({ stage, leads: stageLeads }) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              leads={stageLeads}
              onDragEnd={handleDragEnd}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}


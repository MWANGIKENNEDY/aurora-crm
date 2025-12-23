"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { PipelineStage, Lead } from "@/lib/store";
import { LeadCard } from "./lead-card";
import { Card } from "@/components/ui/card";

interface KanbanColumnProps {
  stage: PipelineStage;
  leads: Lead[];
  onDragEnd: (leadId: string, newStageId: string) => void;
}

export function KanbanColumn({ stage, leads, onDragEnd }: KanbanColumnProps) {
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 w-80"
    >
      <Card variant="glass" className="h-full flex flex-col">
        {/* Column Header */}
        <div
          className="p-4 border-b border-white/10"
          style={{ borderLeftColor: stage.color, borderLeftWidth: "4px" }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{stage.name}</h3>
            <span className="text-sm text-muted-foreground bg-white/10 px-2 py-0.5 rounded-full">
              {leads.length}
            </span>
          </div>
        </div>

        {/* Column Content */}
        <div
          className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[400px]"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
            const leadId = e.dataTransfer.getData("leadId");
            if (leadId) {
              onDragEnd(leadId, stage.id);
            }
          }}
        >
          {isDraggingOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border-2 border-dashed border-purple-500 rounded-lg p-8 text-center text-muted-foreground"
            >
              Drop here
            </motion.div>
          )}

          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} stageColor={stage.color} />
          ))}

          {leads.length === 0 && !isDraggingOver && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-sm">No leads in this stage</p>
            </div>
          )}
        </div>

        {/* Add Lead Button */}
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="h-4 w-4" />
            Add lead
          </button>
        </div>
      </Card>
    </motion.div>
  );
}


"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { User, Building2, DollarSign } from "lucide-react";
import { Lead } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface LeadCardProps {
  lead: Lead;
  stageColor: string;
}

export function LeadCard({ lead, stageColor }: LeadCardProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("leadId", lead.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <motion.div
      draggable
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onDragStart={handleDragStart as any}
      onDragEnd={() => setIsDragging(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <Card
        variant="glass"
        className="cursor-grab active:cursor-grabbing p-4 hover:shadow-lg transition-all"
        style={{
          borderLeftColor: stageColor,
          borderLeftWidth: "3px",
        }}
      >
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">{lead.name}</h4>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span>{lead.company}</span>
            </div>
          </div>

          {lead.dealSize && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="font-medium">{formatCurrency(lead.dealSize)}</span>
            </div>
          )}

          {lead.owner && (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-medium">
                {lead.owner.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-muted-foreground">{lead.owner}</span>
            </div>
          )}

          {lead.source && (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-muted-foreground">
                {lead.source}
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

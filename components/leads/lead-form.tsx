"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lead } from "@/lib/store";
import { useStore } from "@/lib/store";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company is required"),
  status: z.string().min(1, "Status is required"),
  phone: z.string().optional(),
  source: z.string().min(1, "Source is required"),
  owner: z.string().min(1, "Owner is required"),
  notes: z.string().optional(),
  dealSize: z.number().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: Lead | null;
  onSave: (data: LeadFormData) => void;
}

export function LeadForm({ lead, onSave }: LeadFormProps) {
  const { pipelineStages, currentUser } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead
      ? {
          name: lead.name,
          email: lead.email,
          company: lead.company,
          status: lead.status,
          phone: lead.phone,
          source: lead.source,
          owner: lead.owner,
          notes: lead.notes,
          dealSize: lead.dealSize,
        }
      : {
          status: pipelineStages[0]?.id || "",
          owner: currentUser?.name || "",
          source: "Website",
        },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Name *</label>
          <Input {...register("name")} placeholder="John Doe" />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Email *</label>
          <Input {...register("email")} type="email" placeholder="john@example.com" />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Company *</label>
          <Input {...register("company")} placeholder="Acme Inc." />
          {errors.company && (
            <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Phone</label>
          <Input {...register("phone")} type="tel" placeholder="+1 (555) 000-0000" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Status *</label>
          <select
            {...register("status")}
            className="flex h-10 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm"
          >
            {pipelineStages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Source *</label>
          <select
            {...register("source")}
            className="flex h-10 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm"
          >
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Social">Social Media</option>
            <option value="Email">Email Campaign</option>
            <option value="Other">Other</option>
          </select>
          {errors.source && (
            <p className="mt-1 text-sm text-red-500">{errors.source.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Owner *</label>
          <Input {...register("owner")} placeholder="Owner name" />
          {errors.owner && (
            <p className="mt-1 text-sm text-red-500">{errors.owner.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Deal Size ($)</label>
          <Input
            {...register("dealSize", { valueAsNumber: true })}
            type="number"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Notes</label>
        <textarea
          {...register("notes")}
          rows={4}
          className="flex w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm"
          placeholder="Add notes about this lead..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" variant="glass">
          {lead ? "Update Lead" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}


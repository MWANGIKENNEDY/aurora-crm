"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useStore, Lead } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import { LeadForm } from "@/components/leads/lead-form";
import { CSVImport } from "@/components/leads/csv-import";

export default function LeadsPage() {
  const { leads, addLead, updateLead, deleteLead, setLeads } = useStore();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = React.useState<Set<string>>(new Set());

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.source.toLowerCase().includes(query)
    );
  });

  const handleDelete = (id: string) => {
    deleteLead(id);
    addToast({ type: "success", message: "Lead deleted successfully" });
  };

  const handleBulkDelete = () => {
    selectedLeads.forEach((id) => deleteLead(id));
    setSelectedLeads(new Set());
    addToast({ type: "success", message: `${selectedLeads.size} leads deleted` });
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all your leads in one place
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingLead(null);
            setIsModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Lead
        </Button>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" onClick={() => setIsImportOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          {selectedLeads.size > 0 && (
            <Button variant="outline" onClick={handleBulkDelete} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete ({selectedLeads.size})
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card variant="glass">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    {leads.length === 0 ? "No leads yet. Create your first lead!" : "No leads match your search."}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.has(lead.id)}
                        onChange={() => toggleSelect(lead.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-4 font-medium">{lead.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{lead.email}</td>
                    <td className="px-4 py-4">{lead.company}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/10">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{lead.source}</td>
                    <td className="px-4 py-4 text-muted-foreground text-sm">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingLead(lead);
                            setIsModalOpen(true);
                          }}
                          className="rounded-lg p-1.5 hover:bg-white/10 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="rounded-lg p-1.5 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        title={editingLead ? "Edit Lead" : "New Lead"}
        size="lg"
      >
        <LeadForm
          lead={editingLead}
          onSave={(leadData) => {
            if (editingLead) {
              updateLead(editingLead.id, leadData);
              addToast({ type: "success", message: "Lead updated successfully" });
            } else {
              addLead({
                ...leadData,
                id: Math.random().toString(36).substring(7),
                createdAt: new Date().toISOString(),
              });
              addToast({ type: "success", message: "Lead created successfully" });
            }
            setIsModalOpen(false);
            setEditingLead(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Leads from CSV"
        size="xl"
      >
        <CSVImport
          onImport={(importedLeads) => {
            setLeads([...importedLeads, ...leads]);
          }}
          onClose={() => setIsImportOpen(false)}
        />
      </Modal>
    </div>
  );
}


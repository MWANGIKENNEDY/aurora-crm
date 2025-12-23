"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Upload, Download, MoreVertical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useStore, List } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

export default function ListsPage() {
  const { lists, leads, addList } = useStore();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [listName, setListName] = React.useState("");

  const handleCreateList = () => {
    if (!listName.trim()) {
      addToast({ type: "error", message: "List name is required" });
      return;
    }

    const newList: List = {
      id: Math.random().toString(36).substring(7),
      name: listName,
      leadIds: [],
      createdAt: new Date().toISOString(),
    };

    addList(newList);
    addToast({ type: "success", message: "List created successfully" });
    setIsModalOpen(false);
    setListName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lists</h1>
          <p className="text-muted-foreground mt-2">
            Organize your leads into custom lists for better management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New List
          </Button>
        </div>
      </div>

      {lists.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No lists yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first list to organize your leads
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            Create List
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list, index) => {
            const listLeads = leads.filter((lead) => list.leadIds.includes(lead.id));
            return (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                      <button className="rounded-lg p-1 hover:bg-white/10 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{listLeads.length} leads</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created {formatDate(list.createdAt)}
                      </div>
                      {list.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {list.notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setListName("");
        }}
        title="Create New List"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">List Name</label>
            <Input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="My Custom List"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateList();
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setListName("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateList}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


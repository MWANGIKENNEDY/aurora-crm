"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Upload, File, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lead } from "@/lib/store";
import { useToast } from "@/components/ui/toast";

interface CSVImportProps {
  onImport: (leads: Lead[]) => void;
  onClose: () => void;
}

export function CSVImport({ onImport, onClose }: CSVImportProps) {
  const { addToast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<any[]>([]);
  const [mapping, setMapping] = React.useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);

  const leadFields = [
    "name",
    "email",
    "company",
    "phone",
    "source",
    "status",
    "owner",
    "notes",
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        parseCSV(acceptedFiles[0]);
      }
    },
    multiple: false,
  });

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setPreview(results.data.slice(0, 5) as any[]);
          // Auto-map columns
          const headers = Object.keys(results.data[0] as any);
          const autoMapping: Record<string, string> = {};
          headers.forEach((header) => {
            const lowerHeader = header.toLowerCase();
            const matchedField = leadFields.find(
              (field) => lowerHeader.includes(field) || field.includes(lowerHeader)
            );
            if (matchedField) {
              autoMapping[header] = matchedField;
            }
          });
          setMapping(autoMapping);
        }
      },
      error: (error) => {
        addToast({
          type: "error",
          message: `Error parsing CSV: ${error.message}`,
        });
      },
    });
  };

  const handleImport = () => {
    if (!file) return;

    setIsProcessing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const leads: Lead[] = (results.data as any[]).map((row, index) => {
          const lead: Partial<Lead> = {};
          Object.entries(mapping).forEach(([csvHeader, leadField]) => {
            if (leadField && row[csvHeader]) {
              (lead as any)[leadField] = row[csvHeader];
            }
          });

          return {
            id: Math.random().toString(36).substring(7),
            name: lead.name || `Lead ${index + 1}`,
            email: lead.email || "",
            company: lead.company || "",
            status: lead.status || "1",
            source: lead.source || "CSV Import",
            owner: lead.owner || "Current User",
            phone: lead.phone,
            notes: lead.notes,
            createdAt: new Date().toISOString(),
            dealSize: lead.dealSize,
          } as Lead;
        });

        onImport(leads);
        setIsProcessing(false);
        addToast({
          type: "success",
          message: `Successfully imported ${leads.length} leads`,
        });
        onClose();
      },
    });
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          {...getRootProps()}
          className={`glass-strong rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-purple-500 bg-purple-500/10"
              : "border-white/20 hover:border-white/40"
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? "Drop your CSV file here" : "Upload CSV File"}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop a CSV file, or click to browse
            </p>
            <Button variant="outline">Select File</Button>
          </motion.div>
        </div>
      ) : (
        <>
          {/* File Info */}
          <Card variant="glass" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview([]);
                  setMapping({});
                }}
                className="rounded-lg p-1 hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Card>

          {/* Column Mapping */}
          {preview.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Map Columns</h3>
              <Card variant="glass" className="p-4">
                <div className="space-y-3">
                  {Object.keys(preview[0] || {}).map((csvHeader) => (
                    <div key={csvHeader} className="flex items-center gap-3">
                      <div className="flex-1 text-sm font-medium">{csvHeader}</div>
                      <div className="text-muted-foreground">→</div>
                      <select
                        value={mapping[csvHeader] || ""}
                        onChange={(e) =>
                          setMapping({ ...mapping, [csvHeader]: e.target.value })
                        }
                        className="flex-1 h-10 rounded-lg border border-border bg-background/50 px-3 text-sm"
                      >
                        <option value="">Skip</option>
                        {leadFields.map((field) => (
                          <option key={field} value={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Preview */}
              <div>
                <h3 className="font-semibold mb-2">Preview (first 5 rows)</h3>
                <Card variant="glass" className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {Object.keys(preview[0] || {}).map((header) => (
                          <th key={header} className="px-4 py-2 text-left">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i} className="border-b border-white/5">
                          {Object.values(row).map((cell: any, j) => (
                            <td key={j} className="px-4 py-2">
                              {String(cell || "").slice(0, 30)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={isProcessing || !file}
              className="gap-2"
            >
              {isProcessing ? (
                "Importing..."
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Import Leads
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}


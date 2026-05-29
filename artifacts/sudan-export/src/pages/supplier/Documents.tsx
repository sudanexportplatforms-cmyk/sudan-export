import { useState } from "react";
import { useListDocuments, useCreateDocument } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { FileText, Download, Plus, Loader2, FileUp } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { getListDocumentsQueryKey } from "@workspace/api-client-react";

export default function SupplierDocuments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: documents = [], isLoading } = useListDocuments();
  const createDocument = useCreateDocument();
  
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !url) return;

    createDocument.mutate({
      data: { name, type, url }
    }, {
      onSuccess: () => {
        toast({ title: "Certificate uploaded successfully" });
        setIsOpen(false);
        setName("");
        setType("");
        setUrl("");
        queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey() });
      }
    });
  };

  return (
    <PortalLayout role="supplier" title="Certificates & Documents">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Upload quality certificates, origin certificates, and export licenses to increase buyer trust.</p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Certificate</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Document Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., SGS Quality Report" required />
              </div>
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality">Quality Certificate (SGS, etc.)</SelectItem>
                    <SelectItem value="origin">Certificate of Origin</SelectItem>
                    <SelectItem value="phytosanitary">Phytosanitary Certificate</SelectItem>
                    <SelectItem value="export_license">Export License</SelectItem>
                    <SelectItem value="registration">Company Registration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>File URL (Mock Upload)</Label>
                <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." required />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={createDocument.isPending}>
                  {createDocument.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Certificate
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FileUp className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Uploaded</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Verified exporters with quality certificates win 3x more deals. Upload yours now.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Document Name</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Date Uploaded</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-50 text-amber-600 rounded">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {doc.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/5">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" /> View
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PortalLayout>
  );
}

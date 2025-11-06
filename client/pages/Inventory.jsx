import { useInventory } from "@/context/InventoryContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { statusOf, remainingOf } from "@/utils/calculations";
import { Plus, PencilLine, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Inventory() {
  const { foods, categories, reasons, addFood, setSold, addWaste } = useInventory();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() =>
    foods.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()) || f.category.toLowerCase().includes(query.toLowerCase())),
  [foods, query]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <div className="flex gap-2">
          <Input placeholder="Search..." className="w-56" value={query} onChange={(e) => setQuery(e.target.value)} />
          <AddFoodDialog categories={categories} onSave={addFood} />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Initial</TableHead>
                <TableHead className="text-right">Sold</TableHead>
                <TableHead className="text-right">Waste</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-48">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => {
                const status = statusOf(f);
                return (
                  <TableRow key={f.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{f.name}</TableCell>
                    <TableCell>{f.category}</TableCell>
                    <TableCell className="text-right">{f.initialQty} {f.unit}</TableCell>
                    <TableCell className="text-right">{f.soldQty}</TableCell>
                    <TableCell className="text-right">{f.wasteQty}</TableCell>
                    <TableCell className="text-right">{remainingOf(f)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${status.color}`} />
                        <span className="text-sm">{status.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <EditSoldDialog current={f.soldQty} max={f.initialQty - f.wasteQty} onSave={(n) => setSold(f.id, n)} />
                        <WasteDialog foodId={f.id} foodName={f.name} reasons={reasons} max={remainingOf(f)} onSave={(q, r, d) => addWaste({ foodId: f.id, quantity: q, reason: r, date: d })} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AddFoodDialog({ categories, onSave }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: categories[0] || "Produce", unit: "pcs", initialQty: 0, dateAdded: new Date().toISOString().slice(0,10) });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" /> Add Food</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Food</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <Input placeholder="Food Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-sm text-muted-foreground">Category</span>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Unit</span>
              <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">pcs</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="liters">liters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" placeholder="Initial Quantity" value={form.initialQty} onChange={(e) => setForm({ ...form, initialQty: Number(e.target.value) })} />
            <Input type="date" value={form.dateAdded} onChange={(e) => setForm({ ...form, dateAdded: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => {
            if (!form.name) return;
            onSave({ name: form.name, category: form.category, unit: form.unit, initialQty: Math.max(0, Number(form.initialQty)||0), dateAdded: new Date(form.dateAdded).toISOString() });
            setOpen(false);
            setForm({ name: "", category: categories[0] || "Produce", unit: "pcs", initialQty: 0, dateAdded: new Date().toISOString().slice(0,10) });
          }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditSoldDialog({ current, max, onSave }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(current);
  return (
    <Dialog open={open} onOpenChange={(v)=>{ setOpen(v); if(v) setValue(current); }}>
      <DialogTrigger asChild>
        <Button variant="secondary"><PencilLine className="h-4 w-4" /> Edit Sold</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Sold Quantity</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Input type="number" min={0} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} />
          <p className="text-xs text-muted-foreground mt-1">Max allowed: {max}</p>
        </div>
        <DialogFooter>
          <Button onClick={() => { onSave(Math.max(0, Math.min(value, max))); setOpen(false); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WasteDialog({ foodId, foodName, reasons, max, onSave }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(0);
  const [reason, setReason] = useState(reasons[0] || "Expired");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  return (
    <Dialog open={open} onOpenChange={(v)=>{ setOpen(v); if(v){ setQty(0); setReason(reasons[0] || "Expired"); setDate(new Date().toISOString().slice(0,10)); } }}>
      <DialogTrigger asChild>
        <Button variant="outline"><Trash2 className="h-4 w-4" /> Add Waste</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Waste - {foodName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div>
            <span className="text-sm text-muted-foreground">Quantity</span>
            <Input type="number" min={0} max={max} value={qty} onChange={(e)=> setQty(Number(e.target.value))} />
            <p className="text-xs text-muted-foreground mt-1">Max allowed: {max}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Reason</span>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder="Reason" /></SelectTrigger>
              <SelectContent>
                {reasons.map((r)=> (<SelectItem key={r} value={r}>{r}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Date</span>
            <Input type="date" value={date} onChange={(e)=> setDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={()=> { onSave(Math.max(0, Math.min(qty, max)), reason, new Date(date).toISOString()); setOpen(false); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

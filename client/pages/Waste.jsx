import { useMemo, useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function Waste() {
  const { foods, waste, reasons, addWaste, removeWaste } = useInventory();
  const [open, setOpen] = useState(false);
  const [filterReason, setFilterReason] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return waste.filter((w) => {
      if (filterReason !== "all" && w.reason !== filterReason) return false;
      const d = w.date.slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [waste, filterReason, from, to]);

  const summary = useMemo(() => {
    const map = new Map();
    for (const w of filtered) map.set(w.reason, (map.get(w.reason) || 0) + w.quantity);
    return Array.from(map, ([reason, total]) => ({ reason, total }));
  }, [filtered]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Reason</div>
            <Select value={filterReason} onValueChange={setFilterReason}>
              <SelectTrigger className="w-full min-w-40"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {reasons.map((r)=> (<SelectItem key={r} value={r}>{r}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">From</div>
            <Input type="date" value={from} onChange={(e)=> setFrom(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">To</div>
            <Input type="date" value={to} onChange={(e)=> setTo(e.target.value)} />
          </div>
        </div>
        <AddWasteDialog open={open} setOpen={setOpen} foods={foods} reasons={reasons} onSave={(payload)=> addWaste(payload)} />
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>Waste Log</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">{w.foodName}</TableCell>
                    <TableCell className="text-right">{w.quantity}</TableCell>
                    <TableCell>{w.reason}</TableCell>
                    <TableCell>{new Date(w.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => removeWaste(w.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No entries</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Waste by Reason</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ total: { label: "Total", color: "hsl(var(--chart-2))" } }}
            className="h-[280px] w-full"
          >
            <BarChart data={summary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reason" />
              <YAxis allowDecimals={false} />
              <Bar dataKey="total" fill="var(--color-total)" radius={[4,4,0,0]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function AddWasteDialog({ open, setOpen, foods, reasons, onSave }){
  const [foodId, setFoodId] = useState(foods[0]?.id || "");
  const [qty, setQty] = useState(0);
  const [reason, setReason] = useState(reasons[0] || "Expired");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  return (
    <Dialog open={open} onOpenChange={(v)=>{ setOpen(v); if(v){ setFoodId(foods[0]?.id||""); setQty(0); setReason(reasons[0]||"Expired"); setDate(new Date().toISOString().slice(0,10)); } }}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" /> Add Waste</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Waste</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div>
            <div className="text-sm text-muted-foreground">Food</div>
            <Select value={foodId} onValueChange={setFoodId}>
              <SelectTrigger><SelectValue placeholder="Select food" /></SelectTrigger>
              <SelectContent>
                {foods.map((f)=> (<SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-muted-foreground">Quantity</div>
              <Input type="number" min={0} value={qty} onChange={(e)=> setQty(Number(e.target.value))} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Reason</div>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger><SelectValue placeholder="Reason" /></SelectTrigger>
                <SelectContent>
                  {reasons.map((r)=> (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Date</div>
            <Input type="date" value={date} onChange={(e)=> setDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={()=>{ if(!foodId || qty<=0) return; onSave({ foodId, quantity: qty, reason, date: new Date(date).toISOString() }); setOpen(false); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

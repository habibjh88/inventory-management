import { Link } from "react-router-dom";
import { useInventory } from "@/context/InventoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { groupByDate, totals } from "@/utils/calculations";
import { Plus, Package, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  const { foods, waste, categories, reasons, addFood, addWaste, threshold, getLowStock } = useInventory();
  const t = totals(foods);
  const timeline = useMemo(() => {
    const soldSeries = foods.map((f) => ({ date: new Date().toISOString(), sold: f.soldQty }));
    const wasteSeries = waste.map((w) => ({ date: w.date, waste: w.quantity }));
    return groupByDate([...soldSeries, ...wasteSeries]);
  }, [foods, waste]);

  const low = getLowStock();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <Stat title="Total Items" value={t.totalItems} />
        <Stat title="Total Sold" value={t.totalSold} />
        <Stat title="Total Remaining" value={t.totalRemaining} />
        <Stat title="Total Wasted" value={t.totalWaste} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage & Waste Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ sold: { label: "Sold", color: "hsl(var(--chart-1))" }, waste: { label: "Waste", color: "hsl(var(--chart-2))" } }}
            className="h-[280px] w-full"
          >
            <AreaChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
              <YAxis allowDecimals={false} />
              <Area type="monotone" dataKey="sold" stroke="var(--color-sold)" fill="var(--color-sold)" fillOpacity={0.25} />
              <Area type="monotone" dataKey="waste" stroke="var(--color-waste)" fill="var(--color-waste)" fillOpacity={0.25} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {low.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert (below {threshold})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              {low.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{f.name}</p>
                    <p className="text-sm text-muted-foreground">Remaining: {Math.max(0, f.initialQty - (f.soldQty + f.wasteQty))} {f.unit}</p>
                  </div>
                  <Package className="text-amber-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <AddFoodDialog />
        <Button asChild variant="secondary">
          <Link to="/inventory"><Package className="h-4 w-4" /> View Inventory</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/waste"><Trash2 className="h-4 w-4" /> View Waste Log</Link>
        </Button>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-950/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{Number(value).toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

function AddFoodDialog() {
  const { categories, addFood } = useInventory();
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
          <DialogDescription>Provide basic information to track this item.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Food Name</span>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">Category</span>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">Unit</span>
              <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">pcs</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="liters">liters</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">Initial Quantity</span>
              <Input type="number" value={form.initialQty} onChange={(e) => setForm({ ...form, initialQty: Number(e.target.value) })} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">Date Added</span>
              <Input type="date" value={form.dateAdded} onChange={(e) => setForm({ ...form, dateAdded: e.target.value })} />
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!form.name) return;
              addFood({
                name: form.name,
                category: form.category,
                unit: form.unit,
                initialQty: Math.max(0, Number(form.initialQty) || 0),
                dateAdded: new Date(form.dateAdded).toISOString(),
              });
              setOpen(false);
              setForm({ name: "", category: categories[0] || "Produce", unit: "pcs", initialQty: 0, dateAdded: new Date().toISOString().slice(0,10) });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

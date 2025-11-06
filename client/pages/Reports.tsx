import { useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { exportToCsv } from "@/utils/export";
import { remainingOf } from "@/utils/calculations";

export default function Reports(){
  const { foods, waste } = useInventory();

  const soldVsWaste = useMemo(()=>{
    const today = new Date().toISOString().slice(0,10);
    const map = new Map<string, { date: string; sold: number; waste: number }>();
    // Use waste dates; sold is only known as current totals.
    for (const w of waste) {
      const d = w.date.slice(0,10);
      const prev = map.get(d) || { date: d, sold: 0, waste: 0 };
      prev.waste += w.quantity;
      map.set(d, prev);
    }
    const totalSold = foods.reduce((s,f)=> s + f.soldQty, 0);
    const current = map.get(today) || { date: today, sold: 0, waste: 0 };
    current.sold += totalSold;
    map.set(today, current);
    return Array.from(map.values()).sort((a,b)=> a.date.localeCompare(b.date));
  }, [foods, waste]);

  const remainingByCategory = useMemo(()=>{
    const map = new Map<string, number>();
    for (const f of foods) map.set(f.category, (map.get(f.category)||0) + remainingOf(f));
    return Array.from(map, ([category, remaining]) => ({ category, remaining }));
  }, [foods]);

  const mostWastedFoods = useMemo(()=>{
    const arr = foods.map((f)=> ({ name: f.name, wasted: f.wasteQty }));
    arr.sort((a,b)=> b.wasted - a.wasted);
    return arr.slice(0, 8);
  }, [foods]);

  const exportFoods = () => {
    const rows: (string|number)[][] = [["Name","Category","Unit","Initial","Sold","Waste","Remaining","Date Added"]];
    for (const f of foods) rows.push([f.name, f.category, f.unit, f.initialQty, f.soldQty, f.wasteQty, remainingOf(f), new Date(f.dateAdded).toLocaleDateString()]);
    exportToCsv("foods.csv", rows);
  };
  const exportWaste = () => {
    const rows: (string|number)[][] = [["Food","Quantity","Reason","Date"]];
    for (const w of waste) rows.push([w.foodName, w.quantity, w.reason, new Date(w.date).toLocaleDateString()]);
    exportToCsv("waste.csv", rows);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex gap-2">
        <Button onClick={exportFoods} variant="outline">Export Foods (CSV)</Button>
        <Button onClick={exportWaste} variant="outline">Export Waste (CSV)</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Sold vs Waste</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={{ sold:{label:"Sold", color:"hsl(var(--chart-1))"}, waste:{label:"Waste", color:"hsl(var(--chart-2))"}}} className="h-[280px] w-full">
            <AreaChart data={soldVsWaste}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Area dataKey="sold" type="monotone" stroke="var(--color-sold)" fill="var(--color-sold)" fillOpacity={0.25} />
              <Area dataKey="waste" type="monotone" stroke="var(--color-waste)" fill="var(--color-waste)" fillOpacity={0.25} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Remaining by Category</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ remaining: { label: "Remaining", color:"hsl(var(--chart-3))" }}} className="h-[260px] w-full">
              <BarChart data={remainingByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis allowDecimals={false} />
                <Bar dataKey="remaining" fill="var(--color-remaining)" radius={[4,4,0,0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Most Wasted Foods</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ wasted: { label: "Wasted", color:"hsl(var(--chart-4))" }}} className="h-[260px] w-full">
              <BarChart data={mostWastedFoods}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} />
                <Bar dataKey="wasted" fill="var(--color-wasted)" radius={[4,4,0,0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

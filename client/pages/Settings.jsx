import { useTheme } from "next-themes";
import { useInventory } from "@/context/InventoryContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Plus } from "lucide-react";
import { useState } from "react";

export default function Settings(){
  const { theme, setTheme } = useTheme();
  const { threshold, setThreshold, categories, addCategory, removeCategory, reasons, addReason, removeReason } = useInventory();
  const [cat, setCat] = useState("");
  const [reas, setReas] = useState("");

  return (
    <div className="p-4 md:p-6 grid gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Switch light/dark theme.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant={theme === "light" ? "default" : "outline"} onClick={()=> setTheme("light")}>Light</Button>
            <Button variant={theme === "dark" ? "default" : "outline"} onClick={()=> setTheme("dark")}>Dark</Button>
            <Button variant={theme === "system" ? "default" : "outline"} onClick={()=> setTheme("system")}>System</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Warn when remaining below this quantity.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Input type="number" value={threshold} onChange={(e)=> setThreshold(Number(e.target.value))} className="w-32" />
            <span className="text-sm text-muted-foreground">units</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Food Categories</CardTitle>
            <CardDescription>Add or remove categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input placeholder="New category" value={cat} onChange={(e)=> setCat(e.target.value)} />
              <Button onClick={()=> { if(!cat.trim()) return; addCategory(cat.trim()); setCat(""); }}><Plus className="h-4 w-4" /> Add</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c)=> (
                  <TableRow key={c}>
                    <TableCell className="font-medium">{c}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={()=> removeCategory(c)}><X className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waste Reasons</CardTitle>
            <CardDescription>Manage reasons for waste logging.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input placeholder="New reason" value={reas} onChange={(e)=> setReas(e.target.value)} />
              <Button onClick={()=> { if(!reas.trim()) return; addReason(reas.trim()); setReas(""); }}><Plus className="h-4 w-4" /> Add</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reasons.map((r)=> (
                  <TableRow key={r}>
                    <TableCell className="font-medium">{r}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={()=> removeReason(r)}><X className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

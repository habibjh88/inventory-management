import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Waste from "./pages/Waste";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "next-themes";
import { InventoryProvider } from "@/context/InventoryContext";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Package, Trash2, BarChart3, Settings as Cog } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <InventoryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                  <div className="px-2 py-1.5 text-sm font-semibold tracking-tight">Food Inventory</div>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive>
                            <NavLink to="/" end className={({isActive})=> isActive?"data-[active=true]":""}>
                              <LayoutDashboard /> <span>Dashboard</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <NavLink to="/inventory" className={({isActive})=> isActive?"data-[active=true]":""}>
                              <Package /> <span>Inventory</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <NavLink to="/waste" className={({isActive})=> isActive?"data-[active=true]":""}>
                              <Trash2 /> <span>Waste</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <NavLink to="/reports" className={({isActive})=> isActive?"data-[active=true]":""}>
                              <BarChart3 /> <span>Reports</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <NavLink to="/settings" className={({isActive})=> isActive?"data-[active=true]":""}>
                              <Cog /> <span>Settings</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
              <SidebarInset>
                <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="flex h-14 items-center gap-2 px-3">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mx-2 h-6" />
                    <div className="text-sm font-medium">Food Inventory & Waste Management</div>
                    <div className="ml-auto flex items-center gap-2">
                      <Input placeholder="Quick search" className="w-48" />
                      <Button asChild size="sm" variant="outline">
                        <Link to="/inventory">Go to Inventory</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/waste" element={<Waste />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SidebarInset>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </InventoryProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

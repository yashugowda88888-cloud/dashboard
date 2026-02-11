import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, Shield, User, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userStats = session.user.role === "admin" ? await db.select({ value: count() }).from(users) : null;

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Sidebar/Nav */}
            <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary rounded-lg">
                            <Shield className="text-white" size={20} />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Vanguard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full border border-border">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium">{session.user.name}</span>
                        </div>
                        <Link
                            href="/api/auth/signout"
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}</h1>
                        <p className="text-muted-foreground">Here&apos;s what&apos;s happening today.</p>
                    </div>
                    {session.user.role === "admin" && (
                        <Link href="/admin" className="primary flex items-center gap-2">
                            <Users size={18} />
                            Manage Users
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card flex flex-col gap-4">
                        <div className="p-3 bg-blue-500/10 w-fit rounded-xl">
                            <LayoutDashboard size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Account Status</p>
                            <p className="text-xl font-bold text-green-500">Active & Approved</p>
                        </div>
                    </div>

                    <div className="card flex flex-col gap-4">
                        <div className="p-3 bg-purple-500/10 w-fit rounded-xl">
                            <Shield size={24} className="text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">User Role</p>
                            <p className="text-xl font-bold capitalize">{session.user.role}</p>
                        </div>
                    </div>

                    {session.user.role === "admin" && (
                        <div className="card flex flex-col gap-4">
                            <div className="p-3 bg-amber-500/10 w-fit rounded-xl">
                                <Users size={24} className="text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <p className="text-xl font-bold">{userStats ? userStats[0].value : 0}</p>
                            </div>
                        </div>
                    )}
                </div>

                <section className="mt-12">
                    <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                    <div className="card p-0 overflow-hidden">
                        <div className="p-8 text-center text-muted-foreground">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-muted rounded-full">
                                    <User size={32} />
                                </div>
                            </div>
                            <p>No recent activity found. Welcome to your new dashboard!</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

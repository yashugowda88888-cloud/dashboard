import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Shield, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import ApproveButton from "@/components/ApproveButton";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    const allUsers = await db.query.users.findMany({
        orderBy: [desc(users.createdAt)],
    });

    return (
        <div className="min-h-screen bg-[#050505]">
            <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Shield className="text-primary" size={20} />
                            <span className="font-bold text-xl">Admin Console</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-muted-foreground">Approve or reject new registration requests.</p>
                </div>

                <div className="card p-0 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="px-6 py-4 font-semibold text-sm">User</th>
                                <th className="px-6 py-4 font-semibold text-sm">Role</th>
                                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-sm">Joined</th>
                                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {allUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isApproved ? (
                                            <div className="flex items-center gap-1.5 text-green-500 text-sm font-medium">
                                                <CheckCircle size={16} />
                                                Approved
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-amber-500 text-sm font-medium">
                                                <XCircle size={16} />
                                                Pending
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!user.isApproved && (
                                            <ApproveButton userId={user.id} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {allUsers.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            No users found.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

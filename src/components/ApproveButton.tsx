"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

export default function ApproveButton({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to approve user:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleApprove}
            disabled={loading}
            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
        >
            {loading ? (
                <Loader2 className="animate-spin" size={14} />
            ) : (
                <Check size={14} />
            )}
            Approve
        </button>
    );
}

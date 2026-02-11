"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const successMsg = searchParams.get("success");
        if (successMsg) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSuccess(successMsg);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error);
                setLoading(false);
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("An unexpected error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-md animate-fade-in">
            <div className="flex flex-col items-center mb-8">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                    <LogIn className="text-primary" size={32} />
                </div>
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground mt-2">Log in to your account</p>
            </div>

            {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg mb-6 text-sm">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="primary w-full flex items-center justify-center gap-2 mt-4"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Signing in...
                        </>
                    ) : (
                        "Log In"
                    )}
                </button>
            </form>

            <p className="text-center mt-6 text-muted-foreground text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Youtube, Sparkles, Loader2, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function StudyNotesPage() {
    const [videoUrl, setVideoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const handleSummarize = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setNotes("");

        try {
            const res = await fetch("/api/ai/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setNotes(data.notes);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(notes);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#050505]">
            <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Sparkles size={18} className="text-primary" />
                            </div>
                            <span className="font-bold text-xl">AI Study Assistant</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
                        YouTube to <span className="gradient-text">Study Notes</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Paste a link to any educational video and let AI do the heavy lifting.
                    </p>
                </div>

                <div className="card mb-8 animate-fade-in [animation-delay:100ms]">
                    <form onSubmit={handleSummarize} className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                                <Youtube size={20} />
                            </div>
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="pl-10 h-14"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="primary h-14 px-8 flex items-center justify-center gap-2 min-w-[200px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Generate Notes
                                </>
                            )}
                        </button>
                    </form>
                    {error && <p className="error-message mt-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
                </div>

                {notes && (
                    <div className="animate-fade-in [animation-delay:200ms]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Your Generated Notes</h2>
                            <button
                                onClick={copyToClipboard}
                                className="secondary px-4 py-2 flex items-center gap-2 text-sm"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                {copied ? "Copied!" : "Copy Markdown"}
                            </button>
                        </div>
                        <div className="card prose prose-invert max-w-none bg-card/30 border-primary/20">
                            <div className="notes-content">
                                <ReactMarkdown>{notes}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}

                {!notes && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in [animation-delay:300ms]">
                        <div className="card p-6 bg-secondary/30">
                            <h3 className="font-bold mb-2">Fast & Accurate</h3>
                            <p className="text-sm text-muted-foreground">Get a comprehensive summary in seconds using Gemini 1.5 Flash.</p>
                        </div>
                        <div className="card p-6 bg-secondary/30">
                            <h3 className="font-bold mb-2">Clean Formatted</h3>
                            <p className="text-sm text-muted-foreground">Notes are structured in professional Markdown with hierarchy.</p>
                        </div>
                        <div className="card p-6 bg-secondary/30">
                            <h3 className="font-bold mb-2">Free to Use</h3>
                            <p className="text-sm text-muted-foreground">Unlimited summarization for all approved Vanguard users.</p>
                        </div>
                    </div>
                )}
            </main>

            <style jsx global>{`
        .notes-content h1 { font-size: 1.875rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--primary); }
        .notes-content h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
        .notes-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .notes-content p { margin-bottom: 1rem; color: var(--muted-foreground); line-height: 1.7; }
        .notes-content ul, .notes-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
        .notes-content li { margin-bottom: 0.5rem; color: var(--muted-foreground); }
        .notes-content strong { color: var(--foreground); }
        .notes-content blockquote { border-left: 4px solid var(--primary); padding-left: 1rem; font-style: italic; margin: 1.5rem 0; color: var(--muted-foreground); }
      `}</style>
        </div>
    );
}

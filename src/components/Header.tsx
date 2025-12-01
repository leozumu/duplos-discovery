import React from "react";
import { Search } from "lucide-react";
import { Category } from "@/lib/types";

interface HeaderProps {
    categories: Category[];
    selectedCategory?: number;
    onSelectCategory: (id: number | undefined) => void;
}

export function Header({ categories, selectedCategory, onSelectCategory }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/50">
            <div className="flex flex-col w-full max-w-2xl mx-auto">
                {/* Top Bar: Logo & Search */}
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        {/* Logo - assuming logo.svg exists, otherwise fallback or text */}
                        <img src="/logo.svg" alt="Duplos" className="h-7 w-auto" />
                    </div>
                    <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white">
                        <Search className="h-5 w-5" />
                    </button>
                </div>

                {/* Categories / Chips */}
                <div className="relative w-full px-4 pb-3">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide mask-fade-right pb-1">
                        <button
                            onClick={() => onSelectCategory(undefined)}
                            className={`
                                flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all border
                                ${!selectedCategory
                                    ? "bg-zinc-800 border-zinc-700 text-white shadow-sm"
                                    : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                                }
                            `}
                        >
                            Para ti
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => onSelectCategory(cat.id)}
                                className={`
                                    flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all border
                                    ${selectedCategory === cat.id
                                        ? "bg-zinc-800 border-zinc-700 text-white shadow-sm"
                                        : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                                    }
                                `}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}

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
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800">
            <div className="flex flex-col gap-4 p-4 md:px-6 md:py-4">
                {/* Top Bar: Logo & Search */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">D</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Duplos
                        </h1>
                    </div>
                    <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white">
                        <Search className="h-5 w-5" />
                    </button>
                </div>

                {/* Categories / Chips */}
                <div className="relative">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
                        <button
                            onClick={() => onSelectCategory(undefined)}
                            className={`
                                flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all
                                ${!selectedCategory
                                    ? "bg-white text-zinc-950"
                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
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
                                    flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all
                                    ${selectedCategory === cat.id
                                        ? "bg-white text-zinc-950"
                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
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

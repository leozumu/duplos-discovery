"use client";

import React, { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/types";

interface HeaderProps {
    categories: Category[];
    selectedCategory: number | null;
    onSelectCategory: (id: number | null) => void;
}

export function Header({ categories, selectedCategory, onSelectCategory }: HeaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    // Scroll Down
                    setIsVisible(false);
                } else {
                    // Scroll Up
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out bg-white/80 backdrop-blur-md border-b border-gray-100",
                isVisible ? "translate-y-0" : "-translate-y-full"
            )}
        >
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="font-bold text-xl tracking-tight text-gray-900">
                        Duplos<span className="text-blue-600">.cl</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mask-fade-right">
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={cn(
                            "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                            selectedCategory === null
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        Descubrir
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={cn(
                                "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                                selectedCategory === cat.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}

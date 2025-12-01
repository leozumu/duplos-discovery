"use client";

import React, { useState } from "react";
import { WPPost, Category } from "@/lib/types";
import { Header } from "./Header";
import { Feed } from "./Feed";

interface ContentWrapperProps {
    initialPosts: WPPost[];
    categories: Category[];
}

export function ContentWrapper({ initialPosts, categories }: ContentWrapperProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

    const handleCategorySelect = (categoryId: number | undefined) => {
        if (selectedCategory === categoryId) {
            setSelectedCategory(undefined); // Deselect if already selected
        } else {
            setSelectedCategory(categoryId);
        }
        // Scroll to top when category changes
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <Header
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
            />
            <Feed initialPosts={initialPosts} selectedCategory={selectedCategory} />
        </>
    );
}

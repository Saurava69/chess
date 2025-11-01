export function generateStructuredData(page: string, url: string): string {
    const baseData: Record<string, any> = {};
    baseData["@context"] = "https://schema.org";
    baseData["@type"] = "WebApplication";
    baseData.name = "SyntaxEngineer Chess";
    baseData.applicationCategory = "Game";
    baseData.operatingSystem = "Any";
    baseData.url = url;
    baseData.description = "Free chess analysis, game archive, and chess learning platform";
    baseData.creator = {
        "@type": "Organization",
        name: "SyntaxEngineer"
    };
    baseData.offers = {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
    };

    const pageSpecificData: Record<string, Record<string, any>> = {
        analysis: {
            "@type": "WebApplication",
            name: "Chess Game Analysis",
            description: "Analyze your chess games with powerful engine analysis. Get insights, find mistakes, and improve your chess skills.",
            applicationSubCategory: "Chess Analysis Tool",
            featureList: [
                "Engine Analysis",
                "Move Evaluation", 
                "Opening Analysis",
                "Endgame Analysis",
                "Blunder Detection"
            ]
        },
        archive: {
            "@type": "WebApplication",
            name: "Chess Game Archive",
            description: "Store and manage your chess games. Keep track of your progress and review past games.",
            applicationSubCategory: "Chess Database",
            featureList: [
                "Game Storage",
                "Game Organization",
                "Search and Filter",
                "Game Statistics"
            ]
        },
        tutorials: {
            "@type": "Course",
            name: "Chess Tutorials",
            description: "Comprehensive chess tutorial series covering tactics, strategy, openings, and endgames for all skill levels.",
            provider: {
                "@type": "Organization",
                name: "SyntaxEngineer"
            },
            courseMode: ["online"],
            educationalLevel: "Beginner to Advanced",
            teaches: [
                "Chess Tactics",
                "Chess Strategy", 
                "Chess Openings",
                "Chess Endgames",
                "Chess Analysis"
            ]
        },
        openings: {
            "@type": "Article",
            name: "Chess Openings Guide",
            description: "Complete guide to chess openings including Queen's Gambit, Sicilian Defense, Italian Game, and opening principles.",
            author: {
                "@type": "Organization",
                name: "SyntaxEngineer"
            },
            articleSection: "Chess Education",
            keywords: [
                "chess openings",
                "Queen's Gambit",
                "Sicilian Defense",
                "chess opening theory"
            ]
        },
        news: {
            "@type": "Blog",
            name: "Chess News",
            description: "Latest chess news, tournament updates, and chess community content.",
            blogPost: []
        }
    };

    const data = page && pageSpecificData[page] 
        ? { ...baseData, ...pageSpecificData[page] }
        : baseData;

    return `<script type="application/ld+json">
${JSON.stringify(data, null, 2)}
</script>`;
}

export function generateBreadcrumbData(url: string): string {
    const pathSegments = url.split("/").filter(segment => segment);
    
    if (pathSegments.length === 0) {
        return "";
    }

    const breadcrumbs = pathSegments.map((segment, index) => {
        const item: Record<string, any> = {};
        item["@type"] = "ListItem";
        item.position = index + 2; // Start from 2 since Home is 1
        item.name = segment.charAt(0).toUpperCase() + segment.slice(1);
        item.item = `https://syntaxengineer.com/${pathSegments.slice(0, index + 1).join("/")}`;
        return item;
    });

    const homeItem: Record<string, any> = {};
    homeItem["@type"] = "ListItem";
    homeItem.position = 1;
    homeItem.name = "Home";
    homeItem.item = "https://syntaxengineer.com/";
    
    breadcrumbs.unshift(homeItem);

    const breadcrumbData: Record<string, any> = {};
    breadcrumbData["@context"] = "https://schema.org";
    breadcrumbData["@type"] = "BreadcrumbList";
    breadcrumbData.itemListElement = breadcrumbs;

    return `<script type="application/ld+json">
${JSON.stringify(breadcrumbData, null, 2)}
</script>`;
}
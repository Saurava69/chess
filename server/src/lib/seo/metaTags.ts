export interface SEOData {
    title: string;
    description: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
}

export function generateSEOMetaTags(seoData: SEOData, url: string): string {
    const {
        title,
        description,
        keywords,
        ogTitle = title,
        ogDescription = description,
        ogImage = "/img/logo.svg",
        ogType = "website",
        twitterCard = "summary_large_image",
        twitterTitle = title,
        twitterDescription = description,
        twitterImage = ogImage
    } = seoData;

    return `
    <!-- Basic SEO Meta Tags -->
    <title>${title}</title>
    <meta name="description" content="${description}">
    ${keywords ? `<meta name="keywords" content="${keywords}">` : ""}
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="SyntaxEngineer">
    <meta name="language" content="English">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${ogTitle}">
    <meta property="og:description" content="${ogDescription}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:site_name" content="SyntaxEngineer Chess">
    <meta property="og:locale" content="en_US">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="${twitterCard}">
    <meta name="twitter:title" content="${twitterTitle}">
    <meta name="twitter:description" content="${twitterDescription}">
    <meta name="twitter:image" content="${twitterImage}">
    <meta name="twitter:site" content="@syntaxengineer">
    
    <!-- Theme and Favicon -->
    <meta name="theme-color" content="#47acff">
    <meta name="msapplication-TileColor" content="#47acff">
    <link rel="icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/img/logo.svg">
    
    <!-- PWA Support -->
    <link rel="manifest" href="/manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="SyntaxEngineer">
    <meta name="mobile-web-app-capable" content="yes">
    
    <!-- Performance and Preloading -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    
    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    </script>
    `;
}

export const seoDataMap: Record<string, SEOData> = {
    analysis: {
        title: "Chess Game Analysis - Free Online Chess Analysis Tool | SyntaxEngineer",
        description: "Analyze your chess games for free with our powerful chess engine. Find mistakes, discover better moves, and improve your chess skills with detailed game analysis.",
        keywords: "chess analysis, chess engine, free chess analysis, chess game analyzer, chess improvement, chess mistakes",
        ogType: "website",
        twitterCard: "summary_large_image"
    },
    archive: {
        title: "Chess Game Archive - Store and Organize Your Games | SyntaxEngineer", 
        description: "Keep all your chess games organized in one place. Save, search, and review your games with our free chess game archive and database.",
        keywords: "chess archive, chess database, chess games collection, pgn viewer, chess game storage",
        ogType: "website"
    },
    tutorials: {
        title: "Chess Tutorials - Learn Chess Strategy, Tactics & Openings | SyntaxEngineer",
        description: "Master chess with our comprehensive tutorial series. Learn tactics, strategy, openings, and endgames from beginner to advanced level with expert guidance.",
        keywords: "chess tutorials, learn chess, chess lessons, chess strategy, chess tactics, chess openings guide, chess endgame tutorial, chess improvement",
        ogType: "website",
        twitterCard: "summary_large_image"
    },
    openings: {
        title: "Chess Openings Guide - Queen's Gambit, Sicilian Defense & More | SyntaxEngineer",
        description: "Complete chess openings guide covering Queen's Gambit, Sicilian Defense, Italian Game, and other popular openings. Learn opening principles and build your repertoire.",
        keywords: "chess openings, Queen's Gambit, Sicilian Defense, Italian Game, chess opening theory, opening principles, chess repertoire",
        ogType: "article",
        twitterCard: "summary_large_image"
    },
    news: {
        title: "Chess News - Latest Updates and Tournament Coverage | SyntaxEngineer",
        description: "Stay updated with the latest chess news, tournament results, and chess community updates. Get insights from the world of competitive chess.",
        keywords: "chess news, chess tournaments, chess updates, chess community, chess events",
        ogType: "blog"
    },
    signin: {
        title: "Sign In - SyntaxEngineer Chess Platform",
        description: "Sign in to your SyntaxEngineer account to access your chess games, analysis, and personalized chess learning experience.",
        keywords: "chess login, chess sign in, chess account",
        ogType: "website"
    },
    profile: {
        title: "Your Chess Profile - SyntaxEngineer",
        description: "View and manage your chess profile, track your progress, and customize your chess learning experience on SyntaxEngineer.",
        keywords: "chess profile, chess statistics, chess progress tracking",
        ogType: "profile"
    }
};
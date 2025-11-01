import { Request, Response } from "express";

interface SSRConfig {
    title: string;
    description: string;
    preloadedState?: any;
    scripts?: string[];
    styles?: string[];
}

export function renderPage(config: SSRConfig): string {
    const { title, description, preloadedState, scripts = [], styles = [] } = config;

    // Generate preloaded state script
    const preloadedStateScript = preloadedState 
        ? `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, "\\u003c")};</script>`
        : "";

    // Generate script tags
    const scriptTags = scripts.map(src => `<script src="${src}"></script>`).join("\n    ");
    
    // Generate style tags
    const styleTags = styles.map(href => `<link rel="stylesheet" href="${href}">`).join("\n    ");

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    ${styleTags}
</head>
<body>
    <div id="root" class="root">
        <!-- SSR content will be injected here -->
    </div>
    ${preloadedStateScript}
    ${scriptTags}
</body>
</html>`;
}

// Enhanced route handler that ensures proper HTML delivery
export function enhancedAppRouter(
    scriptName: string, 
    config: Partial<SSRConfig> = {}
) {
    return (req: Request, res: Response) => {
        const defaultConfig: SSRConfig = {
            title: "SyntaxEngineer Chess",
            description: "Free chess analysis and learning platform",
            scripts: [`/${scriptName}.bundle.js`],
            ...config
        };

        // Set proper headers for SEO
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
        
        // Send the pre-rendered HTML
        res.send(renderPage(defaultConfig));
    };
}
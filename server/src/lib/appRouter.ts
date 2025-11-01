import { Request, RequestHandler, Response } from "express";
import { readFileSync } from "fs";
import { generateStructuredData, generateBreadcrumbData } from "./seo/structuredData";
import { generateSEOMetaTags, seoDataMap } from "./seo/metaTags";

type PlaceholderGenerator = (req: Request, res: Response) => (
    Promise<Record<string, string>>
);

function appRouter(
    filepath: string,
    getPlaceholders?: PlaceholderGenerator
): RequestHandler {
    return async (req, res) => {
        const protocol = req.secure ? "https" : "http";
        const fullUrl = `${protocol}://${req.get("host")}${req.originalUrl}`;
        
        // Extract page name from filepath for structured data
        const pageName = filepath.replace(".html", "").split("/").pop() || "";
        
        // Generate SEO data
        const structuredData = generateStructuredData(pageName, fullUrl);
        const breadcrumbData = generateBreadcrumbData(req.path);
        
        // Generate enhanced meta tags if we have SEO data for this page
        const seoData = seoDataMap[pageName];
        const metaTags = seoData ? generateSEOMetaTags(seoData, fullUrl) : "";

        let htmlContent = readFileSync(
            `client/public/apps/${filepath}`, "utf-8"
        );

        // Add canonical URL
        const canonicalUrl = `<link rel="canonical" href="${fullUrl.split("?")[0]}" />`;
        
        // Replace existing meta tags with enhanced ones if available
        if (metaTags) {
            // Remove existing basic meta tags and replace with enhanced ones
            htmlContent = htmlContent.replace(
                /<head[^>]*>/i,
                `<head>\n${metaTags}`
            );
        }

        // Add SEO enhancements before closing head tag
        htmlContent = htmlContent.replace(
            "</head>",
            `${canonicalUrl}
${structuredData}
${breadcrumbData}
</head>`
        );

        if (getPlaceholders) {
            const placeholders = Object.entries(
                await getPlaceholders(req, res)
            );

            for (const [ key, value ] of placeholders) {
                htmlContent = htmlContent.replace(
                    new RegExp(`\\\${${key}}`, "gi"), value
                );
            }
        }

        res.header("Content-Type", "text/html");
        res.send(htmlContent);
    };
}

export default appRouter;
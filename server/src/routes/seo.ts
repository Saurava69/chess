import { Request, Response, Router } from "express";

const router = Router();

// Define all public pages with their priorities and change frequencies
const sitePages = [
    {
        url: "/",
        priority: 1.0,
        changefreq: "daily"
    },
    {
        url: "/analysis",
        priority: 1.0,
        changefreq: "daily"
    },
    {
        url: "/tutorials",
        priority: 0.9,
        changefreq: "weekly"
    },
    {
        url: "/openings",
        priority: 0.9,
        changefreq: "weekly"
    },
    {
        url: "/archive",
        priority: 0.8,
        changefreq: "weekly"
    },
    {
        url: "/news",
        priority: 0.7,
        changefreq: "daily"
    },
    {
        url: "/legal",
        priority: 0.3,
        changefreq: "monthly"
    },
    {
        url: "/help",
        priority: 0.5,
        changefreq: "monthly"
    }
];

function generateSitemap(baseUrl: string): string {
    const currentDate = new Date().toISOString();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    sitePages.forEach(page => {
        sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    sitemap += "</urlset>";
    return sitemap;
}

router.get("/sitemap.xml", (req: Request, res: Response) => {
    const protocol = req.secure ? "https" : "http";
    const baseUrl = `${protocol}://${req.get("host")}`;
    
    res.set("Content-Type", "application/xml");
    res.send(generateSitemap(baseUrl));
});

export default router;
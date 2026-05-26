import React, { useEffect } from "react";

import AdvertisementProps from "./AdvertisementProps";
import * as styles from "./Advertisement.module.css";

function Advertisement({
    className,
    style,
    publisherId,
    adUnitId
}: AdvertisementProps) {
    useEffect(() => {
        try {
            // Only push if this ins element hasn't been initialised yet
            const els = document.querySelectorAll<HTMLElement>("ins.adsbygoogle");
            const uninitialised = Array.from(els).filter(
                el => !el.getAttribute("data-adsbygoogle-status")
            );
            if (uninitialised.length > 0) {
                window.adsbygoogle ??= [];
                window.adsbygoogle.push({});
            }
        } catch { /* duplicate load — safe to ignore */ }
    }, []);

    const pubId = publisherId || process.env.ADS_PUBLISHER_ID;
    if (!pubId) return null;

    const devClassName = process.env.NODE_ENV == "development"
        ? styles.dev : "";

    return <ins
        className={`adsbygoogle ${className} ${devClassName}`}
        style={{ display: "block", ...style }}
        data-ad-client={pubId}
        data-ad-slot={adUnitId}
    />;
}

export default Advertisement;
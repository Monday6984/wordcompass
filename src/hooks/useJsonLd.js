import { useEffect } from "react";

/**
 * Adds a <script type="application/ld+json"> (structured data for search engines)
 * while the page is mounted, and removes it afterwards. Pass null to add nothing.
 */
export default function useJsonLd(data) {
  const json = data ? JSON.stringify(data) : "";

  useEffect(() => {
    if (!json) return undefined;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    // Escape "<" so text in the data can never close the script tag.
    script.textContent = json.replace(/</g, "\\u003c");
    document.head.appendChild(script);
    return () => script.remove();
  }, [json]);
}

// components/AdBanner.tsx
"use client";
import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      // Yeh line client browser mein Google ad push karti hai
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense Error: ", e);
    }
  }, []);

  return (
    <div style={{ 
      margin: "24px 0", 
      textAlign: "center", 
      background: "#f1f5f9", 
      minHeight: "90px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      color: "#94a3b8", 
      fontSize: "11px", 
      border: "1px dashed #cbd5e1",
      borderRadius: "6px",
      width: "100%"
    }}>
      {/* Jab AdSense approve ho jaye to XXXXXX ko apni real IDs se badlein */}
      <ins className="adsbygoogle"
           style={{ display: "block" }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" 
           data-ad-slot="XXXXXXXXXX"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <span>-- Advertisement Space --</span>
    </div>
  );
}
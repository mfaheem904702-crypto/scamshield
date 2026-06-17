// app/blog/[id]/page.tsx
import { Metadata } from "next";
import Link from "next/link";

// Demo Data (Hakiki project mein yeh data aap database se fetch karenge)
const BLOG_POSTS = [
  { id: 1, title: "Top 10 Online Scams in Pakistan 2026", cat: "Scam Alert", date: "Jun 14, 2026", desc: "Learn about the most common online scams targeting Pakistanis.", content: "## Full Content Here..." },
  { id: 2, title: "How to Detect Fake WhatsApp Groups", cat: "WhatsApp", date: "Jun 12, 2026", desc: "WhatsApp groups promising daily income — how to spot them.", content: "## Full Content Here..." }
];

interface Props {
  params: { id: string };
}

// ── STEP 3.1: SEO METADATA GENERATOR ──────────────────────────────────────────
// Yeh function Google bots ko aapke blog ka Title aur Description batata hai taake ranking achi ho.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS.find(p => p.id === Number(params.id));
  return {
    title: `${post?.title || "Blog Post"} | ScamShield Pakistan`,
    description: post?.desc || "Stay updated with the latest scam alerts in Pakistan.",
  };
}

// ── STEP 3.2: BLOG RENDER PAGE ────────────────────────────────────────────────
export default function SingleBlogPost({ params }: Props) {
  const post = BLOG_POSTS.find(p => p.id === Number(params.id));

  if (!post) {
    return <div style={{ padding: 50, textAlign: "center" }}>Post not found!</div>;
  }

  return (
    <div style={{ maxWidth: 740, margin: "0 auto", padding: "3rem 1.25rem", fontFamily: "sans-serif" }}>
      <Link href="/">
        <button style={{ padding: "8px 16px", cursor: "pointer", marginBottom: 24 }}>← Back to Home</button>
      </Link>
      
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "2.5rem", background: "#fff" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "4px 12px", borderRadius: 4 }}>{post.cat}</span>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "16px 0", color: "#0f172a" }}>{post.title}</h1>
        <p style={{ color: "#475569", fontSize: 13, marginBottom: 20 }}>Published on: {post.date}</p>
        <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "20px 0" }} />
        
        {/* Blog Body Content */}
        <div style={{ fontSize: 16, lineHeight: 1.8, color: "#334155" }}>
          {post.content}
        </div>
      </div>
    </div>
  );
}
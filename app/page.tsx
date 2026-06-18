"use client";

import { useState, useEffect } from "react";
// Real Supabase Client Import
import { supabase } from "./supabaseClient";

// ── Constants ─────────────────────────────────────────────────────────────────
const FREE_LIMIT = 5;

const TRUSTED = ["fiverr","upwork","freelancer","linkedin","google","amazon","daraz","youtube","facebook","instagram","twitter","github","microsoft","apple","shopify","paypal","stripe","zoom","indeed","glassdoor","binance","coinbase","payoneer","skrill","wise","transferwise","netflix","spotify","aliexpress","ebay","etsy","canva","notion","slack","discord","telegram","whatsapp","snapchat","tiktok","pinterest"];

const PERSON_SCAM_KEYWORDS = ["guru","coach","mentor","invest with me","join my group","i will double","my method","whatsapp me","contact me for earning","send money","trust me","guaranteed profit","my students earn","100% result","no loss","i made millions","secret method"];

const LINK_SCAM_PATTERNS = ["bit.ly","tinyurl","shorturl","t.me/","wa.me/","click here to earn","free gift","you won","claim now","limited offer","verify your account","update your info","suspicious","phishing","xyz","earn.","cash.","profit.","money.","income.","click-earn","dailyprofit","fastcash"];

const SCAM_KEYWORDS = ["earn fast","double money","guarantee","100% profit","click earn","whatsapp earning","typing job","easy money","per day 5000","invest 100 get 1000","crypto double","bitcoin scam","mlm","pyramid","referral earn","daily payout","no skill","work from home daily","task complete earn","watch ads earn","free money","instant withdraw","make money fast","get rich quick","passive income guaranteed","zero investment earn","online job without skill"];

const BLOG_POSTS = [
  {id:1,title:"Top 10 Online Scams in Pakistan 2026",cat:"Scam Alert",date:"Jun 14, 2026",read:"5 min",emoji:"🚨",desc:"Learn about the most common online scams targeting Pakistanis.",content:`## Top 10 Online Scams in Pakistan 2026\n\n**1. Fake Earning Apps** — Rs 5000/day promises. Collect data and disappear.\n\n**2. WhatsApp Investment Groups** — 50-100% monthly returns. Always Ponzi.\n\n**3. Crypto Doubling** — Send 1 BTC get 2. Never true.\n\n**4. Fake Job Offers** — Ask upfront payment for registration.\n\n**5. Online Typing Jobs** — 99% fake. Collect fees and vanish.\n\n**6. Lottery Scams** — Won prize but need to pay tax first.\n\n**7. Fake E-Commerce** — Clone sites. Products never arrive.\n\n**8. MLM Schemes** — Recruit people, ultimately collapses.\n\n**9. Survey Sites** — Minimum payout never reachable.\n\n**10. Phishing Links** — Fake bank/JazzCash links via SMS.\n\n**Stay Safe:** Always verify. Use ScamShield instantly.`},
  {id:2,title:"How to Detect Fake WhatsApp Groups",cat:"WhatsApp",date:"Jun 12, 2026",read:"4 min",emoji:"📱",desc:"WhatsApp groups promising daily income — how to spot them.",content:`## How to Detect Fake WhatsApp Groups\n\n**Red Flags:**\n- Admin promises guaranteed daily income\n- Fake payment screenshots\n- Joining fee required\n- Only admin posts in group\n\n**How Scammers Operate:**\n1. Add you without permission\n2. Show fake testimonials\n3. Ask small investment\n4. Pay small amounts to gain trust\n5. Ask bigger investment, disappear\n\n**What To Do:**\n- Leave immediately if money requested\n- Report to FIA: 9911\n- Never share bank details`},
  {id:3,title:"How to Check if a Person is Scammer",cat:"Person Check",date:"Jun 10, 2026",read:"6 min",emoji:"👤",desc:"Online 'gurus' and coaches — how to verify real vs fake.",content:`## How to Check if a Person is Scammer\n\n**Fake Guru Red Flags:**\n- Promises guaranteed income\n- Asks you to join paid WhatsApp group\n- Shows rented cars/houses as their own\n- No verifiable real identity\n- Asks to send money first\n\n**How to Verify a Person:**\n1. Search their name + "scam" on Google\n2. Check their social media history\n3. Verify their credentials independently\n4. Never pay upfront\n5. Ask for verifiable proof of results\n\n**Safe Rule:** Legitimate mentors don't ask for money before proving value.`},
  {id:4,title:"Link Safety — How to Check Any URL",cat:"Link Safety",date:"Jun 8, 2026",read:"5 min",emoji:"🔗",desc:"Suspicious links — how to verify before clicking.",content:`## Link Safety Guide\n\n**Dangerous Link Signs:**\n- Shortened URLs (bit.ly, tinyurl)\n- Misspelled domains (g00gle.com)\n- HTTP instead of HTTPS\n- Random numbers in domain\n- Urgent language in message\n\n**How to Check a Link:**\n1. Paste in virustotal.com\n2. Check domain age at whois.com\n3. Look for padlock in browser\n4. Never click from unknown senders\n5. Use ScamShield link checker\n\n**Pakistan Specific:** JazzCash, HBL, UBL never send payment links via WhatsApp.`},
  {id:5,title:"Investment Scam Warning Signs",cat:"Investment",date:"Jun 6, 2026",read:"7 min",emoji:"💰",desc:"Before investing a single rupee — 15 red flags to check.",content:`## 15 Investment Scam Warning Signs\n\n**About the Company:**\n1. No physical office\n2. Not registered with SECP\n3. Anonymous founders\n4. Website under 1 year old\n5. No verifiable contact\n\n**About Returns:**\n6. Fixed monthly returns promised\n7. Returns too high\n8. No explanation of profit source\n9. Pressure to invest quickly\n10. Bonus for referring friends\n\n**Safe Alternatives:**\n- Pakistan Stock Exchange (PSX)\n- Government Savings Certificates\n- Registered Mutual Funds\n\nVerify: secp.gov.pk`},
  {id:6,title:"Crypto Scams in Pakistan: Complete Guide",cat:"Crypto",date:"Jun 4, 2026",read:"8 min",emoji:"₿",desc:"Identify fake crypto projects and protect your savings.",content:`## Crypto Scams in Pakistan\n\n**Most Common:**\n1. Fake Exchanges — clone Binance/Coinbase sites\n2. Pump and Dump — influencer hype then sell\n3. Rug Pulls — project raises funds, founders vanish\n4. Fake Mining Apps — phones cannot mine profitably\n5. Romance Scams — friendship leads to fake investment\n\n**Stay Safe:**\n- Only use Binance, Coinbase official apps\n- Never invest based on social media tips\n- Research whitepaper and team\n\n**Report:** FIA Cybercrime: www.fia.gov.pk`},
];

const FAQS = [
  {q:"How does ScamShield work?",a:"ScamShield uses Claude AI and pattern analysis to detect scam signals in apps, websites, job offers, people, links, and investment schemes."},
  {q:"Can I check a person's name for scam?",a:"Yes! Enter a person's name, social media handle, or their claim (e.g. 'Ahmed earning guru Lahore') and ScamShield will analyze if they show scam patterns."},
  {q:"Can ScamShield check suspicious links?",a:"Yes! Paste any URL or link and ScamShield will analyze the domain patterns, keywords, and known phishing indicators."},
  {q:"How many free checks do I get?",a:"Free users get 5 checks per day. Upgrade to Premium for unlimited checks, detailed reports, and priority AI analysis."},
  {q:"How accurate is ScamShield AI?",a:"Our AI maintains 95%+ accuracy. We continuously update detection models for new Pakistani scam patterns."},
  {q:"What payment methods are accepted?",a:"We accept Stripe (international cards), JazzCash, and EasyPaisa for Pakistani users."},
];

const verdictStyle = (dark: any) => ({
  FAKE:{color:"#df2c47",bg:dark?"#2a1418":"#fdf2f4",border:"#f3a6b1",label:"SCAM DETECTED",emoji:"⛔"},
  REAL:{color:"#107c41",bg:dark?"#112519":"#f0f9f4",border:"#9cd9b5",label:"LEGITIMATE",emoji:"✅"},
  UNCERTAIN:{color:"#b76e00",bg:dark?"#2a2010":"#fdf8ee",border:"#f5d6a0",label:"UNCERTAIN",emoji:"⚠️"},
});

function th(dark: any){
  return{
    bg:dark?"#090d16":"#f8fafc",
    card:dark?"#111827":"#ffffff",
    txt:dark?"#f3f4f6":"#0f172a",
    txt2:dark?"#9ca3af":"#475569",
    border:dark?"#1f2937":"#e2e8f0",
    input:dark?"#1f2937":"#f1f5f9",
    primary:"#2563eb",
    primaryGlow:dark?"linear-gradient(135deg, #3b82f6, #1d4ed8)":"linear-gradient(135deg, #2563eb, #1e40af)",
    glow:dark?"0 10px 30px rgba(0,0,0,.5)":"0 10px 25px rgba(15,23,42,.05)",
  };
}

function detectCheckType(q: any) {
  const inp = q.toLowerCase().trim();
  if(inp.startsWith("http")||inp.includes("www.")||inp.includes(".com")||inp.includes(".pk")||inp.includes(".net")||inp.includes(".org")||inp.includes("bit.ly")||inp.includes("t.me")||inp.includes(".xyz")) return "link";
  if(LINK_SCAM_PATTERNS.some(p=>inp.includes(p))) return "link";
  const words = inp.split(" ");
  if(words.length<=3 && !SCAM_KEYWORDS.some(k=>inp.includes(k))) return "person";
  if(PERSON_SCAM_KEYWORDS.some(p=>inp.includes(p))) return "person";
  return "general";
}

function AdBanner(){
  return(
    <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:8,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4,gap:12}}>
      <div>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>Advertisement</div>
        <div style={{fontSize:14,fontWeight:600,color:"#fff"}}>🛡️ Stay Safe Online — Upgrade to ScamShield Premium</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>Unlimited checks · Full AI reports · Priority analysis</div>
      </div>
      <div style={{background:"rgba(255,255,255,0.15)",color:"#fff",borderRadius:6,padding:"8px 18px",fontSize:12,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>Learn More →</div>
    </div>
  );
}

function Card3D({children, style={}, glow}: any){
  const [rot,setRot]=useState({x:0,y:0});
  function onMove(e){
    const r=e.currentTarget.getBoundingClientRect();
    const x=((e.clientY-r.top)/r.height-.5)*6;
    const y=((e.clientX-r.left)/r.width-.5)*-6;
    setRot({x,y});
  }
  return(
    <div onMouseMove={onMove} onMouseLeave={()=>setRot({x:0,y:0})}
      style={{...style,transform:`perspective(1000px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,transition:"transform .25s cubic-bezier(0.25, 1, 0.5, 1)",boxShadow:glow||"0 15px 35px rgba(0,0,0,.06)"}}>
      {children}
    </div>
  );
}

function BillingModal({plan,price,onClose,dark}){
  const t=th(dark);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:t.card,borderRadius:12,padding:"2rem",maxWidth:420,width:"100%",boxShadow:"0 24px 48px rgba(0,0,0,0.3)",border:`1px solid ${t.border}`}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36,marginBottom:8}}>⚡</div>
          <h2 style={{fontSize:18,fontWeight:700,color:t.txt,margin:"0 0 4px"}}>Activate {plan}</h2>
          <div style={{fontSize:22,fontWeight:800,color:"#2563eb"}}>{price}<span style={{fontSize:14,color:t.txt2,fontWeight:400}}>/month</span></div>
        </div>
        <div style={{background:t.input,borderRadius:8,padding:16,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:t.txt2,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:12}}>Payment Options</div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:600,color:t.txt,marginBottom:4}}>🏦 Meezan Bank</div>
            <div style={{fontSize:11,color:t.txt2}}>Account Title: Faheem Abbas</div>
            <div style={{fontSize:11,color:t.txt2,fontFamily:"monospace"}}>IBAN: PK26MEZN0029010105169922</div>
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:t.txt,marginBottom:4}}>📱 EasyPaisa</div>
            <div style={{fontSize:11,color:t.txt2}}>Number: 0302-5878458 · Name: Muhammad Faheem</div>
          </div>
        </div>
        <div style={{background:dark?"rgba(37,99,235,0.1)":"#eff6ff",borderRadius:6,padding:12,fontSize:11,color:dark?"#60a5fa":"#1d4ed8",marginBottom:16,lineHeight:1.5}}>
          💡 After payment, send screenshot via WhatsApp to activate your account within 24 hours.
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>window.open(`https://wa.me/923025878458?text=${encodeURIComponent(`Hello! Maine ${plan} ke ${price} send kar diye hain, please activate kar dein.`)}`,"_blank")}
            style={{flex:1,background:"linear-gradient(135deg,#25d366,#128c7e)",color:"#fff",border:"none",borderRadius:6,padding:"10px",fontWeight:600,fontSize:13,cursor:"pointer"}}>
            📤 Send via WhatsApp
          </button>
          <button onClick={onClose} style={{background:t.input,color:t.txt,border:`1px solid ${t.border}`,borderRadius:6,padding:"10px 16px",fontWeight:600,fontSize:13,cursor:"pointer"}}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Landing ───────────────────────────────────────────────────────────────────
function Landing({dark,setDark,onGetStarted}){
  const[faqOpen,setFaqOpen]=useState(null);
  const[liveQ,setLiveQ]=useState("");
  const[activeBlog,setActiveBlog]=useState(null);
  const[blogQ,setBlogQ]=useState("");
  const t=th(dark);
  const filtered=BLOG_POSTS.filter(p=>!blogQ||p.title.toLowerCase().includes(blogQ.toLowerCase())||p.cat.toLowerCase().includes(blogQ.toLowerCase()));

  const scrollToSection=(id)=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth"});};

  if(activeBlog)return(
    <div style={{background:t.bg,minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif",color:t.txt}}>
      <nav style={{background:t.card,borderBottom:`1px solid ${t.border}`,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",height:64,position:"sticky",top:0,zIndex:200}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setActiveBlog(null)}>
          <span style={{fontSize:22}}>🛡️</span>
          <span style={{fontSize:16,fontWeight:700,color:t.txt}}>ScamShield</span>
        </div>
        <button onClick={()=>setDark(d=>!d)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18}}>{dark?"☀️":"🌙"}</button>
      </nav>
      <div style={{maxWidth:740,margin:"0 auto",padding:"3rem 1.25rem"}}>
        <button onClick={()=>setActiveBlog(null)} style={{background:t.input,border:`1px solid ${t.border}`,borderRadius:6,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:600,color:t.txt,marginBottom:24}}>← Back to Blog</button>
        <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,overflow:"hidden",boxShadow:t.glow}}>
          <div style={{background:dark?"#1e293b":"#f1f5f9",padding:"3rem",textAlign:"center",fontSize:52}}>{activeBlog.emoji}</div>
          <div style={{padding:"2.5rem"}}>
            <span style={{fontSize:11,fontWeight:700,color:t.primary,background:dark?"#1e293b":"#eff6ff",padding:"4px 12px",borderRadius:4}}>{activeBlog.cat}</span>
            <h1 style={{fontSize:24,fontWeight:800,margin:"16px 0",lineHeight:1.3}}>{activeBlog.title}</h1>
            <div style={{fontSize:15,lineHeight:1.8}}>
              {activeBlog.content.split('\n').map((l,i)=>{
                if(l.startsWith('## '))return<h2 key={i} style={{fontSize:19,fontWeight:700,margin:"24px 0 12px",color:t.txt}}>{l.slice(3)}</h2>;
                if(l.startsWith('**')&&l.endsWith('**'))return<p key={i} style={{fontWeight:700,margin:"14px 0 6px"}}>{l.slice(2,-2)}</p>;
                return l?<p key={i} style={{margin:"6px 0",color:t.txt2}}>{l}</p>:<br key={i}/>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{background:t.bg,minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif",color:t.txt}}>
      <nav style={{background:t.card,borderBottom:`1px solid ${t.border}`,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",height:64,position:"sticky",top:0,zIndex:200,boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🛡️</span>
          <span style={{fontSize:17,fontWeight:700,color:t.txt}}>ScamShield</span>
          <span style={{fontSize:10,background:t.primary,color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700}}>AI</span>
        </div>
        <div style={{display:"flex",gap:24,alignItems:"center"}}>
          <span onClick={()=>scrollToSection("features")} style={{fontSize:13,fontWeight:500,color:t.txt2,cursor:"pointer"}}>Features</span>
          <span onClick={()=>scrollToSection("blog")} style={{fontSize:13,fontWeight:500,color:t.txt2,cursor:"pointer"}}>Blog</span>
          <span onClick={()=>scrollToSection("faq")} style={{fontSize:13,fontWeight:500,color:t.txt2,cursor:"pointer"}}>FAQ</span>
          <span onClick={()=>scrollToSection("pricing")} style={{fontSize:13,fontWeight:500,color:t.txt2,cursor:"pointer"}}>Pricing</span>
          <button onClick={()=>setDark(d=>!d)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16}}>{dark?"☀️":"🌙"}</button>
          <button onClick={onGetStarted} style={{background:t.primaryGlow,color:"#fff",border:"none",borderRadius:6,padding:"8px 18px",fontWeight:600,fontSize:13,cursor:"pointer"}}>Get Started Free</button>
        </div>
      </nav>

      <section style={{position:"relative",overflow:"hidden",background:dark?"radial-gradient(circle at top right, rgba(37, 99, 235, 0.15), transparent), #090d16":"radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent), #f8fafc",padding:"100px 5% 100px",textAlign:"center",borderBottom:`1px solid ${t.border}`}}>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:dark?"linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)":"linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px)",backgroundSize:"30px 30px",pointerEvents:"none"}}/>
        <div style={{maxWidth:900,margin:"0 auto",position:"relative",zIndex:2}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:dark?"rgba(37, 99, 235, 0.15)":"rgba(37, 99, 235, 0.08)",border:`1px solid ${dark?"rgba(37, 99, 235, 0.3)":"rgba(37, 99, 235, 0.2)"}`,borderRadius:50,padding:"6px 16px",fontSize:12,fontWeight:600,color:dark?"#60a5fa":"#1d4ed8",marginBottom:28,boxShadow:"0 4px 12px rgba(37, 99, 235, 0.05)"}}>
            <span style={{width:8,height:8,background:"#10b981",borderRadius:"50%",display:"inline-block"}}/>
            🇵🇰 Pakistan's Professional AI Scam Detector
          </div>
          <h1 style={{fontSize:"clamp(32px, 5.5vw, 56px)",fontWeight:900,color:t.txt,lineHeight:1.15,margin:"0 0 24px",letterSpacing:"-1.5px"}}>
            Verify Before You Trust.<br/>
            <span style={{background:"linear-gradient(135deg, #3b82f6, #1d4ed8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Website • Person • Link</span>
          </h1>
          <p style={{fontSize:"clamp(15px, 2vw, 17px)",color:t.txt2,lineHeight:1.7,margin:"0 auto 48px",maxWidth:640,fontWeight:400}}>
            Instant risk assessment for any Pakistani platform, remote job opportunity, financial guru or suspicious link. Powered by intelligent threat analysis.
          </p>
          <div style={{position:"relative",maxWidth:680,margin:"0 auto 54px"}}>
            <div style={{position:"absolute",top:"-10px",left:"-10px",right:"-10px",bottom:"-10px",background:"linear-gradient(135deg, #2563eb, #3b82f6)",borderRadius:16,filter:"blur(25px)",opacity:dark?0.25:0.1,zIndex:1}}/>
            <Card3D style={{background:dark?"rgba(17, 24, 39, 0.85)":"rgba(255, 255, 255, 0.9)",backdropFilter:"blur(12px)",borderRadius:14,padding:"24px 28px",border:`1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(15,23,42,0.08)"}`,position:"relative",zIndex:2}} glow={dark?"0 25px 50px -12px rgba(0,0,0,0.7)":"0 25px 50px -12px rgba(15,23,42,0.1)"}>
              <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
                <div style={{position:"relative",flex:1,minWidth:240}}>
                  <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:16,color:t.txt2}}>🔗</span>
                  <input value={liveQ} onChange={e=>setLiveQ(e.target.value)} placeholder="Website URL, person name, job offer, WhatsApp link…"
                    style={{width:"100%",background:t.input,border:`1px solid ${t.border}`,borderRadius:8,padding:"14px 16px 14px 44px",fontSize:14,color:t.txt,outline:"none"}}/>
                </div>
                <button onClick={onGetStarted} style={{background:t.primaryGlow,color:"#fff",border:"none",borderRadius:8,padding:"0 32px",fontWeight:600,fontSize:14,cursor:"pointer",boxShadow:"0 4px 14px rgba(37, 99, 235, 0.4)",whiteSpace:"nowrap"}}>Verify Now 🔍</button>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                <span style={{fontSize:12,color:t.txt2,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>Examples:</span>
                {[{l:"🌐 Website",v:"earn5000perday.pk"},{l:"👤 Person",v:"Ahmed earning guru"},{l:"🔗 Link",v:"bit.ly/freemoney123"}].map((s,i)=>(
                  <span key={i} onClick={()=>setLiveQ(s.v)} style={{fontSize:12,padding:"6px 14px",borderRadius:6,background:dark?"rgba(255,255,255,0.04)":"#fff",color:t.txt,cursor:"pointer",border:`1px solid ${t.border}`,fontWeight:500}}>{s.l}</span>
                ))}
              </div>
            </Card3D>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:"40px 80px",flexWrap:"wrap",marginTop:20}}>
            {[["1,000+","Scam Checks","🚀"],["500+","Users Safe","🛡️"],["95%","AI Accuracy","🎯"]].map(([v,l,emo],i)=>(
              <div key={i} style={{textAlign:"center",background:dark?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.01)",padding:"14px 28px",borderRadius:10,border:`1px solid ${t.border}`,minWidth:160}}>
                <div style={{fontSize:20,marginBottom:4}}>{emo}</div>
                <div style={{fontSize:28,fontWeight:800,color:t.txt,letterSpacing:"-1px"}}>{v}</div>
                <div style={{fontSize:12,color:t.txt2,fontWeight:600,marginTop:2,textTransform:"uppercase",letterSpacing:"0.5px"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{background:t.card,padding:"20px 5%",borderBottom:`1px solid ${t.border}`}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"center",gap:40,flexWrap:"wrap"}}>
          {["✔ Enterprise Grade AI","✔ Up-to-date Scam DB","✔ Verified Link Checker","✔ Identity Verification"].map((tx,i)=>(
            <span key={i} style={{fontSize:12,fontWeight:600,color:t.txt2}}>{tx}</span>
          ))}
        </div>
      </section>

      <section id="features" style={{padding:60,background:t.bg}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <h2 style={{fontSize:28,fontWeight:700,margin:0}}>Verification Verticals</h2>
            <p style={{color:t.txt2,fontSize:14,marginTop:6}}>Comprehensive threat mapping across multiple categories</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
            {[
              {icon:"🌐",title:"Websites & Portals",desc:"Identify clone domains, phishing platforms, and unlicensed operational applications."},
              {icon:"👤",title:"Identity & Claims",desc:"Verify online coaches, self-proclaimed financial mentors, and remote entity credentials."},
              {icon:"🔗",title:"URL & Redirects",desc:"Deconstruct shortened links, tracking codes, and harmful browser redirects safely."},
              {icon:"💼",title:"Employment Offers",desc:"Sift out fraudulent data-entry projects, premium registration scams, and ghost listings."},
              {icon:"💰",title:"Investment Ventures",desc:"Analyze suspicious yield promises, closed group structures, and unverified pools."},
              {icon:"📱",title:"Communication Logs",desc:"Audit dynamic risk parameters within chat groups and bulk forward signals."}
            ].map((f,i)=>(
              <Card3D key={i} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,padding:24}} glow={t.glow}>
                <div style={{fontSize:28,marginBottom:16}}>{f.icon}</div>
                <h3 style={{fontSize:15,fontWeight:700,margin:"0 0 8px",color:t.txt}}>{f.title}</h3>
                <p style={{fontSize:13,color:t.txt2,lineHeight:1.6,margin:0}}>{f.desc}</p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" style={{padding:60,background:t.card,borderTop:`1px solid ${t.border}`,borderBottom:`1px solid ${t.border}`}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36,flexWrap:"wrap",gap:16}}>
            <div>
              <h2 style={{fontSize:26,fontWeight:700,margin:0}}>Security Bulletins</h2>
              <p style={{color:t.txt2,fontSize:14,marginTop:4}}>Recent analysis on financial cyber-threats in Pakistan</p>
            </div>
            <div style={{display:"flex",gap:8,background:t.input,border:`1px solid ${t.border}`,borderRadius:6,padding:"8px 14px",alignItems:"center",width:260}}>
              <span>🔍</span>
              <input value={blogQ} onChange={e=>setBlogQ(e.target.value)} placeholder="Search repository…" style={{border:"none",outline:"none",background:"transparent",fontSize:13,color:t.txt,width:"100%"}}/>
            </div>
          </div>
          <AdBanner/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20,marginTop:24}}>
            {filtered.map(p=>(
              <Card3D key={p.id} style={{background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer"}} glow={t.glow}>
                <div onClick={()=>setActiveBlog(p)}>
                  <div style={{background:dark?"#1e293b":"#f1f5f9",padding:24,textAlign:"center",fontSize:36}}>{p.emoji}</div>
                  <div style={{padding:20}}>
                    <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                      <span style={{fontSize:10,fontWeight:700,color:t.primary,background:dark?"#1e293b":"#eff6ff",padding:"2px 8px",borderRadius:4}}>{p.cat}</span>
                      <span style={{fontSize:12,color:t.txt2}}>{p.read}</span>
                    </div>
                    <h3 style={{fontSize:14,fontWeight:700,margin:"0 0 8px",lineHeight:1.4}}>{p.title}</h3>
                    <p style={{fontSize:13,color:t.txt2,lineHeight:1.5,margin:"0 0 16px"}}>{p.desc}</p>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${t.border}`,paddingTop:12}}>
                      <span style={{fontSize:11,color:t.txt2}}>{p.date}</span>
                      <span style={{fontSize:13,color:t.primary,fontWeight:600}}>Read Article →</span>
                    </div>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" style={{padding:60,background:t.bg}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <h2 style={{fontSize:26,fontWeight:700,margin:0}}>Frequently Asked Questions</h2>
          </div>
          {FAQS.map((f,i)=>(
            <div key={i} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:6,marginBottom:10,overflow:"hidden"}}>
              <div onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,fontWeight:600,color:t.txt}}>{f.q}</span>
                <span style={{fontSize:16,color:t.primary}}>{faqOpen===i?"−":"+"}</span>
              </div>
              {faqOpen===i&&<div style={{padding:"0 20px 16px",fontSize:13,color:t.txt2,lineHeight:1.6,borderTop:`1px solid ${t.border}`,paddingTop:12}}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{padding:60,background:t.card,borderTop:`1px solid ${t.border}`}}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <h2 style={{fontSize:26,fontWeight:700,margin:0}}>Service Tiers</h2>
          <p style={{color:t.txt2,fontSize:14,marginTop:6,marginBottom:40}}>Predictable pricing scaling with your screening volume</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20,maxWidth:840,margin:"0 auto"}}>
            {[
              {name:"Standard Tier",price:"$0",features:[`${FREE_LIMIT} requests/day`,"Core heuristics","All analysis portals","10 record history"],color:"#64748b",popular:false},
              {name:"Premium Tier",price:"$10",features:["Unlimited requests","Full AI technical report","Advanced asset checking","Complete archival trail","Analytical summaries","Priority infrastructure infrastructure"],color:t.primary,popular:true},
              {name:"Enterprise",price:"$25",features:["Everything in Premium","Direct API endpoints","5 active seats","Custom logs","Dedicated support manager"],color:"#0f172a",popular:false},
            ].map((p,i)=>(
              <Card3D key={i} style={{background:t.bg,border:p.popular?`2px solid ${t.primary}`:`1px solid ${t.border}`,borderRadius:8,padding:24,position:"relative",textAlign:"left"}} glow={t.glow}>
                {p.popular&&<div style={{position:"absolute",top:-12,left:20,background:t.primary,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:4}}>RECOMMENDED</div>}
                <div style={{fontSize:14,fontWeight:600,color:p.color,marginBottom:8}}>{p.name}</div>
                <div style={{fontSize:32,fontWeight:700,color:t.txt,margin:"0 0 20px"}}>{p.price}<span style={{fontSize:14,color:t.txt2,fontWeight:400}}>/mo</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:10,minHeight:180}}>
                  {p.features.map((f,j)=><div key={j} style={{fontSize:13,display:"flex",gap:8,alignItems:"flex-start",color:t.txt2}}><span style={{color:p.color,fontWeight:"bold"}}>✓</span>{f}</div>)}
                </div>
                <button onClick={onGetStarted} style={{width:"100%",marginTop:24,background:p.popular?t.primaryGlow:(dark?"#1e293b":"#e2e8f0"),color:p.popular?"#fff":t.txt,border:"none",borderRadius:6,padding:"10px",cursor:"pointer",fontWeight:600,fontSize:13}}>
                  {p.name==="Standard Tier"?"Get Started":p.name==="Enterprise"?"Contact Sales":"Upgrade Now"}
                </button>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"60px 5%",background:dark?"#1e293b":"#0f172a",textAlign:"center",color:"#fff"}}>
        <h2 style={{fontSize:28,fontWeight:700,margin:"0 0 12px"}}>Enhance Your Operational Safety</h2>
        <p style={{color:"#94a3b8",fontSize:15,margin:"0 0 24px"}}>Protect your professional and personal assets from digital vulnerability.</p>
        <button onClick={onGetStarted} style={{background:"#fff",color:"#0f172a",border:"none",borderRadius:6,padding:"12px 32px",fontWeight:600,fontSize:14,cursor:"pointer"}}>Get Started Free</button>
      </section>

      <footer style={{background:dark?"#0b0f19":"#0f172a",color:"#94a3b8",padding:"48px 5% 24px",borderTop:`1px solid ${t.border}`}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:32,marginBottom:40}}>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:12}}>🛡️ ScamShield AI</div>
              <div style={{fontSize:12,lineHeight:1.6}}>Automated security audits and validation interfaces for localized digital landscapes.</div>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:12}}>Platform</div>
              <div onClick={()=>scrollToSection("features")} style={{fontSize:12,marginBottom:8,cursor:"pointer"}}>Features</div>
              <div onClick={()=>scrollToSection("blog")} style={{fontSize:12,marginBottom:8,cursor:"pointer"}}>Blog</div>
              <div onClick={()=>scrollToSection("pricing")} style={{fontSize:12,marginBottom:8,cursor:"pointer"}}>Pricing</div>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:12}}>Compliance</div>
              {["Privacy Policy","Terms of Service","Disclaimer"].map(l=><div key={l} style={{fontSize:12,marginBottom:8,cursor:"pointer"}}>{l}</div>)}
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:12}}>Partnership</div>
              <div style={{fontSize:12,marginBottom:12,lineHeight:1.5}}>Earn 30% baseline revenue share recurring. Paid monthly.</div>
              <button onClick={onGetStarted} style={{background:t.primaryGlow,color:"#fff",border:"none",borderRadius:4,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>Affiliate Portal</button>
            </div>
          </div>
          <div style={{borderTop:dark?"1px solid #1f2937":"1px solid #1e293b",paddingTop:20,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,fontSize:12}}>
            <div>© 2026 ScamShield. All rights reserved.</div>
            <div>Securing Pakistan 🇵🇰</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── REAL SUPABASE AUTHENTICATION COMPONENT ────────────────────────────────────
function Auth({dark,onAuth,onBack}){
  const[mode,setMode]=useState("login");
  const[form,setForm]=useState({name:"",email:"",password:"",confirm:""});
  const[err,setErr]=useState("");
  const[loading,setLoading]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  
  async function submit(){
    setErr("");
    if(mode==="signup"){
      if(!form.name.trim()) return setErr("Full name required.");
      if(form.password !== form.confirm) return setErr("Passwords mismatch.");
    }
    if(!form.email.includes("@")) return setErr("Valid email required.");
    if(form.password.length < 6) return setErr("Minimum 6 characters required.");
    
    setLoading(true);
    
    try {
      if (mode === "signup") {
        // Asli Supabase Sign Up Call
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.name
            }
          }
        });
        if (error) throw error;
        alert("Registration Successful! Please check your email inbox/spam for the validation link.");
        setMode("login");
      } else {
        // Asli Supabase Sign In Call
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        
        // Custom object matching dashboard expectation
        onAuth({
          name: data.user.user_metadata?.full_name || data.user.email.split("@")[0],
          email: data.user.email,
          plan: "free",
          checksToday: 0
        });
      }
    } catch(error) {
      setErr(error.message || "Authentication process failed.");
    } finally {
      setLoading(false);
    }
  }

  return(
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,-apple-system,sans-serif",padding:16}}>
      <div style={{width:"100%",maxWidth:400}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",borderRadius:4,padding:"6px 14px",fontSize:12,cursor:"pointer",marginBottom:24,fontWeight:500}}>← Access Portal</button>
        <div style={{background:"#fff",borderRadius:8,padding:"2.5rem",boxShadow:"0 20px 40px rgba(0,0,0,.3)"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <span style={{fontSize:32}}>🛡️</span>
            <h2 style={{fontSize:20,fontWeight:700,color:"#0f172a",margin:"8px 0 4px"}}>ScamShield Registry</h2>
          </div>
          <div style={{display:"flex",background:"#f1f5f9",borderRadius:6,padding:3,marginBottom:20}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"6px",border:"none",borderRadius:4,fontWeight:600,fontSize:12,cursor:"pointer",background:mode===m?"#2563eb":"transparent",color:mode===m?"#fff":"#475569"}}>
                {m==="login"?"Sign In":"Sign Up"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {mode==="signup"&&<input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Full Name" style={{border:"1px solid #cbd5e1",borderRadius:6,padding:"10px 12px",fontSize:13,outline:"none",color:"#0f172a"}}/>}
            <input value={form.email} onChange={e=>set("email",e.target.value)} type="email" placeholder="Email Address" style={{border:"1px solid #cbd5e1",borderRadius:6,padding:"10px 12px",fontSize:13,outline:"none",color:"#0f172a"}}/>
            <input value={form.password} onChange={e=>set("password",e.target.value)} type="password" placeholder="Password" style={{border:"1px solid #cbd5e1",borderRadius:6,padding:"10px 12px",fontSize:13,outline:"none",color:"#0f172a"}}/>
            {mode==="signup"&&<input value={form.confirm} onChange={e=>set("confirm",e.target.value)} type="password" placeholder="Confirm Password" style={{border:"1px solid #cbd5e1",borderRadius:6,padding:"10px 12px",fontSize:13,outline:"none",color:"#0f172a"}}/>}
            {err&&<div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:4,padding:"8px 12px",fontSize:12,color:"#dc2626"}}>⚠️ {err}</div>}
            <button onClick={submit} disabled={loading} style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:6,padding:"11px",fontWeight:600,fontSize:13,cursor:"pointer"}}>
              {loading?"Processing…":mode==="login"?"Sign In":"Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({user,dark,setDark,onLogout}){
  const[page,setPage]=useState("checker");
  const[query,setQuery]=useState("");
  const[result,setResult]=useState(null);
  const[loading,setLoading]=useState(false);
  const[history,setHistory]=useState([
    {input:"earn5000perday.pk",type:"🌐",result:"FAKE",confidence:96,date:"Jun 17"},
    {input:"Fiverr.com",type:"🌐",result:"REAL",confidence:99,date:"Jun 16"},
    {input:"Ahmed earning guru Lahore",type:"👤",result:"FAKE",confidence:88,date:"Jun 15"},
    {input:"bit.ly/freecash2026",type:"🔗",result:"FAKE",confidence:94,date:"Jun 14"},
    {input:"Upwork.com",type:"🌐",result:"REAL",confidence:98,date:"Jun 13"},
  ]);
  const[showUpgrade,setShowUpgrade]=useState(false);
  const[notif,setNotif]=useState(null);
  const[sidebar,setSidebar]=useState(true);
  const[faqOpen,setFaqOpen]=useState(null);
  const[blogQ,setBlogQ]=useState("");
  const[activeBlog,setActiveBlog]=useState(null);
  const[checksUsed,setChecksUsed]=useState(user?.checksToday||0);
  const[billingModal,setBillingModal]=useState(null);

  const[affiliateMetrics,setAffiliateMetrics]=useState({
    code:"SECURE"+(user?.name?.toUpperCase()||"USER")+"30",
    clicks:142,
    signups:24,
    conversions:5,
    earningsPending:1400,
    earningsPaid:4200,
  });
  const[payoutDetails,setPayoutDetails]=useState({method:"easypaisa",account:"",name:""});

  const t=th(dark);
  const checksLeft=Math.max(0,FREE_LIMIT-checksUsed);
  const vs=verdictStyle(dark);
  const fakeCount=history.filter(h=>h.result==="FAKE").length;
  const realCount=history.filter(h=>h.result==="REAL").length;
  const filtered=BLOG_POSTS.filter(p=>!blogQ||p.title.toLowerCase().includes(blogQ.toLowerCase())||p.cat.toLowerCase().includes(blogQ.toLowerCase()));

  function showNotif(msg,color="#107c41"){setNotif({msg,color});setTimeout(()=>setNotif(null),3000);}

async function analyzeScam() {
  if (!query.trim()) return;
  if (user.plan === "free" && checksLeft <= 0) { showUpgrade(true); return; }
  
  setLoading(true);
  setResult(null);

  try {
    const response = await fetch("/api/verify-scam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query, userEmail: user.email })
    });

    const data = await response.json();
    
    if (data.success) {
      setResult(data.analysis);
      setHistory(h => [data.newLog, ...h.slice(0, 19)]);
      setChecksUsed(c => c + 1);
    } else {
      showNotif("System diagnosis failed. Try again.", "#df2c47");
    }
  } catch (error) {
    showNotif("Network optimization timeout.", "#df2c47");
  } finally {
    setLoading(false);
  }
}

const navItems = [
  { id: "checker", icon: "🔍", label: "Audit Engine" },
  { id: "dashboard", icon: "📊", label: "Telemetry Panel" },
  { id: "history", icon: "📋", label: "Audit History" },
  { id: "blog", icon: "📝", label: "Bulletins" },
  { id: "pricing", icon: "💎", label: "Subscription" },
  { id: "faq", icon: "❓", label: "Help Desk" },
  { id: "affiliate", icon: "💰", label: "Partner Network" },
  { id: "privacy", icon: "🔒", label: "Data Policy" },
];

if (user?.email === "mfaheem904702@gmail.com") {
  if (!navItems.some(n => n.id === "admin")) {
    navItems.splice(6, 0, { id: "admin", icon: "⚙️", label: "Root System" });
  }
}

  return(
    <div style={{display:"flex",minHeight:"100vh",background:t.bg,fontFamily:"system-ui,-apple-system,sans-serif",color:t.txt,position:"relative"}}>
      {notif&&<div style={{position:"fixed",top:16,right:16,zIndex:9999,background:notif.color,color:"#fff",borderRadius:4,padding:"10px 18px",fontWeight:600,fontSize:13,boxShadow:"0 4px 12px rgba(0,0,0,.1)"}}>{notif.msg}</div>}
      {billingModal&&<BillingModal plan={billingModal.plan} price={billingModal.price} dark={dark} onClose={()=>setBillingModal(null)}/>}

      <div style={{width:sidebar?230:56,background:dark?"#111827":"#ffffff",borderRight:`1px solid ${t.border}`,display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",transition:"width .18s ease-in-out",overflow:"hidden",flexShrink:0,zIndex:10}}>
        <div style={{padding:"0 1rem",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:8,height:60,minHeight:60}}>
          <span style={{fontSize:20}}>🛡️</span>
          {sidebar&&<span style={{fontSize:15,fontWeight:700,color:t.txt}}>ScamShield Core</span>}
          <button onClick={()=>setSidebar(o=>!o)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:t.txt2,fontSize:11}}>{sidebar?"◀":"▶"}</button>
        </div>
        <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
          {navItems.map(n=>(
            <div key={n.id} onClick={()=>{setPage(n.id);setActiveBlog(null);}} title={n.label}
              style={{display:"flex",alignItems:"center",gap:12,padding:sidebar?"10px 1rem":"12px",cursor:"pointer",background:page===n.id?t.input:"transparent",color:page===n.id?t.primary:t.txt2,fontWeight:page===n.id?600:500,fontSize:13,borderLeft:page===n.id?`3px solid ${t.primary}`:"3px solid transparent",whiteSpace:"nowrap"}}>
              <span style={{fontSize:16,flexShrink:0}}>{n.icon}</span>
              {sidebar&&n.label}
            </div>
          ))}
        </nav>
        <div style={{padding:"1rem",borderTop:`1px solid ${t.border}`}}>
          {sidebar?(
            <>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{width:28,height:28,background:t.primary,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:600,fontSize:11}}>{user?.name ? user.name[0].toUpperCase() : "U"}</div>
                <div style={{overflow:"hidden"}}><div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div><div style={{fontSize:11,color:t.primary,fontWeight:600}}>Standard Tier · {checksLeft} left</div></div>
              </div>
              <button onClick={()=>setDark(d=>!d)} style={{width:"100%",background:t.input,border:`1px solid ${t.border}`,borderRadius:4,padding:"6px",fontSize:11,cursor:"pointer",color:t.txt,marginBottom:6}}>{dark?"☀️ Light Display":"🌙 Dark Display"}</button>
              <button onClick={onLogout} style={{width:"100%",background:"transparent",border:"1px solid #cbd5e1",borderRadius:4,padding:"6px",fontSize:11,cursor:"pointer",color:"#dc2626",fontWeight:500}}>Exit Session</button>
            </>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"center"}}>
              <div style={{width:24,height:24,background:t.primary,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:600,fontSize:10}}>{user?.name ? user.name[0].toUpperCase() : "U"}</div>
              <button onClick={()=>setDark(d=>!d)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12}}>{dark?"☀️":"🌙"}</button>
            </div>
          )}
        </div>
      </div>

      <div style={{flex:1,overflow:"auto",minWidth:0}}>
        <div style={{background:t.card,borderBottom:`1px solid ${t.border}`,padding:"0 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,position:"sticky",top:0,zIndex:5}}>
          <span style={{fontSize:13,color:t.txt2}}>Operator: <strong style={{color:t.txt}}>{user.name}</strong></span>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <span style={{fontSize:11,background:dark?"#1e293b":"#f1f5f9",color:t.txt2,padding:"4px 10px",borderRadius:4,fontWeight:600,border:`1px solid ${t.border}`}}>Quota: {checksLeft}/{FREE_LIMIT} requests</span>
            <button onClick={()=>setPage("pricing")} style={{fontSize:11,background:t.primaryGlow,color:"#fff",border:"none",borderRadius:4,padding:"6px 14px",cursor:"pointer",fontWeight:600}}>Upgrade Seat</button>
          </div>
        </div>

        {/* ── CHECKER ── */}
        {page==="checker"&&(
          <div style={{padding:"2rem 1.5rem",maxWidth:760}}>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 6px",color:t.txt}}>Automated Threat Screening</h1>
            <p style={{color:t.txt2,fontSize:14,margin:"0 0 20px"}}>Input structured identifiers or communications records to parse vector metrics.</p>
            <Card3D style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,padding:20,marginBottom:20}} glow={t.glow}>
              <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
                <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyzeScam()} placeholder="Enter domain signature, candidate name, or reference text..."
                  style={{flex:1,minWidth:180,border:`1px solid ${t.border}`,borderRadius:6,padding:"12px 14px",fontSize:13,outline:"none",background:t.input,color:t.txt}}/>
                <button onClick={analyzeScam} disabled={loading} style={{background:loading?"#64748b":t.primaryGlow,color:"#fff",border:"none",borderRadius:6,padding:"0 24px",cursor:"pointer",fontWeight:600,fontSize:13,whiteSpace:"nowrap"}}>
                  {loading?"Auditing...":"Run Diagnostic"}
                </button>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <span style={{fontSize:12,color:t.txt2,fontWeight:500}}>Repository Indexes:</span>
                {["earn500.pk","Ahmed earning guru","Fiverr.com","WhatsApp 100% profit"].map((s,i)=>(
                  <span key={i} onClick={()=>setQuery(s)} style={{fontSize:11,padding:"3px 10px",borderRadius:4,background:t.input,border:`1px solid ${t.border}`,cursor:"pointer",color:t.txt2}}>{s}</span>
                ))}
              </div>
            </Card3D>
            {loading&&<Card3D style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,padding:40,textAlign:"center"}} glow={t.glow}>
              <div style={{fontSize:32,marginBottom:12}}>🤖</div>
              <div style={{fontWeight:700,fontSize:15,color:t.txt}}>Deconstructing Signature Matrix...</div>
              <div style={{color:t.txt2,fontSize:12,marginTop:4}}>Executing contextual analytics and lookup routines</div>
            </Card3D>}
            {result&&!loading&&(()=>{
              const v=vs[result.verdict];
              const typeLabel=result.checkType==="person"?"Personnel Record Check":result.checkType==="link"?"URL Signature Mapping":"Platform Domain Audit";
              return(
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  <Card3D style={{background:v.bg,border:`1px solid ${v.border}`,borderRadius:8,padding:24}} glow={t.glow}>
                    <div style={{fontSize:10,fontWeight:700,color:v.color,background:dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.03)",padding:"3px 8px",borderRadius:4,display:"inline-block",marginBottom:14,border:`1px solid ${v.border}`}}>{typeLabel}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                      <div>
                        <div style={{fontSize:20,fontWeight:700,color:v.color}}>{v.emoji} {v.label}</div>
                        {result.summary&&<div style={{fontSize:14,color:t.txt,marginTop:8,lineHeight:1.5,maxWidth:480}}>{result.summary}</div>}
                      </div>
                      <div style={{textAlign:"center",flexShrink:0,background:dark?"#111827":"#fff",border:`1px solid ${v.border}`,borderRadius:6,padding:"10px 16px"}}>
                        <div style={{fontSize:24,fontWeight:700,color:v.color}}>{result.confidence}%</div>
                        <div style={{fontSize:10,color:t.txt2}}>Confidence Score</div>
                      </div>
                    </div>
                    {result.reasons.length>0&&<div style={{marginBottom:14}}>{result.reasons.map((r,i)=><div key={i} style={{fontSize:13,padding:"8px 12px",borderRadius:4,marginBottom:6,background:dark?"#111827":"#fff",borderLeft:`3px solid ${v.color}`,color:t.txt}}>{r}</div>)}</div>}
                    {result.safe.length>0&&<div style={{marginBottom:10}}>{result.safe.map((s,i)=><div key={i} style={{fontSize:13,color:"#107c41"}}>✅ {s}</div>)}</div>}
                    {result.warning&&<div style={{background:dark?"#1f2937":"#f8fafc",borderRadius:6,padding:12,fontSize:13,borderLeft:`3px solid ${t.primary}`,marginTop:12,color:t.txt2}}>💡 <strong>Deployment Protocol:</strong> {result.warning}</div>}
                  </Card3D>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>{setQuery("");setResult(null);}} style={{background:t.input,color:t.txt,border:`1px solid ${t.border}`,borderRadius:6,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:600}}>Clear Pipeline</button>
                    <button onClick={()=>showNotif("Exported vector data token to clipboard.")} style={{background:t.primaryGlow,color:"#fff",border:"none",borderRadius:6,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:600}}>Export Diagnostics</button>
                  </div>
                </div>
              );
            })()}
            {showUpgrade&&<Card3D style={{background:t.card,border:`1px solid ${t.primary}`,borderRadius:8,padding:24,textAlign:"center",marginTop:16}} glow={t.glow}>
              <div style={{fontSize:28,marginBottom:8}}>🚀</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Operational Ceiling Reached</div>
              <div style={{color:t.txt2,fontSize:13,margin:"0 0 16px"}}>Standard limits exhausted. Deploy extended license modules.</div>
              <button onClick={()=>{setShowUpgrade(false);setPage("pricing");}} style={{background:t.primaryGlow,color:"#fff",border:"none",borderRadius:6,padding:"10px 24px",cursor:"pointer",fontWeight:600,fontSize:13}}>Acquire Production Seat</button>
            </Card3D>}
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {page==="dashboard"&&(
          <div style={{padding:"1.5rem"}}>
            <h1 style={{fontSize:18,fontWeight:700,margin:"0 0 20px"}}>System Metrics & Analytics</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:20}}>
              {[{label:"Aggregated Audits",value:history.length,icon:"🔍",color:t.primary,bg:t.card},{label:"Threat Signatures Identified",value:fakeCount,icon:"⛔",color:"#df2c47",bg:t.card},{label:"Whitelisted Logs",value:realCount,icon:"✅",color:"#107c41",bg:t.card},{label:"Remaining Computes",value:`${checksLeft}/${FREE_LIMIT}`,icon:"⚡",color:"#b76e00",bg:t.card}].map((s,i)=>(
                <Card3D key={i} style={{background:s.bg,borderRadius:6,padding:16,border:`1px solid ${t.border}`}} glow={t.glow}>
                  <div style={{fontSize:18}}>{s.icon}</div>
                  <div style={{fontSize:24,fontWeight:700,color:s.color,margin:"6px 0 2px"}}>{s.value}</div>
                  <div style={{fontSize:11,color:t.txt2,fontWeight:500}}>{s.label}</div>
                </Card3D>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,padding:20}}>
                <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700}}>Recent Operations</h3>
                {history.slice(0,5).map((h,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<4?`1px solid ${t.border}`:"none"}}>
                    <div><div style={{fontSize:13,fontWeight:600}}>{h.type} {h.input.length>22?h.input.slice(0,22)+"…":h.input}</div><div style={{fontSize:11,color:t.txt2}}>{h.date}</div></div>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:h.result==="FAKE"?"#fdf2f4":h.result==="REAL"?"#f0f9f4":"#fdf8ee",color:h.result==="FAKE"?"#df2c47":h.result==="REAL"?"#107c41":"#b76e00"}}>{h.result}</span>
                  </div>
                ))}
              </div>
              <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,padding:20}}>
                <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700}}>Vector Distribution</h3>
                {[{label:"Scam / Malicious Factor",pct:history.length?Math.round(fakeCount/history.length*100):0,color:"#df2c47"},{label:"Legitimate / Clean Factor",pct:history.length?Math.round(realCount/history.length*100):0,color:"#107c41"}].map((s,i)=>(
                  <div key={i} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}><span style={{color:t.txt2}}>{s.label}</span><span style={{fontWeight:700,color:s.color}}>{s.pct}%</span></div>
                    <div style={{background:t.input,borderRadius:4,height:6}}><div style={{width:`${s.pct}%`,height:"100%",background:s.color,borderRadius:4}}/></div>
                  </div>
                ))}
                <div style={{marginTop:20,background:t.input,border:`1px solid ${t.border}`,borderRadius:6,padding:16,textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:600,marginBottom:8,color:t.txt}}>Unlock Complete Analytical Logs</div>
                  <button onClick={()=>setPage("pricing")} style={{background:t.primaryGlow,color:"#fff",border:"none",borderRadius:4,padding:"6px 14px",fontSize:11,fontWeight:600,cursor:"pointer"}}>View Commercial Licenses</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {page==="history"&&(
          <div style={{padding:"1.5rem"}}>
            <h1 style={{fontSize:18,fontWeight:700,margin:"0 0 16px"}}>Audit Archive Log</h1>
            <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"40px 1fr 100px 80px 100px",padding:"12px 16px",background:t.input,borderBottom:`1px solid ${t.border}`,fontSize:11,fontWeight:700,color:t.txt2,textTransform:"uppercase"}}>
                <span>Type</span><span>Query Pipeline</span><span>Verdict</span><span>Confidence</span><span>Timestamp</span>
              </div>
              {history.map((h,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"40px 1fr 100px 80px 100px",padding:"12px 16px",borderBottom:i<history.length-1?`1px solid ${t.border}`:"none",alignItems:"center"}}>
                  <span style={{fontSize:16}}>{h.type}</span>
                  <span style={{fontSize:13,fontWeight:600,color:t.txt}}>{h.input}</span>
                  <div><span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:h.result==="FAKE"?"#fdf2f4":h.result==="REAL"?"#f0f9f4":"#fdf8ee",color:h.result==="FAKE"?"#df2c47":h.result==="REAL"?"#107c41":"#b76e00"}}>{h.result}</span></div>
                  <span style={{fontSize:12,color:t.txt2}}>{h.confidence}%</span>
                  <span style={{fontSize:12,color:t.txt2}}>{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BLOG ── */}
        {page==="blog"&&(
          <div style={{padding:"1.5rem"}}>
            {activeBlog?(
              <div style={{maxWidth:740}}>
                <button onClick={()=>setActiveBlog(null)} style={{background:t.input,border:`1px solid ${t.border}`,borderRadius:6,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:600,color:t.txt,marginBottom:24}}>← Back</button>
                <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{background:dark?"#1e293b":"#f1f5f9",padding:"2rem",textAlign:"center",fontSize:48}}>{activeBlog.emoji}</div>
                  <div style={{padding:"2rem"}}>
                    <span style={{fontSize:11,fontWeight:700,color:t.primary,background:dark?"#1e293b":"#eff6ff",padding:"4px 12px",borderRadius:4}}>{activeBlog.cat}</span>
                    <h1 style={{fontSize:20,fontWeight:800,margin:"16px 0",lineHeight:1.3}}>{activeBlog.title}</h1>
                    <div style={{fontSize:14,lineHeight:1.8}}>
                      {activeBlog.content.split('\n').map((l,i)=>{
                        if(l.startsWith('## '))return<h2 key={i} style={{fontSize:17,fontWeight:700,margin:"20px 0 10px",color:t.txt}}>{l.slice(3)}</h2>;
                        if(l.startsWith('**')&&l.endsWith('**'))return<p key={i} style={{fontWeight:700,margin:"12px 0 4px"}}>{l.slice(2,-2)}</p>;
                        return l?<p key={i} style={{margin:"6px 0",color:t.txt2}}>{l}</p>:<br key={i}/>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ):(
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
                  <h1 style={{fontSize:18,fontWeight:700,margin:0}}>Security Bulletins</h1>
                  <div style={{display:"flex",gap:8,background:t.input,border:`1px solid ${t.border}`,borderRadius:6,padding:"6px 12px",alignItems:"center"}}>
                    <span>🔍</span>
                    <input value={blogQ} onChange={e=>setBlogQ(e.target.value)} placeholder="Search…" style={{border:"none",outline:"none",background:"transparent",fontSize:13,color:t.txt,width:160}}/>
                  </div>
                </div>
                <AdBanner/>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginTop:20}}>
                  {filtered.map(p=>(
                    <Card3D key={p.id} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer"}} glow={t.glow}>
                      <div onClick={()=>setActiveBlog(p)}>
                        <div style={{background:dark?"#1e293b":"#f1f5f9",padding:20,textAlign:"center",fontSize:32}}>{p.emoji}</div>
                        <div style={{padding:16}}>
                          <span style={{fontSize:10,fontWeight:700,color:t.primary,background:dark?"#1e293b":"#eff6ff",padding:"2px 6px",borderRadius:4}}>{p.cat}</span>
                          <h3 style={{fontSize:13,fontWeight:700,margin:"8px 0 4px",lineHeight:1.4}}>{p.title}</h3>
                          <p style={{fontSize:12,color:t.txt2,lineHeight:1.5,margin:"0 0 12px"}}>{p.desc}</p>
                          <div style={{fontSize:11,color:t.primary,fontWeight:600,textAlign:"right"}}>Read Module →</div>
                        </div>
                      </div>
                    </Card3D>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── PRICING ── */}
        {page==="pricing"&&(
          <div style={{padding:"1.5rem"}}>
            <h1 style={{fontSize:18,fontWeight:700,margin:"0 0 20px"}}>Seat Licensing Structure</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:16,maxWidth:840,marginBottom:24}}>
              {[
                {name:"Standard Tier",price:"$0",pkr:"Free",color:"#64748b",features:[`${FREE_LIMIT} requests/day`,"All portals active","Basic parsing metrics","10 index archival memory"],cta:"Current License Active",disabled:true,popular:false},
                {name:"Premium Tier",price:"$10",pkr:"Rs. 2,800",color:t.primary,features:["Unlimited checks","Total cross-vertical access","Detailed diagnostic reporting","Infinite archival trail","Export configurations","Priority infrastructure lane"],cta:"Acquire Premium Seat",disabled:false,popular:true},
                {name:"Enterprise Plan",price:"$25",pkr:"Rs. 7,000",color:"#0f172a",features:["All features in Premium","Direct API endpoints access","5 managed staff seats","White-label outputs","Dedicated engineer account"],cta:"Contact Infrastructure Sales",disabled:false,popular:false}
              ].map((p,i)=>(
                <Card3D key={i} style={{background:t.card,border:p.popular?`2px solid ${t.primary}`:`1px solid ${t.border}`,borderRadius:8,padding:20,position:"relative"}    } glow={t.glow}>
                  {p.popular&&<div style={{position:"absolute",top:-11,left:16,background:t.primary,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4}}>PRODUCTION MINIMUM</div>}
                  <div style={{fontSize:14,fontWeight:700,color:p.color,marginBottom:6}}>{p.name}</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:2,marginBottom:4}}><span style={{fontSize:28,fontWeight:700}}>{p.price}</span><span style={{fontSize:12,color:t.txt2}}>/month</span></div>
                  <div style={{fontSize:11,color:t.txt2,marginBottom:16}}>Pakistan: {p.pkr}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,minHeight:150}}>
                    {p.features.map((f,j)=><div key={j} style={{fontSize:12,display:"flex",gap:6,color:t.txt2}}><span style={{color:p.color,fontWeight:"bold"}}>✓</span>{f}</div>)}
                  </div>
                  <button
                    disabled={p.disabled}
                    onClick={()=>{
                      if(p.disabled)return;
                      setBillingModal({plan:p.name,price:`${p.price} (${p.pkr})`});
                    }}
                    style={{width:"100%",marginTop:16,background:p.disabled?t.input:p.popular?t.primaryGlow:dark?"#1e293b":"#0f172a",color:p.disabled?t.txt2:"#fff",border:"none",borderRadius:6,padding:"10px",cursor:p.disabled?"default":"pointer",fontWeight:600,fontSize:13}}
                  >{p.cta}</button>
                </Card3D>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {page==="faq"&&(
          <div style={{padding:"1.5rem",maxWidth:700}}>
            <h1 style={{fontSize:18,fontWeight:700,margin:"0 0 20px"}}>Help Desk</h1>
            {FAQS.map((f,i)=>(
              <div key={i} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:6,marginBottom:10,overflow:"hidden"}}>
                <div onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:14,fontWeight:600,color:t.txt}}>{f.q}</span>
                  <span style={{fontSize:16,color:t.primary}}>{faqOpen===i?"−":"+"}</span>
                </div>
                {faqOpen===i&&<div style={{padding:"0 20px 16px",fontSize:13,color:t.txt2,lineHeight:1.6,borderTop:`1px solid ${t.border}`,paddingTop:12}}>{f.a}</div>}
              </div>
            ))}
          </div>
        )}

        {/* ── ADMIN ── */}
        {page==="admin"&&(
          <div style={{padding:"1.5rem"}}>
            <h1 style={{fontSize:18,fontWeight:700,margin:"0 0 20px"}}>Root Management Operations</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,marginBottom:20}}>
              {[{label:"Registered Nodes",value:"1,247",icon:"👥",color:t.primary},{label:"Active Premiums",value:"89",icon:"💎",color:"#b76e00"},{label:"Gross MRR",value:"$890",icon:"💰",color:"#107c41"},{label:"System Computes",value:"34,821",icon:"🔍",color:"#df2c47"}].map((s,i)=>(
                <Card3D key={i} style={{background:t.card,borderRadius:6,padding:16,border:`1px solid ${t.border}`}} glow={t.glow}>
                  <div style={{fontSize:18}}>{s.icon}</div>
                  <div style={{fontSize:22,fontWeight:700,color:s.color,margin:"6px 0 2px"}}>{s.value}</div>
                  <div style={{fontSize:11,color:t.txt2,fontWeight:500}}>{s.label}</div>
                </Card3D>
              ))}
            </div>
            <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,padding:20}}>
              <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700}}>Pending Payouts</h3>
              <div style={{fontSize:13,color:t.txt2,padding:"20px",textAlign:"center",border:`1px dashed ${t.border}`,borderRadius:6}}>
                No pending payout requests at this time.
              </div>
            </div>
          </div>
        )}

        {/* ── AFFILIATE ── */}
        {page==="affiliate"&&(
          <div style={{padding:"1.5rem",maxWidth:860}}>
            <h1 style={{fontSize:18,fontWeight:700,margin:"0 0 6px"}}>Partner Network Portal</h1>
            <p style={{color:t.txt2,fontSize:13,margin:"0 0 24px"}}>
              Promote ScamShield and earn a <strong style={{color:t.primary}}>30% recurring revenue share</strong>. Paid monthly via EasyPaisa, JazzCash, or Bank Transfer.
            </p>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:24}}>
              {[
                {label:"Link Clicks",value:affiliateMetrics.clicks,icon:"🔗",color:t.primary},
                {label:"Total Signups",value:affiliateMetrics.signups,icon:"👥",color:"#64748b"},
                {label:"Premium Upgrades",value:affiliateMetrics.conversions,icon:"💎",color:"#107c41"},
                {label:"Available Balance",value:`Rs. ${affiliateMetrics.earningsPending}`,icon:"💰",color:"#b76e00"},
              ].map((m,i)=>(
                <Card3D key={i} style={{background:t.card,borderRadius:6,padding:16,border:`1px solid ${t.border}`}} glow={t.glow}>
                  <div style={{fontSize:16}}>{m.icon}</div>
                  <div style={{fontSize:22,fontWeight:700,color:m.color,margin:"6px 0 2px"}}>{m.value}</div>
                  <div style={{fontSize:11,color:t.txt2,fontWeight:500}}>{m.label}</div>
                </Card3D>
              ))}
            </div>

            <div style={{background:dark?"rgba(37,99,235,0.08)":"#eff6ff",border:`1px solid ${dark?"rgba(37,99,235,0.2)":"#bfdbfe"}`,borderRadius:8,padding:"12px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
              <div style={{fontSize:24}}>🏆</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:dark?"#60a5fa":"#1d4ed8"}}>Lifetime Earnings Paid</div>
                <div style={{fontSize:22,fontWeight:800,color:dark?"#93c5fd":"#1e40af"}}>Rs. {affiliateMetrics.earningsPaid.toLocaleString()}</div>
              </div>
              <div style={{marginLeft:"auto",fontSize:12,color:t.txt2,lineHeight:1.5,maxWidth:220}}>
                Next payout cycle: <strong style={{color:t.txt}}>July 1, 2026</strong><br/>Min threshold: Rs. 1,000
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,flexWrap:"wrap"}}>
              <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,padding:20}}>
                <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700}}>Your Referral Asset</h3>
                <label style={{fontSize:11,color:t.txt2,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>Unique Referral URL</label>
                <div style={{display:"flex",gap:8,marginTop:6,marginBottom:16}}>
                  <input readOnly value={`https://scamshield.pk/join?ref=${affiliateMetrics.code}`}
                    style={{flex:1,background:t.input,border:`1px solid ${t.border}`,borderRadius:4,padding:"8px 10px",fontSize:11,color:t.txt,outline:"none"}}/>
                  <button onClick={()=>showNotif("Referral link copied to clipboard! 📋")} style={{background:t.primaryGlow,color:"#fff",border:"none",borderRadius:4,padding:"0 14px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>Copy</button>
                </div>
                <label style={{fontSize:11,color:t.txt2,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>Referral Code</label>
                <div style={{display:"flex",gap:8,marginTop:6,marginBottom:16}}>
                  <input readOnly value={affiliateMetrics.code}
                    style={{flex:1,background:t.input,border:`1px solid ${t.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,fontWeight:700,color:t.primary,outline:"none"}}/>
                  <button onClick={()=>showNotif("Code copied!")} style={{background:t.input,color:t.txt,border:`1px solid ${t.border}`,borderRadius:4,padding:"0 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Copy</button>
                </div>
                <div style={{background:dark?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.02)",padding:12,borderRadius:6,fontSize:11,color:t.txt2,lineHeight:1.6,border:`1px dashed ${t.border}`}}>
                  📢 <strong>Pro Tip:</strong> Share on Pakistani Facebook groups, freelancing communities, and WhatsApp status for maximum conversions.
                </div>
              </div>

              <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,padding:20}}>
                <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700}}>Request Earnings Withdrawal</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div>
                    <label style={{fontSize:11,color:t.txt2,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Payment Method</label>
                    <select value={payoutDetails.method} onChange={e=>setPayoutDetails({...payoutDetails,method:e.target.value})}
                      style={{width:"100%",background:t.input,border:`1px solid ${t.border}`,borderRadius:4,padding:"8px",fontSize:13,color:t.txt,outline:"none"}}>
                      <option value="easypaisa">EasyPaisa 📱</option>
                      <option value="jazzcash">JazzCash 💸</option>
                      <option value="bank">Local Bank Transfer 🏦</option>
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:11,color:t.txt2,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Account Number / IBAN</label>
                    <input placeholder={payoutDetails.method==="bank"?"PK26MEZN...":"03XX-XXXXXXX"} value={payoutDetails.account}
                      onChange={e=>setPayoutDetails({...payoutDetails,account:e.target.value})}
                      style={{width:"100%",background:t.input,border:`1px solid ${t.border}`,borderRadius:4,padding:"8px",fontSize:13,color:t.txt,outline:"none"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:11,color:t.txt2,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Account Holder Name</label>
                    <input placeholder="Full name" value={payoutDetails.name}
                      onChange={e=>setPayoutDetails({...payoutDetails,name:e.target.value})}
                      style={{width:"100%",background:t.input,border:`1px solid ${t.border}`,borderRadius:4,padding:"8px",fontSize:13,color:t.txt,outline:"none"}}/>
                  </div>

                  {affiliateMetrics.earningsPending<1000&&(
                    <div style={{background:dark?"rgba(183,110,0,0.1)":"#fdf8ee",border:`1px solid #f5d6a0`,borderRadius:6,padding:"8px 12px",fontSize:11,color:"#b76e00"}}>
                      ⚠️ Minimum Rs. 1,000 required. You have Rs. {affiliateMetrics.earningsPending}.
                    </div>
                  )}

                  <button
                    disabled={affiliateMetrics.earningsPending<1000||!payoutDetails.account||!payoutDetails.name}
                    onClick={()=>{
                      showNotif(`Withdrawal request sent! Rs. ${affiliateMetrics.earningsPending} via ${payoutDetails.method.toUpperCase()}. Processing within 48 hours. ✅`);
                      setAffiliateMetrics(prev=>({...prev,earningsPaid:prev.earningsPaid+prev.earningsPending,earningsPending:0}));
                      setPayoutDetails({method:"easypaisa",account:"",name:""});
                    }}
                    style={{
                      width:"100%",
                      background:(affiliateMetrics.earningsPending<1000||!payoutDetails.account||!payoutDetails.name)?t.input:t.primaryGlow,
                      color:(affiliateMetrics.earningsPending<1000||!payoutDetails.account||!payoutDetails.name)?t.txt2:"#fff",
                      border:"none",borderRadius:6,padding:"10px",
                      cursor:(affiliateMetrics.earningsPending<1000||!payoutDetails.account||!payoutDetails.name)?"default":"pointer",
                      fontWeight:600,fontSize:13
                    }}
                  >
                    {affiliateMetrics.earningsPending<1000?"Minimum Rs. 1,000 Required":"Submit Payout Request 💸"}
                  </button>
                </div>
              </div>
            </div>

            <div style={{marginTop:24,background:t.card,border:`1px solid ${t.border}`,borderRadius:8,padding:20}}>
              <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700}}>How Partner Network Works</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
                {[
                  {step:"1",title:"Share Your Link",desc:"Share your unique referral URL on social media, WhatsApp groups, and freelancing communities."},
                  {step:"2",title:"Earn on Upgrades",desc:"When someone upgrades to Premium or Enterprise via your link, you earn 30% recurring commission."},
                  {step:"3",title:"Request Payout",desc:"Once you hit Rs. 1,000 threshold, submit a withdrawal request. Paid within 48 hours."},
                ].map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div style={{width:32,height:32,background:t.primaryGlow,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13,flexShrink:0}}>{s.step}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:t.txt,marginBottom:4}}>{s.title}</div>
                      <div style={{fontSize:12,color:t.txt2,lineHeight:1.5}}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRIVACY ── */}
        {page==="privacy"&&(
          <div style={{padding:"1.5rem",maxWidth:700}}>
            <h1 style={{fontSize:18,fontWeight:700,margin:"0 0 20px"}}>Data Policy</h1>
            {[
              {title:"Data Collection",content:"ScamShield collects only the minimum data required to provide scam detection services. This includes your email address for authentication and the queries you submit for analysis."},
              {title:"Data Usage",content:"Your query data is used solely to improve our AI detection models. We do not sell your data to third parties or use it for advertising purposes."},
              {title:"Data Retention",content:"Query history is retained for 30 days for free users and indefinitely for premium users. You may request deletion at any time."},
              {title:"Security",content:"All data is encrypted in transit and at rest. We employ industry-standard security practices to protect your information."},
              {title:"Contact",content:"For privacy concerns, contact us via WhatsApp: 0302-5878458 or through our support channel."},
            ].map((s,i)=>(
              <div key={i} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:6,padding:20,marginBottom:12}}>
                <h3 style={{fontSize:14,fontWeight:700,color:t.txt,margin:"0 0 8px"}}>{s.title}</h3>
                <p style={{fontSize:13,color:t.txt2,lineHeight:1.6,margin:0}}>{s.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#64748b;border-radius:99px}`}</style>
    </div>
  );
}

// ── ROOT COMPONENT (MANAGED ACTIVE REAL SESSION) ──────────────────────────────
export default function Root(){
  const[dark,setDark]=useState(false);
  const[screen,setScreen]=useState("landing");
  const[user,setUser]=useState(null);
  const[loadingAuthCheck, setLoadingAuthCheck] = useState(true);

  // 1. Monitor active login state continuously
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
          email: session.user.email,
          plan: "free",
          checksToday: 0
        });
        setScreen("app");
      }
      setLoadingAuthCheck(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
          email: session.user.email,
          plan: "free",
          checksToday: 0
        });
        setScreen("app");
      } else {
        setUser(null);
        setScreen("landing");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Secure Sign Out function call
  const handleRealSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setScreen("landing");
  };

  if (loadingAuthCheck) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>🛡️</div>
          <div>Initializing Security Modules...</div>
        </div>
      </div>
    );
  }

  if(screen==="auth") return <Auth dark={dark} onAuth={u=>{setUser(u);setScreen("app");}} onBack={()=>setScreen("landing")}/>;
  if(screen==="app" && user) return <Dashboard user={user} dark={dark} setDark={setDark} onLogout={handleRealSignOut}/>;
  
  return <Landing dark={dark} setDark={setDark} onGetStarted={()=>setScreen("auth")}/>;
}
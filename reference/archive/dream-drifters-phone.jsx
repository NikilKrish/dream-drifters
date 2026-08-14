/* Dream Drifters — "on your iPhone" walkthrough video scene.
   Reads globals from animations.jsx + ios-frame.jsx (loaded before this file). */
const { Stage, Sprite, useTime, Easing, interpolate, clamp } = window;

const NAVY = '#033050', CYAN = '#04b2c9', ICE = '#f0fbfc', GREEN = '#00c864', MUTED = '#6c757d';
const SANS = "'General Sans', -apple-system, system-ui, sans-serif";

// ── stacked mobile site (device-internal 402px coords) ──────────────
function Chip({ children }) {
  return <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:ICE, color:CYAN,
    fontSize:11, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', padding:'6px 12px', borderRadius:900 }}>{children}</div>;
}
function Check() {
  return <span style={{ color:CYAN, fontWeight:700, flexShrink:0 }}>✓</span>;
}

function MobileSite() {
  const li = (t) => <li style={{ display:'flex', gap:8, fontSize:12.5, color:'#475b68', alignItems:'flex-start' }}><Check/>{t}</li>;
  const card = (badge, title, sub, price, grad, items) => (
    <div style={{ background:'#fff', border:'1px solid #e9ecef', borderRadius:20, overflow:'hidden', boxShadow:'rgba(0,0,0,0.07) 0 2px 8px', marginBottom:16 }}>
      <div style={{ position:'relative', height:150, background:grad }}>
        <span style={{ position:'absolute', top:12, left:12, background:CYAN, color:NAVY, fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:900 }}>{badge}</span>
      </div>
      <div style={{ padding:18 }}>
        <div style={{ fontSize:17, fontWeight:600, color:NAVY }}>{title}</div>
        <div style={{ fontSize:12, color:MUTED, marginBottom:12 }}>{sub}</div>
        <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:6, margin:0, padding:0, marginBottom:14 }}>{items.map((x,i)=><React.Fragment key={i}>{li(x)}</React.Fragment>)}</ul>
        <div style={{ fontSize:21, fontWeight:700, color:NAVY, marginBottom:12 }}>{price} <span style={{ fontSize:12, color:MUTED, fontWeight:500 }}>/ person</span></div>
        <div data-btn="itin" style={{ width:'100%', textAlign:'center', border:`1.5px solid ${NAVY}`, color:NAVY, padding:'11px', borderRadius:900, fontSize:13.5, fontWeight:600, boxSizing:'border-box' }}>View Full Itinerary</div>
      </div>
    </div>
  );
  return (
    <div style={{ width:402, fontFamily:SANS }}>
      {/* HERO */}
      <div style={{ background:'#fff', padding:'26px 22px 30px' }}>
        <Chip>Corporate Travel · Chennai</Chip>
        <div style={{ fontSize:38, lineHeight:1.08, fontWeight:700, color:NAVY, letterSpacing:1, margin:'16px 0 12px' }}>Your Journey,<br/><span style={{ color:CYAN }}>Our Passion</span></div>
        <div style={{ fontSize:14, color:MUTED, marginBottom:20, lineHeight:1.5 }}>Professional travel management &amp; corporate solutions — visas, flights, hotels, events.</div>
        <div style={{ display:'flex', gap:10, marginBottom:24 }}>
          <div style={{ background:CYAN, color:NAVY, fontSize:14, fontWeight:600, padding:'13px 22px', borderRadius:900 }}>Explore Packages</div>
          <div style={{ border:`1.5px solid ${NAVY}`, color:NAVY, fontSize:14, fontWeight:600, padding:'12px 22px', borderRadius:900 }}>Talk to Us</div>
        </div>
        <div style={{ display:'flex', justifyContent:'center' }}>
          <div style={{ width:230, height:230, borderRadius:900, background:'radial-gradient(circle at 32% 28%, #7fe3f0 0%, #12afce 40%, #0785a8 75%, #045f7e 100%)', boxShadow:'inset -14px -18px 40px rgba(3,48,80,0.35)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:78, background:'linear-gradient(180deg, rgba(245,225,175,0) 0%, #f3dca0 55%, #e9c97e 100%)' }}/>
            <div style={{ position:'absolute', top:34, left:38, width:44, height:44, borderRadius:900, background:'#fff5cf', boxShadow:'0 0 40px 14px rgba(255,240,190,0.7)' }}/>
          </div>
        </div>
      </div>
      {/* STATS */}
      <div style={{ background:NAVY, padding:'26px 22px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, textAlign:'center' }}>
        {[['15+','Years'],['5000+','Travelers'],['50+','Destinations'],['100%','Satisfaction']].map((s,i)=>(
          <div key={i}><div style={{ fontSize:28, fontWeight:700, color:GREEN, lineHeight:1 }}>{s[0]}</div><div style={{ fontSize:11, color:'rgba(255,255,255,.7)', textTransform:'uppercase', letterSpacing:.8, marginTop:6 }}>{s[1]}</div></div>
        ))}
      </div>
      {/* PACKAGES */}
      <div style={{ background:ICE, padding:'28px 22px 30px' }}>
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <Chip>Travel Packages</Chip>
          <div style={{ fontSize:26, fontWeight:600, color:NAVY, letterSpacing:.5, marginTop:12 }}>Explore Our <span style={{ color:CYAN }}>Destinations</span></div>
        </div>
        {card('Best Seller','Maldives Paradise','5 Days / 4 Nights','₹95,000','linear-gradient(135deg, #1ba9c9 0%, #0a6f92 100%)',['5-star overwater resort','Water sports & snorkeling','Sunset dolphin cruise'])}
        {card('Trending','Japan Cultural Journey','8 Days / 7 Nights','₹1,10,000','linear-gradient(135deg, #e28f9e 0%, #b25a72 100%)',['Tokyo & Kyoto tours','Traditional tea ceremony','Mount Fuji views'])}
      </div>
    </div>
  );
}

// ── Safari chrome ───────────────────────────────────────────────────
function SafariTop({ progress }) {
  return (
    <div style={{ paddingTop:54, background:'#f7f7f8', borderBottom:'1px solid #e2e2e6' }}>
      <div style={{ height:3, background:'#e2e2e6', position:'relative', marginBottom:7 }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${Math.round(progress*100)}%`, background:CYAN, borderRadius:2 }}/>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 14px 10px' }}>
        <div style={{ flex:1, height:36, borderRadius:11, background:'#e8e8ec', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <svg width="11" height="13" viewBox="0 0 11 13"><path d="M2 6V4a3.5 3.5 0 017 0v2" stroke="#6b6b70" strokeWidth="1.4" fill="none"/><rect x="1" y="6" width="9" height="6.2" rx="1.6" fill="#6b6b70"/></svg>
          <span style={{ fontSize:14, color:'#3c3c40', fontWeight:500, letterSpacing:-.2 }}>dreamdrifters.in</span>
        </div>
      </div>
    </div>
  );
}
function SafariBottom() {
  const ico = (d) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a84ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-around', padding:'9px 20px 24px', background:'#f7f7f8', borderTop:'1px solid #e2e2e6' }}>
      {ico(<path d="M15 18l-6-6 6-6"/>)}
      {ico(<path d="M9 18l6-6-6-6" opacity="0.3"/>)}
      {ico(<><path d="M12 16V4"/><path d="M6 10l6-6 6 6"/><rect x="4" y="16" width="16" height="5" rx="1.5"/></>)}
      {ico(<><rect x="4" y="4" width="16" height="16" rx="2"/></>)}
      {ico(<><rect x="3" y="4" width="8" height="8" rx="1.5"/><rect x="13" y="4" width="8" height="8" rx="1.5"/><rect x="3" y="14" width="8" height="6" rx="1.5"/></>)}
    </div>
  );
}

// ── thumb / touch ───────────────────────────────────────────────────
function Thumb({ x, y, pressed, opacity }) {
  return (
    <div style={{ position:'absolute', left:x, top:y, opacity, transform:`translate(-50%,-50%) scale(${pressed?0.92:1})`, transition:'none', pointerEvents:'none', zIndex:80 }}>
      {pressed && <div style={{ position:'absolute', left:'50%', top:'50%', width:64, height:64, marginLeft:-32, marginTop:-32, borderRadius:900, border:`3px solid ${CYAN}`, opacity:0.55 }}/>}
      <div style={{ width:20, height:20, borderRadius:900, background:'rgba(3,48,80,0.32)', boxShadow:'0 0 0 8px rgba(3,48,80,0.12)' }}/>
    </div>
  );
}

// ── the phone with live scroll + gestures ───────────────────────────
function Phone() {
  const t = useTime();
  const { IOSDevice } = window;

  const loadP = interpolate([0.4, 1.9], [0, 1], Easing.easeOutQuad)(t);
  const painted = t > 1.6;

  // scroll through the page
  const scrollY = interpolate([0, 5.4, 8.4, 14], [0, 0, 720, 720], Easing.easeInOutCubic)(t);

  // thumb: swipe up (5.2-8.4), then tap itinerary (9.6-10.6)
  let tx = 250, ty = 720, tp = false, to = 0;
  if (t >= 5.0 && t < 9.0) {
    to = interpolate([5.0, 5.4, 8.4, 9.0], [0, 1, 1, 0], Easing.linear)(t);
    tx = 250;
    ty = interpolate([5.4, 8.4], [610, 300], Easing.easeInOutCubic)(t);
  } else if (t >= 9.4 && t < 11.4) {
    to = interpolate([9.4, 9.8, 10.9, 11.4], [0, 1, 1, 0], Easing.linear)(t);
    tx = 250; ty = 600;
    tp = t > 10.0 && t < 10.7;
  }

  const contentH = 704; // viewport between chrome bars
  return (
    <div style={{ position:'relative', width:402, height:874 }}>
      <IOSDevice width={402} height={874}>
        <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'#fff' }}>
          <SafariTop progress={loadP}/>
          <div style={{ flex:1, position:'relative', overflow:'hidden', background:'#fff' }}>
            {!painted && (
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'#fff' }}>
                <div style={{ width:34, height:34, borderRadius:900, border:`3px solid ${ICE}`, borderTopColor:CYAN, animation:'ddspin 0.8s linear infinite' }}/>
              </div>
            )}
            <div style={{ position:'absolute', top:0, left:0, right:0, transform:`translateY(${-scrollY}px)`, opacity:painted?1:0 }}>
              <MobileSite/>
            </div>
          </div>
          <SafariBottom/>
        </div>
      </IOSDevice>
      <Thumb x={tx} y={ty} pressed={tp} opacity={to}/>
    </div>
  );
}

// ── camera rig ──────────────────────────────────────────────────────
function Camera({ children }) {
  const t = useTime();
  const s = interpolate([0, 2.0, 5.4, 8.6, 11.6, 12.6, 14], [0.86, 1.06, 1.06, 1.12, 1.12, 0.9, 0.9], Easing.easeInOutCubic)(t);
  const ty = interpolate([0, 2.0, 5.4, 8.6, 11.6, 12.6, 14], [30, -20, -20, 40, 40, 0, 0], Easing.easeInOutCubic)(t);
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ transform:`translateY(${ty}px) scale(${s})`, transformOrigin:'50% 50%' }}>{children}</div>
    </div>
  );
}

function Ticker() {
  const t = useTime();
  const root = React.useRef(null);
  React.useEffect(() => {
    const el = root.current && root.current.closest('[data-om-exportable-video-with-duration-secs]');
    if (el) el.setAttribute('data-screen-label', String(Math.floor(t)) + 's');
  }, [Math.floor(t)]);
  return <div ref={root} style={{ display:'none' }}/>;
}

function PhoneVideo() {
  const W = 1080, H = 1920;
  return (
    <Stage width={W} height={H} duration={14} background="#eaf6f8">
      {/* ambient backdrop */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(120% 80% at 50% 12%, #ffffff 0%, #dff2f6 42%, #bfe6ee 100%)' }}/>
      <div style={{ position:'absolute', top:-140, left:-120, width:560, height:560, borderRadius:900, background:'radial-gradient(circle, rgba(4,178,201,0.20), rgba(4,178,201,0) 70%)' }}/>
      <div style={{ position:'absolute', bottom:-180, right:-140, width:640, height:640, borderRadius:900, background:'radial-gradient(circle, rgba(3,48,80,0.14), rgba(3,48,80,0) 70%)' }}/>

      <Camera>
        <div style={{ transform:'scale(1.716)', transformOrigin:'50% 50%' }}>
          <Phone/>
        </div>
      </Camera>

      {/* intro caption */}
      <Sprite start={0.2} end={2.4}>
        <div style={{ position:'absolute', top:150, left:0, right:0, textAlign:'center', fontFamily:SANS }}>
          <div style={{ fontSize:30, fontWeight:600, color:NAVY, letterSpacing:0.5 }}>Plan your trip — right from your phone</div>
        </div>
      </Sprite>

      {/* end card */}
      <Sprite start={12.2} end={14}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(70% 45% at 50% 78%, rgba(234,246,248,0.96) 0%, rgba(234,246,248,0.75) 45%, rgba(234,246,248,0) 75%)' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', paddingBottom:230, fontFamily:SANS }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14 }}>
            <img src="./brand/dd-mark.png" alt="Dream Drifters logo" style={{ height:64, width:'auto', display:'block' }}/>
            <div style={{ fontSize:40, fontWeight:600, color:NAVY, letterSpacing:0.5 }}>Dream <span style={{ color:CYAN }}>Drifters</span></div>
          </div>
          <div style={{ fontSize:22, color:MUTED, fontWeight:500 }}>dreamdrifters.in · +91 93633 12124</div>
        </div>
      </Sprite>

      <Ticker/>
    </Stage>
  );
}

window.PhoneVideo = PhoneVideo;

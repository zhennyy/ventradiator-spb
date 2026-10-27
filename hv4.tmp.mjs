import { chromium } from 'playwright';
const S='/tmp/claude-0/-home-claude/fe69af44-1b72-520c-8d0d-933f5f4dbb4a/scratchpad/';
const wall=(pt,g1,g2)=>`@media(max-width:1279px){.hero-stage{display:flex!important;align-items:flex-start!important;min-height:max(560px,min(100vw + 260px,100svh - 110px))!important}
.hero-photo{position:absolute!important;inset:0;height:100%!important;-webkit-mask-image:none!important;mask-image:none!important;object-position:72% 100%!important}
.hero-stage::after,.hero-copy::before{display:none!important}.hero-copy{margin:0!important;border-left:2px solid var(--ink);padding-left:18px!important}
.hero-stage::before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(to bottom,rgb(250 249 245 / 0) 0%,rgb(250 249 245 / .55) ${g1}%,rgb(250 249 245 / .6) ${g2}%,rgb(250 249 245 / 0) ${g2+16}%)}
.hero-copy-wrap{padding-block:${pt} 0!important}
.hero h1{font-size:clamp(28px,3.4vw + 14px,42px)!important;max-width:12em!important;line-height:1.06!important}
.hero-lead{font-size:clamp(15px,.4vw + 13px,17px)!important;max-width:30em!important;margin:12px 0 20px!important}
.hero-actions{display:flex!important;gap:10px!important}.hero-actions .button{flex:0 0 auto!important;min-width:0!important;width:auto!important;padding-inline:24px!important}}
@media(max-width:600px){.hero-actions{display:grid!important;grid-template-columns:1fr 1fr}.hero-actions .button{padding-inline:8px!important}}`;
const V={a:wall('clamp(64px, 9vh, 96px)',8,38), b:wall('clamp(100px, 15vh, 160px)',14,46), c:wall('clamp(140px, 22vh, 240px)',22,54)};
const b = await chromium.launch();
for (const [n,css] of Object.entries(V)) for (const [w,h] of [[768,1024],[390,844]]) {
  const p = await b.newPage({viewport:{width:w,height:h}}); await p.goto('http://localhost:4199/'); await p.waitForTimeout(500);
  await p.addStyleTag({content:css}); await p.waitForTimeout(800);
  await p.screenshot({path:S+`h4-${n}-${w}.png`}); await p.close();
}
await b.close();

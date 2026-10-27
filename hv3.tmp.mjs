import { chromium } from 'playwright';
const S='/tmp/claude-0/-home-claude/fe69af44-1b72-520c-8d0d-933f5f4dbb4a/scratchpad/';
const base=`@media(max-width:1279px){.hero-stage{display:flex!important;align-items:flex-end!important;min-height:max(560px,min(100vw + 260px,100svh - 110px))!important}
.hero-photo{position:absolute!important;inset:0;height:100%!important;-webkit-mask-image:none!important;mask-image:none!important;object-position:72% 60%!important}
.hero-stage::after,.hero-copy::before{display:none!important}.hero-copy{margin:0!important}
.hero h1{font-size:clamp(28px,3.4vw + 14px,42px)!important;max-width:12em!important;line-height:1.06!important}
.hero-lead{font-size:clamp(15px,.4vw + 13px,17px)!important;max-width:30em!important;margin:12px 0 20px!important}
.hero-actions{display:flex!important;gap:10px!important}.hero-actions .button{flex:0 0 auto!important;min-width:0!important;width:auto!important;padding-inline:24px!important}}
@media(max-width:600px){.hero-actions{display:grid!important;grid-template-columns:1fr 1fr}.hero-actions .button{padding-inline:8px!important}}`;
const V={
glass: base+`@media(max-width:1279px){.hero-copy-wrap{padding-block:0 20px!important}
.hero-copy{max-width:560px!important;padding:24px 22px!important;background:rgb(250 249 245 / .62);-webkit-backdrop-filter:blur(18px) saturate(1.1);backdrop-filter:blur(18px) saturate(1.1);border:1px solid rgb(255 255 255 / .6);box-shadow:0 20px 50px rgb(23 25 27 / .12)}}`,
dark: base+`@media(max-width:1279px){.hero-stage::before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgb(23 25 27 / .78) 0%,rgb(23 25 27 / .55) 28%,rgb(23 25 27 / 0) 58%)}
.hero-copy-wrap{padding-block:0 28px!important}.hero h1{color:#fff!important}.hero-lead{color:rgb(255 255 255 / .86)!important}
.hero-actions .button:first-child{background:transparent!important;color:#fff!important;border-color:rgb(255 255 255 / .8)!important}
.hero-actions .button:last-child{background:#fff!important;color:var(--ink)!important;border-color:#fff!important}}`,
wall: base+`@media(max-width:1279px){.hero-stage{align-items:flex-start!important}.hero-photo{object-position:72% 100%!important}
.hero-stage::before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(to bottom,rgb(250 249 245 / .82) 0%,rgb(250 249 245 / .5) 32%,rgb(250 249 245 / 0) 50%)}
.hero-copy-wrap{padding-block:32px 0!important}.hero-copy{border-left:2px solid var(--ink);padding-left:18px!important}}`,
};
const b = await chromium.launch();
for (const [n,css] of Object.entries(V)) for (const [w,h] of [[768,1024],[390,844]]) {
  const p = await b.newPage({viewport:{width:w,height:h}}); await p.goto('http://localhost:4199/'); await p.waitForTimeout(500);
  await p.addStyleTag({content:css}); await p.waitForTimeout(800);
  await p.screenshot({path:S+`h3-${n}-${w}.png`}); await p.close();
}
await b.close();

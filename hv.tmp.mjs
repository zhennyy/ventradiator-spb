import { chromium } from 'playwright';
const S='/tmp/claude-0/-home-claude/fe69af44-1b72-520c-8d0d-933f5f4dbb4a/scratchpad/';
const common = `.hero h1{font-size:clamp(26px,4.2vw + 10px,40px)!important;max-width:13em!important;line-height:1.08!important}
.hero-lead{font-size:15px!important;max-width:34em!important}`;
const btn = `.hero-actions{display:flex!important;flex-wrap:wrap;gap:10px!important}.hero-actions .button{flex:0 0 auto!important;min-width:0!important;width:auto!important;padding-inline:22px!important}`;
const btnPhone = `@media(max-width:600px){.hero-actions{display:grid!important;grid-template-columns:1fr 1fr}.hero-actions .button{padding-inline:8px!important}}`;
const V = {
now: ``,
split: common+`@media(max-width:1279px){.hero-stage{display:flex!important;flex-direction:column!important;min-height:0!important}
.hero-photo{position:static!important;order:2;width:100%;height:auto!important;aspect-ratio:16/10;object-position:72% 75%!important;-webkit-mask-image:linear-gradient(#000 85%,transparent)!important;mask-image:linear-gradient(#000 85%,transparent)!important}
.hero-stage::after,.hero-copy::before{display:none!important}.hero-copy-wrap{order:1;padding-block:28px 24px!important}.hero-copy{margin:0!important}${btn}}`+btnPhone,
card: common+`@media(max-width:1279px){.hero-stage{display:flex!important;flex-direction:column!important;min-height:0!important}
.hero-photo{position:static!important;width:100%;height:auto!important;aspect-ratio:4/3;object-position:72% 80%!important;-webkit-mask-image:none!important;mask-image:none!important}
.hero-stage::after,.hero-copy::before{display:none!important}
.hero-copy-wrap{margin-top:-72px;padding-block:0 8px!important}.hero-copy{margin:0!important;max-width:620px!important;background:var(--surface);border:1px solid var(--line);padding:24px 22px!important;box-shadow:0 18px 40px rgb(23 25 27 / .08)}${btn}}
@media(max-width:600px){.hero-copy-wrap{margin-top:-48px}}`+btnPhone,
overlay: common+`@media(max-width:1279px){.hero-stage{align-items:flex-start!important;min-height:max(560px,min(100vw + 220px,100svh - 120px))!important}
.hero-photo{object-position:70% 100%!important}
.hero-stage::after{background:linear-gradient(to bottom,rgb(242 240 234 / .96) 0%,rgb(242 240 234 / .9) 30%,rgb(242 240 234 / .35) 48%,rgb(242 240 234 / 0) 60%)!important;content:'';position:absolute;inset:0;z-index:-1}
.hero-copy::before{display:none!important}.hero-copy-wrap{padding-block:32px 0!important}.hero-copy{margin:0!important}${btn}}`+btnPhone,
};
const b = await chromium.launch();
for (const [n,css] of Object.entries(V)) for (const [w,h] of [[768,1000],[390,844]]) {
  const p = await b.newPage({viewport:{width:w,height:h}}); await p.goto('http://localhost:4199/'); await p.waitForTimeout(600);
  if (css) await p.addStyleTag({content:css}); await p.waitForTimeout(700);
  await p.screenshot({path:S+`hv-${n}-${w}.png`}); await p.close();
}
await b.close();

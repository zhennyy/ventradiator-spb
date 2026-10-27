import { chromium } from 'playwright';
const S='/tmp/claude-0/-home-claude/fe69af44-1b72-520c-8d0d-933f5f4dbb4a/scratchpad/';
const reset=`@media(max-width:1279px){.hero-stage{display:flex!important;flex-direction:column!important;min-height:0!important;align-items:stretch!important}
.hero-stage::after,.hero-copy::before{display:none!important}.hero-copy{margin:0!important;max-width:none!important}
.hero-photo{position:static!important;-webkit-mask-image:none!important;mask-image:none!important;height:auto!important}
.hero h1{font-size:clamp(28px,3.6vw + 14px,44px)!important;max-width:12em!important;line-height:1.06!important;letter-spacing:-0.03em}
.hero-lead{font-size:clamp(15px,.5vw + 13px,17px)!important;max-width:30em!important;margin:14px 0 22px!important}
.hero-copy::after{content:'';display:block}}`;
const eyebrow=`.hero-copy h1::before{content:'Представительство в Санкт-Петербурге';display:block;margin-bottom:16px;font:400 11px/1.4 var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft)}`;
const btns=`.hero-actions{display:flex!important;gap:10px!important}.hero-actions .button{flex:0 0 auto!important;min-width:0!important;width:auto!important;padding-inline:24px!important}
@media(max-width:600px){.hero-actions{display:grid!important;grid-template-columns:1fr 1fr}.hero-actions .button{padding-inline:8px!important}}`;
const V={
journal: reset+`@media(max-width:1279px){${eyebrow}.hero-copy-wrap{order:1;padding-block:36px 28px!important}
.hero-photo{order:2;width:calc(100% - 2*var(--gutter))!important;margin:0 var(--gutter) 8px;aspect-ratio:16/10;object-position:78% 78%!important;border:1px solid var(--line)}${btns}}
@media(max-width:600px){.hero-photo{aspect-ratio:4/5;object-position:80% 70%!important}}`,
center: reset+`@media(max-width:1279px){${eyebrow}.hero-copy-wrap{order:1;padding-block:40px 30px!important}.hero-copy{text-align:center}.hero h1,.hero-lead{margin-inline:auto!important}
.hero-actions{justify-content:center}.hero-photo{order:2;width:calc(100% - 2*var(--gutter))!important;margin:0 var(--gutter) 8px;aspect-ratio:16/10;object-position:78% 78%!important}${btns}}
@media(max-width:600px){.hero-photo{aspect-ratio:1/1;object-position:80% 72%!important}}`,
bleed: reset+`@media(max-width:1279px){${eyebrow}.hero-photo{order:1;width:100%;aspect-ratio:16/9;object-position:82% 80%!important}
.hero-copy-wrap{order:2;padding-block:28px 12px!important;border-bottom:0}${btns}}
@media(max-width:600px){.hero-photo{aspect-ratio:5/4;object-position:84% 76%!important}}`,
};
const b = await chromium.launch();
for (const [n,css] of Object.entries(V)) for (const [w,h] of [[768,1024],[390,844]]) {
  const p = await b.newPage({viewport:{width:w,height:h}}); await p.goto('http://localhost:4199/'); await p.waitForTimeout(500);
  await p.addStyleTag({content:css}); await p.waitForTimeout(800);
  await p.screenshot({path:S+`h2-${n}-${w}.png`}); await p.close();
}
await b.close();

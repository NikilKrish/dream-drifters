# Current Theme

## Compact token summary

- Colors: navy `#033050`, navy-dark `#021e33`, navy-mid `#044268`, cyan `#04b2c9`, cyan-dark `#039db2`, white `#ffffff`, ice `#f0fbfc`, gray `#6c757d`, text `#2c3e50`.
- Typography: Segoe UI/Tahoma/Geneva/Verdana system stack; headings 2.2–2.8rem; body 0.9–1.15rem.
- Layout: centered `1200px` containers, 4.5rem section padding, sticky navigation.
- Shapes: mostly 10px cards and 20–30px pills; package cards 12px.
- Shadows: medium card and navigation shadows.
- Breakpoints: 900px and 600px.
- CSS: vanilla embedded stylesheet; no Tailwind or theme provider.

## Raw source: variables and foundation

```css
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --navy:#033050;
  --navy-dark:#021e33;
  --navy-mid:#044268;
  --yellow:#04b2c9;
  --yellow-dark:#039db2;
  --white:#ffffff;
  --light:#f0fbfc;
  --gray:#6c757d;
  --text:#2c3e50;
}
html{scroll-behavior:smooth;}
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:var(--text);line-height:1.7;}
section{padding:4.5rem 2rem;}
.container{max-width:1200px;margin:0 auto;}
```

## Raw source: navigation and hero

```css
nav{background:var(--navy);padding:0.8rem 2rem;position:sticky;top:0;z-index:999;box-shadow:0 2px 15px rgba(0,0,0,0.2);}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;}
.hero{background:linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 60%,#ffffff 100%);color:var(--white);padding:5rem 2rem;text-align:center;position:relative;overflow:hidden;}
.hero h1{font-size:2.8rem;font-weight:800;margin-bottom:1rem;line-height:1.2;}
.btn-primary{background:var(--yellow);color:var(--navy);padding:0.85rem 2rem;border-radius:30px;font-weight:700;text-decoration:none;transition:all 0.3s;font-size:0.95rem;}
```

The complete raw stylesheet is lines 7–211 of `reference/archive/uploads/Harish's athai/index.html` and should be passed as part of that full file for reproduction; it is below the 900-line context threshold.


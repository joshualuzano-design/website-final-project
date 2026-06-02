import { useState, useEffect, useRef, useCallback } from "react";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=Pacifico&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

  :root {
    --espresso: #2C1810;
    --coffee: #5C3317;
    --latte: #C19A6B;
    --cream: #FDF6EC;
    --foam: #FFF9F2;
    --caramel: #D4855A;
    --gold: #C8961E;
    --bark: #8B5E3C;
    --leaf: #4A7C59;
    --text: #1A1008;
    --muted: #7A6558;
    --card-shadow: 0 20px 60px rgba(44,24,16,0.12);
    --card-shadow-hover: 0 40px 80px rgba(44,24,16,0.22);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9999; opacity: 0.4;
  }

  /* ─── NAVBAR ─── */
  .navbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(44,24,16,0.97);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(193,154,107,0.2);
    padding: 0 2rem;
  }
  .nav-inner {
    max-width: 1280px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    height: 70px;
  }
  .nav-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; }
  .nav-logo-icon {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, var(--latte), var(--gold));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 16px rgba(193,154,107,0.4);
  }
  .nav-brand-name { font-family: 'Pacifico', cursive; font-size: 1.4rem; color: #fff; letter-spacing: 0.5px; }
  .nav-brand-sub { font-size: 0.65rem; color: var(--latte); letter-spacing: 1.5px; text-transform: uppercase; margin-top: -2px; }
  .nav-links { display: flex; align-items: center; gap: 2rem; }
  .nav-link {
    color: rgba(255,255,255,0.8); background: none; border: none;
    font-size: 0.9rem; font-weight: 500; letter-spacing: 0.3px;
    cursor: pointer; transition: color .2s; font-family: 'DM Sans', sans-serif;
  }
  .nav-link:hover { color: var(--latte); }
  .nav-cart-btn {
    display: flex; align-items: center; gap: 8px;
    background: rgba(193,154,107,0.15);
    border: 1px solid rgba(193,154,107,0.4);
    color: #fff; padding: 8px 18px; border-radius: 50px;
    cursor: pointer; font-size: 0.88rem; font-weight: 600;
    transition: all .2s; position: relative; font-family: 'DM Sans', sans-serif;
  }
  .nav-cart-btn:hover { background: rgba(193,154,107,0.3); border-color: var(--latte); }
  .cart-badge {
    position: absolute; top: -6px; right: -6px;
    background: var(--caramel); color: #fff;
    width: 20px; height: 20px; border-radius: 50%;
    font-size: 0.7rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .nav-admin-btn {
    background: var(--latte); color: var(--espresso); border: none;
    padding: 9px 20px; border-radius: 50px; cursor: pointer;
    font-weight: 700; font-size: 0.85rem; transition: all .2s;
    font-family: 'DM Sans', sans-serif; letter-spacing: 0.5px;
  }
  .nav-admin-btn:hover { background: var(--gold); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,150,30,0.4); }

  /* ─── MAIN ─── */
  .main-content {
    max-width: 1280px; margin: 0 auto;
    padding: 3rem 2rem 6rem;
    min-height: calc(100vh - 70px);
  }

  /* ─── HERO ─── */
  .hero {
    position: relative;
    background: linear-gradient(145deg, var(--espresso) 0%, var(--coffee) 50%, #3D1F0E 100%);
    border-radius: 32px; padding: 6rem 4rem; overflow: hidden; margin-bottom: 4rem;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(193,154,107,0.15) 0%, transparent 70%);
  }
  .hero::after {
    content: '☕'; position: absolute; right: 10%; top: 50%;
    transform: translateY(-50%); font-size: 200px; opacity: 0.07; line-height: 1;
  }
  .hero-content { position: relative; z-index: 1; max-width: 600px; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    color: var(--latte); font-size: 0.8rem; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase; margin-bottom: 1.5rem;
  }
  .hero-eyebrow::before { content: ''; flex: 0 0 40px; height: 1px; background: rgba(193,154,107,0.4); }
  .hero h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem,6vw,5rem); font-weight: 700;
    color: #fff; line-height: 1.1; margin-bottom: 1.5rem;
  }
  .hero h1 em { font-style: italic; color: var(--latte); }
  .hero-desc { color: rgba(255,255,255,0.7); font-size: 1.1rem; line-height: 1.7; margin-bottom: 2.5rem; max-width: 480px; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .hero-stats { display: flex; gap: 2rem; margin-top: 3rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; }
  .hero-stat .num { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: var(--latte); }
  .hero-stat .label { font-size: 0.8rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }

  /* ─── BUTTONS ─── */
  .btn-primary {
    background: linear-gradient(135deg, var(--latte), var(--gold));
    color: var(--espresso); border: none; padding: 16px 36px;
    border-radius: 50px; font-size: 1rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.5px; transition: all .25s;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 8px 30px rgba(200,150,30,0.4);
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(200,150,30,0.5); }
  .btn-outline {
    background: transparent; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.3);
    padding: 16px 36px; border-radius: 50px; font-size: 1rem;
    font-weight: 500; cursor: pointer; transition: all .25s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-outline:hover { border-color: var(--latte); color: var(--latte); }
  .btn-secondary {
    background: rgba(0,0,0,0.05); color: var(--muted); border: none;
    padding: 14px 24px; border-radius: 14px; cursor: pointer;
    font-weight: 600; font-size: 0.95rem; transition: all .2s;
    font-family: 'DM Sans', sans-serif; flex: 1;
  }
  .btn-secondary:hover { background: rgba(0,0,0,0.1); }
  .btn-checkout {
    background: linear-gradient(135deg, var(--espresso), var(--coffee));
    color: #fff; border: none; padding: 14px 28px; border-radius: 14px;
    cursor: pointer; font-weight: 700; font-size: 0.95rem;
    flex: 2; transition: all .2s; font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.3px; box-shadow: 0 6px 20px rgba(44,24,16,0.3);
  }
  .btn-checkout:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(44,24,16,0.4); }
  .btn-back {
    background: #fff; border: 1.5px solid rgba(0,0,0,0.1); color: var(--muted);
    padding: 10px 20px; border-radius: 12px; cursor: pointer;
    font-weight: 600; font-size: 0.9rem; font-family: 'DM Sans', sans-serif;
    transition: all .15s; display: flex; align-items: center; gap: 8px;
  }
  .btn-back:hover { background: var(--foam); border-color: var(--latte); color: var(--espresso); }
  .btn-sm {
    padding: 7px 14px; border-radius: 10px; border: none;
    cursor: pointer; font-size: 0.8rem; font-weight: 600;
    font-family: 'DM Sans', sans-serif; transition: all .15s; margin-right: 6px;
  }
  .btn-edit { background: #EFF6FF; color: #1D4ED8; }
  .btn-edit:hover { background: #DBEAFE; }
  .btn-delete { background: #FEF2F2; color: #B91C1C; }
  .btn-delete:hover { background: #FEE2E2; }
  .btn-complete { background: #ECFDF5; color: #065F46; }
  .btn-complete:hover { background: #D1FAE5; }
  .btn-reopen { background: #FEF3C7; color: #92400E; }
  .btn-reopen:hover { background: #FDE68A; }

  /* ─── SECTION HEADER ─── */
  .section-header { text-align: center; margin-bottom: 3rem; }
  .section-tag { display: inline-block; color: var(--bark); font-size: 0.75rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 0.75rem; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem,4vw,3rem); font-weight: 700; color: var(--espresso); line-height: 1.2; }
  .section-desc { color: var(--muted); font-size: 1rem; margin-top: 0.75rem; }

  /* ─── CATEGORY FILTERS ─── */
  .cat-filters { display: flex; gap: 10px; justify-content: center; margin-bottom: 2.5rem; flex-wrap: wrap; }
  .cat-btn {
    padding: 10px 24px; border-radius: 50px; border: 1.5px solid rgba(92,51,23,0.2);
    background: #fff; color: var(--muted); font-size: 0.88rem; font-weight: 500;
    cursor: pointer; transition: all .2s; font-family: 'DM Sans', sans-serif;
  }
  .cat-btn:hover, .cat-btn.active { background: var(--espresso); color: #fff; border-color: var(--espresso); box-shadow: 0 4px 16px rgba(44,24,16,0.3); }

  /* ─── PRODUCT GRID ─── */
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
  .product-card {
    background: #fff; border-radius: 24px; overflow: hidden;
    box-shadow: var(--card-shadow); transition: all .35s cubic-bezier(.34,1.56,.64,1);
    border: 1px solid rgba(193,154,107,0.15);
  }
  .product-card:hover { transform: translateY(-10px); box-shadow: var(--card-shadow-hover); }
  .product-img-wrap { position: relative; height: 220px; background: linear-gradient(135deg,#F5EAD8,#E8D5BC); overflow: hidden; }
  .product-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s ease; }
  .product-card:hover .product-img-wrap img { transform: scale(1.07); }
  .product-category-badge {
    position: absolute; top: 14px; left: 14px;
    background: rgba(44,24,16,0.75); color: var(--latte);
    font-size: 0.7rem; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 5px 12px; border-radius: 50px;
    backdrop-filter: blur(8px);
  }
  .product-no-img {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 5rem;
    background: linear-gradient(135deg,#F0E0C8,#DFC5A0);
  }
  .product-body { padding: 1.5rem; }
  .product-name { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--espresso); margin-bottom: 0.4rem; }
  .product-desc { color: var(--muted); font-size: 0.88rem; line-height: 1.6; margin-bottom: 1.2rem; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: var(--coffee); }
  .add-btn {
    background: var(--espresso); color: #fff; border: none;
    padding: 10px 22px; border-radius: 50px; font-size: 0.85rem;
    font-weight: 600; cursor: pointer; transition: all .2s;
    font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 8px;
  }
  .add-btn:hover { background: var(--coffee); transform: scale(1.05); box-shadow: 0 6px 20px rgba(44,24,16,0.3); }
  .add-btn.added { background: var(--leaf); }

  /* ─── MODAL ─── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.65);
    backdrop-filter: blur(6px); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  }
  .modal-box {
    background: #fff; border-radius: 28px; width: 100%;
    max-width: 560px; max-height: 92vh; overflow-y: auto;
    animation: modalIn .3s cubic-bezier(.34,1.56,.64,1); position: relative;
  }
  .modal-box.wide { max-width: 900px; }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(.92) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 2rem 2rem 1rem; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 700; color: var(--espresso); }
  .modal-close {
    background: rgba(0,0,0,0.06); border: none; width: 36px; height: 36px;
    border-radius: 50%; cursor: pointer; font-size: 1.1rem; color: var(--muted);
    display: flex; align-items: center; justify-content: center; transition: all .2s; flex-shrink: 0;
  }
  .modal-close:hover { background: rgba(0,0,0,0.12); color: var(--text); }
  .modal-body { padding: 1.5rem 2rem 2rem; }

  /* ─── FORMS ─── */
  .form-group { margin-bottom: 1.25rem; }
  .form-label { display: block; font-size: 0.82rem; font-weight: 600; color: var(--espresso); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 0.5rem; }
  .form-input, .form-select, .form-textarea {
    width: 100%; padding: 14px 18px; border: 1.5px solid rgba(0,0,0,0.12);
    border-radius: 14px; font-size: 1rem; font-family: 'DM Sans', sans-serif;
    color: var(--text); background: #fff; transition: all .2s; outline: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--latte); box-shadow: 0 0 0 4px rgba(193,154,107,0.15);
  }
  .form-textarea { height: 100px; resize: none; }

  /* ─── PAYMENT OPTIONS ─── */
  .payment-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
  .payment-option {
    display: flex; align-items: center; gap: 10px; padding: 12px 16px;
    border: 2px solid rgba(193,154,107,0.2); border-radius: 12px;
    cursor: pointer; transition: all 0.2s; background: var(--foam);
  }
  .payment-option:hover { border-color: var(--latte); background: rgba(193,154,107,0.05); }
  .payment-option.selected { border-color: var(--gold); background: rgba(200,150,30,0.08); }
  .payment-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text); font-weight: 500; }
  .payment-label i { color: var(--latte); font-size: 16px; }

  /* ─── CART ─── */
  .cart-item {
    display: flex; align-items: center; gap: 14px; padding: 1rem;
    background: var(--foam); border-radius: 16px; margin-bottom: 12px;
    border: 1px solid rgba(193,154,107,0.15);
  }
  .cart-item-img { width: 68px; height: 68px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }
  .cart-item-emoji {
    width: 68px; height: 68px; border-radius: 12px;
    background: linear-gradient(135deg,#F0E0C8,#DFC5A0);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; flex-shrink: 0;
  }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-weight: 600; font-size: 1rem; color: var(--espresso); }
  .cart-item-price { color: var(--bark); font-size: 0.9rem; margin-top: 2px; }
  .cart-qty { display: flex; align-items: center; gap: 10px; }
  .qty-btn {
    width: 32px; height: 32px; border-radius: 50%;
    border: 1.5px solid rgba(0,0,0,0.12); background: #fff;
    cursor: pointer; font-size: 1rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    color: var(--espresso); transition: all .15s;
  }
  .qty-btn:hover { background: var(--espresso); color: #fff; border-color: var(--espresso); }
  .qty-num { font-weight: 700; font-size: 1rem; min-width: 24px; text-align: center; }
  .remove-btn { background: none; border: none; color: rgba(0,0,0,0.25); cursor: pointer; font-size: 1rem; padding: 4px 8px; transition: color .15s; }
  .remove-btn:hover { color: #e53e3e; }
  .cart-subtotal { font-weight: 700; color: var(--coffee); min-width: 70px; text-align: right; font-size: 1rem; }
  .cart-total-bar { border-top: 1px solid rgba(0,0,0,0.08); padding-top: 1.5rem; margin-top: 0.5rem; }
  .cart-total-row { display: flex; justify-content: space-between; align-items: center; font-size: 1.3rem; font-weight: 700; color: var(--espresso); margin-bottom: 1.2rem; }
  .cart-total-amount { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: var(--coffee); }
  .cart-actions { display: flex; gap: 12px; }

  /* ─── SUCCESS ─── */
  .success-icon {
    width: 90px; height: 90px; background: linear-gradient(135deg,#48bb78,#38a169);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem; font-size: 2rem; color: #fff;
    box-shadow: 0 10px 30px rgba(72,187,120,0.4);
  }

  /* ─── ADMIN DASHBOARD ─── */
  .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 20px; margin-bottom: 2rem; }
  .dash-card {
    border-radius: 24px; padding: 2rem; cursor: pointer;
    transition: all .25s cubic-bezier(.34,1.56,.64,1);
    text-align: center; border: none; font-family: 'DM Sans', sans-serif;
  }
  .dash-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
  .dash-card .icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
  .dash-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
  .dash-card p { font-size: 0.85rem; opacity: 0.8; }
  .dc-blue { background: linear-gradient(135deg,#3B82F6,#1D4ED8); color: #fff; }
  .dc-green { background: linear-gradient(135deg,#10B981,#047857); color: #fff; }
  .dc-amber { background: linear-gradient(135deg,var(--latte),var(--gold)); color: var(--espresso); }
  .dc-red { background: linear-gradient(135deg,#EF4444,#B91C1C); color: #fff; }
  .dc-purple { background: linear-gradient(135deg,#8B5CF6,#6D28D9); color: #fff; }

  /* ─── TABLE ─── */
  .data-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: var(--card-shadow); }
  .data-table th { background: var(--espresso); color: var(--latte); padding: 1rem 1.25rem; text-align: left; font-size: 0.8rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
  .data-table td { padding: 1rem 1.25rem; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 0.95rem; color: var(--text); vertical-align: middle; }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: var(--foam); }

  /* ─── BADGES ─── */
  .badge { display: inline-block; padding: 5px 14px; border-radius: 50px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.5px; }
  .badge-pending { background: #FEF3C7; color: #92400E; }
  .badge-completed { background: #D1FAE5; color: #065F46; }
  .badge-cancelled { background: #FEE2E2; color: #991B1B; }
  .badge-active { background: #D1FAE5; color: #065F46; }
  .badge-inactive { background: #F3F4F6; color: #6B7280; }

  /* ─── STATS ─── */
  .stats-row { display: grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap: 16px; margin-bottom: 2rem; }
  .stat-box { background: #fff; border-radius: 18px; padding: 1.5rem; box-shadow: var(--card-shadow); border: 1px solid rgba(193,154,107,0.12); }
  .stat-box .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: var(--espresso); line-height: 1; }
  .stat-box .stat-label { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }

  /* ─── BACK BAR ─── */
  .back-bar { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }

  /* ─── ORDER DETAIL ─── */
  .order-item-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed rgba(0,0,0,0.08); font-size: 0.95rem; }
  .order-item-row:last-child { border: none; }

  /* ─── STAFF ─── */
  .staff-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 20px; }
  .staff-card { background: #fff; border-radius: 20px; padding: 1.75rem; box-shadow: var(--card-shadow); border: 1px solid rgba(193,154,107,0.15); }
  .staff-avatar {
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg,var(--latte),var(--gold));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; font-weight: 700; color: var(--espresso); flex-shrink: 0;
    font-family: 'Cormorant Garamond', serif;
  }
  .staff-name { font-weight: 700; font-size: 1rem; color: var(--espresso); margin-bottom: 3px; }
  .staff-role { font-size: 0.82rem; color: var(--bark); font-weight: 500; margin-bottom: 3px; }
  .staff-contact { font-size: 0.8rem; color: var(--muted); }

  /* ─── TOAST ─── */
  .toast {
    position: fixed; top: 88px; right: 24px; z-index: 9000;
    padding: 14px 22px; border-radius: 16px; color: #fff;
    font-weight: 600; font-size: 0.92rem; box-shadow: 0 8px 30px rgba(0,0,0,0.25);
    transform: translateX(calc(100% + 30px));
    transition: transform .3s cubic-bezier(.34,1.56,.64,1);
    max-width: 340px; display: flex; align-items: center; gap: 10px;
  }
  .toast.show { transform: translateX(0); }
  .toast.success { background: linear-gradient(135deg,#10B981,#047857); }
  .toast.error { background: linear-gradient(135deg,#EF4444,#B91C1C); }
  .toast.info { background: linear-gradient(135deg,var(--bark),var(--coffee)); }

  /* ─── EMPTY STATE ─── */
  .empty-state { text-align: center; padding: 4rem 2rem; color: var(--muted); }
  .empty-state .emoji { font-size: 4rem; margin-bottom: 1rem; }
  .empty-state p { font-size: 1.1rem; }

  /* ─── FOOTER ─── */
  .site-footer { background: var(--espresso); color: rgba(255,255,255,0.6); text-align: center; padding: 2rem; font-size: 0.85rem; }
  .site-footer strong { color: var(--latte); }

  /* ─── SCROLLBAR ─── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: rgba(0,0,0,0.04); }
  ::-webkit-scrollbar-thumb { background: var(--latte); border-radius: 3px; }

  /* ─── CHATBOT ─── */
  .chatbot-toggle {
    position: fixed; bottom: 24px; right: 24px;
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--caramel));
    border: none; color: white; font-size: 24px; cursor: pointer;
    box-shadow: 0 4px 24px rgba(200,150,30,0.4); z-index: 199;
    display: flex; align-items: center; justify-content: center; transition: all 0.3s;
  }
  .chatbot-toggle:hover { transform: scale(1.1); box-shadow: 0 6px 32px rgba(200,150,30,0.6); }
  .chatbot-toggle.active { background: var(--espresso); }
  .chat-notification-badge {
    position: absolute; top: -4px; right: -4px;
    background: #E74C3C; color: white; border-radius: 50%;
    width: 24px; height: 24px; font-size: 12px;
    display: flex; align-items: center; justify-content: center; font-weight: 600;
  }
  .chatbot-sidebar {
    position: fixed; right: -420px; top: 0; width: 380px; height: 100vh;
    background: #fff; border-left: 1px solid rgba(193,154,107,0.2);
    box-shadow: -10px 0 40px rgba(44,24,16,0.15);
    z-index: 200; display: flex; flex-direction: column; transition: right 0.3s ease;
  }
  .chatbot-sidebar.open { right: 0; }
  .chatbot-header {
    background: linear-gradient(135deg, var(--coffee), var(--espresso));
    color: white; padding: 1rem;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 2px solid var(--latte);
  }
  .chatbot-header h3 { margin: 0; font-size: 1rem; font-weight: 600; }
  .chatbot-close { background: none; border: none; color: white; font-size: 20px; cursor: pointer; }
  .chatbot-messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 12px; }
  .chat-message { display: flex; animation: slideIn 0.3s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .chat-message.bot { justify-content: flex-start; }
  .chat-message.user { justify-content: flex-end; }
  .message-text { padding: 10px 14px; border-radius: 12px; max-width: 85%; word-wrap: break-word; font-size: 0.9rem; line-height: 1.4; }
  .chat-message.bot .message-text { background: var(--foam); color: var(--text); border-bottom-left-radius: 0; }
  .chat-message.user .message-text { background: var(--gold); color: white; border-bottom-right-radius: 0; }
  .chatbot-input-area { padding: 1rem; border-top: 1px solid rgba(193,154,107,0.2); }
  .quick-buttons { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .quick-btn {
    padding: 6px 10px; background: var(--foam); border: 1px solid var(--latte);
    color: var(--text); border-radius: 16px; font-size: 0.75rem;
    cursor: pointer; transition: all 0.2s; font-weight: 500;
  }
  .quick-btn:hover { background: var(--latte); color: white; }
  .chat-input-wrapper { display: flex; gap: 8px; }
  .chat-input {
    flex: 1; padding: 10px 12px; border: 1px solid var(--latte);
    border-radius: 20px; font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; outline: none; transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: var(--gold); }
  .chat-send-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--gold); border: none; color: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px;
  }
  .chat-send-btn:hover { background: var(--caramel); transform: scale(1.05); }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 768px) {
    .nav-brand-sub { display: none; }
    .hero { padding: 3rem 1.5rem; }
    .hero h1 { font-size: 2.5rem; }
    .main-content { padding: 2rem 1rem 4rem; }
    .chatbot-sidebar { width: 100%; right: -100%; }
  }
`;

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PRODUCT_IMAGES = {
  1: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80',
  2: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80',
  3: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&q=80',
  4: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80',
  5: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&q=80',
  6: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=600&q=80',
  7: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
  8: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
};
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80';
const CATEGORY_EMOJI =     { 'Espresso':'☕','Cappuccino':'☕','Caramel Latte':'☕','Matcha Latte':'🍵','Americano':'☕','Mocha':'☕','Croissant':'🥐','Chocolate Cake':'🍰' };
const CAT_EMOJI = { 'Drinks':'☕','Food':'🥐','Desserts':'🍰','Others':'✨' };
const PAYMENT_ICONS = { cash: 'money-bill-wave', gcash: 'mobile-alt', paymaya: 'credit-card', bank: 'university' };
const PAYMENT_LABELS = { cash: 'Cash on Delivery', gcash: 'GCash', paymaya: 'PayMaya', bank: 'Bank Transfer' };

const CHATBOT_RESPONSES = {
  greeting: "Hi! 👋 Welcome to Angel & Josh Caffee. How can I help you today?",
  faqs: {
    hours: "⏰ We're open: Monday-Friday 7AM-6PM, Saturday-Sunday 8AM-5PM",
    location: "📍 Located at Genonocan, Tubigon, Bohol. Come visit us!",
    menu: "☕ We have: Espresso, Cappuccino, Caramel Latte, Americano, Matcha Latte, Mocha, and delicious desserts!",
    payment: "💳 We accept cash and online payment. Choose during checkout.",
    delivery: "🚗 We offer local delivery in Tubigon area. Select 'Delivery' during checkout.",
    contact: "📞 Call us at: 0917-XXX-XXXX or email: info@alysascafe.ph"
  },
  suggestions: [
    { text: "☕ Menu & Prices", key: 'menu' },
    { text: "⏰ Hours", key: 'hours' },
    { text: "📍 Location", key: 'location' },
    { text: "💳 Payment", key: 'payment' },
    { text: "🚗 Delivery", key: 'delivery' },
    { text: "📞 Contact", key: 'contact' }
  ]
};

const INITIAL_PRODUCTS = [
  { id:1, name:'Espresso',       price:120, category:'Drinks',   description:'Bold single shot. Rich, concentrated coffee with velvety crema.',     is_available:1 },
  { id:2, name:'Cappuccino',     price:155, category:'Drinks',   description:'Espresso with silky steamed milk and a thick layer of frothed foam.',  is_available:1 },
  { id:3, name:'Caramel Latte',  price:170, category:'Drinks',   description:'Sweet & creamy. Espresso, steamed milk, and house caramel drizzle.',   is_available:1 },
  { id:4, name:'Matcha Latte',   price:165, category:'Drinks',   description:'Premium Japanese ceremonial matcha blended with oat milk.',            is_available:1 },
  { id:5, name:'Americano',      price:130, category:'Drinks',   description:'Classic black coffee. Double espresso pulled long with hot water.',    is_available:1 },
  { id:6, name:'Mocha',          price:160, category:'Drinks',   description:'Chocolate coffee delight. Espresso, Belgian cocoa, steamed milk.',     is_available:1 },
  { id:7, name:'Croissant',      price: 85, category:'Food',     description:'Flaky, buttery pastry baked fresh daily. Perfect with any coffee.',    is_available:1 },
  { id:8, name:'Chocolate Cake', price: 95, category:'Desserts', description:'Rich fudgy slice with ganache frosting. Intensely chocolatey.',        is_available:1 },
];

const INITIAL_STAFF = [
  { id:1, full_name:'Alysa Santos',   role:'Owner / Manager', phone:'09171234567', email:'alysa@alysascafe.ph',   is_active:1 },
  { id:2, full_name:'Maria Cruz',     role:'Barista',          phone:'09181234567', email:'maria@alysascafe.ph',   is_active:1 },
  { id:3, full_name:'Jose Reyes',     role:'Barista',          phone:'09191234567', email:'jose@alysascafe.ph',    is_active:1 },
  { id:4, full_name:'Ana Villanueva', role:'Cashier',          phone:'09201234567', email:'ana@alysascafe.ph',     is_active:1 },
];

const INITIAL_ORDERS = [
  { id:1, customer_name:'Juan dela Cruz',  customer_phone:'09171110001', customer_address:'Genonocan, Tubigon', notes:'', payment_method:'cash', total:470, status:'Pending',   order_date:'2024-11-20', items:[{product_id:2,quantity:2,name:'Cappuccino',unit_price:155},{product_id:6,quantity:1,name:'Mocha',unit_price:160}] },
  { id:2, customer_name:'Maria Santos',    customer_phone:'09181110002', customer_address:'Poblacion, Tubigon',  notes:'Extra hot please', payment_method:'gcash', total:295, status:'Completed', order_date:'2024-11-21', items:[{product_id:5,quantity:1,name:'Americano',unit_price:130},{product_id:4,quantity:1,name:'Matcha Latte',unit_price:165}] },
  { id:3, customer_name:'Pedro Reyes',     customer_phone:'09191110003', customer_address:'Matabao, Tubigon',    notes:'No sugar on the latte', payment_method:'cash', total:630, status:'Pending',   order_date:'2024-11-22', items:[{product_id:3,quantity:3,name:'Caramel Latte',unit_price:170},{product_id:1,quantity:1,name:'Espresso',unit_price:120}] },
];

// ─── ACCOUNTS ────────────────────────────────────────────────────────────────
// role: 'admin' = full access | 'staff' = view-only (orders, menu, staff — no delete/edit)
const ACCOUNTS = [
  { username: 'jai',             password: '212121',  role: 'staff', displayName: 'Jai' },
  { username: 'jireh@gmail.com', password: 'faith',   role: 'admin', displayName: 'Jireh' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getProductImg(p) { return PRODUCT_IMAGES[p.id] || FALLBACK_IMG; }
function getProductEmoji(p) { return CATEGORY_EMOJI[p.name] || CAT_EMOJI[p.category] || '☕'; }

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <>
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.show ? 'show' : ''} ${t.type}`}>
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAdd, adminMode, onEdit, onDelete, onToggle }) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  function handleAdd() {
    onAdd(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        {imgError ? (
          <div className="product-no-img"><span style={{fontSize:'4rem'}}>{getProductEmoji(product)}</span></div>
        ) : (
          <img src={getProductImg(product)} alt={product.name} loading="lazy" onError={() => setImgError(true)} />
        )}
        <span className="product-category-badge">{product.category}</span>
        {adminMode && !product.is_available && (
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{background:'red',color:'#fff',padding:'4px 12px',borderRadius:'50px',fontSize:'0.75rem',fontWeight:700}}>UNAVAILABLE</span>
          </div>
        )}
      </div>
      <div className="product-body">
        <div className="product-name">{product.name}</div>
        <div className="product-desc">{product.description}</div>
        <div className="product-footer">
          <div className="product-price">₱{product.price.toLocaleString()}</div>
          {adminMode ? (
            <div style={{display:'flex',gap:6}}>
              <button className="btn-sm btn-edit" onClick={() => onEdit(product.id)}><i className="fas fa-pen"></i></button>
              <button className="btn-sm btn-edit" style={{background: product.is_available?'#FEF3C7':'#ECFDF5',color:product.is_available?'#92400E':'#065F46'}} onClick={() => onToggle(product.id)}>{product.is_available?'Hide':'Show'}</button>
              <button className="btn-sm btn-delete" onClick={() => onDelete(product.id)}><i className="fas fa-trash"></i></button>
            </div>
          ) : (
            <button className={`add-btn${added ? ' added' : ''}`} onClick={handleAdd}>
              <i className={`fas fa-${added ? 'check' : 'plus'}`}></i> {added ? 'Added' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────
function Modal({ onClose, wide, children }) {
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal-box${wide ? ' wide' : ''}`}>
        {children}
      </div>
    </div>
  );
}

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: CHATBOT_RESPONSES.greeting }]);
  const [showQuick, setShowQuick] = useState(true);
  const [input, setInput] = useState('');
  const [badgeVisible, setBadgeVisible] = useState(true);
  const msgRef = useRef(null);

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [messages]);

  function addMsg(sender, text) {
    setMessages(prev => [...prev, { sender, text }]);
  }

  function handleQuick(key) {
    const suggestion = CHATBOT_RESPONSES.suggestions.find(s => s.key === key);
    addMsg('user', suggestion.text);
    setTimeout(() => addMsg('bot', CHATBOT_RESPONSES.faqs[key]), 300);
    setShowQuick(false);
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    addMsg('user', text);
    setInput('');
    setShowQuick(false);
    const lower = text.toLowerCase();
    let response = "Thanks for your message! For more info, check our FAQs above or contact us. 😊";
    if (lower.includes('menu') || lower.includes('price') || lower.includes('drink') || lower.includes('coffee')) response = CHATBOT_RESPONSES.faqs.menu;
    else if (lower.includes('hour') || lower.includes('open')) response = CHATBOT_RESPONSES.faqs.hours;
    else if (lower.includes('location') || lower.includes('where') || lower.includes('address')) response = CHATBOT_RESPONSES.faqs.location;
    else if (lower.includes('order') || lower.includes('buy')) response = "Great! Click the cart icon to start placing your order. We'll deliver it to you! 📦";
    else if (lower.includes('payment') || lower.includes('pay')) response = CHATBOT_RESPONSES.faqs.payment;
    else if (lower.includes('deliver')) response = CHATBOT_RESPONSES.faqs.delivery;
    else if (lower.includes('contact') || lower.includes('phone') || lower.includes('call')) response = CHATBOT_RESPONSES.faqs.contact;
    addMsg('bot', response);
  }

  return (
    <>
      <div className={`chatbot-sidebar${open ? ' open' : ''}`}>
        <div className="chatbot-header">
          <h3>Angel & Josh's Assistant</h3>
          <button className="chatbot-close" onClick={() => setOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        <div className="chatbot-messages" ref={msgRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.sender}`}>
              <div className="message-text" dangerouslySetInnerHTML={{ __html: m.text }} />
            </div>
          ))}
        </div>
        <div className="chatbot-input-area">
          {showQuick && (
            <div className="quick-buttons">
              {CHATBOT_RESPONSES.suggestions.map(s => (
                <button key={s.key} className="quick-btn" onClick={() => handleQuick(s.key)}>{s.text}</button>
              ))}
            </div>
          )}
          <div className="chat-input-wrapper">
            <input
              className="chat-input" value={input} placeholder="Type a message..."
              onChange={e => setInput(e.target.value)}
              onKeyUp={e => { if (e.key === 'Enter') sendMessage(); }}
            />
            <button className="chat-send-btn" onClick={sendMessage}><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
      <button
        className={`chatbot-toggle${open ? ' active' : ''}`}
        style={{ position: 'fixed' }}
        onClick={() => { setOpen(o => !o); setBadgeVisible(false); }}
        title="Chat with us"
      >
        <i className="fas fa-comments"></i>
        {badgeVisible && <span className="chat-notification-badge">1</span>}
      </button>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  // Inject styles once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ─── State ───
  const [page, setPage] = useState('home'); // home | menu | admin | adminOrders | adminProducts | adminStaff | productForm | staffForm
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cafe_cart') || '[]'); } catch { return []; }
  });
  const [catFilter, setCatFilter] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // { username, role, displayName }
  const [nextOrderId, setNextOrderId] = useState(INITIAL_ORDERS.length + 1);
  const [toasts, setToasts] = useState([]);

  // Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [successCartSnap, setSuccessCartSnap] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [myOrdersOpen, setMyOrdersOpen] = useState(false);
  const [orderDetailId, setOrderDetailId] = useState(null);

  // Admin forms
  const [editingProduct, setEditingProduct] = useState(null); // null = add new, object = edit
  const [editingStaff, setEditingStaff] = useState(null);

  // Checkout form
  const [coName, setCoName] = useState('');
  const [coPhone, setCoPhone] = useState('');
  const [coAddress, setCoAddress] = useState('');
  const [coNotes, setCoNotes] = useState('');
  const [coPayment, setCoPayment] = useState('cash');

  // Login
  const [loginUsername, setLoginUsername] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Order tracking
  const [trackPhone, setTrackPhone] = useState('');
  const [trackResults, setTrackResults] = useState(null);

  // ─── Persist cart ───
  useEffect(() => { localStorage.setItem('cafe_cart', JSON.stringify(cart)); }, [cart]);

  // ─── Toast helper ───
  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type, show: false }]);
    setTimeout(() => setToasts(prev => prev.map(t => t.id === id ? { ...t, show: true } : t)), 20);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, show: false } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
    }, 3500);
  }, []);

  // ─── Cart helpers ───
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  function addToCart(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    setCart(prev => {
      const ex = prev.find(x => x.id === id);
      if (ex) return prev.map(x => x.id === id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...prev, { ...p, quantity: 1 }];
    });
    showToast(`${p.name} added to cart!`, 'success');
  }

  function updateQty(id, delta) {
    setCart(prev => {
      const updated = prev.map(x => x.id === id ? { ...x, quantity: x.quantity + delta } : x);
      return updated.filter(x => x.quantity > 0);
    });
  }

  function removeFromCart(id) { setCart(prev => prev.filter(x => x.id !== id)); }

  // ─── Checkout ───
  function submitOrder() {
    if (!coName || !coPhone) { showToast('Please enter your name and phone', 'error'); return; }
    const newOrder = {
      id: nextOrderId,
      customer_name: coName, customer_phone: coPhone,
      customer_address: coAddress, notes: coNotes,
      payment_method: coPayment,
      total: cartTotal, status: 'Pending',
      order_date: new Date().toISOString().split('T')[0],
      items: cart.map(i => ({ product_id: i.id, quantity: i.quantity, name: i.name, unit_price: i.price }))
    };
    setOrders(prev => [...prev, newOrder]);
    setNextOrderId(n => n + 1);
    setSuccessCartSnap([...cart]);
    setSuccessOrder(newOrder);
    setCart([]);
    setCheckoutOpen(false);
    setCoName(''); setCoPhone(''); setCoAddress(''); setCoNotes(''); setCoPayment('cash');
  }

  // ─── Admin ───
  function loginAdmin() {
    const account = ACCOUNTS.find(
      a => a.username.toLowerCase() === loginUsername.trim().toLowerCase() && a.password === adminPass
    );
    if (account) {
      setIsAdmin(true);
      setCurrentUser(account);
      setLoginOpen(false);
      setLoginUsername('');
      setAdminPass('');
      setPage('admin');
    } else {
      showToast('Incorrect username or password', 'error');
      setAdminPass('');
    }
  }
  function logoutAdmin() { setIsAdmin(false); setCurrentUser(null); setPage('home'); showToast('Logged out', 'info'); }

  // ─── Order tracking ───
  function lookupOrders() {
    if (!trackPhone) { showToast('Enter your phone number', 'error'); return; }
    const found = orders.filter(o => o.customer_phone === trackPhone);
    setTrackResults(found);
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  function renderHome() {
    const availableProducts = products.filter(p => p.is_available);
    return (
      <>
        <div className="hero">
          <div className="hero-content">
            <div className="hero-eyebrow">Genonocan, Tubigon, Bohol</div>
            <h1>Your Daily Cup<br />of <em>Happiness</em></h1>
            <p className="hero-desc">Handcrafted drinks & fresh bites made with love. Visit us or browse our menu and place your order online.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => setPage('menu')}>
                <i className="fas fa-coffee" style={{marginRight:8}}></i>Browse Menu
              </button>
              <button className="btn-outline" onClick={() => setMyOrdersOpen(true)}>Track My Order</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="num">{availableProducts.length}</div><div className="label">Menu Items</div></div>
              <div className="hero-stat"><div className="num">{staff.length}</div><div className="label">Staff Members</div></div>
              <div className="hero-stat"><div className="num">{orders.length}</div><div className="label">Orders Served</div></div>
            </div>
          </div>
        </div>

        <div className="section-header">
          <div className="section-tag">Our Bestsellers</div>
          <h2 className="section-title">Crafted for Every Mood</h2>
          <p className="section-desc">From bold espressos to comforting lattes — there's something for everyone.</p>
        </div>
        <div className="product-grid">
          {availableProducts.slice(0, 3).map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:'2rem'}}>
          <button className="btn-primary" style={{background:'var(--espresso)'}} onClick={() => setPage('menu')}>
            View Full Menu →
          </button>
        </div>
      </>
    );
  }

  function renderMenu() {
    const cats = ['All', 'Drinks', 'Food', 'Desserts', 'Others'];
    const filtered = catFilter === 'All' ? products.filter(p => p.is_available) : products.filter(p => p.category === catFilter && p.is_available);
    return (
      <>
        <div className="section-header">
          <div className="section-tag">Fresh & Handcrafted</div>
          <h2 className="section-title">Our Menu</h2>
        </div>
        <div className="cat-filters">
          {cats.map(c => (
            <button key={c} className={`cat-btn${catFilter === c ? ' active' : ''}`} onClick={() => setCatFilter(c)}>{c}</button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="emoji">☕</div><p>No items in this category.</p></div>
        ) : (
          <div className="product-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
          </div>
        )}
      </>
    );
  }

  function renderAdmin() {
    const pending = orders.filter(o => o.status === 'Pending').length;
    const revenue = orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.total, 0);
    return (
      <>
        <div className="back-bar" style={{justifyContent:'space-between'}}>
          <div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'var(--espresso)'}}>Admin Dashboard</h2>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
              <span style={{fontSize:'0.82rem',color:'var(--muted)'}}>Logged in as <strong style={{color:'var(--espresso)'}}>{currentUser?.displayName}</strong></span>
              <span className={`badge ${currentUser?.role === 'admin' ? 'badge-completed' : 'badge-pending'}`} style={{fontSize:'0.7rem'}}>
                {currentUser?.role === 'admin' ? '⭐ Admin' : '👤 Staff'}
              </span>
            </div>
          </div>
          <button className="btn-back" onClick={logoutAdmin}><i className="fas fa-sign-out-alt"></i> Logout</button>
        </div>
        <div className="stats-row">
          <div className="stat-box"><div className="stat-num">{products.filter(p => p.is_available).length}</div><div className="stat-label">Active Products</div></div>
          <div className="stat-box"><div className="stat-num">{orders.length}</div><div className="stat-label">Total Orders</div></div>
          <div className="stat-box"><div className="stat-num">{pending}</div><div className="stat-label">Pending Orders</div></div>
          <div className="stat-box"><div className="stat-num">₱{revenue.toLocaleString()}</div><div className="stat-label">Revenue (Completed)</div></div>
        </div>
        <div className="dashboard-grid">
          <div className="dash-card dc-blue" onClick={() => setPage('adminProducts')}>
            <div className="icon"><i className="fas fa-coffee"></i></div>
            <h3>Products</h3>
            <p>{products.length} menu items</p>
          </div>
          <div className="dash-card dc-amber" onClick={() => setPage('adminOrders')}>
            <div className="icon"><i className="fas fa-clipboard-list"></i></div>
            <h3>Orders</h3>
            <p>{orders.length} total — {pending} pending</p>
          </div>
          <div className="dash-card dc-green" onClick={() => setPage('adminStaff')}>
            <div className="icon"><i className="fas fa-users"></i></div>
            <h3>Staff</h3>
            <p>{staff.length} team members</p>
          </div>
          <div className="dash-card dc-purple" onClick={() => setPage('menu')}>
            <div className="icon"><i className="fas fa-eye"></i></div>
            <h3>View Menu</h3>
            <p>Customer view</p>
          </div>
        </div>
      </>
    );
  }

  function renderAdminOrders() {
    return (
      <>
        <div className="back-bar">
          <button className="btn-back" onClick={() => setPage('admin')}><i className="fas fa-arrow-left"></i> Dashboard</button>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'var(--espresso)'}}>Orders</h2>
        </div>
        <div className="stats-row">
          <div className="stat-box"><div className="stat-num">{orders.length}</div><div className="stat-label">All Orders</div></div>
          <div className="stat-box"><div className="stat-num">{orders.filter(o => o.status === 'Pending').length}</div><div className="stat-label">Pending</div></div>
          <div className="stat-box"><div className="stat-num">{orders.filter(o => o.status === 'Completed').length}</div><div className="stat-label">Completed</div></div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr>
              <th>Order #</th><th>Customer</th><th>Phone</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td><strong>#{o.id}</strong></td>
                  <td>{o.customer_name}</td>
                  <td>{o.customer_phone}</td>
                  <td><strong style={{color:'var(--coffee)'}}>₱{o.total.toLocaleString()}</strong></td>
                  <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                  <td>{o.order_date}</td>
                  <td>
                    <button className="btn-sm btn-edit" onClick={() => setOrderDetailId(o.id)}><i className="fas fa-eye"></i> View</button>
                    {currentUser?.role === 'admin' && (
                      <>
                        {o.status === 'Pending'
                          ? <button className="btn-sm btn-complete" onClick={() => setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: 'Completed' } : x))}>✓ Complete</button>
                          : <button className="btn-sm btn-reopen" onClick={() => setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: 'Pending' } : x))}>↺ Reopen</button>
                        }
                        <button className="btn-sm btn-delete" onClick={() => { if (window.confirm(`Cancel order #${o.id}?`)) setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: 'Cancelled' } : x)); }}>✕ Cancel</button>
                        <button className="btn-sm btn-delete" onClick={() => { if (window.confirm(`Delete order #${o.id} permanently?`)) setOrders(prev => prev.filter(x => x.id !== o.id)); showToast(`Order #${o.id} deleted`, 'info'); }}>🗑 Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  function renderAdminProducts() {
    const isStaff = currentUser?.role === 'staff';
    return (
      <>
        <div className="back-bar">
          <button className="btn-back" onClick={() => setPage('admin')}><i className="fas fa-arrow-left"></i> Dashboard</button>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'var(--espresso)'}}>Products</h2>
          {!isStaff && (
            <button className="btn-primary" style={{marginLeft:'auto'}} onClick={() => { setEditingProduct(null); setPage('productForm'); }}>
              <i className="fas fa-plus" style={{marginRight:8}}></i>Add Product
            </button>
          )}
        </div>
        <div className="product-grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onAdd={() => {}} adminMode={!isStaff}
              onEdit={id => { setEditingProduct(products.find(x => x.id === id)); setPage('productForm'); }}
              onDelete={id => { if (window.confirm('Delete this product permanently?')) { setProducts(prev => prev.filter(x => x.id !== id)); showToast('Product deleted', 'info'); } }}
              onToggle={id => { setProducts(prev => prev.map(x => x.id === id ? { ...x, is_available: x.is_available ? 0 : 1 } : x)); }}
            />
          ))}
        </div>
      </>
    );
  }

  function renderProductForm() {
    const isEdit = !!editingProduct;
    const [name, setName] = useState(isEdit ? editingProduct.name : '');
    const [price, setPrice] = useState(isEdit ? editingProduct.price : '');
    const [desc, setDesc] = useState(isEdit ? editingProduct.description : '');
    const [cat, setCat] = useState(isEdit ? editingProduct.category : 'Drinks');

    function submit() {
      const p = parseFloat(price);
      if (!name || !p || p <= 0) { showToast('Please fill name and a valid price', 'error'); return; }
      if (isEdit) {
        setProducts(prev => prev.map(x => x.id === editingProduct.id ? { ...x, name, price: p, description: desc, category: cat } : x));
        showToast('Product updated!', 'success');
      } else {
        const newId = Math.max(...products.map(x => x.id), 0) + 1;
        setProducts(prev => [...prev, { id: newId, name, price: p, description: desc, category: cat, is_available: 1 }]);
        showToast('Product added!', 'success');
      }
      setPage('adminProducts');
    }

    return (
      <>
        <div className="back-bar">
          <button className="btn-back" onClick={() => setPage('adminProducts')}><i className="fas fa-arrow-left"></i> Products</button>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'var(--espresso)'}}>{isEdit ? `Edit: ${editingProduct.name}` : 'Add New Product'}</h2>
        </div>
        <div style={{maxWidth:560,margin:'0 auto',background:'#fff',borderRadius:24,padding:'2rem',boxShadow:'var(--card-shadow)'}}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vanilla Latte" />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div className="form-group">
              <label className="form-label">Price (₱) *</label>
              <input className="form-input" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 150" />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" value={cat} onChange={e => setCat(e.target.value)}>
                {['Drinks','Food','Desserts','Others'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe this product..." />
          </div>
          <div style={{display:'flex',gap:12,marginTop:'1rem'}}>
            <button className="btn-secondary" onClick={() => setPage('adminProducts')}>Cancel</button>
            <button className="btn-checkout" style={{flex:2,display:'flex',justifyContent:'center'}} onClick={submit}>
              <i className="fas fa-save" style={{marginRight:8}}></i>{isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      </>
    );
  }

  function renderAdminStaff() {
    const isStaff = currentUser?.role === 'staff';
    return (
      <>
        <div className="back-bar">
          <button className="btn-back" onClick={() => setPage('admin')}><i className="fas fa-arrow-left"></i> Dashboard</button>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'var(--espresso)'}}>Staff</h2>
          {!isStaff && (
            <button className="btn-primary" style={{marginLeft:'auto'}} onClick={() => { setEditingStaff(null); setPage('staffForm'); }}>
              <i className="fas fa-plus" style={{marginRight:8}}></i>Add Staff
            </button>
          )}
        </div>
        <div className="staff-grid">
          {staff.map(s => (
            <div key={s.id} className="staff-card">
              <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <div className="staff-avatar">{s.full_name.charAt(0)}</div>
                <div>
                  <div className="staff-name">{s.full_name}</div>
                  <div className="staff-role">{s.role}</div>
                  <div className="staff-contact"><i className="fas fa-phone" style={{marginRight:5,color:'var(--latte)'}}></i>{s.phone}</div>
                  <div className="staff-contact" style={{marginTop:3}}><i className="fas fa-envelope" style={{marginRight:5,color:'var(--latte)'}}></i>{s.email}</div>
                </div>
              </div>
              {!isStaff && (
                <div style={{display:'flex',gap:8,marginTop:'1rem'}}>
                  <button className="btn-sm btn-edit" onClick={() => { setEditingStaff(s); setPage('staffForm'); }}><i className="fas fa-pen"></i> Edit</button>
                  <button className="btn-sm btn-delete" onClick={() => { if (window.confirm('Delete this staff member permanently?')) { setStaff(prev => prev.filter(x => x.id !== s.id)); showToast('Staff member deleted', 'info'); } }}><i className="fas fa-trash"></i></button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{marginTop:'2rem',textAlign:'center'}}>
          <p style={{color:'var(--muted)',fontSize:'0.9rem'}}>{staff.length} active members.</p>
        </div>
      </>
    );
  }

  function renderStaffForm() {
    const isEdit = !!editingStaff;
    const [sName, setSName] = useState(isEdit ? editingStaff.full_name : '');
    const [sRole, setSRole] = useState(isEdit ? editingStaff.role : 'Barista');
    const [sPhone, setSPhone] = useState(isEdit ? editingStaff.phone : '');
    const [sEmail, setSEmail] = useState(isEdit ? editingStaff.email : '');

    function submit() {
      if (!sName || !sRole || !sPhone || !sEmail) { showToast('Please fill all required fields', 'error'); return; }
      if (isEdit) {
        setStaff(prev => prev.map(x => x.id === editingStaff.id ? { ...x, full_name: sName, role: sRole, phone: sPhone, email: sEmail } : x));
        showToast('Staff updated!', 'success');
      } else {
        const newId = Math.max(...staff.map(x => x.id), 0) + 1;
        setStaff(prev => [...prev, { id: newId, full_name: sName, role: sRole, phone: sPhone, email: sEmail, is_active: 1 }]);
        showToast('Staff added!', 'success');
      }
      setPage('adminStaff');
    }

    return (
      <>
        <div className="back-bar">
          <button className="btn-back" onClick={() => setPage('adminStaff')}><i className="fas fa-arrow-left"></i> Staff</button>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,color:'var(--espresso)'}}>{isEdit ? `Edit: ${editingStaff.full_name}` : 'Add New Staff'}</h2>
        </div>
        <div style={{maxWidth:560,margin:'0 auto',background:'#fff',borderRadius:24,padding:'2rem',boxShadow:'var(--card-shadow)'}}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={sName} onChange={e => setSName(e.target.value)} placeholder="e.g. Maria Santos" />
          </div>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <select className="form-select" value={sRole} onChange={e => setSRole(e.target.value)}>
              {['Owner','Manager','Barista','Cashier','Server','Other'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className="form-input" value={sPhone} onChange={e => setSPhone(e.target.value)} placeholder="09xxxxxxxxx" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={sEmail} onChange={e => setSEmail(e.target.value)} placeholder="maria@alysascafe.ph" />
            </div>
          </div>
          <div style={{display:'flex',gap:12,marginTop:'1rem'}}>
            <button className="btn-secondary" onClick={() => setPage('adminStaff')}>Cancel</button>
            <button className="btn-checkout" style={{flex:2,display:'flex',justifyContent:'center'}} onClick={submit}>
              <i className="fas fa-save" style={{marginRight:8}}></i>{isEdit ? 'Update Staff' : 'Add Staff'}
            </button>
          </div>
        </div>
      </>
    );
  }

  const orderDetail = orderDetailId ? orders.find(o => o.id === orderDetailId) : null;

  // ─── Main Render ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => setPage('home')}>
            <div className="nav-logo-icon">☕</div>
            <div>
              <div className="nav-brand-name">Angel & Josh Caffee</div>
              <div className="nav-brand-sub">Tubigon, Bohol</div>
            </div>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => setPage('home')}>Home</button>
            <button className="nav-link" onClick={() => setPage('menu')}>Menu</button>
            <button className="nav-link" onClick={() => setMyOrdersOpen(true)}>My Orders</button>
            <button className="nav-cart-btn" onClick={() => setCartOpen(true)}>
              <i className="fas fa-shopping-bag"></i>
              Cart&nbsp;{cartCount}
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="nav-admin-btn" onClick={() => isAdmin ? setPage('admin') : setLoginOpen(true)}>
              {isAdmin ? `👤 ${currentUser?.displayName}` : 'Admin'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {page === 'home' && renderHome()}
        {page === 'menu' && renderMenu()}
        {page === 'admin' && renderAdmin()}
        {page === 'adminOrders' && renderAdminOrders()}
        {page === 'adminProducts' && renderAdminProducts()}
        {page === 'adminStaff' && renderAdminStaff()}
        {page === 'productForm' && renderProductForm()}
        {page === 'staffForm' && renderStaffForm()}
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <strong>Angel & Josh Caffee</strong>&nbsp;•&nbsp;Genonocan, Tubigon, Bohol&nbsp;•&nbsp;☕ Crafted with love
      </footer>

      {/* ─── MODALS ─── */}

      {/* Cart Modal */}
      {cartOpen && (
        <Modal onClose={() => setCartOpen(false)}>
          <div className="modal-header">
            <span className="modal-title">{cart.length ? 'Shopping Cart' : 'Your Cart'}</span>
            <button className="modal-close" onClick={() => setCartOpen(false)}><i className="fas fa-times"></i></button>
          </div>
          <div className="modal-body">
            {cart.length === 0 ? (
              <div className="empty-state">
                <div className="emoji">🛒</div><p>Your cart is empty</p>
                <button className="btn-primary" style={{marginTop:'1rem'}} onClick={() => { setCartOpen(false); setPage('menu'); }}>Browse Menu</button>
              </div>
            ) : (
              <>
                {cart.map(item => {
                  const [imgErr, setImgErr] = useState(false);
                  return (
                    <div key={item.id} className="cart-item">
                      {imgErr
                        ? <div className="cart-item-emoji">{getProductEmoji(item)}</div>
                        : <img className="cart-item-img" src={getProductImg(item)} alt={item.name} onError={() => setImgErr(true)} />
                      }
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">₱{item.price.toLocaleString()} each</div>
                      </div>
                      <div className="cart-qty">
                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                        <span className="qty-num">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}><i className="fas fa-trash-alt"></i></button>
                      </div>
                      <div className="cart-subtotal">₱{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  );
                })}
                <div className="cart-total-bar">
                  <div className="cart-total-row">
                    <span>Total</span>
                    <span className="cart-total-amount">₱{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="cart-actions">
                    <button className="btn-secondary" onClick={() => setCartOpen(false)}>Continue</button>
                    <button className="btn-checkout" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
                      <i className="fas fa-arrow-right" style={{marginRight:8}}></i>Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <Modal onClose={() => setCheckoutOpen(false)}>
          <div className="modal-header">
            <span className="modal-title">Checkout</span>
            <button className="modal-close" onClick={() => setCheckoutOpen(false)}><i className="fas fa-times"></i></button>
          </div>
          <div className="modal-body">
            <div style={{background:'var(--foam)',borderRadius:14,padding:'1rem 1.25rem',marginBottom:'1.5rem',border:'1px dashed rgba(193,154,107,0.4)'}}>
              <div style={{fontSize:'0.82rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'0.5rem'}}>Order Summary</div>
              {cart.map(i => (
                <div key={i.id} className="order-item-row">
                  <span>{i.quantity}× {i.name}</span>
                  <span style={{fontWeight:600}}>₱{(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',marginTop:10,paddingTop:10,borderTop:'1px solid rgba(0,0,0,0.08)',fontWeight:700,fontSize:'1.05rem'}}>
                <span>Total</span>
                <span style={{color:'var(--coffee)',fontFamily:"'Cormorant Garamond',serif",fontSize:'1.3rem'}}>₱{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={coName} onChange={e => setCoName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input className="form-input" type="tel" value={coPhone} onChange={e => setCoPhone(e.target.value)} placeholder="09xxxxxxxxx" />
            </div>
            <div className="form-group">
              <label className="form-label">Address / Pickup</label>
              <input className="form-input" value={coAddress} onChange={e => setCoAddress(e.target.value)} placeholder="Delivery address or 'Pickup'" />
            </div>
            <div className="form-group">
              <label className="form-label">Special Instructions</label>
              <textarea className="form-textarea" value={coNotes} onChange={e => setCoNotes(e.target.value)} placeholder="Extra sugar, no ice, etc." />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method *</label>
              <div className="payment-options">
                {[['cash','money-bill-wave','Cash on Delivery'],['gcash','mobile-alt','GCash'],['paymaya','credit-card','PayMaya'],['bank','university','Bank Transfer']].map(([val, icon, label]) => (
                  <div key={val} className={`payment-option${coPayment === val ? ' selected' : ''}`} onClick={() => setCoPayment(val)}>
                    <span className="payment-label"><i className={`fas fa-${icon}`}></i>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-checkout" style={{width:'100%',display:'flex',justifyContent:'center'}} onClick={submitOrder}>
              <i className="fas fa-check-circle" style={{marginRight:8}}></i>Place Order
            </button>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      {successOrder && (
        <Modal onClose={() => setSuccessOrder(null)}>
          <div className="modal-body" style={{textAlign:'center',padding:'3rem 2rem'}}>
            <div className="success-icon"><i className="fas fa-check"></i></div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:700,marginBottom:'0.5rem'}}>Order Placed!</h2>
            <p style={{color:'var(--muted)',marginBottom:'1.5rem'}}>Order #{successOrder.id} confirmed</p>
            <div style={{background:'var(--foam)',borderRadius:16,padding:'1.25rem',marginBottom:'1.5rem',textAlign:'left',border:'1px dashed rgba(193,154,107,0.4)'}}>
              <div style={{marginBottom:'0.75rem'}}>
                <span style={{fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:'1px',color:'var(--muted)'}}>Customer</span>
                <div style={{fontWeight:700,color:'var(--espresso)'}}>{successOrder.customer_name}</div>
                <div style={{fontSize:'0.9rem',color:'var(--muted)'}}>{successOrder.customer_phone}</div>
              </div>
              <div style={{marginBottom:'0.75rem'}}>
                <span style={{fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:'1px',color:'var(--muted)'}}>Payment Method</span>
                <div style={{fontWeight:600,color:'var(--espresso)'}}>
                  <i className={`fas fa-${PAYMENT_ICONS[successOrder.payment_method] || 'money-bill-wave'}`} style={{marginRight:6,color:'var(--latte)'}}></i>
                  {PAYMENT_LABELS[successOrder.payment_method] || 'Cash on Delivery'}
                </div>
              </div>
              {successCartSnap.map(i => (
                <div key={i.id} className="order-item-row">
                  <span>{i.quantity}× {i.name}</span>
                  <span style={{fontWeight:600}}>₱{(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',marginTop:10,paddingTop:10,borderTop:'1px solid rgba(0,0,0,0.08)',fontWeight:700}}>
                <span>Total</span>
                <span style={{color:'var(--coffee)',fontFamily:"'Cormorant Garamond',serif",fontSize:'1.3rem'}}>₱{successOrder.total.toLocaleString()}</span>
              </div>
            </div>
            <p style={{color:'var(--muted)',fontSize:'0.88rem',marginBottom:'1.5rem'}}>We'll call you at <strong>{successOrder.customer_phone}</strong> to confirm your order.</p>
            <button className="btn-primary" onClick={() => { setSuccessOrder(null); setPage('menu'); }}>Continue Shopping</button>
          </div>
        </Modal>
      )}

      {/* Login Modal */}
      {loginOpen && (
        <Modal onClose={() => { setLoginOpen(false); setLoginUsername(''); setAdminPass(''); }}>
          <div className="modal-header">
            <span className="modal-title">Staff Login</span>
            <button className="modal-close" onClick={() => { setLoginOpen(false); setLoginUsername(''); setAdminPass(''); }}><i className="fas fa-times"></i></button>
          </div>
          <div className="modal-body">
            <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
              <div style={{width:70,height:70,background:'linear-gradient(135deg,var(--latte),var(--gold))',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',margin:'0 auto 0.75rem'}}>☕</div>
              <p style={{color:'var(--muted)',fontSize:'0.9rem'}}>Staff access only</p>
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="Enter username or email" autoComplete="username" onKeyDown={e => { if (e.key === 'Enter') loginAdmin(); }} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="Enter password" autoComplete="current-password" onKeyDown={e => { if (e.key === 'Enter') loginAdmin(); }} />
            </div>
            <button className="btn-checkout" style={{width:'100%',display:'flex',justifyContent:'center'}} onClick={loginAdmin}>
              <i className="fas fa-sign-in-alt" style={{marginRight:8}}></i>Login
            </button>
          </div>
        </Modal>
      )}

      {/* My Orders Modal */}
      {myOrdersOpen && (
        <Modal onClose={() => { setMyOrdersOpen(false); setTrackPhone(''); setTrackResults(null); }}>
          <div className="modal-header">
            <span className="modal-title">Track My Order</span>
            <button className="modal-close" onClick={() => { setMyOrdersOpen(false); setTrackPhone(''); setTrackResults(null); }}><i className="fas fa-times"></i></button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Enter Your Phone Number</label>
              <input className="form-input" type="tel" value={trackPhone} onChange={e => setTrackPhone(e.target.value)} placeholder="09xxxxxxxxx" onKeyDown={e => { if (e.key === 'Enter') lookupOrders(); }} />
            </div>
            <button className="btn-checkout" style={{width:'100%',display:'flex',justifyContent:'center'}} onClick={lookupOrders}>
              <i className="fas fa-search" style={{marginRight:8}}></i>Find Orders
            </button>
            {trackResults !== null && (
              <div style={{marginTop:'1.5rem'}}>
                {trackResults.length === 0 ? (
                  <div className="empty-state"><div className="emoji">🔍</div><p>No orders found for {trackPhone}</p></div>
                ) : trackResults.map(o => (
                  <div key={o.id} style={{background:'var(--foam)',borderRadius:16,padding:'1.25rem',marginBottom:12,border:'1px solid rgba(193,154,107,0.2)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                      <span style={{fontWeight:700,color:'var(--espresso)'}}>Order #{o.id}</span>
                      <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                    </div>
                    <div style={{fontSize:'0.88rem',color:'var(--muted)',marginBottom:8}}>{o.order_date}</div>
                    <div style={{fontWeight:700,color:'var(--coffee)',fontSize:'1.1rem',fontFamily:"'Cormorant Garamond',serif"}}>₱{o.total.toLocaleString()}</div>
                    <div style={{fontSize:'0.82rem',color:'var(--muted)',marginTop:6}}>{o.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Order Detail Modal */}
      {orderDetail && (
        <Modal onClose={() => setOrderDetailId(null)}>
          <div className="modal-header">
            <span className="modal-title">Order #{orderDetail.id}</span>
            <button className="modal-close" onClick={() => setOrderDetailId(null)}><i className="fas fa-times"></i></button>
          </div>
          <div className="modal-body">
            <div style={{display:'flex',gap:'2rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
              <div><div style={{fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'1px',color:'var(--muted)'}}>Customer</div><div style={{fontWeight:700}}>{orderDetail.customer_name}</div></div>
              <div><div style={{fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'1px',color:'var(--muted)'}}>Phone</div><div style={{fontWeight:700}}>{orderDetail.customer_phone}</div></div>
              <div><div style={{fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'1px',color:'var(--muted)'}}>Date</div><div style={{fontWeight:700}}>{orderDetail.order_date}</div></div>
              <div><div style={{fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'1px',color:'var(--muted)'}}>Status</div><span className={`badge badge-${orderDetail.status.toLowerCase()}`}>{orderDetail.status}</span></div>
            </div>
            {orderDetail.customer_address && <div style={{marginBottom:'1rem',background:'var(--foam)',padding:'10px 14px',borderRadius:10,fontSize:'0.9rem'}}><i className="fas fa-map-marker-alt" style={{color:'var(--bark)',marginRight:6}}></i>{orderDetail.customer_address}</div>}
            {orderDetail.notes && <div style={{marginBottom:'1rem',background:'#FEF3C7',padding:'10px 14px',borderRadius:10,fontSize:'0.9rem'}}><i className="fas fa-sticky-note" style={{color:'#92400E',marginRight:6}}></i>{orderDetail.notes}</div>}
            <div style={{fontWeight:700,marginBottom:'0.75rem'}}>Items Ordered</div>
            {orderDetail.items.map((i, idx) => (
              <div key={idx} className="order-item-row">
                <span>{i.quantity}× {i.name}</span>
                <span style={{fontWeight:600}}>₱{(i.unit_price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'1rem',paddingTop:'1rem',borderTop:'2px solid rgba(0,0,0,0.08)',fontWeight:700,fontSize:'1.1rem'}}>
              <span>Total</span>
              <span style={{color:'var(--coffee)',fontFamily:"'Cormorant Garamond',serif",fontSize:'1.5rem'}}>₱{orderDetail.total.toLocaleString()}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Chatbot */}
      <Chatbot />

      {/* Toasts */}
      <Toast toasts={toasts} />
    </>
  );
}
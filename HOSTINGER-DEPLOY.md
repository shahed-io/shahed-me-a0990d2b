# Hostinger এ ওয়েবসাইট হোস্ট করার গাইড

এই সাইটটি একটি static build (Vite + React)। Hostinger এর যেকোনো Shared/Premium/Business plan এ চলবে।
Database, login, blog — সব Lovable Cloud (backend) থেকেই আসবে, তাই Hostinger এ শুধু ফাইল রাখলেই হবে।

---

## ১) এক নজরে

| কী | মান |
| --- | --- |
| Build কমান্ড | `npm run build` |
| Publish ফোল্ডার | `dist` |
| Node ভার্সন | 20 |
| Upload করার জায়গা | `public_html` |

`public/.htaccess` ফাইলটি build এর সময় নিজে থেকে `dist` এ চলে যায় — এটি সব পেজের লিংক (যেমন `/blog`, `/timeline`) ঠিকভাবে কাজ করায়, HTTPS জোর করে চালু করে, আর ছবি/ফাইল ক্যাশ করে সাইট দ্রুত করে।

---

## ২) সবচেয়ে সহজ পদ্ধতি (ম্যানুয়াল আপলোড)

1. কম্পিউটারে প্রজেক্ট নামান, তারপর:
   ```bash
   npm install
   npm run build
   ```
2. `dist` ফোল্ডারের **ভিতরের সব ফাইল** (ফোল্ডারটি নয়) কপি করুন।
3. Hostinger hPanel → **File Manager** → `public_html` খুলুন → পুরনো ফাইল মুছে নতুনগুলো আপলোড করুন।
4. লুকানো ফাইল দেখাতে File Manager এর Settings এ "Show hidden files" চালু করুন, নিশ্চিত করুন `.htaccess` আপলোড হয়েছে।

---

## ৩) GitHub থেকে অটো-ডিপ্লয় (একবার সেট করলেই যথেষ্ট)

প্রতিবার GitHub এর `main` branch এ কোড গেলে সাইট নিজে থেকেই আপডেট হবে।
ফাইলটি আছে: `.github/workflows/deploy-hostinger.yml`

### ধাপ ১ — Hostinger এ FTP তথ্য নিন
hPanel → **Files → FTP Accounts**। সেখান থেকে নিন: FTP hostname, username, password.

### ধাপ ২ — GitHub এ Secrets যোগ করুন
GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret নাম | মান |
| --- | --- |
| `FTP_SERVER` | Hostinger এর FTP hostname (যেমন `ftp.shahed.com.bd`) |
| `FTP_USERNAME` | FTP ইউজারনেম |
| `FTP_PASSWORD` | FTP পাসওয়ার্ড |
| `FTP_SERVER_DIR` | `/public_html/` |
| `VITE_SUPABASE_URL` | প্রজেক্টের `.env` ফাইলে যা আছে |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | প্রজেক্টের `.env` ফাইলে যা আছে |
| `VITE_SUPABASE_PROJECT_ID` | প্রজেক্টের `.env` ফাইলে যা আছে |

এই তিনটি Supabase মান গোপন নয় — এগুলো ব্রাউজারে ব্যবহারের জন্যই বানানো।

### ধাপ ৩ — চালু করুন
GitHub এর **Actions** ট্যাবে গিয়ে "Deploy to Hostinger" → **Run workflow** চাপুন, অথবা যেকোনো একটি কোড push করুন।

---

## ৪) ডোমেইন সেটআপ

- ডোমেইন `shahed.com.bd` যদি Hostinger এ থাকে: hPanel → Domains এ সেটি `public_html` এর সাথে যুক্ত করুন।
- অন্য জায়গায় থাকলে nameserver গুলো Hostinger এর দিকে দিন (`ns1.dns-parking.com`, `ns2.dns-parking.com`)।
- hPanel → **SSL** থেকে ফ্রি SSL চালু করুন, তারপর "Force HTTPS" অন করুন।

---

## ৫) আপলোডের পর চেক করার তালিকা

- [ ] `https://shahed.com.bd` খুলছে
- [ ] `/blog`, `/timeline` সরাসরি লিখে খুললেও কাজ করছে (404 আসছে না)
- [ ] `/sitemap.xml` এবং `/robots.txt` দেখা যাচ্ছে
- [ ] লগইন ও ব্লগ ডেটা ঠিকমতো আসছে
- [ ] Google Search Console এ নতুন করে sitemap জমা দিন

---

## ৬) সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| ভেতরের পেজে 404 | `.htaccess` `public_html` এ আছে কিনা দেখুন |
| সাদা পেজ | ফাইলগুলো `public_html` এর ভেতরে সরাসরি আছে কিনা দেখুন, `dist` নামের ফোল্ডারের ভেতর নয় |
| পুরনো ভার্সন দেখাচ্ছে | ব্রাউজার ক্যাশ পরিষ্কার করুন / hPanel এর cache purge করুন |
| ডেটা আসছে না | GitHub Secrets এ `VITE_SUPABASE_*` মানগুলো ঠিক আছে কিনা দেখুন |

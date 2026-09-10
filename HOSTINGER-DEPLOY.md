# Hostinger এ ওয়েবসাইট হোস্ট করার গাইড

এই সাইটটি Vite + React দিয়ে বানানো। Hostinger এ দুইভাবে হোস্ট করা যায় —
**Deploy Web App (GitHub থেকে, সবচেয়ে সহজ)** অথবা **ম্যানুয়াল ফাইল আপলোড**।
Database, login, blog — সব Lovable Cloud (backend) থেকেই আসবে, Hostinger এ আলাদা কিছু লাগবে না।

---

## ১) এক নজরে (Hostinger এ যা লিখতে হবে)

| ঘর | মান |
| --- | --- |
| Repository | আপনার GitHub repo (branch: `main`) |
| Node version | `20` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output / Publish directory | `dist` |
| Start command (চাইলে) | `npm start` |

প্রজেক্টে এগুলো আগে থেকেই প্রস্তুত আছে:

- `.nvmrc` → Node 20 নিজে থেকেই বেছে নেবে
- `package.json` → `start` কমান্ড ও `engines` যোগ করা
- `public/.htaccess` → ভেতরের পেজ (`/blog`, `/timeline`) খুললে 404 আসবে না, HTTPS চালু, ক্যাশিং
- `Dockerfile` → Hostinger container দিয়ে চালাতে চাইলে ব্যবহার হবে
- `.env` → Supabase-এর পাবলিক মানগুলো repo-তেই আছে, তাই আলাদা environment variable না দিলেও build হবে

---

## ২) Deploy Web App (GitHub → Hostinger)

1. hPanel → **Websites → Add website → Deploy Web App** বেছে নিন।
2. **GitHub** নির্বাচন করে Hostinger কে আপনার GitHub account এর অনুমতি দিন।
3. এই প্রজেক্টের repository ও `main` branch বাছুন।
4. সেটিংসে উপরের টেবিলের মানগুলো দিন (Node 20, build `npm run build`, output `dist`)।
5. **Deploy** চাপুন। প্রথমবার ২–৪ মিনিট লাগতে পারে।
6. এরপর থেকে GitHub এ কোড push করলেই সাইট নিজে থেকে আপডেট হবে।

> Hostinger যদি "static site" না ধরে Node app হিসেবে চালাতে চায়, তাহলে Start command এ `npm start` দিন — এটি `dist` ফোল্ডারটি `PORT` পোর্টে সার্ভ করবে।

---

## ৩) বিকল্প: FTP দিয়ে অটো-আপলোড (GitHub Actions)

`.github/workflows/deploy-hostinger.yml` ফাইলটি এই কাজ করে। GitHub repo →
**Settings → Secrets and variables → Actions** এ এগুলো যোগ করুন:

| Secret | মান |
| --- | --- |
| `FTP_SERVER` | Hostinger এর FTP hostname |
| `FTP_USERNAME` | FTP ইউজারনেম |
| `FTP_PASSWORD` | FTP পাসওয়ার্ড |
| `FTP_SERVER_DIR` | `/public_html/` |
| `VITE_SUPABASE_URL` | `.env` এ যা আছে |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` এ যা আছে |
| `VITE_SUPABASE_PROJECT_ID` | `.env` এ যা আছে |

---

## ৪) বিকল্প: ম্যানুয়াল আপলোড

```bash
npm install
npm run build
```
`dist` ফোল্ডারের **ভিতরের সব ফাইল** hPanel → File Manager → `public_html` এ আপলোড করুন।
File Manager এ "Show hidden files" চালু করে দেখে নিন `.htaccess` উঠেছে কিনা।

---

## ৫) ডোমেইন ও SSL

- ডোমেইন Hostinger এ থাকলে hPanel → Domains থেকে সাইটের সাথে যুক্ত করুন।
- বাইরে থাকলে nameserver দিন: `ns1.dns-parking.com`, `ns2.dns-parking.com`।
- hPanel → **SSL** থেকে ফ্রি SSL চালু করে "Force HTTPS" অন করুন।

---

## ৬) আপলোডের পর চেক করুন

- [ ] `https://shahed.com.bd` খুলছে
- [ ] `/blog`, `/timeline` সরাসরি লিখে খুললেও 404 আসছে না
- [ ] `/sitemap.xml`, `/robots.txt` দেখা যাচ্ছে
- [ ] লগইন ও ব্লগের ডেটা আসছে
- [ ] Google Search Console এ sitemap আবার জমা দিন

---

## ৭) সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Build ব্যর্থ | Node version 20 দেওয়া আছে কিনা দেখুন |
| ভেতরের পেজে 404 | Output directory `dist` আছে কিনা, আর `.htaccess` উঠেছে কিনা দেখুন |
| সাদা পেজ | ফাইলগুলো `public_html` এর ভেতরে সরাসরি আছে কিনা দেখুন |
| ডেটা আসছে না | `.env` / GitHub Secrets এ `VITE_SUPABASE_*` মানগুলো ঠিক আছে কিনা দেখুন |
| পুরনো ভার্সন | ব্রাউজার ক্যাশ পরিষ্কার করুন, hPanel থেকে cache purge করুন |



## Plan: shahed.com.bd এর অবিকল ক্লোন তৈরি

আমি আপনার বর্তমান ওয়েবসাইট shahed.com.bd ব্রাউজ করে সম্পূর্ণ স্ক্রিনশট ও কন্টেন্ট সংগ্রহ করেছি। নিচে যে সেকশনগুলো বর্তমানে নেই বা আলাদা, সেগুলো যোগ/আপডেট করার পরিকল্পনা:

### যা ইতিমধ্যে আছে (ছোট আপডেট দরকার)
- Hero section (stats সংখ্যা আপডেট: 150+ Projects, 99% satisfaction)
- About, Skills, Tech Stack, Experience, Projects, Services, Contact

### যা নতুন যোগ করতে হবে

1. **Hero Section আপডেট**
   - Typing animation effect (roles cycle: "Graphic Designer", "Brand Strategist", "Web Developer")
   - "View My Work" বাটনে sparkle icon
   - Facebook ও WhatsApp বাটন আলাদা styled buttons হিসেবে (icon + text)
   - Stats: 150+ Projects, 99% Client Satisfaction

2. **Hamburger Menu (Mobile)**
   - মোবাইলে hamburger menu icon দেখাবে, ক্লিক করলে navigation links আসবে

3. **Testimonials Section (নতুন)**
   - Carousel/slider সহ client testimonials
   - Rahim Uddin - Startup Founder এর রিভিউ
   - Arrow navigation (prev/next)

4. **Blog Section (নতুন)**
   - 3টি blog card: title, category tag, read time, date, description
   - Articles: "High-Converting Business Website", "Why Branding is Foundation", "E-Commerce Trends"

5. **FAQ Section (নতুন)**
   - 5টি accordion-style FAQ items
   - Questions: project types, timeline, support, pricing, redesigning

6. **Contact Form (নতুন)**
   - Name, Email, Message fields সহ contact form
   - "send_message()" styled heading

7. **Newsletter Section (নতুন)**
   - Email input + Subscribe button

8. **Footer আপডেট**
   - Logo, social icons (Email, LinkedIn, Facebook)
   - Privacy Policy, Terms & Conditions links
   - "Back to top" button

9. **Floating WhatsApp Chat Button**
   - নিচে ডান কোণায় সবুজ WhatsApp floating button (সব সময় দেখা যাবে)

### Technical Details

- **File changed:** `src/pages/Index.tsx` — সব সেকশন এক ফাইলে (existing pattern অনুসরণ)
- Typing animation: simple React state + useEffect cycle
- FAQ accordion: useState toggle
- Testimonials: simple state-based carousel
- Contact form: UI only (no backend)
- Newsletter: UI only
- Floating WhatsApp: fixed position button
- All images from shahed.com.bd assets URLs


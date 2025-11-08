# Website Setup Guide

## 📧 Contact Form Setup (EmailJS)

The contact form is configured to use EmailJS for sending emails. Follow these steps to set it up:

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month on free tier)

### Step 2: Add Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Note your **Service ID**

### Step 3: Create Email Template
1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template structure:
   ```
   Subject: {{subject}}
   
   From: {{from_name}} ({{from_email}})
   
   Message:
   {{message}}
   ```
4. Set the **To Email** to your email address (e.g., ianhnk01@gmail.com)
5. Note your **Template ID**

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key**

### Step 5: Update the Code
1. Open `script.js`
2. Find the line: `emailjs.init('YOUR_PUBLIC_KEY');`
3. Replace `YOUR_PUBLIC_KEY` with your actual Public Key
4. In the contact form submission handler (around line 854-864), replace:
   - `'YOUR_SERVICE_ID'` with your Service ID
   - `'YOUR_TEMPLATE_ID'` with your Template ID
   - `'YOUR_PUBLIC_KEY'` with your Public Key (if not already done)

### Alternative: Use Mailto Fallback
If you don't want to use EmailJS, the form will automatically fall back to opening the user's email client with a pre-filled message.

---

## 📄 Resume File

1. Create a PDF version of your resume
2. Save it as `resume.pdf` in the root directory
3. The "Download Résumé" button will automatically work

---

## 🎨 Favicon Setup

To add favicons to your site:

1. Generate favicon files using a tool like [Favicon.io](https://favicon.io/) or [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Create these files in the root directory:
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png` (180x180px)
3. The HTML is already configured to use these files

---

## 📊 Google Analytics Setup

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)
4. Open `index.html`
5. Find the Google Analytics section (around line 84-91)
6. Uncomment the script tags
7. Replace `G-XXXXXXXXXX` with your actual Measurement ID

---

## 🖼️ Open Graph Image

For better social media sharing:

1. Create an image (1200x630px recommended)
2. Save it as `og-image.jpg` in the root directory
3. Update the `og:image` and `twitter:image` URLs in `index.html` if your domain is different from `c1tenn.dev`

---

## ✅ Checklist

- [ ] Set up EmailJS and update credentials in `script.js`
- [ ] Add `resume.pdf` file
- [ ] Generate and add favicon files
- [ ] Set up Google Analytics (optional)
- [ ] Create and add Open Graph image
- [ ] Update domain URLs in meta tags if needed
- [ ] Test contact form submission
- [ ] Test resume download
- [ ] Test dark/light mode toggle
- [ ] Test on mobile devices

---

## 🚀 Deployment Tips

- Use a service like **Vercel**, **Netlify**, or **GitHub Pages** for hosting
- Make sure all file paths are correct (relative paths work best)
- Test all links and forms after deployment
- Check that images load correctly
- Verify meta tags with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

## 📝 Notes

- The contact form has a fallback to `mailto:` links if EmailJS isn't configured
- All images have lazy loading for better performance
- The site is fully responsive and accessible
- Dark mode preference is saved in localStorage


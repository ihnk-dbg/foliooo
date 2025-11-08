# Ian Hnk - Portfolio Website

A modern, responsive portfolio website showcasing my work as a full-stack developer and computer science student.

## ✨ Features

- **Dark/Light Mode Toggle** - Persistent theme preference with smooth transitions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Interactive Projects Section** - Filterable project cards with detailed modals
- **Contact Form** - Integrated with EmailJS for easy communication
- **Performance Optimized** - Lazy loading, preconnect hints, and optimized assets
- **SEO Optimized** - Open Graph tags, Twitter Cards, and structured data
- **Accessible** - ARIA labels, keyboard navigation, and screen reader support

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Icons**: Font Awesome 6.5.0
- **Fonts**: Poppins (Google Fonts)
- **Form Handling**: EmailJS
- **Analytics**: Google Analytics (optional)

## 📁 Project Structure

```
c1tenn/
├── index.html          # Main HTML file
├── style.css           # All styles
├── script.js           # All JavaScript functionality
├── site.webmanifest    # PWA manifest
├── robots.txt          # SEO robots file
├── SETUP.md            # Setup instructions
└── assets/
    └── images/         # Project images
```

## 🚀 Getting Started

1. Clone or download this repository
2. Open `index.html` in a browser for local development
3. Follow the setup instructions in `SETUP.md` to configure:
   - EmailJS for contact form
   - Google Analytics (optional)
   - Favicon files
   - Resume PDF

## 📝 Setup Checklist

See `SETUP.md` for detailed instructions on:
- ✅ EmailJS configuration
- ✅ Resume file setup
- ✅ Favicon generation
- ✅ Google Analytics setup
- ✅ Open Graph image

## 🎨 Customization

### Update Personal Information
- Edit the About section in `index.html`
- Update contact information in the Contact section
- Modify social media links in the footer

### Change Colors
- Edit CSS variables in `style.css` (look for `:root` selectors)
- Main accent color: `--accent: #4f46e5`

### Add Projects
- Add project cards in the Projects section
- Update project data in `script.js` (search for `projectData`)

## 📧 Contact Form Setup

The contact form uses EmailJS. To enable it:
1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Create a service and template
3. Update credentials in `script.js` (see `SETUP.md` for details)

If EmailJS isn't configured, the form falls back to opening the user's email client.

## 🌐 Deployment

### Recommended Platforms:
- **Vercel** - Easy deployment with Git integration
- **Netlify** - Great for static sites
- **GitHub Pages** - Free hosting for public repos

### Before Deploying:
- [ ] Update domain URLs in meta tags (`index.html` head section)
- [ ] Configure EmailJS credentials
- [ ] Add favicon files
- [ ] Add resume PDF
- [ ] Test all links and forms
- [ ] Verify images load correctly

## 📊 Performance

- All images use lazy loading
- Fonts are preloaded for faster rendering
- DNS prefetch for external resources
- Optimized CSS and JavaScript

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Skip to main content link
- Focus indicators

## 📄 License

This project is open source and available for personal use.

## 👤 Author

**Ian Hnk**
- Email: ianhnk01@gmail.com
- GitHub: [@ihnk-dbg](https://github.com/ihnk-dbg)
- LinkedIn: [ianhnk](https://www.linkedin.com/in/ianhnk)

---

Built with ❤️ using HTML, CSS, and JavaScript.


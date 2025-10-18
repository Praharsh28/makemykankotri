# 🚀 Deployment Guide - WebKankotri v2

**Production deployment checklist and instructions**

---

## 📋 Pre-Deployment Checklist

### ✅ **1. Code Quality**
- [x] All 558 tests passing
- [x] No TypeScript errors
- [x] No ESLint errors
- [x] Code reviewed
- [x] Documentation complete

### ✅ **2. Environment Setup**
- [ ] Production Supabase project created
- [ ] Database schema deployed
- [ ] RLS policies enabled
- [ ] Environment variables configured
- [ ] Secrets secured

### ✅ **3. Build Verification**
- [ ] Production build tested locally
- [ ] No build errors
- [ ] No console warnings
- [ ] Bundle size optimized

### ✅ **4. Security**
- [ ] API keys in environment variables
- [ ] No hardcoded secrets
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting considered

---

## 🗄️ Database Setup (Production)

### **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Project Name:** webkankotri-v2-prod
   - **Database Password:** (Generate strong password)
   - **Region:** Choose closest to your users
4. Wait for project creation (~2 minutes)

### **Step 2: Run Database Schema**

1. Open Supabase SQL Editor
2. Copy contents from `supabase-setup.sql`
3. Paste and execute
4. Verify tables created:
   - `templates` table
   - Indexes created
   - RLS policies enabled
   - Helper functions created

### **Step 3: Enable Row Level Security**

Verify RLS policies are active:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'templates';
```

### **Step 4: Get API Credentials**

1. Go to **Project Settings > API**
2. Copy:
   - **Project URL:** `https://[project-ref].supabase.co`
   - **Anon Key:** `eyJhbGc...` (public key)
3. Save these for environment variables

---

## ⚙️ Environment Variables

### **Local Development (.env.local)**

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Production (Vercel)**

Set in **Vercel Project Settings > Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your production Supabase URL | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your production anon key | Production |

---

## 🚢 Deploy to Vercel

### **Option 1: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

### **Option 2: GitHub Integration**

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
6. Add environment variables
7. Click "Deploy"

---

## 🔧 Vercel Configuration

### **Project Settings**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### **Build & Development Settings**

- **Node.js Version:** 20.x
- **Package Manager:** npm
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### **Environment Variables**

Add in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=[production-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[production-key]
```

### **Domain Settings**

1. Go to **Project Settings > Domains**
2. Add custom domain (optional)
3. Configure DNS:
   - **Type:** CNAME
   - **Name:** @ or www
   - **Value:** cname.vercel-dns.com

---

## 🏗️ Build Process

### **Local Build Test**

```bash
# Install dependencies
npm install

# Run build
npm run build

# Test production build locally
npm start

# Open http://localhost:3000
```

### **Expected Build Output**

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5 kB       100 kB
├ ○ /auth/login                          3 kB        98 kB
├ ○ /auth/signup                         3 kB        98 kB
├ ○ /dashboard                           4 kB        99 kB
└ ○ /gallery                             6 kB       101 kB

○  (Static)  automatically rendered as static HTML
```

---

## ✅ Post-Deployment Verification

### **1. Smoke Tests**

Visit these URLs and verify:

- [ ] **/** - Homepage loads
- [ ] **/gallery** - Gallery displays templates
- [ ] **/auth/login** - Login form works
- [ ] **/auth/signup** - Signup form works
- [ ] **/dashboard** - Dashboard requires auth

### **2. Feature Tests**

Test core functionality:

- [ ] **Authentication:**
  - Sign up new user
  - Log in existing user
  - Log out
  - Protected routes redirect

- [ ] **Templates:**
  - Browse gallery
  - Search templates
  - Filter by category
  - View template details

- [ ] **Dashboard:**
  - View my templates
  - Edit template
  - Delete template
  - Duplicate template

- [ ] **Export:**
  - Export PDF
  - Export PNG
  - Export JPEG
  - Download works

### **3. Performance Tests**

Check performance metrics:

- [ ] **Lighthouse Score:**
  - Performance: >90
  - Accessibility: >90
  - Best Practices: >90
  - SEO: >90

- [ ] **Core Web Vitals:**
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1

### **4. Error Monitoring**

Set up error tracking:

- [ ] Vercel Analytics enabled
- [ ] Console errors monitored
- [ ] Error boundaries working
- [ ] API errors logged

---

## 🐛 Troubleshooting

### **Build Fails**

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### **Environment Variables Not Working**

1. Verify variables are set in Vercel dashboard
2. Redeploy after adding variables
3. Check variable names match exactly
4. Ensure `NEXT_PUBLIC_` prefix for client-side vars

### **Supabase Connection Error**

1. Verify Supabase project is active
2. Check URL and API key are correct
3. Verify RLS policies allow operations
4. Check network/firewall settings

### **404 Errors**

1. Verify routes exist in `app/` directory
2. Check Next.js routing configuration
3. Ensure dynamic routes are correct
4. Verify build completed successfully

---

## 📊 Monitoring & Analytics

### **Vercel Analytics**

1. Enable in Vercel dashboard
2. View metrics:
   - Page views
   - Unique visitors
   - Geographic distribution
   - Performance metrics

### **Error Tracking**

Consider integrating:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Mixpanel** - User analytics

### **Performance Monitoring**

Tools to use:
- **Vercel Speed Insights**
- **Google PageSpeed Insights**
- **Lighthouse CI**
- **WebPageTest**

---

## 🔒 Security Checklist

- [x] HTTPS enforced (automatic with Vercel)
- [x] API keys in environment variables
- [x] No secrets in code
- [x] RLS enabled in Supabase
- [x] Input validation
- [x] CORS configured
- [ ] Rate limiting (consider Vercel Edge Config)
- [ ] DDoS protection (Vercel Pro)
- [ ] Security headers configured

### **Security Headers**

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 📈 Scaling Considerations

### **Performance Optimization**
- Enable Vercel Edge Network (CDN)
- Use Image Optimization API
- Implement code splitting
- Enable gzip compression
- Consider ISR (Incremental Static Regeneration)

### **Database Optimization**
- Monitor Supabase usage
- Add indexes for frequent queries
- Use connection pooling
- Consider read replicas
- Implement caching (Redis)

### **Cost Management**
- Monitor Vercel bandwidth usage
- Track Supabase API calls
- Optimize bundle size
- Use edge functions for heavy operations

---

## 🎯 Launch Checklist

### **Before Launch**
- [ ] All tests passing
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Database deployed and seeded
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Analytics set up
- [ ] Error monitoring active

### **At Launch**
- [ ] Deploy to production
- [ ] Verify all features working
- [ ] Run smoke tests
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify email notifications (if any)

### **After Launch**
- [ ] Monitor traffic
- [ ] Watch error rates
- [ ] Check performance
- [ ] Gather user feedback
- [ ] Plan improvements

---

## 🆘 Support & Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Project Issues:** GitHub Issues
- **Community:** Discord / Slack

---

## 📞 Emergency Contacts

- **DevOps Team:** devops@yourcompany.com
- **Database Admin:** dba@yourcompany.com
- **On-Call:** +1-XXX-XXX-XXXX

---

**🚀 Ready to deploy!**

Follow this guide step-by-step for a smooth production deployment.

---

**Last Updated:** October 18, 2025  
**Status:** ✅ Ready for Production

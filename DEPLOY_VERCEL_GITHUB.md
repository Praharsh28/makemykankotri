# 🚀 Deploy WebKankotri v2 to Vercel via GitHub

**Complete step-by-step guide for deploying to Vercel using GitHub integration**

---

## 📋 Prerequisites Checklist

- [ ] GitHub account created
- [ ] Git configured locally
- [ ] Vercel account created
- [ ] Supabase production project ready

---

## 🔧 Step 1: Configure Git Identity

Run these commands with YOUR information:

```bash
cd /home/enigma/Desktop/windsurf/projects/webkankotri-v2

# Set your Git identity (replace with your actual info)
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"

# Verify configuration
git config --global user.email
git config --global user.name
```

---

## 📝 Step 2: Commit the Code

```bash
# Already initialized git and staged files
# Now commit with your identity configured
git commit -m "feat: WebKankotri v2 - Production Ready

- Complete template builder platform with AI generation
- Visual editor with Puck integration
- Authentication with Supabase
- User dashboard with CRUD operations
- PDF and Image export features
- Toast notifications and semantic alerts
- 558 comprehensive tests passing (100%)
- WCAG 2.1 AA accessible
- Complete documentation

Ready for production deployment!"

# Verify commit
git log --oneline
```

---

## 🌐 Step 3: Create GitHub Repository

### **Option A: Via GitHub Website**

1. Go to [github.com](https://github.com)
2. Click **"New repository"** (+ icon, top-right)
3. Fill in details:
   - **Repository name:** `webkankotri-v2`
   - **Description:** "AI-powered wedding invitation platform"
   - **Visibility:** Private or Public (your choice)
   - **DO NOT** initialize with README, .gitignore, or license
4. Click **"Create repository"**

### **Option B: Via GitHub CLI (if installed)**

```bash
gh repo create webkankotri-v2 --private --source=. --remote=origin
```

---

## 🔗 Step 4: Connect Local Repo to GitHub

After creating the GitHub repository, copy the commands shown on GitHub:

```bash
# Connect to your GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/webkankotri-v2.git

# Verify remote
git remote -v

# Push code to GitHub
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

---

## 🚀 Step 5: Deploy to Vercel via GitHub

### **5.1: Create Vercel Account**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### **5.2: Import Project**

1. After login, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find `webkankotri-v2` in the list
4. Click **"Import"**

### **5.3: Configure Project**

Vercel should auto-detect Next.js. Verify settings:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)
- **Node Version:** 20.x

### **5.4: Add Environment Variables**

Click **"Environment Variables"** and add:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your production Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your production Supabase anon key | Production, Preview, Development |

**Get these from your Supabase production project:**
1. Go to [supabase.com](https://supabase.com)
2. Select your production project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon public** key

### **5.5: Deploy**

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. ✅ Deployment successful!

---

## 🎯 Step 6: Verify Deployment

### **6.1: Open Your Site**

Vercel will provide URLs:
- **Production:** `https://webkankotri-v2.vercel.app`
- **Custom domain:** (optional, configure later)

### **6.2: Run Smoke Tests**

Visit these pages and verify they work:

- [ ] **Homepage** (`/`) - Loads correctly
- [ ] **Gallery** (`/gallery`) - Shows templates
- [ ] **Login** (`/auth/login`) - Form works
- [ ] **Signup** (`/auth/signup`) - Form works
- [ ] **Dashboard** (`/dashboard`) - Requires auth, redirects if not logged in

### **6.3: Test Features**

- [ ] **Sign up** - Create new account
- [ ] **Log in** - Login works
- [ ] **Browse templates** - Gallery displays
- [ ] **Search** - Search works
- [ ] **Filters** - Filtering works
- [ ] **My Templates** - Dashboard shows user templates
- [ ] **Export PDF** - PDF downloads
- [ ] **Export PNG** - PNG downloads

---

## 🔄 Step 7: Continuous Deployment

**Automatic deployments are now enabled!**

Every time you push to GitHub:
```bash
git add .
git commit -m "feat: your changes"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy to production
4. Update your site

---

## 🌐 Step 8: Custom Domain (Optional)

### **8.1: Add Custom Domain**

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain: `yourdomain.com`
5. Follow DNS configuration instructions

### **8.2: DNS Configuration**

Add these records to your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

Or:

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | cname.vercel-dns.com |
| CNAME | www | cname.vercel-dns.com |

Wait 24-48 hours for DNS propagation.

---

## 🗄️ Step 9: Production Database

### **9.1: Verify Supabase Setup**

Ensure your production Supabase has:
- [ ] `templates` table created
- [ ] RLS policies enabled
- [ ] Indexes created
- [ ] Auth enabled

### **9.2: Run Database Schema**

If not done yet:
1. Go to your production Supabase project
2. Open **SQL Editor**
3. Copy contents from `supabase-setup.sql`
4. Execute the script

### **9.3: Test Database Connection**

Try creating a template from your deployed site:
- [ ] Sign up for account
- [ ] Create a template (in editor, if available)
- [ ] Verify it saves to Supabase
- [ ] Check in Supabase Table Editor

---

## 📊 Step 10: Monitor & Analytics

### **10.1: Vercel Analytics**

1. Go to your project in Vercel
2. Click **"Analytics"** tab
3. Enable **Vercel Analytics** (optional, paid feature)

### **10.2: Vercel Logs**

Monitor errors:
1. Go to **"Logs"** tab
2. Filter by:
   - Build logs
   - Function logs
   - Static logs

### **10.3: Error Monitoring**

Consider integrating:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Mixpanel** - User analytics

---

## 🐛 Troubleshooting

### **Build Failed**

```bash
# Check build locally first
npm run build

# If local build works but Vercel fails:
# - Check Node version (should be 20.x)
# - Check environment variables are set
# - Check logs in Vercel dashboard
```

### **Environment Variables Not Working**

1. Verify variables are set in Vercel
2. Ensure `NEXT_PUBLIC_` prefix for client-side vars
3. Redeploy after adding variables
4. Clear cache: Settings → Clear Cache & Redeploy

### **404 Errors**

1. Check routes exist in `app/` directory
2. Verify build completed successfully
3. Check output in build logs
4. Ensure dynamic routes are configured correctly

### **Supabase Connection Error**

1. Verify Supabase project is active
2. Check URL and API key are correct
3. Verify RLS policies allow operations
4. Check CORS settings in Supabase

### **Cannot Push to GitHub**

```bash
# Check remote is configured
git remote -v

# If not configured:
git remote add origin https://github.com/YOUR-USERNAME/webkankotri-v2.git

# If authentication fails, use personal access token:
# 1. Go to GitHub Settings → Developer settings → Personal access tokens
# 2. Generate new token with 'repo' scope
# 3. Use token as password when pushing
```

---

## ✅ Deployment Checklist

### **Before Deployment:**
- [x] All 558 tests passing
- [x] No build errors locally
- [x] Documentation complete
- [x] Git repository initialized
- [ ] Git identity configured
- [ ] GitHub repository created
- [ ] Supabase production project ready
- [ ] Environment variables documented

### **During Deployment:**
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Build successful
- [ ] No deployment errors

### **After Deployment:**
- [ ] Site accessible
- [ ] Smoke tests passed
- [ ] Auth working
- [ ] Database connected
- [ ] Exports working
- [ ] No console errors
- [ ] Performance acceptable

---

## 🎉 Success!

Your WebKankotri v2 is now live on Vercel!

**Production URL:** `https://webkankotri-v2.vercel.app`

---

## 📞 Quick Commands

```bash
# Check git status
git status

# View commit history
git log --oneline

# Push changes to GitHub
git add .
git commit -m "your message"
git push origin main

# View Vercel deployments
# Visit: https://vercel.com/dashboard

# Check production site
# Visit: https://webkankotri-v2.vercel.app
```

---

## 🔗 Helpful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/YOUR-USERNAME/webkankotri-v2
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Vercel Docs:** https://vercel.com/docs

---

**Ready to deploy!** Follow the steps above to get your site live. 🚀

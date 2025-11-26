# Contact Page Rollback Runbook

**Feature:** Contact Page  
**Version:** 1.0  
**Last Updated:** 2025-11-26  
**Owner:** Engineering Team  
**Time to Rollback:** < 5 minutes

## Overview

This runbook provides step-by-step instructions for rolling back the Contact Page feature in case of critical issues post-deployment.

## When to Rollback

### Critical Issues (\u2717 immediate rollback)

- Email service completely down (0% delivery rate)
- Spam flood overwhelming system (>100 submissions/hour)
- Security vulnerability discovered
- API route causing server crashes
- Data leakage or privacy breach
- Form collecting incorrect/corrupted data

### Non-Critical Issues (! monitor, don't rollback)

- Occasional email delivery failures (<5%)
- Minor UI issues
- Validation too strict/loose (can be hotfixed)
- Rate limiting too aggressive (can be adjusted via env vars)
- Analytics not tracking properly

## Rollback Decision Tree

```
Is the contact form causing data loss or security issues?
├─ YES → Immediate full rollback (Method A)
└─ NO → Is email delivery completely broken?
    ├─ YES → Can it be fixed by changing email service?
    │   ├─ YES → Update env vars (Method C)
    │   └─ NO → Feature flag disable (Method B)
    └─ NO → Is it a spam flood?
        ├─ YES → Disable via feature flag (Method B)
        └─ NO → Monitor and hotfix
```

## Rollback Methods

### Method A: Full Code Rollback (Most Severe)

**Time:** 5 minutes  
**Impact:** Removes all contact page functionality

1. **Identify last known good deployment:**

   ```bash
   vercel ls
   # Find deployment before contact page merge
   ```

2. **Revert via Vercel Dashboard:**
   - Go to https://vercel.com/carinyaparc/site
   - Click on "Deployments"
   - Find last good deployment
   - Click "..." menu → "Promote to Production"
   - Confirm promotion

3. **OR revert via Git:**

   ```bash
   # Find commit before contact page
   git log --oneline -10

   # Revert commits
   git revert HEAD~N..HEAD  # N = number of commits to revert

   # Push revert
   git push origin main
   ```

4. **Verify rollback:**
   - [ ] `/contact` returns 404
   - [ ] `/api/contact` returns 404
   - [ ] No contact links in navigation
   - [ ] Check Sentry for errors stopping

### Method B: Feature Flag Disable (Recommended)

**Time:** 2 minutes  
**Impact:** Shows fallback message instead of form

1. **Update environment variable in Vercel:**

   ```
   CONTACT_FORM_ENABLE=false
   ```

2. **Trigger redeployment:**
   - Vercel Dashboard → Settings → Environment Variables
   - Update `CONTACT_FORM_ENABLE` to `false`
   - Save changes
   - Trigger redeployment

3. **Update contact page to show fallback:**

   ```typescript
   // Quick patch to apps/site/src/app/(www)/contact/page.tsx
   if (process.env.CONTACT_FORM_ENABLE === 'false') {
     return (
       <div className="min-h-screen bg-white py-24">
         <div className="mx-auto max-w-3xl px-4 text-center">
           <h1 className="text-3xl font-bold">Contact Us</h1>
           <p className="mt-4 text-lg">
             Our contact form is temporarily unavailable.
             Please email us directly at contact@carinyaparc.com.au
           </p>
         </div>
       </div>
     );
   }
   ```

4. **Verify:**
   - [ ] `/contact` shows fallback message
   - [ ] `/api/contact` returns 503
   - [ ] Email link is displayed

### Method C: Email Service Switch

**Time:** 5 minutes  
**Impact:** Changes email delivery method

1. **Switch to backup email service (if Resend fails):**

   **Option 1: Use existing MailerLite:**

   ```bash
   # Update env vars in Vercel
   CONTACT_EMAIL_PROVIDER=mailerlite
   MAILERLITE_API_KEY=existing_key
   ```

   **Option 2: Disable email, log to database:**

   ```bash
   CONTACT_EMAIL_PROVIDER=log
   # Requires code change to log instead of email
   ```

2. **Quick code patch for MailerLite:**

   ```typescript
   // Update send-contact-notification.ts
   if (process.env.CONTACT_EMAIL_PROVIDER === 'mailerlite') {
     // Use MailerLite API instead
   }
   ```

3. **Redeploy and verify**

## Post-Rollback Actions

### Immediate (within 1 hour)

1. **Notify stakeholders:**
   - [ ] Product Owner
   - [ ] Customer Support (if applicable)
   - [ ] Marketing (if promoted)

2. **Document the issue:**

   ```markdown
   ## Incident Report

   Date: [DATE]
   Time: [TIME]
   Issue: [DESCRIPTION]
   Impact: [USERS AFFECTED]
   Root Cause: [IF KNOWN]
   Action Taken: [ROLLBACK METHOD]
   ```

3. **Preserve evidence:**

   ```bash
   # Export logs
   vercel logs carinyaparc.com.au --since 2h > incident-logs.txt

   # Screenshot Sentry errors
   # Download any error submissions
   ```

### Within 24 hours

1. **Root cause analysis:**
   - [ ] Review error logs
   - [ ] Analyze submission patterns
   - [ ] Check email service status
   - [ ] Review recent code changes

2. **Create fix:**
   - [ ] Identify solution
   - [ ] Write tests for the issue
   - [ ] Implement fix in feature branch
   - [ ] Test thoroughly in preview

3. **Communicate:**
   - [ ] Update status page (if exists)
   - [ ] Email affected users (if data was lost)
   - [ ] Internal post-mortem meeting

## Recovery Procedure

### After fixing the issue:

1. **Re-enable in preview first:**

   ```bash
   # Deploy fix to preview
   git checkout -b fix/contact-page-issue
   # Apply fixes
   git push origin fix/contact-page-issue
   ```

2. **Test thoroughly:**
   - All original test cases
   - Specific test for the issue that caused rollback
   - Load test if it was a scale issue
   - Security scan if it was a security issue

3. **Gradual re-enable:**
   - Day 1: Enable in preview, test with team
   - Day 2: Enable in production with increased monitoring
   - Day 3: Add back navigation links if stable

4. **Enhanced monitoring:**
   ```javascript
   // Add specific monitoring for the issue
   if (issueType === 'email_delivery') {
     // Add email delivery success metrics
     // Add fallback notification method
     // Add delivery retry logic
   }
   ```

## Rollback Verification Checklist

After any rollback method:

- [ ] Contact page shows appropriate state (404, fallback, or working)
- [ ] API endpoint responds correctly
- [ ] No errors in Sentry related to contact form
- [ ] Email service errors stopped (if applicable)
- [ ] Rate limiting cleared (if it was stuck)
- [ ] Navigation links updated (removed if full rollback)
- [ ] Team notified via Slack/email
- [ ] Incident report started

## Emergency Contacts

| Role                  | Name   | Contact            | When to Contact           |
| --------------------- | ------ | ------------------ | ------------------------- |
| Engineering Lead      | TBD    | email/phone        | Code rollback decisions   |
| DevOps                | TBD    | email/phone        | Deployment issues         |
| Product Owner         | TBD    | email/phone        | Feature disable decisions |
| Email Service Support | Resend | support@resend.com | Email delivery issues     |

## Common Issues & Quick Fixes

### Issue: "Rate limit exceeded" for all users

```bash
# Quick fix: Increase limit temporarily
CONTACT_RATE_LIMIT_MAX=100
CONTACT_RATE_LIMIT_WINDOW_HOURS=1
```

### Issue: Spam flood

```bash
# Quick fix: Disable form
CONTACT_FORM_ENABLE=false
# Then implement CAPTCHA
```

### Issue: Wrong email recipient

```bash
# Quick fix: Update recipient
CONTACT_EMAIL_RECIPIENT=correct@email.com
```

### Issue: Email not sending but no errors

```bash
# Check: API key is production key, not test
RESEND_API_KEY=re_live_xxx  # not re_test_xxx
```

## Lessons Learned Log

| Date | Issue                       | Root Cause      | Prevention                |
| ---- | --------------------------- | --------------- | ------------------------- |
| TBD  | Example: Email service down | API key expired | Add key expiry monitoring |

## Change Log

| Date       | Version | Changes                  | Author   |
| ---------- | ------- | ------------------------ | -------- |
| 2025-11-26 | 1.0     | Initial rollback runbook | AI Agent |

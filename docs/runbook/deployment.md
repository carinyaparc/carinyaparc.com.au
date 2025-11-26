# Contact Page Deployment Runbook

**Feature:** Contact Page  
**Version:** 1.0  
**Last Updated:** 2025-11-26  
**Owner:** Engineering Team

## Overview

This runbook documents the phased deployment procedure for the Contact Page feature, including pre-deployment checks, feature flag configuration, and verification steps.

## Pre-Deployment Checklist

### Code Quality (\u2713 required)

- [ ] All unit tests passing: `pnpm test:unit`
- [ ] Integration tests passing: `pnpm test:integration` 
- [ ] Smoke tests passing: `pnpm test:smoke`
- [ ] Security tests passing: `pnpm test:security`
- [ ] TypeScript compilation: `pnpm typecheck`
- [ ] Linting clean: `pnpm lint`
- [ ] Code review completed and approved

### Environment Configuration

- [ ] Development environment tested with `.env.local`
- [ ] Resend API key obtained and tested
- [ ] Email recipient configured
- [ ] SPF/DKIM records configured for sender domain (production)
- [ ] Feature flags documented

### Documentation

- [ ] `docs/tech.md` updated with new dependencies
- [ ] `docs/structure.md` updated with new routes/components
- [ ] Environment configuration documented
- [ ] This runbook reviewed

## Deployment Phases

### Phase 1: Preview Deployment (Day 1)

**Objective:** Deploy to Vercel preview environment for internal testing

#### Steps:

1. **Configure preview environment variables in Vercel:**
   ```
   CONTACT_FORM_ENABLE=true
   CONTACT_FORM_RATE_LIMITING=true
   RESEND_API_KEY=re_test_xxx (test key)
   CONTACT_EMAIL_RECIPIENT=test@carinyaparc.com.au
   CONTACT_EMAIL_FROM=onboarding@resend.dev
   CONTACT_RATE_LIMIT_MAX=10
   CONTACT_RATE_LIMIT_WINDOW_HOURS=1
   ```

2. **Deploy to preview:**
   ```bash
   git checkout feature/contact-page
   git push origin feature/contact-page
   # Vercel will auto-deploy preview
   ```

3. **Verification tests:**
   - [ ] Navigate to preview URL `/contact`
   - [ ] Page renders correctly (desktop + mobile)
   - [ ] Submit test form with valid data
   - [ ] Verify email received
   - [ ] Test validation errors
   - [ ] Test rate limiting (4th submission)
   - [ ] Test honeypot spam protection
   - [ ] Check Vercel Analytics events

4. **Load testing:**
   ```bash
   # Run from local machine
   npx artillery quick --count 10 --num 5 https://preview-url.vercel.app/api/contact
   ```

5. **Internal team testing:**
   - Share preview URL with team
   - Collect 5-10 test submissions
   - Document any issues found

**Success Criteria:**
- \u2713 All verification tests pass
- \u2713 Email delivery rate > 95%
- \u2713 API response time P95 < 500ms
- \u2713 No critical errors in logs

### Phase 2: Production Soft Launch (Day 2-3)

**Objective:** Deploy to production without navigation links

#### Steps:

1. **Configure production environment variables:**
   ```
   CONTACT_FORM_ENABLE=true
   CONTACT_FORM_RATE_LIMITING=true
   RESEND_API_KEY=re_prod_xxx (production key)
   CONTACT_EMAIL_RECIPIENT=contact@carinyaparc.com.au
   CONTACT_EMAIL_FROM=noreply@carinyaparc.com.au
   CONTACT_RATE_LIMIT_MAX=3
   CONTACT_RATE_LIMIT_WINDOW_HOURS=24
   ```

2. **Merge to main branch:**
   ```bash
   git checkout main
   git merge feature/contact-page
   git push origin main
   ```

3. **Production verification:**
   - [ ] Navigate to `https://carinyaparc.com.au/contact`
   - [ ] Submit test form
   - [ ] Verify email delivery to production recipient
   - [ ] Check Sentry for errors
   - [ ] Monitor Vercel Analytics

4. **Monitoring setup:**
   - [ ] Set up Sentry alert for contact form errors
   - [ ] Configure email delivery monitoring
   - [ ] Set up analytics dashboard

5. **Soft launch testing:**
   - Monitor first 20 real submissions
   - Check spam rate
   - Verify email delivery rate
   - Review submission quality

**Success Criteria:**
- \u2713 Page accessible at production URL
- \u2713 First 20 submissions processed successfully
- \u2713 Spam rate < 15%
- \u2713 No critical errors in Sentry

### Phase 3: Full Rollout (Day 4-5)

**Objective:** Add navigation links and announce feature

#### Steps:

1. **Add navigation links:**
   ```typescript
   // Update apps/site/src/app/navigation.ts
   export const navigation = [
     // ... existing items
     { name: 'Contact', href: '/contact' }
   ];
   ```

2. **Add footer link:**
   ```typescript
   // Update apps/site/src/components/layouts/Footer.tsx
   // Add contact link to footer navigation
   ```

3. **Deploy navigation updates:**
   ```bash
   git add -A
   git commit -m "feat: add contact page to navigation"
   git push origin main
   ```

4. **Announcement (optional):**
   - Newsletter mention
   - Social media post
   - Update site messaging

5. **Post-launch monitoring (30 days):**
   - [ ] Daily submission volume
   - [ ] Spam rate tracking
   - [ ] Email delivery success rate
   - [ ] Response time metrics
   - [ ] User feedback collection

**Success Criteria:**
- \u2713 Navigation links working
- \u2713 Submission volume as expected (50-200/month)
- \u2713 Spam rate < 10%
- \u2713 Email delivery > 95%
- \u2713 Positive user feedback

## Verification Commands

### Local Testing
```bash
# Start dev server
pnpm dev

# Run tests
pnpm test:unit src/lib/validation
pnpm test:unit src/app/api/contact
pnpm test:unit src/app/\(www\)/contact

# Test API directly
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","phone":"","inquiryType":"general","message":"This is a test message that meets the minimum character requirement for validation","website":"","submissionTime":5000}'
```

### Production Testing
```bash
# Check deployment status
vercel ls

# View logs
vercel logs carinyaparc.com.au --follow

# Test production API (carefully)
curl -X POST https://carinyaparc.com.au/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"Deploy","email":"deploy.test@example.com","phone":"","inquiryType":"general","message":"Deployment test - please ignore this message. Testing contact form after deployment.","website":"","submissionTime":5000}'
```

## Monitoring Dashboards

- **Vercel Dashboard**: https://vercel.com/carinyaparc/site
- **Sentry**: https://sentry.io/organizations/carinyaparc
- **Resend Dashboard**: https://resend.com/emails
- **Analytics**: Vercel Analytics dashboard

## Known Issues & Workarounds

### Issue: Rate limiting resets on server restart
**Impact:** Low - acceptable for current volume  
**Workaround:** None needed for MVP  
**Future fix:** Migrate to Redis when volume > 500/month

### Issue: Email delivery delays
**Impact:** Medium  
**Workaround:** Set expectation of 48-hour response  
**Monitoring:** Check Resend dashboard for delivery status

## Rollback Procedure

See [rollback.md](./rollback.md) for detailed rollback instructions.

## Contact

For deployment issues or questions:
- Engineering Lead: [Contact]
- DevOps: [Contact]
- Product Owner: [Contact]

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-26 | 1.0 | Initial deployment runbook | AI Agent |

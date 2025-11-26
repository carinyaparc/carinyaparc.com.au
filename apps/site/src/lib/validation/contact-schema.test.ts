/**
 * Unit tests for contact form Zod schema
 */

import { describe, it, expect } from 'vitest';
import {
  contactFormSchema,
  contactFormClientSchema,
  inquiryTypes,
  type ContactFormData,
  type InquiryType,
} from './contact-schema';

describe('contactFormSchema', () => {
  const validFormData = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+61412345678',
    inquiryType: 'tours' as InquiryType,
    message: 'I am interested in booking a farm tour for two people in December. Would love to learn more about regenerative farming practices.',
    website: '',
    submissionTime: 5000,
  };

  describe('firstName validation', () => {
    it('should accept valid first names', () => {
      const result = contactFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it('should reject empty first name', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        firstName: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('required');
      }
    });

    it('should reject first name with numbers', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        firstName: 'Jane123',
      });
      expect(result.success).toBe(false);
    });

    it('should accept first name with hyphens and apostrophes', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        firstName: "Mary-Jane O'Connor",
      });
      expect(result.success).toBe(true);
    });

    it('should reject first name exceeding 50 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        firstName: 'a'.repeat(51),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('lastName validation', () => {
    it('should accept valid last names', () => {
      const result = contactFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it('should reject empty last name', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        lastName: '',
      });
      expect(result.success).toBe(false);
    });

    it('should accept last name with spaces', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        lastName: 'Van Der Berg',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('email validation', () => {
    it('should accept valid email addresses', () => {
      const emails = [
        'user@example.com',
        'jane.smith@company.co.uk',
        'test+tag@domain.com.au',
      ];

      emails.forEach((email) => {
        const result = contactFormSchema.safeParse({
          ...validFormData,
          email,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = ['notanemail', 'missing@domain', '@nodomain.com', 'spaces in@email.com'];

      invalidEmails.forEach((email) => {
        const result = contactFormSchema.safeParse({
          ...validFormData,
          email,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject spam email patterns via validateEmailForAPI', () => {
      const spamEmails = ['test@test.com', 'example@example.com'];

      spamEmails.forEach((email) => {
        const result = contactFormSchema.safeParse({
          ...validFormData,
          email,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]?.message).toContain('invalid');
        }
      });
    });
  });

  describe('phone validation', () => {
    it('should accept valid Australian phone numbers', () => {
      const validPhones = ['+61412345678', '0412345678', '+61298765432'];

      validPhones.forEach((phone) => {
        const result = contactFormSchema.safeParse({
          ...validFormData,
          phone,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept empty phone (optional field)', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        phone: '',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid phone formats', () => {
      const invalidPhones = ['1234', '+1234567890', '04123', 'not-a-phone'];

      invalidPhones.forEach((phone) => {
        const result = contactFormSchema.safeParse({
          ...validFormData,
          phone,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('inquiryType validation', () => {
    it('should accept all valid inquiry types', () => {
      inquiryTypes.forEach((type) => {
        const result = contactFormSchema.safeParse({
          ...validFormData,
          inquiryType: type,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid inquiry types', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        inquiryType: 'invalid-type',
      });
      expect(result.success).toBe(false);
    });

    it('should require inquiry type', () => {
      const data = { ...validFormData };
      delete (data as Partial<typeof validFormData>).inquiryType;

      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('message validation', () => {
    it('should accept valid messages', () => {
      const result = contactFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it('should reject messages under 50 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        message: 'Too short',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('50 characters');
      }
    });

    it('should reject messages over 500 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        message: 'a'.repeat(501),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('500 characters');
      }
    });

    it('should accept message at exactly 50 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        message: 'a'.repeat(50),
      });
      expect(result.success).toBe(true);
    });

    it('should accept message at exactly 500 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        message: 'a'.repeat(500),
      });
      expect(result.success).toBe(true);
    });
  });

  describe('honeypot validation', () => {
    it('should accept empty website field', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        website: '',
      });
      expect(result.success).toBe(true);
    });

    it('should reject filled honeypot field', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        website: 'https://spam.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('submission timing validation', () => {
    it('should accept submission time > 2 seconds', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        submissionTime: 2500,
      });
      expect(result.success).toBe(true);
    });

    it('should reject submission time < 2 seconds (bot protection)', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        submissionTime: 1000,
      });
      expect(result.success).toBe(false);
    });

    it('should accept exactly 2 seconds', () => {
      const result = contactFormSchema.safeParse({
        ...validFormData,
        submissionTime: 2000,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('type inference', () => {
    it('should correctly infer TypeScript types', () => {
      const data: ContactFormData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+61412345678',
        inquiryType: 'general',
        message: 'a'.repeat(50),
        website: '',
        submissionTime: 3000,
      };

      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(true);

      if (result.success) {
        // TypeScript should infer these types correctly
        const inferredData: ContactFormData = result.data;
        expect(inferredData.firstName).toBe('Jane');
        expect(inferredData.inquiryType).toBe('general');
      }
    });
  });

  describe('contactFormClientSchema', () => {
    it('should omit anti-bot fields (website, submissionTime)', () => {
      const clientData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '',
        inquiryType: 'tours' as InquiryType,
        message: 'a'.repeat(50),
      };

      const result = contactFormClientSchema.safeParse(clientData);
      expect(result.success).toBe(true);
    });

    it('should validate all required fields', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Smith',
        email: 'invalid-email',
        inquiryType: 'tours' as InquiryType,
        message: 'short',
      };

      const result = contactFormClientSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('error messages', () => {
    it('should provide user-friendly error messages', () => {
      const invalidData = {
        firstName: '',
        lastName: '123',
        email: 'invalid',
        phone: 'abc',
        inquiryType: 'invalid',
        message: 'x',
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        const formatted = result.error.format();
        expect(formatted.firstName?._errors[0]).toBeDefined();
        expect(formatted.email?._errors[0]).toBeDefined();
        expect(formatted.message?._errors[0]).toBeDefined();
      }
    });
  });
});


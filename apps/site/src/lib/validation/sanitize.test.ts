/**
 * Unit tests for DOMPurify sanitization utilities
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizePlainText,
  sanitizeForEmail,
  sanitizeContactFormData,
  sanitizeForEmailGeneration,
} from './sanitize';

describe('sanitizePlainText', () => {
  describe('XSS payload prevention', () => {
    it('should strip script tags', () => {
      const malicious = '<script>alert("XSS")</script>Hello';
      const result = sanitizePlainText(malicious);
      expect(result).toBe('Hello');
      expect(result).not.toContain('<script>');
    });

    it('should strip event handlers', () => {
      const malicious = '<img src=x onerror="alert(1)" />Test';
      const result = sanitizePlainText(malicious);
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert');
    });

    it('should strip iframe tags', () => {
      const malicious = '<iframe src="evil.com"></iframe>Content';
      const result = sanitizePlainText(malicious);
      expect(result).toBe('Content');
      expect(result).not.toContain('<iframe>');
    });

    it('should strip style tags with XSS', () => {
      const malicious = '<style>body{background:url("javascript:alert(1)")}</style>Text';
      const result = sanitizePlainText(malicious);
      expect(result).toBe('Text');
      expect(result).not.toContain('<style>');
    });

    it('should strip anchor tags with javascript: protocol', () => {
      const malicious = '<a href="javascript:alert(1)">Click</a>';
      const result = sanitizePlainText(malicious);
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('<a');
    });
  });

  describe('legitimate content preservation', () => {
    it('should preserve plain text without HTML', () => {
      const input = 'Hello, this is a normal message.';
      const result = sanitizePlainText(input);
      expect(result).toBe(input);
    });

    it('should preserve text with special characters', () => {
      const input = "Hello! I'm interested in farm tours (2-3 people).";
      const result = sanitizePlainText(input);
      expect(result).toBe(input);
    });

    it('should preserve unicode characters', () => {
      const input = 'Café, naïve, résumé';
      const result = sanitizePlainText(input);
      expect(result).toBe(input);
    });

    it('should trim whitespace', () => {
      const input = '  Hello  ';
      const result = sanitizePlainText(input);
      expect(result).toBe('Hello');
    });
  });

  describe('edge cases', () => {
    it('should handle null input', () => {
      const result = sanitizePlainText(null);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = sanitizePlainText(undefined);
      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      const result = sanitizePlainText('');
      expect(result).toBe('');
    });
  });
});

describe('sanitizeForEmail', () => {
  describe('line break preservation', () => {
    it('should convert newlines to <br> tags', () => {
      const input = 'Hello\n\nThis is a message';
      const result = sanitizeForEmail(input);
      expect(result).toContain('<br>');
    });

    it('should preserve multiple line breaks', () => {
      const input = 'Line 1\nLine 2\n\nLine 4';
      const result = sanitizeForEmail(input);
      const brCount = (result.match(/<br>/g) || []).length;
      expect(brCount).toBe(3);
    });
  });

  describe('XSS payload prevention in email context', () => {
    it('should strip dangerous tags even with line breaks', () => {
      const malicious = 'Hello\n<script>alert("XSS")</script>\nWorld';
      const result = sanitizeForEmail(malicious);
      expect(result).not.toContain('<script>');
      expect(result).toContain('<br>');
    });

    it('should allow basic formatting tags if configured', () => {
      const input = 'Normal text with line breaks\nSecond line';
      const result = sanitizeForEmail(input);
      // Should preserve content but sanitize
      expect(result).toContain('Normal text');
      expect(result).toContain('Second line');
    });
  });

  describe('edge cases', () => {
    it('should handle null input', () => {
      const result = sanitizeForEmail(null);
      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      const result = sanitizeForEmail('');
      expect(result).toBe('');
    });
  });
});

describe('sanitizeContactFormData', () => {
  const rawData = {
    firstName: '<b>Jane</b>',
    lastName: '<script>alert(1)</script>Smith',
    email: 'jane@example.com',
    phone: '+61<img>412345678',
    inquiryType: 'tours',
    message: 'Hello\n<script>XSS</script>\nWorld',
  };

  it('should sanitize all text fields', () => {
    const result = sanitizeContactFormData(rawData);

    expect(result.firstName).toBe('Jane');
    expect(result.lastName).toBe('Smith');
    expect(result.email).toBe('jane@example.com');
    expect(result.phone).toBe('+61412345678');
    expect(result.message).not.toContain('<script>');
  });

  it('should handle optional phone field', () => {
    const dataWithoutPhone = {
      ...rawData,
      phone: undefined,
    };

    const result = sanitizeContactFormData(dataWithoutPhone);
    expect(result.phone).toBeUndefined();
  });

  it('should preserve inquiry type', () => {
    const result = sanitizeContactFormData(rawData);
    expect(result.inquiryType).toBe('tours');
  });
});

describe('sanitizeForEmailGeneration', () => {
  const rawData = {
    firstName: '<b>Jane</b>',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '+61412345678',
    inquiryType: 'tours',
    message: 'Hello\n\nThis is my message\nWith multiple lines',
  };

  it('should sanitize names and email as plain text', () => {
    const result = sanitizeForEmailGeneration(rawData);

    expect(result.firstName).toBe('Jane');
    expect(result.email).toBe('jane@example.com');
  });

  it('should preserve line breaks in message for email', () => {
    const result = sanitizeForEmailGeneration(rawData);

    expect(result.message).toContain('<br>');
    expect(result.message).toContain('Hello');
    expect(result.message).toContain('message');
  });

  it('should strip XSS from message while preserving structure', () => {
    const dataWithXSS = {
      ...rawData,
      message: 'Hello\n<script>alert(1)</script>\nWorld',
    };

    const result = sanitizeForEmailGeneration(dataWithXSS);

    expect(result.message).not.toContain('<script>');
    expect(result.message).toContain('<br>');
    expect(result.message).toContain('Hello');
    expect(result.message).toContain('World');
  });
});

describe('OWASP XSS payload testing', () => {
  const owaspPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror="alert(1)">',
    '<svg onload="alert(1)">',
    'javascript:alert(1)',
    '<iframe src="javascript:alert(1)"></iframe>',
    '<body onload="alert(1)">',
    '<input onfocus="alert(1)" autofocus>',
    '<select onfocus="alert(1)" autofocus>',
    '<textarea onfocus="alert(1)" autofocus>',
    '<marquee onstart="alert(1)">',
  ];

  it('should sanitize all OWASP XSS payloads', () => {
    owaspPayloads.forEach((payload) => {
      const result = sanitizePlainText(payload);

      // Should not contain the dangerous parts
      expect(result).not.toContain('<script');
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('onload');
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('alert');
    });
  });
});

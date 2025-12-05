// Utility functions to test
function formatCurrency(amount: number, locale = 'fr-CA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

function formatDate(date: Date | string, locale = 'fr-CA'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(date: Date | string, locale = 'fr-CA'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

function calculateAge(birthDate: Date | string): { years: number; months: number } {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (today.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  
  return { years, months };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

describe('formatCurrency', () => {
  it('formats positive amounts correctly', () => {
    expect(formatCurrency(45.00)).toMatch(/45[,.]00/);
    expect(formatCurrency(1234.56)).toMatch(/1[\s,]?234[,.]56/);
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toMatch(/0[,.]00/);
  });

  it('formats negative amounts correctly', () => {
    expect(formatCurrency(-100)).toMatch(/-?100[,.]00/);
  });
});

describe('formatDate', () => {
  it('formats date object correctly', () => {
    const date = new Date('2024-12-04');
    const formatted = formatDate(date);
    expect(formatted).toContain('2024');
    expect(formatted).toMatch(/décembre|December/i);
  });

  it('formats date string correctly', () => {
    const formatted = formatDate('2024-01-15');
    expect(formatted).toContain('2024');
    expect(formatted).toMatch(/janvier|January/i);
  });
});

describe('formatTime', () => {
  it('formats time correctly', () => {
    const date = new Date('2024-12-04T14:30:00');
    const formatted = formatTime(date);
    expect(formatted).toMatch(/14[h:]30|2:30/);
  });
});

describe('formatPhoneNumber', () => {
  it('formats 10-digit phone numbers', () => {
    expect(formatPhoneNumber('5145551234')).toBe('(514) 555-1234');
    expect(formatPhoneNumber('514-555-1234')).toBe('(514) 555-1234');
    expect(formatPhoneNumber('(514) 555 1234')).toBe('(514) 555-1234');
  });

  it('returns original for invalid formats', () => {
    expect(formatPhoneNumber('123')).toBe('123');
    expect(formatPhoneNumber('abc')).toBe('abc');
  });
});

describe('calculateAge', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-12-04'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calculates age correctly for past dates', () => {
    const age = calculateAge('2022-06-15');
    expect(age.years).toBe(2);
    expect(age.months).toBe(5);
  });

  it('calculates age for infants correctly', () => {
    const age = calculateAge('2024-06-04');
    expect(age.years).toBe(0);
    expect(age.months).toBe(6);
  });
});

describe('slugify', () => {
  it('converts text to slug format', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('Garderie Les Petits Anges')).toBe('garderie-les-petits-anges');
  });

  it('handles accented characters', () => {
    expect(slugify('Préscolaire Été')).toBe('prescolaire-ete');
    expect(slugify('Café résumé')).toBe('cafe-resume');
  });

  it('removes special characters', () => {
    expect(slugify('Test! @#$% String')).toBe('test-string');
  });

  it('handles empty strings', () => {
    expect(slugify('')).toBe('');
  });
});


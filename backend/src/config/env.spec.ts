import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('ENV configuration', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        // Reset modules so ENV is re-evaluated with fresh process.env
        vi.resetModules();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('reads DATABASE_URL from process.env', async () => {
        process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
        const { ENV } = await import('./env');
        expect(ENV.DATABASE_URL).toBe('postgresql://user:pass@localhost:5432/testdb');
    });

    it('reads PORT from process.env', async () => {
        process.env.PORT = '4000';
        const { ENV } = await import('./env');
        expect(ENV.PORT).toBe('4000');
    });

    it('reads NODE_ENV from process.env', async () => {
        process.env.NODE_ENV = 'test';
        const { ENV } = await import('./env');
        expect(ENV.NODE_ENV).toBe('test');
    });

    it('reads FRONTEND_URL from process.env', async () => {
        process.env.FRONTEND_URL = 'http://localhost:3000';
        const { ENV } = await import('./env');
        expect(ENV.FRONTEND_URL).toBe('http://localhost:3000');
    });

    it('reads CLERK_PUBLISHABLE_KEY from process.env', async () => {
        process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_abc123';
        const { ENV } = await import('./env');
        expect(ENV.CLERK_PUBLISHABLE_KEY).toBe('pk_test_abc123');
    });

    it('reads CLERK_SECRET_KEY from process.env', async () => {
        process.env.CLERK_SECRET_KEY = 'sk_test_xyz789';
        const { ENV } = await import('./env');
        expect(ENV.CLERK_SECRET_KEY).toBe('sk_test_xyz789');
    });

    it('returns undefined for DATABASE_URL when not set', async () => {
        delete process.env.DATABASE_URL;
        const { ENV } = await import('./env');
        expect(ENV.DATABASE_URL).toBeUndefined();
    });

    it('returns undefined for PORT when not set', async () => {
        delete process.env.PORT;
        const { ENV } = await import('./env');
        expect(ENV.PORT).toBeUndefined();
    });

    it('exports all required keys in the ENV object', async () => {
        const { ENV } = await import('./env');
        expect(ENV).toHaveProperty('PORT');
        expect(ENV).toHaveProperty('DATABASE_URL');
        expect(ENV).toHaveProperty('NODE_ENV');
        expect(ENV).toHaveProperty('FRONTEND_URL');
        expect(ENV).toHaveProperty('CLERK_PUBLISHABLE_KEY');
        expect(ENV).toHaveProperty('CLERK_SECRET_KEY');
    });

    it('does NOT export DB_URL (renamed to DATABASE_URL)', async () => {
        const { ENV } = await import('./env');
        expect(ENV).not.toHaveProperty('DB_URL');
    });

    it('ENV object has exactly 6 keys', async () => {
        const { ENV } = await import('./env');
        expect(Object.keys(ENV)).toHaveLength(6);
    });
});
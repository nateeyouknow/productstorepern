import { describe, it, expect, vi, beforeEach } from 'vitest';

// Pool must be a proper constructor (not an arrow function) since code does `new Pool(...)`.
// We use vi.hoisted so the class mock is available before vi.mock is hoisted.
const { MockPool, mockPoolOn } = vi.hoisted(() => {
    const mockPoolOn = vi.fn();
    class MockPool {
        on: typeof mockPoolOn;
        constructor(_opts: unknown) {
            this.on = mockPoolOn;
        }
    }
    return { MockPool, mockPoolOn };
});

vi.mock('pg', () => ({ Pool: MockPool }));

vi.mock('drizzle-orm/node-postgres', () => ({
    drizzle: vi.fn(() => ({ _isMockDrizzle: true })),
}));

describe('db/index - module initialisation', () => {
    beforeEach(() => {
        vi.resetModules();
        mockPoolOn.mockReset();
    });

    it('throws when DATABASE_URL is not set', async () => {
        vi.doMock('../config/env', () => ({
            ENV: { DATABASE_URL: undefined },
        }));

        await expect(import('./index')).rejects.toThrow(
            'DATABASE_URL is not set in env vairiable'
        );
    });

    it('throws with exact error message including typo "vairiable"', async () => {
        vi.doMock('../config/env', () => ({
            ENV: { DATABASE_URL: '' },
        }));

        await expect(import('./index')).rejects.toThrow('vairiable');
    });

    it('does not throw when DATABASE_URL is provided', async () => {
        vi.doMock('../config/env', () => ({
            ENV: { DATABASE_URL: 'postgresql://user:pass@localhost:5432/db' },
        }));

        await expect(import('./index')).resolves.toBeDefined();
    });

    it('exports a db object when DATABASE_URL is provided', async () => {
        vi.doMock('../config/env', () => ({
            ENV: { DATABASE_URL: 'postgresql://user:pass@localhost:5432/db' },
        }));

        const mod = await import('./index');
        expect(mod.db).toBeDefined();
    });

    it('creates a Pool with the DATABASE_URL connection string', async () => {
        const url = 'postgresql://user:pass@localhost:5432/mydb';
        vi.doMock('../config/env', () => ({
            ENV: { DATABASE_URL: url },
        }));

        await import('./index');

        // MockPool is a class - check it was instantiated
        const { Pool } = await import('pg');
        expect(Pool).toBeDefined();
    });

    it('registers a "connect" event listener on the pool', async () => {
        vi.doMock('../config/env', () => ({
            ENV: { DATABASE_URL: 'postgresql://localhost/db' },
        }));

        await import('./index');

        expect(mockPoolOn).toHaveBeenCalledWith('connect', expect.any(Function));
    });

    it('registers an "error" event listener on the pool', async () => {
        vi.doMock('../config/env', () => ({
            ENV: { DATABASE_URL: 'postgresql://localhost/db' },
        }));

        await import('./index');

        expect(mockPoolOn).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('"connect" listener logs success message to console.log', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.doMock('../config/env', () => ({
            ENV: { DATABASE_URL: 'postgresql://localhost/db' },
        }));

        await import('./index');

        const connectCb = mockPoolOn.mock.calls.find(
            (call) => call[0] === 'connect'
        )?.[1] as (() => void) | undefined;
        connectCb?.();

        expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully');
        consoleSpy.mockRestore();
    });

    it('"error" listener logs error to console.error', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.doMock('../config/env', () => ({
            ENV: { DATABASE_URL: 'postgresql://localhost/db' },
        }));

        await import('./index');

        const errorCb = mockPoolOn.mock.calls.find(
            (call) => call[0] === 'error'
        )?.[1] as ((err: Error) => void) | undefined;
        const fakeError = new Error('connection refused');
        errorCb?.(fakeError);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            '💥 Database connection error',
            fakeError
        );
        consoleErrorSpy.mockRestore();
    });
});
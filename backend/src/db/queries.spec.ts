import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.mock is hoisted to the top of the file, so mock objects must be created
// with vi.hoisted() to be accessible inside the factory function.
const {
    mockReturning,
    mockWhere,
    mockValues,
    mockInsert,
    mockDelete,
    mockFindFirst,
    mockFindMany,
    mockDb,
} = vi.hoisted(() => {
    const mockReturning = vi.fn();
    const mockWhere = vi.fn(() => ({ returning: mockReturning }));
    const mockValues = vi.fn(() => ({ returning: mockReturning }));
    const mockInsert = vi.fn(() => ({ values: mockValues }));
    const mockDelete = vi.fn(() => ({ where: mockWhere }));
    const mockFindFirst = vi.fn();
    const mockFindMany = vi.fn();

    const mockDb = {
        insert: mockInsert,
        delete: mockDelete,
        query: {
            users: { findFirst: mockFindFirst },
            products: {
                findFirst: mockFindFirst,
                findMany: mockFindMany,
            },
            comments: { findFirst: mockFindFirst },
        },
    };

    return {
        mockReturning,
        mockWhere,
        mockValues,
        mockInsert,
        mockDelete,
        mockFindFirst,
        mockFindMany,
        mockDb,
    };
});

vi.mock('./index', () => ({ db: mockDb }));

import {
    createUser,
    getUserById,
    updateUser,
    upsertUser,
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByUserId,
    updateProduct,
    deleteProduct,
    createComment,
    deleteComment,
    getCommentById,
} from './queries';
import type { NewUser, NewProduct, NewComment } from './schema';

// ---- Fixtures ----
const mockUser = {
    id: 'user_1',
    email: 'test@example.com',
    name: 'Test User',
    imageUrl: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};

const mockProduct = {
    id: 'prod-uuid-1',
    title: 'Test Product',
    description: 'A test product',
    imageUrl: null,
    userId: 'user_1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};

const mockComment = {
    id: 'comment-uuid-1',
    content: 'Great product!',
    userId: 'user_1',
    productId: 'prod-uuid-1',
    createdAt: new Date('2024-01-01'),
};

beforeEach(() => {
    vi.clearAllMocks();
    // Re-wire chain defaults after clearAllMocks resets return values
    mockValues.mockReturnValue({ returning: mockReturning });
    mockWhere.mockReturnValue({ returning: mockReturning });
    mockInsert.mockReturnValue({ values: mockValues });
    mockDelete.mockReturnValue({ where: mockWhere });
});

// ---- Users ----

describe('createUser', () => {
    it('inserts a user and returns it', async () => {
        const newUser: NewUser = { id: 'user_1', email: 'test@example.com' };
        mockReturning.mockResolvedValueOnce([mockUser]);

        const result = await createUser(newUser);

        expect(mockInsert).toHaveBeenCalled();
        expect(mockValues).toHaveBeenCalledWith(newUser);
        expect(mockReturning).toHaveBeenCalled();
        expect(result).toEqual(mockUser);
    });

    it('returns undefined when the db returns an empty array', async () => {
        const newUser: NewUser = { id: 'user_x', email: 'x@example.com' };
        mockReturning.mockResolvedValueOnce([]);

        const result = await createUser(newUser);
        expect(result).toBeUndefined();
    });
});

describe('getUserById', () => {
    it('queries users by id and returns the found user', async () => {
        mockFindFirst.mockResolvedValueOnce(mockUser);

        const result = await getUserById('user_1');

        expect(mockDb.query.users.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.anything() })
        );
        expect(result).toEqual(mockUser);
    });

    it('returns undefined when user does not exist', async () => {
        mockFindFirst.mockResolvedValueOnce(undefined);

        const result = await getUserById('non_existent');
        expect(result).toBeUndefined();
    });
});

describe('updateUser', () => {
    it('is a no-op stub that returns undefined', async () => {
        const result = await updateUser('user_1', { name: 'Updated' });
        expect(result).toBeUndefined();
    });

    it('does not call db insert or delete when invoked', async () => {
        await updateUser('user_1', {});
        expect(mockInsert).not.toHaveBeenCalled();
        expect(mockDelete).not.toHaveBeenCalled();
    });
});

describe('upsertUser', () => {
    it('calls createUser when the user does not exist', async () => {
        const newUser: NewUser = { id: 'user_new', email: 'new@example.com' };
        // getUserById returns undefined -> user not found
        mockFindFirst.mockResolvedValueOnce(undefined);
        // createUser insert returns the new user
        mockReturning.mockResolvedValueOnce([{ ...newUser, createdAt: new Date(), updatedAt: new Date() }]);

        const result = await upsertUser(newUser);

        expect(mockInsert).toHaveBeenCalled();
        expect(result).toMatchObject({ id: 'user_new' });
    });

    it('calls updateUser (returns undefined) when user already exists', async () => {
        const existingUser: NewUser = { id: 'user_1', email: 'test@example.com' };
        // getUserById finds the user
        mockFindFirst.mockResolvedValueOnce(mockUser);

        const result = await upsertUser(existingUser);

        // updateUser is a stub that returns undefined
        expect(result).toBeUndefined();
        // insert should NOT have been called
        expect(mockInsert).not.toHaveBeenCalled();
    });
});

// ---- Products ----

describe('createProduct', () => {
    it('inserts a product and returns it', async () => {
        const newProduct: NewProduct = {
            title: 'New Product',
            description: 'Desc',
            userId: 'user_1',
        };
        mockReturning.mockResolvedValueOnce([mockProduct]);

        const result = await createProduct(newProduct);

        expect(mockInsert).toHaveBeenCalled();
        expect(mockValues).toHaveBeenCalledWith(newProduct);
        expect(result).toEqual(mockProduct);
    });

    it('returns undefined when db returns empty array', async () => {
        mockReturning.mockResolvedValueOnce([]);
        const result = await createProduct({ title: 'T', description: 'D', userId: 'u' });
        expect(result).toBeUndefined();
    });
});

describe('getAllProducts', () => {
    it('queries all products ordered by createdAt desc with user relation', async () => {
        const products = [mockProduct];
        mockFindMany.mockResolvedValueOnce(products);

        const result = await getAllProducts();

        expect(mockDb.query.products.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                with: { user: true },
                orderBy: expect.any(Function),
            })
        );
        expect(result).toEqual(products);
    });

    it('returns an empty array when no products exist', async () => {
        mockFindMany.mockResolvedValueOnce([]);

        const result = await getAllProducts();
        expect(result).toEqual([]);
    });
});

describe('getProductById', () => {
    it('queries a product by id with user and comments relations', async () => {
        mockFindFirst.mockResolvedValueOnce(mockProduct);

        const result = await getProductById('prod-uuid-1');

        expect(mockDb.query.products.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.anything(),
                with: expect.objectContaining({
                    user: true,
                    comments: expect.objectContaining({
                        with: { user: true },
                        orderBy: expect.any(Function),
                    }),
                }),
            })
        );
        expect(result).toEqual(mockProduct);
    });

    it('returns undefined when product does not exist', async () => {
        mockFindFirst.mockResolvedValueOnce(undefined);
        const result = await getProductById('non-existent-id');
        expect(result).toBeUndefined();
    });
});

describe('getProductsByUserId', () => {
    it('queries products filtered by userId with user relation', async () => {
        const products = [mockProduct];
        mockFindMany.mockResolvedValueOnce(products);

        const result = await getProductsByUserId('user_1');

        expect(mockDb.query.products.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.anything(),
                with: { user: true },
                orderBy: expect.any(Function),
            })
        );
        expect(result).toEqual(products);
    });

    it('returns empty array when user has no products', async () => {
        mockFindMany.mockResolvedValueOnce([]);
        const result = await getProductsByUserId('user_no_products');
        expect(result).toEqual([]);
    });
});

describe('updateProduct', () => {
    it('is a no-op stub that returns undefined', async () => {
        const result = await updateProduct('prod-uuid-1', { title: 'Updated' });
        expect(result).toBeUndefined();
    });

    it('does not call db insert or delete when invoked', async () => {
        await updateProduct('prod-uuid-1', {});
        expect(mockInsert).not.toHaveBeenCalled();
        expect(mockDelete).not.toHaveBeenCalled();
    });
});

describe('deleteProduct', () => {
    it('deletes a product by id and returns it', async () => {
        mockReturning.mockResolvedValueOnce([mockProduct]);

        const result = await deleteProduct('prod-uuid-1');

        expect(mockDelete).toHaveBeenCalled();
        expect(mockWhere).toHaveBeenCalledWith(expect.anything());
        expect(result).toEqual(mockProduct);
    });

    it('returns undefined when product to delete is not found', async () => {
        mockReturning.mockResolvedValueOnce([]);
        const result = await deleteProduct('non-existent-id');
        expect(result).toBeUndefined();
    });
});

// ---- Comments ----

describe('createComment', () => {
    it('inserts a comment and returns it', async () => {
        const newComment: NewComment = {
            content: 'Nice!',
            userId: 'user_1',
            productId: 'prod-uuid-1',
        };
        mockReturning.mockResolvedValueOnce([mockComment]);

        const result = await createComment(newComment);

        expect(mockInsert).toHaveBeenCalled();
        expect(mockValues).toHaveBeenCalledWith(newComment);
        expect(result).toEqual(mockComment);
    });

    it('returns undefined when db returns empty array', async () => {
        mockReturning.mockResolvedValueOnce([]);
        const result = await createComment({ content: 'x', userId: 'u', productId: 'p' });
        expect(result).toBeUndefined();
    });
});

describe('deleteComment', () => {
    it('deletes a comment by id and returns it', async () => {
        mockReturning.mockResolvedValueOnce([mockComment]);

        const result = await deleteComment('comment-uuid-1');

        expect(mockDelete).toHaveBeenCalled();
        expect(mockWhere).toHaveBeenCalledWith(expect.anything());
        expect(result).toEqual(mockComment);
    });

    it('returns undefined when comment to delete is not found', async () => {
        mockReturning.mockResolvedValueOnce([]);
        const result = await deleteComment('non-existent-comment-id');
        expect(result).toBeUndefined();
    });
});

describe('getCommentById', () => {
    it('queries a comment by id with user relation', async () => {
        mockFindFirst.mockResolvedValueOnce(mockComment);

        const result = await getCommentById('comment-uuid-1');

        expect(mockDb.query.comments.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.anything(),
                with: { user: true },
            })
        );
        expect(result).toEqual(mockComment);
    });

    it('returns undefined when comment does not exist', async () => {
        mockFindFirst.mockResolvedValueOnce(undefined);
        const result = await getCommentById('non-existent-comment-id');
        expect(result).toBeUndefined();
    });
});
import { describe, it, expect } from 'vitest';
import {
    users,
    products,
    comments,
    usersRelations,
    productsRelations,
    commentsRelations,
} from './schema';
import type { User, NewUser, Product, NewProduct, Comment, NewComment } from './schema';

describe('schema - users table', () => {
    it('is defined as a pg table named "users"', () => {
        expect(users).toBeDefined();
        // Drizzle tables expose their name via the Symbol(drizzle:Name) property
        expect((users as any)[Symbol.for('drizzle:Name')]).toBe('users');
    });

    it('has an id column', () => {
        expect(users.id).toBeDefined();
    });

    it('has an email column', () => {
        expect(users.email).toBeDefined();
    });

    it('has a name column', () => {
        expect(users.name).toBeDefined();
    });

    it('has an imageUrl column', () => {
        expect(users.imageUrl).toBeDefined();
    });

    it('has a createdAt column', () => {
        expect(users.createdAt).toBeDefined();
    });

    it('has an updatedAt column', () => {
        expect(users.updatedAt).toBeDefined();
    });

    it('id column maps to "id" in the database', () => {
        expect((users.id as any).name).toBe('id');
    });

    it('email column maps to "email" in the database', () => {
        expect((users.email as any).name).toBe('email');
    });

    it('imageUrl column maps to "image_url" in the database', () => {
        expect((users.imageUrl as any).name).toBe('image_url');
    });

    it('createdAt column maps to "created_at" in the database', () => {
        expect((users.createdAt as any).name).toBe('created_at');
    });

    it('updatedAt column maps to "updated_at" in the database', () => {
        expect((users.updatedAt as any).name).toBe('updated_at');
    });
});

describe('schema - products table', () => {
    it('is defined as a pg table named "products"', () => {
        expect(products).toBeDefined();
        expect((products as any)[Symbol.for('drizzle:Name')]).toBe('products');
    });

    it('has an id column', () => {
        expect(products.id).toBeDefined();
    });

    it('has a title column', () => {
        expect(products.title).toBeDefined();
    });

    it('has a description column', () => {
        expect(products.description).toBeDefined();
    });

    it('has an imageUrl column', () => {
        expect(products.imageUrl).toBeDefined();
    });

    it('has a userId column', () => {
        expect(products.userId).toBeDefined();
    });

    it('has a createdAt column', () => {
        expect(products.createdAt).toBeDefined();
    });

    it('has an updatedAt column', () => {
        expect(products.updatedAt).toBeDefined();
    });

    it('userId column maps to "user_id" in the database', () => {
        expect((products.userId as any).name).toBe('user_id');
    });

    it('imageUrl column maps to "image_url" in the database', () => {
        expect((products.imageUrl as any).name).toBe('image_url');
    });

    it('createdAt column maps to "created_at" in the database', () => {
        expect((products.createdAt as any).name).toBe('created_at');
    });

    it('updatedAt column maps to "updated_at" in the database', () => {
        expect((products.updatedAt as any).name).toBe('updated_at');
    });
});

describe('schema - comments table', () => {
    it('is defined as a pg table named "comments"', () => {
        expect(comments).toBeDefined();
        expect((comments as any)[Symbol.for('drizzle:Name')]).toBe('comments');
    });

    it('has an id column', () => {
        expect(comments.id).toBeDefined();
    });

    it('has a content column', () => {
        expect(comments.content).toBeDefined();
    });

    it('has a userId column', () => {
        expect(comments.userId).toBeDefined();
    });

    it('has a productId column', () => {
        expect(comments.productId).toBeDefined();
    });

    it('has a createdAt column', () => {
        expect(comments.createdAt).toBeDefined();
    });

    it('userId column maps to "user_id" in the database', () => {
        expect((comments.userId as any).name).toBe('user_id');
    });

    it('productId column maps to "product_id" in the database', () => {
        expect((comments.productId as any).name).toBe('product_id');
    });

    it('createdAt column maps to "created_at" in the database', () => {
        expect((comments.createdAt as any).name).toBe('created_at');
    });
});

describe('schema - relations', () => {
    it('usersRelations is defined', () => {
        expect(usersRelations).toBeDefined();
    });

    it('productsRelations is defined', () => {
        expect(productsRelations).toBeDefined();
    });

    it('commentsRelations is defined', () => {
        expect(commentsRelations).toBeDefined();
    });
});

describe('schema - type exports', () => {
    it('User type can be used for a user row shape', () => {
        const user: User = {
            id: 'user_1',
            email: 'test@example.com',
            name: 'Test User',
            imageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        expect(user.id).toBe('user_1');
        expect(user.email).toBe('test@example.com');
    });

    it('NewUser type allows insert without optional fields', () => {
        const newUser: NewUser = {
            id: 'user_2',
            email: 'new@example.com',
        };
        expect(newUser.id).toBe('user_2');
        expect(newUser.name).toBeUndefined();
    });

    it('Product type can be used for a product row shape', () => {
        const product: Product = {
            id: 'prod-uuid-1234',
            title: 'Test Product',
            description: 'A description',
            imageUrl: null,
            userId: 'user_1',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        expect(product.title).toBe('Test Product');
        expect(product.userId).toBe('user_1');
    });

    it('NewProduct type requires title, description, and userId', () => {
        const newProduct: NewProduct = {
            title: 'Product A',
            description: 'Desc A',
            userId: 'user_1',
        };
        expect(newProduct.title).toBe('Product A');
    });

    it('Comment type can be used for a comment row shape', () => {
        const comment: Comment = {
            id: 'comment-uuid-1',
            content: 'Great product!',
            userId: 'user_1',
            productId: 'prod-uuid-1234',
            createdAt: new Date(),
        };
        expect(comment.content).toBe('Great product!');
        expect(comment.productId).toBe('prod-uuid-1234');
    });

    it('NewComment type requires content, userId, and productId', () => {
        const newComment: NewComment = {
            content: 'Nice!',
            userId: 'user_1',
            productId: 'prod-uuid-5678',
        };
        expect(newComment.content).toBe('Nice!');
    });
});
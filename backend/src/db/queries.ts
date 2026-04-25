import {eq} from 'drizzle-orm';
import {users, comments, products, type NewUser, type NewComment, type NewProduct} from './schema';
import {db} from './index';

export const createUser = async (data: NewUser) =>{
    const [user] = await db.insert(users).values(data).returning(); //await
    return user;
}

export const getUserById = async (id: string) => {
    return await db.query.users.findFirst({where: eq(users.id, id)}); //await
}

export const updateUser = async (id: string, data: Partial<NewUser>)  => {};

export const upsertUser = async (data: NewUser) => {
    const existingUser = await getUserById(data.id);
    if(existingUser) return updateUser(data.id, data);
    return createUser(data);
}

export const createProduct = async (data:NewProduct) => {
    const [product] = await db.insert(products).values(data).returning();
    return product;
}

export const getAllProducts = async() =>{
    return await db.query.products.findMany({ //await
        with: { user: true},
        orderBy: (products, {desc})=> [desc(products.createdAt)] //desc means: you will see the latest first
        //square brackets required because drizzle orm expects brackets
    });
}

export const getProductById = async (id: string) => {
    return await db.query.products.findFirst({ //await
        where: eq(products.id, id),
        with:
        {
            user: true,
            comments: {
                with: {user: true},
                orderBy: (comments, {desc}) => [desc(comments.createdAt)]
            }
        }
    });
};

export const getProductsByUserId = async (userId: string) => {
    return await db.query.products.findMany({
        where: eq(products.userId, userId),
        with: {
            user: true,
        },
        orderBy: (products, {desc})=>desc(products.createdAt)
    })
};

export const updateProduct = async(id: string, data: Partial<NewProduct>)=>{

};

export const deleteProduct = async (id: string) =>{
    const [product] = await db.delete(products).where(eq(products.id, id)).returning();
    return product;
};

export const createComment = async (data: NewComment) => {
    const [comment] = await db.insert(comments).values(data).returning();
    return comment;
};

export const deleteComment = async (id: string) => {
    const [comment] = await db.delete(comments).where(eq(comments.id, id)).returning();
    return comment;
};

export const getCommentById = async (id: string) => {
    return db.query.comments.findFirst({
        where: eq(comments.id, id),
        with: {user: true},
})
}
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
    // 1. Create a connection pool using your Supabase POOLER URL (port 6543)
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // 2. Wrap it in the Prisma PG adapter
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter to the Prisma Client
    return new PrismaClient({ adapter });
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
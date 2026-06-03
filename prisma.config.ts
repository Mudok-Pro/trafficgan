import { defineConfig, env } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // The CLI strictly uses this direct connection (port 5432) for migrations
    url: env('DIRECT_URL'),
  },
});
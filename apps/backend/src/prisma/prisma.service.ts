import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "../../../../packages/prisma/generated/main";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Check if DATABASE_URL contains unresolved variables
    const envDatabaseUrl = process.env.DATABASE_URL;
    const hasUnresolvedVars = envDatabaseUrl && envDatabaseUrl.includes("${");

    const databaseUrl =
      envDatabaseUrl && !hasUnresolvedVars
        ? envDatabaseUrl
        : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    // console.log('🔍 Backend Prisma Debug:');
    // console.log('DATABASE_URL:', process.env.DATABASE_URL);
    // console.log('Final databaseUrl:', databaseUrl);

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

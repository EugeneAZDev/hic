import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "../../../../packages/prisma/generated/auth";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Check if AUTH_DATABASE_URL contains unresolved variables
    const envDatabaseUrl = process.env.AUTH_DATABASE_URL;
    const hasUnresolvedVars = envDatabaseUrl && envDatabaseUrl.includes("${");

    const databaseUrl =
      envDatabaseUrl && !hasUnresolvedVars
        ? envDatabaseUrl
        : `postgresql://${process.env.AUTH_DB_USER}:${process.env.AUTH_DB_PASSWORD}@${process.env.AUTH_DB_HOST}:${process.env.AUTH_DB_PORT}/${process.env.AUTH_DB_NAME}`;

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

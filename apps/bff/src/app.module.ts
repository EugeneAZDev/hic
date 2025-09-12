import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { AppController } from "./app.controller";
import { UsersBffModule } from "./users/users-bff.module";
import { AuthBffModule } from "./auth/auth-bff.module";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(__dirname, "../../..", ".env-files", ".env.local"),
        join(__dirname, "../../..", ".env-files", ".env.dev"),
        ".env.local",
        ".env.dev",
        ".env",
      ],
    }),
    HttpModule,
    UsersBffModule,
    AuthBffModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

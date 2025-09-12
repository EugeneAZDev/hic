import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { UserFromSchema } from "@hic/shared-dto";

@Injectable()
export class UsersBffService {
  private readonly backendUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.backendUrl =
      this.configService.get<string>("BACKEND_URL") || "http://localhost:3011";
  }

  async findAll(): Promise<UserFromSchema[]> {
    const response = await firstValueFrom(
      this.httpService.get<UserFromSchema[]>(`${this.backendUrl}/api/users`),
    );
    return response.data;
  }

  async findOne(id: string): Promise<UserFromSchema> {
    const response = await firstValueFrom(
      this.httpService.get<UserFromSchema>(
        `${this.backendUrl}/api/users/${id}`,
      ),
    );
    return response.data;
  }
}

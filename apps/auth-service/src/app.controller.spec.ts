import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";

describe("AppController", () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return service info", () => {
    const result = controller.getServiceInfo();
    expect(result).toHaveProperty("service", "auth-service");
    expect(result).toHaveProperty("version", "1.0.0");
    expect(result).toHaveProperty("status", "running");
    expect(result).toHaveProperty("timestamp");
    expect(result).toHaveProperty("endpoints");
  });
});

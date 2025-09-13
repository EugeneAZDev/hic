import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";
import { HealthCheckService, MemoryHealthIndicator, DiskHealthIndicator } from "@nestjs/terminus";

describe("HealthController", () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn(),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: {
            checkStorage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should call health check", () => {
    const mockResult = { status: "ok" };
    jest.spyOn(healthCheckService, "check").mockReturnValue(mockResult as any);

    const result = controller.check();
    expect(healthCheckService.check).toHaveBeenCalled();
    expect(result).toBe(mockResult);
  });
});

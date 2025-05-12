import { vi, describe, it, expect } from "vitest";
import { getRouteToken, pollRouteStatus } from "../services/api";

const getMockStatus = (token) => {
  return fetch(`https://sg-mock-api.lalamove.com/mock/route/${token}`);
};

describe("pollRouteStatus - Mock API Endpoints", () => {
  it("returns success data for valid token", async () => {
    const result = await pollRouteStatus(
      "success",
      undefined,
      3,
      500,
      getMockStatus
    );
    expect(result.status).toBe("success");
    expect(result.path).toBeDefined();
    expect(result.total_distance).toBeGreaterThan(0);
    expect(result.total_time).toBeGreaterThan(0);
  });

  it("throws error on failure token", async () => {
    await expect(
      pollRouteStatus("failure", undefined, 1, 0, getMockStatus)
    ).rejects.toThrow("Location not accessible by car");
  });

  it("throws timeout error if always in progress", async () => {
    await expect(
      pollRouteStatus("inprogress", undefined, 2, 100, getMockStatus)
    ).rejects.toThrow("Route generation timed out");
  });
});

describe("pollRouteStatus - Mock getStatus", () => {
  it("resolves with mocked success data", async () => {
    const mockGetStatus = async () => ({
      ok: true,
      json: async () => ({
        status: "success",
        path: [["22.372081", "114.107877"]],
        total_distance: 1000,
        total_time: 300,
      }),
    });

    const result = await pollRouteStatus(
      "success",
      undefined,
      1,
      0,
      mockGetStatus
    );
    expect(result.status).toBe("success");
    expect(result.total_distance).toBe(1000);
    expect(result.total_time).toBe(300);
  });

  it("throws mocked failure error", async () => {
    const mockGetStatus = async () => ({
      ok: true,
      json: async () => ({
        status: "failure",
        error: "Mock failure",
      }),
    });

    await expect(
      pollRouteStatus("failure", undefined, 1, 0, mockGetStatus)
    ).rejects.toThrow("Mock failure");
  });

  it("throws after max retries with mocked in progress", async () => {
    const mockGetStatus = async () => ({
      ok: true,
      json: async () => ({ status: "in progress" }),
    });

    await expect(
      pollRouteStatus("inprogress", undefined, 3, 0, mockGetStatus)
    ).rejects.toThrow("Route generation timed out");
  });
});

describe("getRouteToken - Mock API Endpoints", () => {
  it("returns a valid token on successful POST request (200 OK)", async () => {
    // Mock the fetch call to return a successful response with a token
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        token: "9d3503e0-7236-4e47-a62f-8b01b5646c16",
      }),
    });

    const result = await getRouteToken(
      "originAddress",
      "destinationAddress",
      undefined
    );
    expect(result).toBeDefined();
    expect(result).toBe("9d3503e0-7236-4e47-a62f-8b01b5646c16");
  });

  it("throws error on 500 Internal Server Error during token request", async () => {
    // Mock the fetch call to simulate a 500 error response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Internal Server Error" }),
    });

    await expect(
      getRouteToken("originAddress", "destinationAddress", undefined)
    ).rejects.toThrow("Server error: 500");
  });
});

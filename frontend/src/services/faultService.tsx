import { axiosInstance, buildConfig } from "@/utils/axios";

export const getFaults = (accessToken?: string, params?: any) =>
  axiosInstance.get("/faults/all", buildConfig(accessToken, params));
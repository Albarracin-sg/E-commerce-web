import { requestAuth, requestGet } from "../../../services/api";
import type { ApiResponse } from "../../../services/api";
import type {
  AdminDashboardMetrics,
  AdminOrder,
  AdminOrderStatus,
  AdminPaginatedResponse,
  AdminUser,
} from "../types";

export function getAdminDashboardMetricsRequest() {
  return requestGet<ApiResponse<AdminDashboardMetrics>>("/api/admin/dashboard/metrics");
}

export function getAdminOrdersRequest(params?: { page?: number; limit?: number; status?: string }) {
  return requestGet<AdminPaginatedResponse<AdminOrder>>("/api/admin/orders", params);
}

export function getAdminUsersRequest(params?: { page?: number; limit?: number }) {
  return requestGet<AdminPaginatedResponse<AdminUser>>("/api/admin/users", params);
}

export function updateAdminOrderStatusRequest(id: number, status: AdminOrderStatus) {
  return requestAuth<ApiResponse<{ id: number; status: AdminOrderStatus; updated: boolean }>>(
    "patch",
    `/api/admin/orders/${id}/status`,
    { status }
  );
}

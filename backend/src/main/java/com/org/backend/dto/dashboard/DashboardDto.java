package com.org.backend.dto.dashboard;

public record DashboardDto(
        AdminDashboardDto admin,
        ManagerDashboardDto manager,
        EmployeeDashboardDto employee
) {
}

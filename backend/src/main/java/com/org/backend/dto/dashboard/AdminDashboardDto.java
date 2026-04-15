package com.org.backend.dto.dashboard;

public record AdminDashboardDto(
        int noOfEmployees,
        int noOfDepartments,
        int noOfManagers,
        int noOfActiveTasks
) {
}

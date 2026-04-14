package com.org.backend.service;

import com.org.backend.dto.dashboard.AdminDashboardDto;
import com.org.backend.dto.dashboard.DashboardDto;
import com.org.backend.dto.dashboard.EmployeeDashboardDto;
import com.org.backend.dto.dashboard.ManagerDashboardDto;
import com.org.backend.entity.Employee;
import com.org.backend.enums.TaskStatus;
import com.org.backend.repository.DepartmentRepository;
import com.org.backend.repository.EmployeeRepository;
import com.org.backend.repository.PositionRepository;
import com.org.backend.repository.TaskRepository;
import com.org.backend.security.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final TaskRepository taskRepository;
    private final PositionRepository positionRepository;

    public DashboardDto getDashboardData(CustomUserPrincipal userPrincipal){

        AdminDashboardDto adminData = null;
        EmployeeDashboardDto employeeData = null;
        ManagerDashboardDto managerData = null;

        if(userPrincipal.getRole().equals("ADMIN")) {

            adminData = getAdminDashboard(userPrincipal);

        } else if (userPrincipal.getRole().equals("MANAGER")) {

            managerData = getManagerDashboard(userPrincipal);

        }else {

            employeeData = getEmployeeDashboard(userPrincipal);
        }

        return new DashboardDto(
                adminData,
                managerData,
                employeeData
        );
    }

    private AdminDashboardDto getAdminDashboard(CustomUserPrincipal userPrincipal){

        int noOfEmployees = (int) employeeRepository.count();
        int noOfDepartments = (int) departmentRepository.count();
        int noOfManagers = (int) employeeRepository.countManagers();
        int noOfTasks = (int) taskRepository.countByStatus(TaskStatus.IN_PROGRESS);


        return new AdminDashboardDto(
                noOfEmployees,
                noOfDepartments,
                noOfManagers,
                noOfTasks
        );
    }

    private ManagerDashboardDto getManagerDashboard(CustomUserPrincipal userPrincipal){

        Employee employee = employeeRepository.findById(userPrincipal.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid employee"));

        int teamSize = (int) employeeRepository.countByManagerId(employee.getManager().getId());
        int tasksPending = 0; //mock

        return new ManagerDashboardDto(
                teamSize,
                tasksPending
        );
    }

    private EmployeeDashboardDto getEmployeeDashboard(CustomUserPrincipal userPrincipal){

        Employee employee = employeeRepository.findById(userPrincipal.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid employee"));

        int teamSize = 0;

        if (employee.getManager() != null) {
            teamSize = (int) employeeRepository.countByManagerId(employee.getManager().getId());
        }

        int tasksPending = 0; //mock

        return new EmployeeDashboardDto(
                teamSize,
                tasksPending
        );
    }
}

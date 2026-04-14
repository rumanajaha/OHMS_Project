package com.org.backend.config;

import com.org.backend.entity.Role;
import com.org.backend.enums.Permission;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class RolePermissionMapper {

    private static final Map<String, List<Permission>> ROLE_PERMISSIONS = Map.of(
            "ADMIN", List.of(
                    Permission.DEPARTMENT_CREATE,
                    Permission.DEPARTMENT_UPDATE,
                    Permission.POSITION_CREATE,
                    Permission.POSITION_UPDATE,
                    Permission.EMPLOYEE_CREATE,
                    Permission.EMPLOYEE_UPDATE,
                    Permission.EMPLOYEE_VIEW_TEAM,
                    Permission.EMPLOYEE_VIEW_SELF,
                    Permission.EMPLOYEE_VIEW_ALL,
                    Permission.EMPLOYEE_SEARCH,
                    Permission.HIERARCHY_VIEW,
                    Permission.HIERARCHY_EDIT,
                    Permission.TASK_CREATE,
                    Permission.TASK_UPDATE,
                    Permission.TASK_DELETE,
                    Permission.TASK_VIEW,
                    Permission.TASK_ASSIGN,
                    Permission.TASK_COMMENT
            ),
            "MANAGER", List.of(
                    Permission.EMPLOYEE_UPDATE,
                    Permission.EMPLOYEE_VIEW_TEAM,
                    Permission.HIERARCHY_VIEW,
                    Permission.TASK_CREATE,
                    Permission.TASK_UPDATE,
                    Permission.TASK_VIEW,
                    Permission.TASK_ASSIGN,
                    Permission.TASK_COMMENT
            ),
            "EMPLOYEE", List.of(
                    Permission.EMPLOYEE_VIEW_TEAM,
                    Permission.EMPLOYEE_VIEW_SELF,
                    Permission.TASK_VIEW,
                    Permission.TASK_COMMENT
            )
    );


    public List<String> getPermissions(List<String> roles){
        return roles.stream()
                .flatMap(role -> ROLE_PERMISSIONS
                        .getOrDefault(role, List.of())
                        .stream()
                )
                .map(Enum::name)
                .distinct()
                .toList();
    }
}

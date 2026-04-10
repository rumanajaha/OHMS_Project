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
                    Permission.HIERARCHY_EDIT
            ),
            "MANAGER", List.of(
                    Permission.EMPLOYEE_UPDATE,
                    Permission.EMPLOYEE_VIEW_TEAM,
                    Permission.HIERARCHY_VIEW
            ),
            "EMPLOYEE", List.of(
                    Permission.EMPLOYEE_VIEW_TEAM,
                    Permission.EMPLOYEE_VIEW_SELF
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

package com.org.backend.service;

import com.org.backend.dto.HierarchyEmployeeDto;
import com.org.backend.dto.HierarchyNodeDto;
import com.org.backend.entity.Employee;
import com.org.backend.entity.Position;
import com.org.backend.repository.EmployeeRepository;
import com.org.backend.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class HierarchyService {

    private final EmployeeRepository employeeRepository;
    private final PositionRepository positionRepository;
    private final NotificationService notificationService;

    public List<HierarchyNodeDto> getFullHierarchy(){

        List<Position> positions = positionRepository.findAll();
        List<Employee> employees = employeeRepository.findAll();

        Map<Long, List<Employee>> positionEmployeesMap =
                employees.stream()
                        .filter(e -> e.getPosition() != null)
                        .collect(Collectors.groupingBy(e -> e.getPosition().getId()));

        Map<Long, List<Position>> childrenMap =
                positions.stream()
                        .filter(p -> p.getParentPosition() != null)
                        .collect(Collectors.groupingBy(
                                p -> p.getParentPosition().getId()
                        ));

        List<Position> roots = positions.stream()
                .filter(p -> p.getParentPosition() == null)
                .toList();

        if (roots.isEmpty()) {
            throw new RuntimeException("No root positions found");
        }

        return roots.stream()
                .map(root -> buildTree(root, childrenMap, positionEmployeesMap))
                .toList();
    }


    private HierarchyNodeDto buildTree(
            Position position,
            Map<Long, List<Position>> childrenMap,
            Map<Long, List<Employee>> positionEmployeesMap
    ) {

        HierarchyNodeDto node = new HierarchyNodeDto();

        node.setPositionId(position.getId());
        node.setTitle(position.getTitle());

        List<Employee> employees =
                positionEmployeesMap.getOrDefault(position.getId(), List.of());

        node.setEmployees(
                employees.stream()
                        .map(e -> new HierarchyEmployeeDto(
                                e.getId(),
                                e.getFullName()
                        ))
                        .toList()
        );

        List<HierarchyNodeDto> children =
                childrenMap.getOrDefault(position.getId(), List.of())
                        .stream()
                        .map(child -> buildTree(child, childrenMap, positionEmployeesMap))
                        .toList();

        node.setChildren(children);

        return node;
    }
    public void movePosition(Long positionId, Long parentId) {
        Position position = positionRepository.findById(positionId).orElseThrow(() -> new RuntimeException("Position not found"));
        Position parent = positionRepository.findById(parentId).orElseThrow(() -> new RuntimeException("Parent position not found"));
        if (position.getId().equals(parentId)) {
            throw new RuntimeException("Position cannot be its own parent");
        }
        // circular hierarchy
        Position curr = parent;
        while (curr != null) {
            if (curr.getId().equals(positionId)) {
                throw new RuntimeException("Circular hierarchy detected");
            }
            curr = curr.getParentPosition();
        }
        position.setParentPosition(parent);
        positionRepository.save(position);

        List<Employee> employees = employeeRepository.findAll().stream()
                .filter(e -> e.getPosition() != null && e.getPosition().getId().equals(positionId))
                .toList();
        
        for (Employee emp : employees) {
            if (emp.getUser() != null) {
                notificationService.notify(
                        emp.getUser().getId(),
                        "Hierarchy Changed",
                        "Your position's place in the hierarchy has changed.",
                        com.org.backend.enums.NotificationType.POSITION_CHANGED,
                        positionId,
                        1L
                );
            }
        }
    }

    public void assignEmployeeToPosition(Long positionId, Long employeeId) {
        Position position = positionRepository.findById(positionId).orElseThrow(() -> new RuntimeException("Position not found"));
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found"));
        
        if (employeeRepository.existsByPositionIdAndIdNot(positionId, employeeId)) {
            throw new RuntimeException("This position is already assigned to another employee");
        }
        
        employee.setPosition(position);
        employee.setDepartment(position.getDepartment());
        employeeRepository.save(employee);
        
        if (employee.getUser() != null) {
            notificationService.notify(
                    employee.getUser().getId(),
                    "Position Assigned",
                    "You have been assigned to the position: " + position.getTitle(),
                    com.org.backend.enums.NotificationType.EMPLOYEE_ASSIGNED,
                    employee.getId(),
                    1L
            );
        }
    }

    public void unassignEmployeeFromPosition(Long positionId) {
        Position position = positionRepository.findById(positionId).orElseThrow(() -> new RuntimeException("Position not found"));
        List<Employee> employees = employeeRepository.findAll().stream()
                .filter(e -> e.getPosition() != null && e.getPosition().getId().equals(positionId))
                .toList();

        for (Employee employee : employees) {
            employee.setPosition(null);
            employee.setDepartment(null);
            employeeRepository.save(employee);
            
            if (employee.getUser() != null) {
                notificationService.notify(
                        employee.getUser().getId(),
                        "Position Unassigned",
                        "You have been unassigned from the position: " + position.getTitle(),
                        com.org.backend.enums.NotificationType.POSITION_CHANGED,
                        employee.getId(),
                        1L
                );
            }
        }
    }
}

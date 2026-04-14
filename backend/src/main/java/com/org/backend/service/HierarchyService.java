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
    }
}

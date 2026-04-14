package com.org.backend.repository;

import com.org.backend.entity.Employee;
import com.org.backend.enums.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    List<Employee> findByManagerId(Long managerId);
    List<Employee> findByDepartmentId(Long departmentId);
    List<Employee> findByPositionId(Long positionId);
    List<Employee> findByStatus(EmployeeStatus status);

    List<Employee> findByManagerIdAndStatus(Long managerId, EmployeeStatus status);

    long countByStatus(EmployeeStatus status);
    long countByPositionId(Long positionId);
    long countByManagerId(Long managerId);
    List<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}

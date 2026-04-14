package com.org.backend.repository;

import com.org.backend.entity.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment,Long> {
    List<TaskAssignment> findByEmployeeId(Long employeeId);
    List<TaskAssignment> findByTaskId(Long taskId);
    boolean existsByTaskIdAndEmployeeId(Long taskId,Long employeeId);
}

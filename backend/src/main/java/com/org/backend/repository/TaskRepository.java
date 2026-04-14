package com.org.backend.repository;

import com.org.backend.entity.Task;
import com.org.backend.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByAssignedById(Long employeeId);
    List<Task> findByStatus(TaskStatus status);

}

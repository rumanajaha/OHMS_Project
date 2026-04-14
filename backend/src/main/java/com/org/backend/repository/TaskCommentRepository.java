package com.org.backend.repository;

import com.org.backend.entity.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskCommentRepository extends JpaRepository<TaskComment,Long> {
    List<TaskComment> findByTaskId(Long taskId);
}

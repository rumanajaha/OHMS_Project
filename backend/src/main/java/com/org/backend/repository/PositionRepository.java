package com.org.backend.repository;

import com.org.backend.entity.Department;
import com.org.backend.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {

    long countByDepartment(Department department);
}

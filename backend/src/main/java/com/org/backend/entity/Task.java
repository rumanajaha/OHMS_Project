package com.org.backend.entity;

import com.org.backend.enums.TaskPriority;
import com.org.backend.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
@Table(name="tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.TODO;
    @Enumerated(EnumType.STRING)
    private TaskPriority priority = TaskPriority.MEDIUM;
    private LocalDate dueDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="assigned_by_id", nullable=false)
    private Employee assignedBy;
    @OneToMany(mappedBy="task",cascade=CascadeType.ALL,fetch =FetchType.LAZY)
    private List<TaskAssignment> assignments = new ArrayList<>();
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskComment> comments = new ArrayList<>();
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

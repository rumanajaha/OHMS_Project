package com.org.backend.controller;

import com.org.backend.dto.Task.*;
import com.org.backend.enums.TaskStatus;
import com.org.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/tasks")
@PreAuthorize("isAuthenticated()")

public class TaskController {
    private final TaskService taskService;
    @PreAuthorize("hasAuthority('TASK_CREATE')")
    @PostMapping
    public TaskDto createTask(@Valid @RequestBody TaskCreateRequestDto request){
        return taskService.createTask(request);
    }
    @PreAuthorize("hasAuthority('TASK_VIEW')")
    @GetMapping
    public List<TaskDto> getAllTasks() { return taskService.getAllTasks();
    }
    @PreAuthorize("hasAuthority('TASK_VIEW')")
    @GetMapping("/{taskId}")
    public TaskDto getTaskById(@PathVariable Long taskId) { return taskService.getTaskById(taskId);
    }
    @PreAuthorize("hasAuthority('TASK_UPDATE')")
    @PutMapping("/{taskId}")
    public TaskDto updateTask(@PathVariable Long taskId,  @Valid @RequestBody TaskUpdateRequestDto request ) {
        return taskService.updateTask(taskId, request);
    }
    @PreAuthorize("hasAuthority('TASK_DELETE')")
    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long taskId) { taskService.deleteTask(taskId);
    }
    @PreAuthorize("hasAuthority('TASK_ASSIGN')")
    @PostMapping("/{taskId}/assign")
    public TaskDto assignEmployees(@PathVariable Long taskId, @Valid @RequestBody TaskAssignRequestDto request
    ) {
        return taskService.assignEmployees(taskId, request);
    }
    @PreAuthorize("hasAuthority('TASK_VIEW')")
    @GetMapping("/employee/{employeeId}")
    public List<TaskDto> getTasksForEmployee(@PathVariable Long employeeId) {
        return taskService.getTasksForEmployee(employeeId);
    }
    @PreAuthorize("hasAuthority('TASK_VIEW')")
    @GetMapping("/filter")
    public List<TaskDto> getTasksByStatus(@RequestParam TaskStatus status) {
        return taskService.getTasksByStatus(status);
    }
    @PreAuthorize("hasAuthority('TASK_COMMENT')")
    @PostMapping("/{taskId}/comments")
    public TaskCommentDto addComment(@PathVariable Long taskId, @Valid @RequestBody TaskCommentCreateRequestDto request) {
        return taskService.addComment(taskId, request);
    }
    @PreAuthorize("hasAuthority('TASK_VIEW')")
    @GetMapping("/{taskId}/comments")
    public List<TaskCommentDto> getComments(@PathVariable Long taskId) {
        return taskService.getComments(taskId);
    }
}

package com.org.backend.service;

import com.org.backend.repository.EmployeeRepository;
import com.org.backend.repository.TaskAssignmentRepository;
import com.org.backend.repository.TaskCommentRepository;
import com.org.backend.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.org.backend.dto.Task.*;
import com.org.backend.entity.Employee;
import com.org.backend.entity.Task;
import com.org.backend.entity.TaskAssignment;
import com.org.backend.entity.TaskComment;
import com.org.backend.enums.TaskStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskAssignmentRepository taskAssignmentRepository;
    private final TaskCommentRepository taskCommentRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public TaskDto createTask(TaskCreateRequestDto request){
        Employee assignedBy = employeeRepository.findById(request.assignedByEmployeeId()).orElseThrow(()-> new IllegalArgumentException("Inavlid employee id"));
        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setAssignedBy(assignedBy);
        if(request.priority()!=null){
            task.setPriority(request.priority());

        }
        task = taskRepository.save(task);
        if (request.assigneeIds() != null && !request.assigneeIds().isEmpty()) {
            for (Long employeeId : request.assigneeIds()) {
                Employee assignee = employeeRepository.findById(employeeId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid assignee id: " + employeeId));

                TaskAssignment assignment = new TaskAssignment();
                assignment.setTask(task);
                assignment.setEmployee(assignee);
                taskAssignmentRepository.save(assignment);
            }
        }
        return mapToDto(task);
    }
    public List<TaskDto> getAllTasks(){
        return taskRepository.findAll().stream().map(this::mapToDto).toList();
    }
    public TaskDto getTaskById(Long taskId){
        Task task = taskRepository.findById(taskId).orElseThrow(()-> new IllegalArgumentException("Task not found"));
        return mapToDto(task);
    }
    @Transactional
    public TaskDto updateTask(Long taskId,TaskUpdateRequestDto request){
        Task task = taskRepository.findById(taskId).orElseThrow(()->new IllegalArgumentException("Task not found"));
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        if (request.priority() != null) { task.setPriority(request.priority()); }
        if (request.status() != null) { task.setStatus(request.status()); }
        task = taskRepository.save(task);
        return mapToDto(task);
    }
    @Transactional
    public void deleteTask(Long taskId){
        Task task = taskRepository.findById(taskId).orElseThrow(()->new IllegalArgumentException("Task NOt found"));
        taskRepository.delete(task);
    }
    @Transactional
    public TaskDto assignEmployees(Long taskId,TaskAssignRequestDto req){
        Task t = taskRepository.findById(taskId).orElseThrow(()-> new IllegalArgumentException("task not found"));
        for (Long employeeId: req.assigneeIds()){
            if(taskAssignmentRepository.existsByTaskIdAndEmployeeId(taskId,employeeId)){
                continue;
            }
            Employee employee = employeeRepository.findById(employeeId).orElseThrow(()-> new IllegalArgumentException("Invalid employee id: "+employeeId));
            TaskAssignment assignment = new TaskAssignment();
            assignment.setTask(t);
            assignment.setEmployee(employee);
            taskAssignmentRepository.save(assignment);
        }
        return mapToDto(t);
    }
    public List<TaskDto> getTasksForEmployee(Long employeeId){
        List<TaskAssignment> assignments = taskAssignmentRepository.findByEmployeeId(employeeId);
        return assignments.stream().map(a -> mapToDto(a.getTask())).toList();
    }
    public List<TaskDto> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status).stream().map(this::mapToDto).toList();
    }
    @Transactional
    public TaskCommentDto addComment(Long taskId,TaskCommentCreateRequestDto request){
        Task task = taskRepository.findById(taskId).orElseThrow(()->new IllegalArgumentException("task Nt found"));
        Employee employee = employeeRepository.findById(request.employeeId()).orElseThrow(()->new IllegalArgumentException("Invalid employee id"));
        TaskComment comment = new TaskComment();
        comment.setTask(task);
        comment.setEmployee(employee);
        comment.setContent(request.content());
        comment = taskCommentRepository.save(comment);
        return mapCommentToDto(comment);


    }
    public List<TaskCommentDto> getComments(Long taskId) {
        return taskCommentRepository.findByTaskId(taskId).stream().map(this::mapCommentToDto).toList();
    }
    private TaskDto mapToDto(Task task){
        List <TaskAssigneeDto> assignees = taskAssignmentRepository.findByTaskId(task.getId()).stream().map(a -> new TaskAssigneeDto(a.getEmployee().getId(),a.getEmployee().getFullName())).toList();
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                task.getAssignedBy().getId(),
                task.getAssignedBy().getFullName(),
                assignees,
                task.getCreatedAt() );
    }
    private TaskCommentDto mapCommentToDto(TaskComment comment) {
        return new TaskCommentDto(
                comment.getId(),
                comment.getContent(),
                comment.getEmployee().getId(),
                comment.getEmployee().getFullName(),
                comment.getCreatedAt()
        );
    }
}

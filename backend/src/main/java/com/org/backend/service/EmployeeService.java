package com.org.backend.service;

import com.org.backend.dto.CurrentUserDto;
import com.org.backend.entity.Position;
import com.org.backend.enums.EmployeeStatus;
import com.org.backend.repository.EmployeeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import jakarta.annotation.PostConstruct;
import com.org.backend.dto.EmployeeDto;
import com.org.backend.dto.EmployeeCreateRequestDto;
import com.org.backend.dto.EmployeeUpdateRequestDto;
import com.org.backend.entity.Employee;
import com.org.backend.entity.Department;
import com.org.backend.repository.DepartmentRepository;
import com.org.backend.repository.PositionRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixSchema() {
        try {
            jdbcTemplate.execute("ALTER TABLE employees MODIFY position_id BIGINT NULL");
            jdbcTemplate.execute("ALTER TABLE employees MODIFY department_id BIGINT NULL");
            jdbcTemplate.execute("ALTER TABLE employees ADD COLUMN skills TEXT NULL");
            jdbcTemplate.execute("ALTER TABLE employees ADD COLUMN profile_picture_base64 LONGTEXT NULL");
            jdbcTemplate.execute("ALTER TABLE employees ADD COLUMN resume_base64 LONGTEXT NULL");
            jdbcTemplate.execute("ALTER TABLE employees ADD COLUMN resume_name VARCHAR(255) NULL");
        } catch(Exception e) {
            System.out.println("Schema modification skipped: " + e.getMessage());
        }
    }

    @Transactional
    public EmployeeDto createEmployee(EmployeeCreateRequestDto request){

        Employee employee = new Employee();
        employee.setEmployeeCode(request.employeeCode());
        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setPhone(request.phone());
        employee.setHireDate(request.hireDate());

        if (request.positionId() != null) {
            Position position = positionRepository.findById(request.positionId()).orElseThrow(() -> new IllegalArgumentException("Invalid position id"));
            if (employeeRepository.existsByPositionId(position.getId())) {
                throw new IllegalArgumentException("This position is already assigned to another employee");
            }
            employee.setPosition(position);
        } else {
            employee.setPosition(null);
        }

        if (request.departmentId() != null) {
            Department department = departmentRepository.findById(request.departmentId()).orElseThrow(() -> new IllegalArgumentException("Invalid department id"));
            employee.setDepartment(department);
        } else {
            employee.setDepartment(null);
        }
        if(request.managerId() != null){
            Employee manager = employeeRepository.findById(request.managerId()).orElseThrow(() -> new IllegalArgumentException("Invalid manager id"));
            employee.setManager(manager); }
        employee = employeeRepository.save(employee);

        CurrentUserDto user = userService.createUser(
                employee,
                request.role()
        );

        if (employee.getPosition() != null) {
            notificationService.notify(
                    user.userId(),
                    "Position Assigned",
                    "You have been assigned to the position: " + employee.getPosition().getTitle(),
                    com.org.backend.enums.NotificationType.EMPLOYEE_ASSIGNED,
                    employee.getId(),
                    user.userId() // using the user themselves as creator for simplicity, or we could pass the current user if we had it
            );
        }

        return mapToDto(employee);
    }

    @Transactional
    public EmployeeDto updateEmployee(Long employeeId, EmployeeUpdateRequestDto request){

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid employee id"));

        employee.setEmployeeCode(request.employeeCode());
        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setPhone(request.phone());
        employee.setHireDate(request.hireDate());

        Long oldPositionId = employee.getPosition() != null ? employee.getPosition().getId() : null;
        if (request.positionId() != null) {
            Position position = positionRepository.findById(request.positionId()).orElseThrow(() -> new IllegalArgumentException("Invalid position id"));
            if (!position.getId().equals(oldPositionId) &&
                    employeeRepository.existsByPositionIdAndIdNot(request.positionId(), employeeId)) {
                throw new IllegalArgumentException("This position is already assigned to another employee");
            }
            employee.setPosition(position);
            employee.setDepartment(position.getDepartment());
        } else {
            employee.setPosition(null);
            if (request.departmentId() != null) {
                Department department = departmentRepository.findById(request.departmentId()).orElseThrow(() -> new IllegalArgumentException("Invalid department id"));
                employee.setDepartment(department);
            } else {
                employee.setDepartment(null);
            }
        }

        Long oldManagerId = employee.getManager() != null ? employee.getManager().getId() : null;

        if(request.managerId() != null){
            Employee manager = employeeRepository.findById(request.managerId()).orElseThrow(() -> new IllegalArgumentException("Invalid manager id"));
            employee.setManager(manager); 
        } else {
            employee.setManager(null); 
        }
        
        employee = employeeRepository.save(employee);

        Long newPositionId = employee.getPosition() != null ? employee.getPosition().getId() : null;
        if (oldPositionId != null && !oldPositionId.equals(newPositionId) || oldPositionId == null && newPositionId != null) {
            notificationService.notify(
                    employee.getUser().getId(),
                    "Position Changed",
                    "Your position has been changed.",
                    com.org.backend.enums.NotificationType.POSITION_CHANGED,
                    employee.getId(),
                    1L 
            );
        }

        Long newManagerId = employee.getManager() != null ? employee.getManager().getId() : null;
        if (oldManagerId != null && !oldManagerId.equals(newManagerId) || oldManagerId == null && newManagerId != null) {
            notificationService.notify(
                    employee.getUser().getId(),
                    "Manager Changed",
                    "Your manager has been changed.",
                    com.org.backend.enums.NotificationType.MANAGER_CHANGED,
                    employee.getId(),
                    1L
            );
        }

        return mapToDto(employee);
    }

    @Transactional
    public EmployeeDto updateEmployeeProfile(Long employeeId, com.org.backend.dto.EmployeeProfileUpdateRequestDto request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid employee id"));
        
        if (request.skills() != null) employee.setSkills(request.skills());
        if (request.profilePictureBase64() != null) employee.setProfilePictureBase64(request.profilePictureBase64());
        if (request.resumeBase64() != null) employee.setResumeBase64(request.resumeBase64());
        if (request.resumeName() != null) employee.setResumeName(request.resumeName());

        employee = employeeRepository.save(employee);
        return mapToDto(employee);
    }

    EmployeeDto mapToDto(Employee employee) {
        return new EmployeeDto(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getFullName(),
                employee.getEmail(),
                employee.getPhone(),
                employee.getHireDate(),
                employee.getPosition() != null ? employee.getPosition().getId() : null,
                employee.getDepartment() != null ? employee.getDepartment().getId() : null,
                employee.getManager() != null ? employee.getManager().getId() : null,
                employee.getStatus(),
                employee.getUser().getUserRole().toString(),
                employee.getSkills(),
                employee.getProfilePictureBase64(),
                employee.getResumeBase64(),
                employee.getResumeName()
        );
    }
    public List<EmployeeDto> getAllEmployees(){
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream().map(this::mapToDto).toList();
    }
    public EmployeeDto getEmployeeById(Long employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new IllegalArgumentException("Invalid employee id"));

        return mapToDto(employee);
    }
    @Transactional
    public void deleteEmployee(Long employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new IllegalArgumentException("Invalid employee id"));

        if(employeeRepository.countByManagerId(employee.getId()) > 0){
            throw new IllegalArgumentException("The employee is manger of other employees");
        }

//        userService.deleteUserByEmpployee(employeeId);

        employeeRepository.delete(employee);
    }

    @Transactional
    public EmployeeDto changeEmployeeStatus(Long employeeId, EmployeeStatus status){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new IllegalArgumentException("Invalid employee id"));
        employee.setStatus(status);
        if (status == EmployeeStatus.TERMINATED) {
            employee.setPosition(null);
            employee.setDepartment(null);
        }
        employee = employeeRepository.save(employee);
        return mapToDto(employee);
    }
    public List<EmployeeDto> getMyTeam(Long managerId){
        List<Employee> employees = employeeRepository.findByManagerId(managerId);
        return employees.stream().map(this::mapToDto).toList();
    }

    public List<EmployeeDto> getMyTeamDynamic(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid employee id"));
        
        Position position = employee.getPosition();
        if (position == null) return java.util.Collections.emptyList();
        
        List<Position> teamPositions = new java.util.ArrayList<>();
        
        if (position.getSubPositions() != null && !position.getSubPositions().isEmpty()) {
            // Manager: Return Subordinates
            teamPositions.addAll(position.getSubPositions());
        } else {
            // Peer: Return Peers matching the same parent Head
            Position parent = position.getParentPosition();
            if (parent != null && parent.getSubPositions() != null) {
                teamPositions.addAll(parent.getSubPositions());
            }
        }
        
        if (teamPositions.isEmpty()) return java.util.Collections.emptyList();
        
        return employeeRepository.findByPositionIn(teamPositions)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<EmployeeDto> searchEmployees(String name, Long departmentId, String departmentName,Long positionId, String positionTitle,Long managerId, EmployeeStatus status){
        List<Employee> employees = employeeRepository.findAll();
        if (name!=null && !name.isBlank()){
            employees = employeeRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrSkillsContainingIgnoreCase(name,name,name);
        }else{ employees = employeeRepository.findAll();}
        if(departmentId != null){
            employees = employees.stream().filter(e -> e.getDepartment() != null &&  e.getDepartment().getId().equals(departmentId)).toList(); }
        if (departmentName != null && !departmentName.isBlank()) {
            employees = employees.stream().filter(e -> e.getDepartment() != null && e.getDepartment().getName().equalsIgnoreCase(departmentName)).toList();
        }
        if(positionId != null){
            employees = employees.stream().filter(e -> e.getPosition() != null &&  e.getPosition().getId().equals(positionId)).toList();
        }
        if (positionTitle != null && !positionTitle.isBlank()) {
            employees = employees.stream().filter(e -> e.getPosition() != null && e.getPosition().getTitle().equalsIgnoreCase(positionTitle)).toList();
        }
        if(managerId!=null){ employees = employees.stream().filter(e->e.getManager()!=null && e.getManager().getId().equals(managerId)).toList();}
        if(status != null){
            employees = employees.stream().filter(e -> e.getStatus() == status).toList();


        }
        return employees.stream().map(this::mapToDto).toList();

    }}
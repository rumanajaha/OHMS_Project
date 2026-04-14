package com.org.backend.service;

import com.org.backend.entity.Position;
import com.org.backend.enums.EmployeeStatus;
import com.org.backend.repository.EmployeeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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
    @Transactional
    public EmployeeDto createEmployee(EmployeeCreateRequestDto request){

        Employee employee = new Employee();
        employee.setEmployeeCode(request.employeeCode());
        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setPhone(request.phone());
        employee.setHireDate(request.hireDate());

        Position position = positionRepository.findById(request.positionId()).orElseThrow(() -> new IllegalArgumentException("Invalid position id"));
        employee.setPosition(position);
        Department department = departmentRepository.findById(request.departmentId()).orElseThrow(() -> new IllegalArgumentException("Invalid department id"));
        employee.setDepartment(department);
        if(request.managerId() != null){
            Employee manager = employeeRepository.findById(request.managerId()).orElseThrow(() -> new IllegalArgumentException("Invalid manager id"));
            employee.setManager(manager); }
        employee = employeeRepository.save(employee);
        return mapToDto(employee); }

    private EmployeeDto mapToDto(Employee employee) {
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
                employee.getStatus()
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

        employeeRepository.delete(employee);
    }

    @Transactional
    public EmployeeDto updateEmployee(Long employeeId, EmployeeUpdateRequestDto request){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new IllegalArgumentException("Invalid employee id"));
        employee.setEmployeeCode(request.employeeCode());
        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setPhone(request.phone());
        employee.setHireDate(request.hireDate());
        Position position = positionRepository.findById(request.positionId()).orElseThrow(() -> new IllegalArgumentException("Invalid position id"));
        employee.setPosition(position);
        employee.setDepartment(position.getDepartment());
        if(request.managerId() != null){
            Employee manager = employeeRepository.findById(request.managerId()).orElseThrow(() -> new IllegalArgumentException("Invalid manager id"));
            employee.setManager(manager); }
        else {
            employee.setManager(null); }
        employee = employeeRepository.save(employee);
        return mapToDto(employee); }
    @Transactional
    public EmployeeDto changeEmployeeStatus(Long employeeId, EmployeeStatus status){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new IllegalArgumentException("Invalid employee id"));
        employee.setStatus(status);
        employee = employeeRepository.save(employee);
        return mapToDto(employee);
    }
    public List<EmployeeDto> getMyTeam(Long managerId){
        List<Employee> employees = employeeRepository.findByManagerId(managerId);
        return employees.stream().map(this::mapToDto).toList();
    }
    public List<EmployeeDto> searchEmployees(String name, Long departmentId, Long positionId,Long managerId, EmployeeStatus status){
        List<Employee> employees = employeeRepository.findAll();
        if (name!=null && !name.isBlank()){
            employees = employeeRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name,name);
        }else{ employees = employeeRepository.findAll();}
        if(departmentId != null){
            employees = employees.stream().filter(e -> e.getDepartment() != null &&  e.getDepartment().getId().equals(departmentId)).toList(); }
        if(positionId != null){
            employees = employees.stream().filter(e -> e.getPosition() != null &&  e.getPosition().getId().equals(positionId)).toList();
        }
        if(managerId!=null){ employees = employees.stream().filter(e->e.getManager()!=null && e.getManager().getId().equals(managerId)).toList();}
        if(status != null){
            employees = employees.stream().filter(e -> e.getStatus() == status).toList();


    }
        return employees.stream().map(this::mapToDto).toList();

}}



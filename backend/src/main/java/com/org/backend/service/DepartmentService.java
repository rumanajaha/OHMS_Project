package com.org.backend.service;

import com.org.backend.dto.DepartmentCreateRequestDto;
import com.org.backend.dto.DepartmentDto;
import com.org.backend.dto.DepartmentUpdateRequestDto;
import com.org.backend.entity.Department;
import com.org.backend.entity.Employee;
import com.org.backend.repository.DepartmentRepository;
import com.org.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public List<DepartmentDto> getAllDepartments(){

        List<Department> departments = departmentRepository
                .findAll();

        return departments.stream().map(this::mapToDto).toList();
    }

    public DepartmentDto getDepartment(Long departmentId) {

        Department department = departmentRepository
                .findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid department id"));

        return mapToDto(department);
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentCreateRequestDto request) {

        Department department = new Department();
        department.setName(request.name());
        department.setDepartmentCode(request.departmentCode());

        if (request.parentDepartmentId() != null){
            Department parentDepartment = departmentRepository
                    .findById(request.parentDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Parent department id"));

            department.setParentDepartment(parentDepartment);
        }

        if (request.headEmployeeId() != null){
            Employee headEmployee = employeeRepository
                    .findById(request.headEmployeeId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Head employee id"));

            department.setHeadEmployee(headEmployee);
        }

        department = departmentRepository.save(department);
        return mapToDto(department);
    }

    @Transactional
    public DepartmentDto updateDepartment(
            Long departmentId,
            DepartmentUpdateRequestDto request
    ){

        Department department = departmentRepository
                .findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid department id"));

        department.setName(request.name());
        department.setDepartmentCode(request.departmentCode());

        if (request.parentDepartmentId() != null){
            Department parentDepartment = departmentRepository
                    .findById(request.parentDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Parent department id"));

            department.setParentDepartment(parentDepartment);
        }

        if (request.headEmployeeId() != null){
            Employee headEmployee = employeeRepository
                    .findById(request.headEmployeeId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Head employee id"));

            department.setHeadEmployee(headEmployee);
        }

        department = departmentRepository.save(department);
        return mapToDto(department);
    }

    @Transactional
    public void delete(Long departmentId){

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid department id"));

        // soft delete logic in future
        departmentRepository.delete(department);
    }

    public DepartmentDto mapToDto(Department department){
        return new DepartmentDto(
                department.getId(),
                department.getName(),
                department.getDepartmentCode(),
                department.getParentDepartment() != null ? department.getParentDepartment().getId() : null
        );
    }
}

package com.org.backend.controller;
import java.util.*;
import com.org.backend.dto.EmployeeCreateRequestDto;
import com.org.backend.dto.EmployeeDto;
import com.org.backend.dto.EmployeeUpdateRequestDto;
import com.org.backend.enums.EmployeeStatus;
import com.org.backend.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/employees")
public class EmployeeController {
    private final EmployeeService employeeService;
    @PostMapping
    public EmployeeDto createEmployee(@Valid @RequestBody EmployeeCreateRequestDto request){
        return employeeService.createEmployee(request);
    }
    @PutMapping("/{employeeId}")
    public EmployeeDto updateEmployee( @PathVariable Long employeeId, @Valid @RequestBody EmployeeUpdateRequestDto request
    ){
        return employeeService.updateEmployee(employeeId,request);
    }
    @DeleteMapping("/{employeeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable Long employeeId){
        employeeService.deleteEmployee(employeeId);
    }
    @GetMapping("/{employeeId}")
    public EmployeeDto getEmployeeById(@PathVariable Long employeeId){
        return employeeService.getEmployeeById(employeeId);
    }
    @GetMapping
    public List<EmployeeDto> getAllEmployees(){return employeeService.getAllEmployees();}
    @GetMapping("/manager/{managerId}")
    public List<EmployeeDto> getMyTeam(@PathVariable Long managerId){
        return employeeService.getMyTeam(managerId);
    }
    @PatchMapping("/{employeeId}/status")
    public EmployeeDto changeEmployeeStatus(@PathVariable Long employeeId, @RequestParam EmployeeStatus status){
        return employeeService.changeEmployeeStatus(employeeId, status);
    }
    @GetMapping("/search")
    public List<EmployeeDto> searchEmployees(@RequestParam(required = false) Long departmentId, @RequestParam(required = false) Long positionId, @RequestParam(required = false) EmployeeStatus status){
        return employeeService.searchEmployees(departmentId, positionId, status);
    }
}

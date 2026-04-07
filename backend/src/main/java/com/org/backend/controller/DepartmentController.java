package com.org.backend.controller;

import com.org.backend.dto.DepartmentCreateRequestDto;
import com.org.backend.dto.DepartmentDto;
import com.org.backend.dto.DepartmentParentUpdateRequestDto;
import com.org.backend.dto.DepartmentUpdateRequestDto;
import com.org.backend.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public List<DepartmentDto> getAllDepartments(){
        return departmentService.getAllDepartments();
    }

    @PostMapping
    public DepartmentDto createDepartment(
            @Valid @RequestBody DepartmentCreateRequestDto request
            ){
        return departmentService.createDepartment(request);
    }

    @PutMapping("/{departmentId}")
    public DepartmentDto updateDepartment(
            @PathVariable Long departmentId,
            @Valid @RequestBody DepartmentUpdateRequestDto request
            ){
        return departmentService.updateDepartment(departmentId, request);
    }

    @GetMapping("/{departmentId}")
    public DepartmentDto getDepartmentById(
            @PathVariable Long departmentId
    ){
        return departmentService.getDepartmentById(departmentId);
    }

    @DeleteMapping("/{departmentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteDepartment(
            @PathVariable Long departmentId
    ){
        departmentService.deleteDepartment(departmentId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{departmentId}/parent")
    public DepartmentDto changeDepartmentParent(
            @PathVariable Long departmentId,
            @Valid @RequestBody DepartmentParentUpdateRequestDto request
    ){
        return departmentService.changeDepartmentParent(departmentId, request);
    }
}

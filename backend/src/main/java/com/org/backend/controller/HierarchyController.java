package com.org.backend.controller;

import com.org.backend.dto.HierarchyNodeDto;
import com.org.backend.service.HierarchyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/hierarchy")
public class HierarchyController {

    private final HierarchyService hierarchyService;

    @GetMapping
    public List<HierarchyNodeDto> getTree(){
        return hierarchyService.getFullHierarchy();
    }
}

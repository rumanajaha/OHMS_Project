package com.org.backend.controller;

import com.org.backend.dto.HierarchyNodeDto;
import com.org.backend.service.HierarchyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/hierarchy")
@PreAuthorize("isAuthenticated()")
public class HierarchyController {

    private final HierarchyService hierarchyService;

    @GetMapping
    public List<HierarchyNodeDto> getTree(){
        return hierarchyService.getFullHierarchy();
    }
    @PreAuthorize("hasAuthority('HIERARCHY_EDIT')")
    @PatchMapping("/position/{positionId}/parent/{parentId}")
    public void movePosition(
            @PathVariable Long positionId,
            @PathVariable Long parentId
    ) {
        hierarchyService.movePosition(positionId, parentId);
    }
}

package com.org.backend.controller;

import com.org.backend.dto.PositionCreateRequestDto;
import com.org.backend.dto.PositionDto;
import com.org.backend.dto.PositionUpdateRequestDto;
import com.org.backend.service.PositionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/positions")
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    public List<PositionDto> getAllPositions(){
        return positionService.getAllPositions();
    }

    @PreAuthorize("hasAuthority('POSITION_CREATE')")
    @PostMapping
    public PositionDto createPosition(
            @Valid @RequestBody PositionCreateRequestDto request
    ){
        return positionService.createPosition(request);
    }

    @GetMapping("/{positionId}")
    public PositionDto getPositionById(@PathVariable Long positionId){
        return positionService.getPositionById(positionId);
    }

    @PreAuthorize("hasAuthority('POSITION_UPDATE')")
    @PutMapping("/{positionId}")
    public PositionDto getPosition(
            @PathVariable Long positionId,
            @Valid @RequestBody PositionUpdateRequestDto request
    ){
        return positionService.updatePosition(positionId, request);
    }

    @PreAuthorize("hasAuthority('POSITION_UPDATE')")
    @DeleteMapping("/{positionId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long positionId
    ){
        positionService.deletePosition(positionId);
        return ResponseEntity.noContent().build();
    }
}

package com.org.backend.controller;

import com.org.backend.dto.PositionCreateRequestDto;
import com.org.backend.dto.PositionDto;
import com.org.backend.dto.PositionUpdateRequestDto;
import com.org.backend.service.PositionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/positions")
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    public List<PositionDto> getAll(){
        return positionService.getAll();
    }

    @PostMapping
    public PositionDto create(
            @Valid @RequestBody PositionCreateRequestDto request
    ){
        return positionService.create(request);
    }

    @GetMapping("/{positionId}")
    public PositionDto getPosition(@PathVariable Long positionId){
        return positionService.get(positionId);
    }

    @PutMapping("/{positionId}")
    public PositionDto getPosition(
            @PathVariable Long positionId,
            @Valid @RequestBody PositionUpdateRequestDto request
    ){
        return positionService.update(positionId, request);
    }

    @DeleteMapping("/{positionId")
    public ResponseEntity<Void> delete(
            @PathVariable Long positionId
    ){
        positionService.delete(positionId);
        return ResponseEntity.noContent().build();
    }
}

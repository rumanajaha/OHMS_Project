package com.org.backend.service;

import com.org.backend.dto.PositionCreateRequestDto;
import com.org.backend.dto.PositionDto;
import com.org.backend.dto.PositionUpdateRequestDto;
import com.org.backend.entity.Department;
import com.org.backend.entity.Position;
import com.org.backend.repository.DepartmentRepository;
import com.org.backend.repository.PositionRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PositionService {

    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;

    public List<PositionDto> getAll() {

        List<Position> positions = positionRepository.findAll();
        return positions.stream().map(this::mapToDto).toList();
    }

    @Transactional
    public PositionDto create(@Valid PositionCreateRequestDto request) {

        Position position = new Position();
        position.setTitle(request.title());

        Department department = departmentRepository
                .findById(request.departmentId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid department id"));
        position.setDepartment(department);

        if (request.parentPositionId() != null){
            Position parentPosition = positionRepository
                    .findById(request.parentPositionId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid parent position id"));
            position.setParentPosition(parentPosition);
        }

        position = positionRepository.save(position);

        return mapToDto(position);
    }

    public PositionDto get(Long positionId) {

        Position position = positionRepository
                .findById(positionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid position id"));

        return mapToDto(position);
    }

    @Transactional
    public PositionDto update(Long positionId, PositionUpdateRequestDto request) {

        Position position = positionRepository
                .findById(positionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid position id"));

        position.setTitle(request.title());

        Department department = departmentRepository
                .findById(request.departmentId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid department id"));
        position.setDepartment(department);

        if (request.parentPositionId() != null){
            Position parentPosition = positionRepository
                    .findById(request.parentPositionId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid parent position id"));
            position.setParentPosition(parentPosition);
        }

        position = positionRepository.save(position);

        return mapToDto(position);
    }

    private PositionDto mapToDto(Position position){

        Long parentPositionId = position.getParentPosition() != null
                ? position.getParentPosition().getId()
                : null;

        return new PositionDto(
                position.getId(),
                position.getTitle(),
                position.getDepartment().getId(),
                parentPositionId
        );
    }
}

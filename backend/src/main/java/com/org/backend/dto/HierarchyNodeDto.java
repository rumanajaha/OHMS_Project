package com.org.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class HierarchyNodeDto {

    private Long positionId;

    private String title;

    private List<HierarchyEmployeeDto> employees;

    private List<HierarchyNodeDto> children = new ArrayList<>();
}

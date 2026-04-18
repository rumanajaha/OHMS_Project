import React, { useMemo } from 'react';
import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Handle, Position } from '@xyflow/react';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { usePositions } from '../context/PositionContext';
import { getDepartmentNameById, getEmployeeByPositionId, getEmployeeFullName, getRootPositions } from '../utils/org';

const PreviewNode = ({ data }) => {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        minWidth: '200px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        borderTop: `3px solid ${data.color || 'var(--primary)'}`,
        position: 'relative',
        opacity: data.isPreview ? 0.9 : 1,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: data.color || 'var(--primary)', width: 6, height: 6, border: '1px solid white' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'var(--text-main)',
            fontSize: '0.75rem',
          }}
        >
          {data.initials}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
            {data.positionTitle}
          </div>
          <div style={{ fontSize: '0.625rem', color: data.employeeId ? 'var(--text-muted)' : 'var(--warning)' }}>
            {data.employeeName}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: data.color || 'var(--primary)', width: 6, height: 6, border: '1px solid white' }}
      />
    </div>
  );
};

const nodeTypes = { preview: PreviewNode };

export const OrgHierarchyPreview = () => {
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const { positions } = usePositions();

  const { nodes, edges } = useMemo(() => {
    const computedNodes = [];
    const computedEdges = [];
    const NODE_WIDTH = 220;
    const SPACING_X = 40;
    const SPACING_Y = 100;
    let globalX = 0;

    const childrenByParent = positions.reduce((acc, position) => {
      const key = position.parentPositionId ? String(position.parentPositionId) : 'root';
      acc[key] = [...(acc[key] || []), position];
      return acc;
    }, {});

    const traverse = (position, depth, parentPositionId = null) => {
      const children = childrenByParent[String(position.id)] || [];
      const startX = globalX;

      children.forEach((child) => traverse(child, depth + 1, position.id));

      if (children.length === 0) {
        globalX += NODE_WIDTH + SPACING_X;
      }

      const xPos =
        children.length === 0
          ? startX
          : (startX + globalX - NODE_WIDTH - SPACING_X) / 2;
      const yPos = depth * SPACING_Y + 20;
      const employee = getEmployeeByPositionId(employees, position.id);
      const employeeName = employee ? getEmployeeFullName(employee) : 'Vacant';

      computedNodes.push({
        id: String(position.id),
        type: 'preview',
        position: { x: xPos, y: yPos },
        data: {
          id: String(position.id),
          employeeId: employee?.id || null,
          positionTitle: position.title,
          employeeName,
          initials: employee
            ? `${employee?.firstName?.[0] || ''}${employee?.lastName?.[0] || ''}`
            : (position.title || 'VP').slice(0, 2).toUpperCase(),
          color: depth === 0 ? 'var(--primary)' : depth === 1 ? 'var(--secondary)' : 'var(--accent)',
          isPreview: true,
        },
      });

      if (parentPositionId) {
        computedEdges.push({
          id: `e-${parentPositionId}-${position.id}`,
          source: String(parentPositionId),
          target: String(position.id),
          type: 'smoothstep',
          animated: false,
          style: { stroke: 'var(--primary)', strokeWidth: 1.5, opacity: 0.4 },
          markerEnd: { type: 'arrowclosed', color: 'var(--primary)' },
        });
      }
    };

    getRootPositions(positions).forEach((root) => traverse(root, 0));

    return { nodes: computedNodes, edges: computedEdges };
  }, [employees, positions]);

  if (nodes.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: '30px', height: '30px', color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--border-color)" />
      </ReactFlow>
    </div>
  );
};

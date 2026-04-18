import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { usePositions } from '../context/PositionContext';
import { Briefcase, Mail, Phone, Edit2, UserCog, UserPlus, UserMinus, LogOut } from 'lucide-react';
import { getDepartmentNameById, getEmployeeByPositionId, getEmployeeFullName, getRootPositions } from '../utils/org';
import { assignEmployeeToPositionApi, movePositionApi, unassignEmployeeFromPositionApi } from '../api/hierarchy';
import { updateEmployeeStatusApi } from '../api/employee';

const CustomNode = ({ data }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const employeeId = e.dataTransfer.getData('employeeId');
    const positionId = e.dataTransfer.getData('positionId');
    if (employeeId && !data.employeeId) {
      if (window.confirm('Are you sure you want to assign this employee to this position?')) {
        data.onAssignEmployee(data.positionId, employeeId);
      }
    } else if (positionId && positionId !== String(data.positionId)) {
      if (window.confirm('Are you sure you want to change the parent of this position?')) {
        data.onChangeParent(positionId, data.positionId);
      }
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        background: isDragOver ? 'var(--bg-subtle)' : 'var(--bg-surface)',
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        minWidth: '240px',
        boxShadow: isDragOver ? '0 0 0 2px var(--primary)' : 'var(--shadow-md)',
        border: '1px solid var(--border-color)',
        borderTop: `4px solid ${data.color || 'var(--primary)'}`,
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: data.color || 'var(--primary)', width: 10, height: 10, border: '2px solid white' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
          }}
        >
          {data.initials}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)', fontFamily: 'Poppins, sans-serif' }}>
            {data.positionTitle}
          </div>
          <div style={{ fontSize: '0.75rem', color: data.employeeId ? 'var(--text-muted)' : 'var(--warning)', fontWeight: data.employeeId ? 'normal' : '600' }}>
            {data.employeeName}
          </div>
        </div>
      </div>

      {data.department && (
        <div
          style={{
            display: 'inline-block',
            background: 'var(--bg-subtle)',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.625rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginTop: '0.5rem',
          }}
        >
          {data.department}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: data.color || 'var(--primary)', width: 10, height: 10, border: '2px solid white' }}
      />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export const OrgHierarchy = () => {
  const { employees, fetchEmployees } = useEmployees();
  const { departments } = useDepartments();
  const { positions, fetchPositions } = usePositions();
  const navigate = useNavigate();
  const [selectedNodeData, setSelectedNodeData] = React.useState(null);
  
  const unassignedEmployees = useMemo(() => {
    return employees.filter(emp => !emp.positionId && emp.status !== 'TERMINATED');
  }, [employees]);

  const handleAssignEmployee = useCallback(async (positionId, employeeId) => {
    try {
      await assignEmployeeToPositionApi(positionId, employeeId);
      await fetchEmployees();
      await fetchPositions();
    } catch (err) {
      console.error(err);
      alert('Failed to assign employee.');
    }
  }, [fetchEmployees, fetchPositions]);

  const handleChangeParent = useCallback(async (positionId, parentId) => {
    try {
      await movePositionApi(positionId, parentId);
      await fetchPositions();
    } catch (err) {
      console.error(err);
      alert('Failed to move position. Check for circular references.');
    }
  }, [fetchPositions]);

  const onConnect = useCallback(
    (params) => {
      // params.source is parentId, params.target is childId
      if (window.confirm('Are you sure you want to change the parent of this position?')) {
        handleChangeParent(params.target, params.source);
      }
    },
    [handleChangeParent]
  );

  const handleUnassignEmployee = useCallback(async (positionId) => {
    if (!window.confirm('Are you sure you want to unassign this employee from their position?')) return;
    try {
      await unassignEmployeeFromPositionApi(positionId);
      await fetchEmployees();
      await fetchPositions();
      setSelectedNodeData(null);
    } catch (err) {
      console.error(err);
      alert('Failed to unassign employee.');
    }
  }, [fetchEmployees, fetchPositions]);

  const handleTerminateEmployee = useCallback(async (employeeId) => {
    if (!window.confirm('Are you sure you want to mark this employee as Terminated?')) return;
    try {
      await updateEmployeeStatusApi(employeeId, 'TERMINATED');
      await fetchEmployees();
      setSelectedNodeData(null);
    } catch (err) {
      console.error(err);
      alert('Failed to mark employee as terminated.');
    }
  }, [fetchEmployees]);

  const { computedNodes, computedEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    const NODE_WIDTH = 280;
    const SPACING_X = 80;
    const SPACING_Y = 180;
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
      const yPos = depth * SPACING_Y + 50;
      const employee = getEmployeeByPositionId(employees, position.id);
      const employeeName = employee ? getEmployeeFullName(employee) : 'Vacant position';

      nodes.push({
        id: String(position.id),
        type: 'custom',
        position: { x: xPos, y: yPos },
        data: {
          id: String(position.id),
          positionId: position.id,
          employeeId: employee?.id || null,
          positionTitle: position.title,
          employeeName,
          initials: employee
            ? `${employee?.firstName?.[0] || ''}${employee?.lastName?.[0] || ''}`
            : (position.title || 'VP').slice(0, 2).toUpperCase(),
          department: getDepartmentNameById(departments, position.departmentId),
          color:
            depth === 0
              ? 'var(--primary)'
              : depth === 1
                ? 'var(--secondary)'
                : 'var(--accent)',
          rawPosition: position,
          rawEmployee: employee || null,
          onAssignEmployee: handleAssignEmployee,
          onChangeParent: handleChangeParent,
        },
      });

      if (parentPositionId) {
        edges.push({
          id: `e-${parentPositionId}-${position.id}`,
          source: String(parentPositionId),
          target: String(position.id),
          type: 'smoothstep',
          animated: false,
          style: { stroke: 'var(--primary)', strokeWidth: 2, opacity: 0.5 },
          markerEnd: { type: 'arrowclosed', color: 'var(--primary)' },
        });
      }
    };

    getRootPositions(positions).forEach((root) => traverse(root, 0));

    return { computedNodes: nodes, computedEdges: edges };
  }, [departments, employees, positions]);

  const [nodes, setNodes, onNodesChange] = useNodesState(computedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(computedEdges);

  useEffect(() => {
    setNodes(computedNodes);
    setEdges(computedEdges);
    if (selectedNodeData) {
      const updated = computedNodes.find((node) => node.id === selectedNodeData.id);
      setSelectedNodeData(updated ? updated.data : null);
    }
  }, [computedEdges, computedNodes, selectedNodeData, setEdges, setNodes]);

  const onNodeClick = useCallback((_event, node) => {
    setSelectedNodeData(node.data);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="h1">Hierarchy Map</h1>
          {/* <p className="text-muted text-sm">Interactive visualization of your organization structure by parent position.</p> */}
        </div>
      </div>

      <div
        style={{ flex: 1, display: 'flex', gap: '1.5rem', minHeight: '600px', overflow: 'hidden' }}
      >
        <div className="card" style={{ width: '280px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          <h3 className="h3" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={18} />
            Unassigned
          </h3>
          <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
            Drag and drop employees to vacant positions in the hierarchy.
          </p>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {unassignedEmployees.length === 0 ? (
              <div className="text-sm text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                No unassigned employees.
              </div>
            ) : (
              unassignedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow-type', 'unassigned-employee');
                    e.dataTransfer.setData('employeeId', emp.id);
                  }}
                  style={{
                    padding: '0.75rem',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  >
                    {emp.firstName?.[0]}{emp.lastName?.[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{getEmployeeFullName(emp)}</div>
                    <div className="text-xs text-muted">{emp.employeeCode}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          className="card"
          style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', position: 'relative' }}
        >
          <div style={{ flex: 1, height: '100%' }}>
            {nodes.length > 0 ? (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onNodeDragStart={(e, node) => {
                  e.dataTransfer?.setData('application/reactflow-type', 'position-node');
                  e.dataTransfer?.setData('positionId', node.data.positionId);
                }}
                nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              minZoom={0.2}
              maxZoom={1.5}
              defaultEdgeOptions={{ type: 'smoothstep' }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1}
                color="var(--border-color)"
              />
              <Controls />
            </ReactFlow>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="spinner" style={{ width: '30px', height: '30px', color: 'var(--primary)' }} />
            </div>
          )}
        </div>

        {selectedNodeData && (
          <div
            style={{
              width: '320px',
              background: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 16px rgba(0,0,0,0.05)',
              height: '100%',
              minHeight: 0,
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="h3">Position Details</h3>
              <button
                onClick={() => setSelectedNodeData(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '24px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                {selectedNodeData.initials}
              </div>
              <h2 className="h2" style={{ marginBottom: '0.25rem' }}>{selectedNodeData.positionTitle}</h2>
              <p className="text-sm text-muted">{selectedNodeData.employeeName}</p>
              <span className="badge badge-neutral" style={{ marginTop: '0.5rem' }}>
                {selectedNodeData.department || 'Unknown Dept'}
              </span>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', minHeight: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Briefcase size={16} className="text-muted" />
                <div>
                  <div className="text-xs text-muted">Position</div>
                  <div className="text-sm font-medium">{selectedNodeData.positionTitle}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Mail size={16} className="text-muted" />
                <div>
                  <div className="text-xs text-muted">Email</div>
                  <div className="text-sm font-medium">{selectedNodeData.rawEmployee?.email || 'Vacant'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Phone size={16} className="text-muted" />
                <div>
                  <div className="text-xs text-muted">Phone</div>
                  <div className="text-sm font-medium">{selectedNodeData.rawEmployee?.phone || 'Vacant'}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedNodeData.employeeId ? (
                <>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                    onClick={() => navigate(`/admin/employees/edit/${selectedNodeData.employeeId}`)}
                  >
                    <Edit2 size={16} /> Edit Employee
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', background: 'var(--bg-subtle)', color: 'var(--text-main)' }}
                    onClick={() => handleUnassignEmployee(selectedNodeData.positionId)}
                  >
                    <UserMinus size={16} /> Unassign Employee
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', background: 'var(--danger-light)', color: 'var(--danger)' }}
                    onClick={() => handleTerminateEmployee(selectedNodeData.employeeId)}
                  >
                    <LogOut size={16} /> Terminate Employee
                  </button>
                </>
              ) : null}
              <button
                className="btn btn-secondary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => navigate(`/admin/positions/edit/${selectedNodeData.positionId}`)}
              >
                <UserCog size={16} /> Edit Position
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

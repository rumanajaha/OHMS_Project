import React, { useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { User as UserIcon, Mail, Phone, Edit2, Link } from 'lucide-react';

const CustomNode = ({ data }: any) => {
  return (
    <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)', minWidth: '220px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', borderTop: `4px solid ${data.color || 'var(--primary)'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-main)' }}>
          {data.initials}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)', fontFamily: 'Poppins, sans-serif' }}>
            {data.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{data.title}</div>
        </div>
      </div>
      {data.department && (
        <div style={{ display: 'inline-block', background: 'var(--bg-subtle)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.5rem' }}>
          {data.department}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export const OrgHierarchy: React.FC = () => {
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const navigate = useNavigate();
  const [selectedNodeData, setSelectedNodeData] = React.useState<any>(null);

  // Parse employees into a functional tree dataset safely
  const { computedNodes, computedEdges } = useMemo(() => {
    const nodes: any[] = [];
    const edges: any[] = [];
    
    // Find absolute root nodes (No manager)
    const rootNodes = employees.filter(e => !e.managerId || !employees.some(emp => emp.id === e.managerId));

    const NODE_WIDTH = 280;
    const SPACING_X = 50;
    const SPACING_Y = 200;

    // Use a basic DFS layout algorithm to assign X, Y organically
    let globalX = 0;
    
    const traverse = (employee: any, depth: number, parentId: string | null) => {
      const children = employees.filter(e => e.managerId === employee.id);
      
      const startX = globalX;
      
      children.forEach((child) => {
        traverse(child, depth + 1, employee.id);
      });
      
      // If leaf node, claim horizontal space
      if (children.length === 0) {
        globalX += NODE_WIDTH + SPACING_X;
      }
      
      const xPos = children.length === 0 ? startX : (startX + globalX - NODE_WIDTH - SPACING_X) / 2;
      const yPos = depth * SPACING_Y + 50; // Add padding

      nodes.push({
        id: employee.id,
        type: 'custom',
        position: { x: xPos, y: yPos },
        data: { 
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`, 
          title: employee.designation,
          initials: (employee.firstName[0] || '') + (employee.lastName[0] || ''),
          department: departments.find(d => d.id === employee.departmentId)?.name,
          color: depth === 0 ? 'var(--primary)' : depth === 1 ? 'var(--secondary)' : 'var(--accent)',
          raw: employee
        }
      });

      if (parentId) {
        edges.push({ 
          id: `e-${parentId}-${employee.id}`, 
          source: parentId, 
          target: employee.id, 
          type: 'smoothstep', 
          animated: true, 
          style: { stroke: 'var(--border-focus)', strokeWidth: 2 } 
        });
      }
    };

    rootNodes.forEach(root => traverse(root, 0, null));
    
    return { computedNodes: nodes, computedEdges: edges };
  }, [employees, departments]);

  const [nodes, setNodes, onNodesChange] = useNodesState(computedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(computedEdges);

  // Sync state cleanly when dependencies shift
  useEffect(() => {
    setNodes(computedNodes);
    setEdges(computedEdges);
    
    if (selectedNodeData) {
      // Keep selected node inspector panel alive but update data
      const updated = computedNodes.find(n => n.id === selectedNodeData.id);
      if (updated) setSelectedNodeData(updated.data);
      else setSelectedNodeData(null); // Node was deleted
    }
  }, [computedNodes, computedEdges, setNodes, setEdges]); // intentionally ignoring selectedNodeData dependency to avoid loops

  const onNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    setSelectedNodeData(node.data);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="h1">Hierarchy Map</h1>
          <p className="text-muted text-sm">Interactive visualization of your organization structure.</p>
        </div>
      </div>

      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', position: 'relative' }}>
        
        <div style={{ flex: 1, height: '100%' }}>
          {nodes.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.2}
            >
              <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--border-color)" />
              <Controls />
            </ReactFlow>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="spinner" style={{ width: '30px', height: '30px', color: 'var(--primary)' }} />
            </div>
          )}
        </div>

        {/* Sliding Detail Panel */}
        {selectedNodeData && (
          <div style={{ width: '320px', background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 16px rgba(0,0,0,0.03)', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="h3">Employee Details</h3>
              <button 
                onClick={() => setSelectedNodeData(null)} 
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
            
            <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}>
                {selectedNodeData.initials}
              </div>
              <h2 className="h2" style={{ marginBottom: '0.25rem' }}>{selectedNodeData.name}</h2>
              <span className="badge badge-neutral" style={{ marginTop: '0.5rem' }}>{selectedNodeData.department || 'Unknown Dept'}</span>
            </div>
            
            <div style={{ padding: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <UserIcon size={16} className="text-muted" />
                <div>
                  <div className="text-xs text-muted">Title</div>
                  <div className="text-sm font-medium">{selectedNodeData.title}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Mail size={16} className="text-muted" />
                <div>
                  <div className="text-xs text-muted">Email</div>
                  <div className="text-sm font-medium">{selectedNodeData.raw?.email || 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Phone size={16} className="text-muted" />
                <div>
                  <div className="text-xs text-muted">Phone</div>
                  <div className="text-sm font-medium">{selectedNodeData.raw?.phone || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => navigate(`/admin/employees/edit/${selectedNodeData.id}`)}>
                <Edit2 size={16} /> Edit Employee
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => navigate(`/admin/employees/edit/${selectedNodeData.id}?focus=manager`)}>
                <Link size={16} /> Reassign Manager
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

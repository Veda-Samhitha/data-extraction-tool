import ReactFlow from 'react-flow-renderer';

const nodes = [
  { id: '1', data: { label: 'Upload File' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'OCR Extraction' }, position: { x: 200, y: 0 } },
  { id: '3', data: { label: 'Text Parsing' }, position: { x: 400, y: 0 } },
  { id: '4', data: { label: 'Entity Extraction' }, position: { x: 600, y: 0 } },
  {
  id: '5',
  data: { label: 'Form/Table Extraction' },
  position: { x: 800, y: 0 },
  type: 'default',
}

];

const edges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' },

];

function PipelineFlow() {
  return (
    <div style={{ width: '100%', height: 300, border: "1px solid #ccc", marginTop: "20px" }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}

export default PipelineFlow;

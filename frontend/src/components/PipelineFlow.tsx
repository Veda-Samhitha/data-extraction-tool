// import React, { useState } from 'react';
// import ReactFlow, { Controls, Background } from 'reactflow';
// import type { Node, Edge } from 'reactflow'; 
// import 'reactflow/dist/style.css';
// import UploadForm from './uploadform';
// // import ExtractionResults from './ExtractionResults';
// import './PipelineFlow.css';

// // Type definitions
// interface ExtractedData {
//   entities?: {
//     names?: string[];
//     dates?: string[];
//     addresses?: string[];
//   };
//   tables?: {
//     headers: string[];
//     rows: string[][];
//   }[];
//   formFields?: {
//     fieldName: string;
//     fieldValue: string;
//   }[];
//   structure?: any;
// }

// interface uploadformProps {
//   onUpload: (file: File) => Promise<void>;
//   isProcessing: boolean;
//   onReset: () => void;
// }

// const initialNodes: Node[] = [
//   { 
//     id: '1', 
//     position: { x: 50, y: 100 }, 
//     data: { 
//       label: 'Upload Document',
//       description: 'Supported formats: PDF, JPG, PNG (max 10MB)'
//     }, 
//     type: 'input',
//     className: 'input-node'
//   },
//   { 
//     id: '2', 
//     position: { x: 350, y: 100 }, 
//     data: { 
//       label: 'OCR Processing',
//       description: 'Extracting text, tables and form fields'
//     },
//     type: 'default',
//     className: 'processing-node'
//   },
//   { 
//     id: '3', 
//     position: { x: 650, y: 100 }, 
//     data: { 
//       label: 'Structured Data',
//       description: 'JSON containing extracted data'
//     }, 
//     type: 'output',
//     className: 'output-node'
//   },
// ];

// const initialEdges: Edge[] = [
//   { id: 'e1-2', source: '1', target: '2', animated: false, label: 'Document' },
//   { id: 'e2-3', source: '2', target: '3', animated: false, label: 'Structured Data' },
// ];

// const PipelineFlow: React.FC = () => {
//   const [nodes, setNodes] = useState<Node[]>(initialNodes);
//   const [edges, setEdges] = useState<Edge[]>(initialEdges);
//   const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const onFileUpload = async (file: File) => {
//     if (!file) return;
    
//     try {
//       setIsProcessing(true);
//       setError(null);
      
//       // Update processing node
//       setNodes(prevNodes => prevNodes.map(node => 
//         node.id === '2' ? { 
//           ...node, 
//           data: { ...node.data, label: 'Processing...' },
//           className: 'processing-node-active'
//         } : node
//       ));

//       setEdges(prevEdges => prevEdges.map(edge => 
//         edge.id === 'e1-2' ? { ...edge, animated: true } : edge
//       ));

    

//       // Update nodes to show completion
//       setNodes(prevNodes => prevNodes.map(node => 
//         node.id === '2' ? { 
//           ...node, 
//           data: { ...node.data, label: 'Processing Complete' },
//           className: 'success-node'
//         } : node.id === '3' ? {
//           ...node,
//           className: 'output-node-active'
//         } : node
//       ));

//       setEdges(prevEdges => prevEdges.map(edge => 
//         edge.id === 'e1-2' ? { ...edge, animated: false } : 
//         edge.id === 'e2-3' ? { ...edge, animated: true } : edge
//       ));
//     } catch (err) {
//       setError('Processing failed. Please try again.');
//       setNodes(prevNodes => prevNodes.map(node => 
//         node.id === '2' ? { 
//           ...node, 
//           data: { ...node.data, label: 'Processing Failed' },
//           className: 'error-node'
//         } : node
//       ));
//       setEdges(prevEdges => prevEdges.map(edge => 
//         edge.id === 'e1-2' ? { ...edge, animated: false } : edge
//       ));
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const onReset = () => {
//     setExtractedData(null);
//     setNodes(initialNodes);
//     setEdges(initialEdges);
//     setError(null);
//   };

//   return (
//     <div className="pipeline-container">
//       <h1>Document Data Extraction Pipeline</h1>
//       <div className="pipeline-content">
//         <div className="flow-diagram">
//           <ReactFlow 
//             nodes={nodes} 
//             edges={edges} 
//             fitView
//             nodesDraggable={false}
//             nodesConnectable={false}
//           >
//             <Background />
//             <Controls />
//           </ReactFlow>
//         </div>
        
        
//       </div>
//     </div>
//   );
// };

// export default PipelineFlow;

import React, { useState, useEffect } from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import type { Node, Edge } from 'reactflow'; 
import 'reactflow/dist/style.css';
import './PipelineFlow.css';

interface PipelineFlowProps {
  trigger: boolean;
}

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 50, y: 100 },
    data: { label: 'Upload Document' },
    type: 'input',
    className: 'input-node',
  },
  {
    id: '2',
    position: { x: 250, y: 100 },
    data: { label: 'OCR Processing' },
    type: 'default',
    className: 'processing-node',
  },
  {
    id: '3',
    position: { x: 450, y: 100 },
    data: { label: 'Entity Extraction' },
    type: 'default',
    className: 'processing-node',
  },
  {
    id: '4',
    position: { x: 650, y: 100 },
    data: { label: 'Table' },
    type: 'default',
    className: 'processing-node',
  },
  {
    id: '5',
    position: { x: 850, y: 100 },
    data: { label: 'Structured Data' },
    type: 'output',
    className: 'output-node',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: false, label: 'Document' },
  { id: 'e2-3', source: '2', target: '3', animated: false, label: 'Text' },
  { id: 'e3-4', source: '3', target: '4', animated: false, label: 'Entities' },
  { id: 'e4-5', source: '4', target: '5', animated: false, label: 'Structured' },
];

const PipelineFlow: React.FC<PipelineFlowProps> = ({ trigger }) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  useEffect(() => {
    if (trigger) {
      const updateNode = (id: string, label: string, className: string) => {
        setNodes(prev =>
          prev.map(node =>
            node.id === id
              ? { ...node, data: { ...node.data, label }, className }
              : node
          )
        );
      };

      const animateEdge = (id: string, on: boolean) => {
        setEdges(prev =>
          prev.map(edge =>
            edge.id === id ? { ...edge, animated: on } : edge
          )
        );
      };

      // Step-by-step animation
      updateNode('2', 'Processing OCR...', 'processing-node-active');
      animateEdge('e1-2', true);

      setTimeout(() => {
        updateNode('2', 'OCR Complete', 'success-node');
        animateEdge('e1-2', false);
        animateEdge('e2-3', true);
        updateNode('3', 'Extracting Entities...', 'processing-node-active');
      }, 1000);

      setTimeout(() => {
        updateNode('3', 'Entities Extracted', 'success-node');
        animateEdge('e2-3', false);
        animateEdge('e3-4', true);
        updateNode('4', 'Detecting Tables...', 'processing-node-active');
      }, 2000);

      setTimeout(() => {
        updateNode('4', 'Table', 'success-node');
        animateEdge('e3-4', false);
        animateEdge('e4-5', true);
        updateNode('5', 'Structured Data ', 'output-node-active');
      }, 3000);
    }
  }, [trigger]);

  return (
    <div className="pipeline-container mt-10">
      <h1 className="text-2xl font-bold mb-4">Pipeline</h1>
      <div className="flow-diagram h-80 border rounded p-4 bg-white shadow-md">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default PipelineFlow;

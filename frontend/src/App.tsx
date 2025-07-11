// import React, { useState } from 'react';
// import UploadForm from './components/uploadform';
// import PipelineFlow from './components/PipelineFlow';

// function App() {
//   const [data, setData] = useState<any>(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleUpload = (uploadedData: any) => {
//     setData(uploadedData);
//     setIsProcessing(false);
//   };

//   const handleReset = () => {
//     setData(null);
//     setIsProcessing(false);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans">
//       <h1 className="text-3xl font-bold text-indigo-700 mb-4">Data Extraction Tool</h1>

//       <UploadForm 
//         onUpload={handleUpload}
//         isProcessing={isProcessing}
//         onReset={handleReset}
//       />

//       {isProcessing && (
//         <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
//           Processing document...
//         </div>
//       )}

//       {data && (
//         <div className="mt-8 bg-white p-4 rounded shadow-md">
//           <h2 className="text-xl font-semibold mb-4">Extracted Entities</h2>
//           <div className="space-y-1 text-sm">
//             <p><strong>Names:</strong> {data.entities?.names?.join(', ') || 'None'}</p>
//             <p><strong>Emails:</strong> {data.entities?.emails?.join(', ') || 'None'}</p>
//             <p><strong>Dates:</strong> {data.entities?.dates?.join(', ') || 'None'}</p>
//             <p><strong>Phones:</strong> {data.entities?.phones?.join(', ') || 'None'}</p>
//           </div>

//           {data.formFields?.length > 0 && (
//             <div className="mt-4">
//               <h3 className="text-lg font-semibold">Form Fields</h3>
//               <ul className="list-disc ml-6">
//                 {data.formFields.map((field: any, i: number) => (
//                   <li key={i}><strong>{field.label}:</strong> {field.value}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {data.table?.headers && data.table?.rows && (
//             <div className="mt-4">
//               <h3 className="text-lg font-semibold">Extracted Table</h3>
//               <div className="overflow-x-auto border rounded my-2">
//                 <table className="min-w-full table-auto text-sm border-collapse border border-gray-300">
//                   <thead>
//                     <tr>
//                       {data.table.headers.map((header: string, hIndex: number) => (
//                         <th key={hIndex} className="border border-gray-300 px-3 py-1 bg-gray-200">{header}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.table.rows.map((row: string[], rIndex: number) => (
//                       <tr key={rIndex}>
//                         {row.map((cell: string, cIndex: number) => (
//                           <td key={cIndex} className="border border-gray-300 px-3 py-1">{cell}</td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           <details className="mt-6">
//             <summary className="cursor-pointer font-semibold text-indigo-700">Full JSON Response</summary>
//             <pre className="bg-gray-100 p-2 rounded text-sm max-h-[300px] overflow-y-auto">
//               {JSON.stringify(data, null, 2)}
//             </pre>
//           </details>

//           <div className="mt-4">
//             <h3 className="text-lg font-semibold">Raw Extracted Text</h3>
//             <pre className="bg-gray-100 p-2 rounded max-h-[300px] overflow-y-auto text-sm">
//               {data.rawText || 'None'}
//             </pre>
//           </div>
//         </div>
//       )}

//       <PipelineFlow />
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import UploadForm from './components/uploadform';
import PipelineFlow from './components/PipelineFlow';

function App() {
  const [data, setData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineTrigger, setPipelineTrigger] = useState(false);

  const handleUpload = (uploadedData: any) => {
    setData(uploadedData);
    setIsProcessing(false);
    setPipelineTrigger(true);
  };

  const handleReset = () => {
    setData(null);
    setIsProcessing(false);
    setPipelineTrigger(false);
  };

  useEffect(() => {
    if (pipelineTrigger) {
      const timer = setTimeout(() => setPipelineTrigger(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [pipelineTrigger]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">Data Extraction Tool</h1>

      <UploadForm 
        onUpload={handleUpload}
        isProcessing={isProcessing}
        onReset={handleReset}
      />

      {isProcessing && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
          Processing document...
        </div>
      )}

      {data && (
        <div className="mt-8 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Extracted Entities</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Names:</strong> {data.entities?.names?.join(', ') || 'None'}</p>
            <p><strong>Emails:</strong> {data.entities?.emails?.join(', ') || 'None'}</p>
            <p><strong>Dates:</strong> {data.entities?.dates?.join(', ') || 'None'}</p>
            <p><strong>Phones:</strong> {data.entities?.phones?.join(', ') || 'None'}</p>
            <p><strong>Addresses:</strong> {data.entities?.addresses?.join(', ') || 'None'}</p>
          </div>

          {data.formFields?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Form Fields</h3>
              <ul className="list-disc ml-6">
                {data.formFields.map((field: any, i: number) => (
                  <li key={i}><strong>{field.label}:</strong> {field.value}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Extracted Table</h3>
            {data.table?.headers && data.table?.rows ? (
              <div className="overflow-x-auto border rounded my-2">
                <table className="min-w-full table-auto text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      {data.table.headers.map((header: string, hIndex: number) => (
                        <th key={hIndex} className="border border-gray-300 px-3 py-1 bg-gray-200">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.table.rows.map((row: string[], rIndex: number) => (
                      <tr key={rIndex}>
                        {row.map((cell: string, cIndex: number) => (
                          <td key={cIndex} className="border border-gray-300 px-3 py-1">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Table: None</p>
            )}
          </div>

          <details className="mt-6">
            <summary className="cursor-pointer font-semibold text-indigo-700">Full JSON Response</summary>
            <pre className="bg-gray-100 p-2 rounded text-sm max-h-[300px] overflow-y-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <PipelineFlow trigger={pipelineTrigger} />
    </div>
  );
}

export default App;

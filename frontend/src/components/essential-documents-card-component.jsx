/* Description: enables users to download forms

@author Prince Czedrick Nepomuceno
@date 04/27/2024
*/

import React from 'react';

const EssentialDocumentsCardComponent = ({ documents }) => {
  // File download connection to files
  // Reference a file in the src folder
  // To reference a file from inside the src folder, you have to access the public folder URL. 
  // React saves this path in an environment variable. To be able to use that file you have to use the process.env.PUBLIC_URL path.
  // To download a file from the public folder, you can access it like this:
  const handleFileDownload = async (x) => {
    const fileName = x.name; // Extract filename

    // Ensure filename includes extension
    const filePath = `${fileName}`; 

    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink); // Append to body for accessibility
    downloadLink.style.display = "none"; // Hide the element

    downloadLink.href = process.env.PUBLIC_URL + filePath;

    downloadLink.download = fileName;
    downloadLink.click();
    downloadLink.remove();
  };

  return (
    <div className="card">
      <div className="card-header">
        <span>Essential Documents</span>
        <h6 className="card-subtitle mb-2 text-muted">&#8203;</h6>
      </div>
      <ul className="list-group list-group-flush">
        <li class="list-group-item" style={{ paddingTop: "30px" }}>
          {documents.map((document) => (
            <div className="card file-manager-recent-item" style={{ boxShadow: '0px 0px 11px 1px rgba(0, 0, 0, 0.075)' }}>
              <div className="file-card">
                <div className="d-flex align-items-center">
                  <i className="material-icons-outlined text-danger align-middle m-r-sm">description</i>
                  {/* eslint-disable-next-line */}
                  <a href="#" className="file-manager-recent-item-title flex-fill">
                    {document.name}
                  </a>
                  <span className="p-h-sm">{document.size}</span>
                  {/* eslint-disable-next-line */}
                  <a
                    className="dropdown-toggle file-manager-recent-file-actions"
                    id={`file-manager-recent-${document.id}`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={() => handleFileDownload(document)}
                  >  
                    <i className="material-icons">download</i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </li>
      </ul>
    </div>
  );
};

export default EssentialDocumentsCardComponent;

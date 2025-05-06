import React, { useRef } from "react";
import { usePDF } from "react-to-pdf";

export default function ApplicationForm() {
  const formRef = useRef();
  const { toPDF, targetRef } = usePDF({
    filename: "Darul-Muttaquine-Scholarship-Application.pdf",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Darul Muttaquine Scholarship 2026
          </h1>
          <button
            onClick={() => toPDF()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Download PDF
          </button>
        </div>

        <div ref={targetRef} className="bg-white p-8 rounded-lg shadow-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">
              APPLICATION FORM
            </h2>
            <p className="text-gray-600">(For Academic Year 2026-2027)</p>
          </div>

          {/* Applicant Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">
              APPLICANT INFORMATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  1. Full Name (As per academic records)
                </label>
                <div className="h-8 border-b border-gray-300"></div>
                <p className="text-xs text-gray-500 mt-1">
                  [Write in block letters]
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  2. Parent/Guardian's Full Name
                </label>
                <div className="h-8 border-b border-gray-300"></div>
                <p className="text-xs text-gray-500 mt-1">
                  [Include title (Mr./Mrs./Ms.)]
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  3. Current Class/Grade
                </label>
                <div className="h-8 border-b border-gray-300 w-1/2"></div>
                <p className="text-xs text-gray-500 mt-1">
                  [e.g., Grade 10, 1st Year College]
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  4. Class Roll Number
                </label>
                <div className="h-8 border-b border-gray-300 w-1/2"></div>
                <p className="text-xs text-gray-500 mt-1">
                  [Official number from your institute]
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  5. Institute Name
                </label>
                <div className="h-8 border-b border-gray-300"></div>
                <p className="text-xs text-gray-500 mt-1">
                  [Full name with location, e.g., "City Public School, Dhaka"]
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">
              CONTACT DETAILS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  6. Phone Number
                </label>
                <div className="h-8 border-b border-gray-300"></div>
                <p className="text-xs text-gray-500 mt-1">
                  [Include country code if applicable]
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  7. Email Address
                </label>
                <div className="h-8 border-b border-gray-300"></div>
                <p className="text-xs text-gray-500 mt-1">
                  [Use an active email for correspondence]
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  8. Blood Group
                </label>
                <div className="h-8 border-b border-gray-300 w-1/4"></div>
                <p className="text-xs text-gray-500 mt-1">
                  [e.g., A+, O-, etc.]
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">
              ADDRESS
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  9. Permanent Address
                </label>
                <div className="h-8 border-b border-gray-300"></div>
                <div className="h-8 border-b border-gray-300 mt-2"></div>
                <p className="text-xs text-gray-500 mt-1">
                  [House No., Street, City, ZIP Code]
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  10. Emergency Contact (Name & Number)
                </label>
                <div className="h-8 border-b border-gray-300"></div>
                <p className="text-xs text-gray-500 mt-1">
                  [Not a parent; e.g., relative/neighbor]
                </p>
              </div>
            </div>
          </div>

          {/* Declaration & Signatures */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">
              DECLARATION & SIGNATURES
            </h3>

            <div className="mb-4">
              <p className="text-sm italic mb-4">
                <strong>Applicant's Declaration:</strong> I certify that all
                information provided is accurate. I agree to abide by the
                scholarship terms.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Applicant's Signature
                  </label>
                  <div className="h-12 border-b border-gray-300 w-3/4"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="h-8 border-b border-gray-300 w-1/2"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent/Guardian's Signature
                  </label>
                  <div className="h-12 border-b border-gray-300 w-3/4"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="h-8 border-b border-gray-300 w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* For Office Use Only */}
          <div className="border-t-2 border-gray-300 pt-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">
              FOR OFFICE USE ONLY
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application ID
                </label>
                <div className="h-8 border-b border-gray-300 w-full"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received By
                </label>
                <div className="h-8 border-b border-gray-300 w-full"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Received
                </label>
                <div className="h-8 border-b border-gray-300 w-full"></div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex space-x-4">
                  <span className="inline-flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600" />
                    <span className="ml-2 text-gray-700">Approved</span>
                  </span>
                  <span className="inline-flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600" />
                    <span className="ml-2 text-gray-700">Rejected</span>
                  </span>
                  <span className="inline-flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600" />
                    <span className="ml-2 text-gray-700">Pending</span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Authority Stamp/Signature
                </label>
                <div className="h-16 border border-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="mt-8 text-sm bg-gray-50 p-4 rounded-md">
            <h4 className="font-semibold mb-2">GUIDELINES FOR FILLING:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Use <strong>black/blue ink</strong> only.
              </li>
              <li>
                Write <strong>clearly in block letters</strong>; avoid
                abbreviations.
              </li>
              <li>
                Attach copies of:
                <ul className="list-disc pl-5 mt-1">
                  <li>Academic transcripts</li>
                  <li>ID proof (Student/Parent)</li>
                  <li>Passport-size photo</li>
                </ul>
              </li>
              <li>
                Submit by deadline: <strong>DD/MM/YYYY</strong>.
              </li>
            </ol>
            <p className="mt-2 italic">
              Note: Incomplete forms will be rejected. Contact
              scholarship@darulmuttaquine.edu for queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

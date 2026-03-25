import React from 'react';
import { UploadCloud } from 'lucide-react';

export default function ImportData() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Import Data</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-8 border border-gray-100">
        <div className="max-w-xl mx-auto">
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-16 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-500 mt-2">CSV files up to 10MB</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Process Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

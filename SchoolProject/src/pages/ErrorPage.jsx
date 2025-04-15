import React from 'react'

function ErrorPage({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]">
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-600">
          {error?.status === 404 ? "404 - Page Not Found" : "Oops! An Error Occurred"}
        </h1>
        <p className="mt-2 text-gray-600">
          {error?.statusText || "Something went wrong. Please try again later."}
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
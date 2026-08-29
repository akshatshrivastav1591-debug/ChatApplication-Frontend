import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./Config/api";

export function IssueReportingUi(){
    const navigate=useNavigate();
    const reporterEmail=useRef();
    const issueDescription=useRef();
    const [error,setError]=useState(null);
    const [isSending,setIsSending]=useState(false);
    function closingComponent(){
    navigate("/MainUI/ChatList");
    }

    async function sendingReport(){
    setIsSending(true);
    const reportingObject={
        "senderEmail":reporterEmail.current.value,
        "message":issueDescription.current.value
    }
     const response=await fetch(`${API_BASE_URL}/reportingOfAnIssue`,{
        headers: { "Content-Type": "application/json" },
        method:"POST",
        credentials:"include",
        body:JSON.stringify(reportingObject)

     })
    if(response.ok){
        setIsSending(false);
        navigate("/MainUI/ChatList");
    }
    else{
        setIsSending(false);
        setError("Something wrong in backend");
    }
  }
    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
          Report an Issue
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          Let us know what went wrong.
        </p>

        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Your email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          ref={reporterEmail}
        />

        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Issue
        </label>
        <textarea
          placeholder="Describe the issue you ran into..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
          ref={issueDescription}
        />

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <div className="flex gap-x-3 mt-3">
          <button
            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg py-2 font-medium transition"
            onClick={closingComponent}
          >
            Close
          </button>
          <button
            className="flex-1 bg-red-500 text-white hover:bg-red-600 rounded-lg py-2 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendingReport}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
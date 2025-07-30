"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import { Plus } from 'lucide-react';

export default function PostTitleGenerator() {
  const [tab, setTab] = useState("company");
  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState([]);
  const [summary, setSummary] = useState("");
  const [role, setRole] = useState("");
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddService = () => {
    if (serviceInput.trim() !== "") {
      setServices([...services, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    if (tab === "company") {
      formData.append("summary", summary);
      formData.append("services", JSON.stringify(services));
    } else {
      formData.append("role", role);
      formData.append("pdf", pdf);
    }

    const endpoint =
      tab === "company" ? "/api/titles" : "/api/generate-individual-posts";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        tab === "company"
          ? (setSummary(""), setServices([]))
          : (setRole(""), setPdf(null));
        router.push("/your-titles");
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      alert("Request failed.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex mb-6 overflow-hidden rounded-lg shadow-md">
        <button
          onClick={() => setTab("company")}
          className={`w-1/2 py-3 text-lg font-semibold transition ${tab === "company"
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Company
        </button>
        <button
          onClick={() => setTab("individual")}
          className={`w-1/2 py-3 text-lg font-semibold transition ${tab === "individual"
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Individual
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow-md"
      >
        {tab === "company" ? (
          <>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Services
              </label>
              <div className="flex flex-wrap gap-2 mt-2 border border-gray-400 rounded p-3 bg-gray-50">
                {services.map((srv, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm shadow-sm"
                  >
                    {srv}
                    <FiX
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveService(index)}
                    />
                  </span>
                ))}
                <input
                  type="text"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  className="flex-1 min-w-[120px] outline-none bg-transparent text-sm px-2 py-1"
                  placeholder="Type a service"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="text-sm font-semibold text-blue-600 disabled:opacity-50 cursor-pointer"
                  disabled={loading || !serviceInput.trim()}
                >
                  <Plus />
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                className="border border-gray-400 w-full p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter company summary"
                disabled={loading}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Your Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-400 w-full p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Software Engineer"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Upload Resume (PDF)
              </label>
              <div className="border-2 border-dashed border-gray-400 p-6 rounded-lg relative bg-gray-50 hover:border-blue-500 transition duration-200">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdf(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={loading}
                />
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16v-4m0 0V8m0 4h4m-4 0H8m8 8H8a2 2 0 01-2-2V6a2 2 0 012-2h5.5a2 2 0 011.4.6l3.5 3.5a2 2 0 01.6 1.4V18a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Click or drag PDF to upload
                  </p>
                  {pdf && (
                    <p className="mt-2 text-sm font-medium text-blue-600">
                      📄 {pdf.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition duration-300 ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            }`}
        >
          {loading ? "Generating..." : "Generate Titles"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function PostTitleGenerator() {
  const [tab, setTab] = useState("company");

  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedService, setEditedService] = useState("");

  const [summary, setSummary] = useState("");

  const [role, setRole] = useState("");
  const [pdf, setPdf] = useState(null);

  const [loading, setLoading] = useState(false);


  const handleAddService = () => {
    if (serviceInput.trim() !== "") {
      setServices([...services, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  const handleEditService = (index) => {
    setEditingIndex(index);
    setEditedService(services[index]);
  };

  const handleSaveEdit = () => {
    const updated = [...services];
    updated[editingIndex] = editedService.trim();
    setServices(updated);
    setEditingIndex(null);
    setEditedService("");
  };

  const handleDeleteService = (index) => {
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

    const endpoint = tab === "company"
      ? "/api/generating-titles"
      : "/api/generate-individual-posts";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        if (tab === "company") {
          setSummary("");
          setServices([]);
          setServiceInput("");
        } else {
          setRole("");
          setPdf(null);
        }
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
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("company")}
          className={`px-4 py-2 rounded ${tab === "company" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Company
        </button>
        <button
          onClick={() => setTab("individual")}
          className={`px-4 py-2 rounded ${tab === "individual" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Individual
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "company" ? (
          <>
            <div>
              <label className="block font-medium">Add Services</label>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  className="border p-2 flex-1 rounded"
                  placeholder="Enter a service"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !serviceInput.trim()}
                >
                  Add
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {services.map((srv, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    {editingIndex === idx ? (
                      <>
                        <input
                          value={editedService}
                          onChange={(e) => setEditedService(e.target.value)}
                          className="border p-1 rounded w-full"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          disabled={loading || !editedService.trim()}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingIndex(null)}
                          className="text-gray-500 px-2 py-1"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1">{srv}</span>
                        <button
                          type="button"
                          onClick={() => handleEditService(idx)}
                          className="text-blue-600 hover:underline text-sm  cursor-pointer"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(idx)}
                          className="text-red-600 hover:underline text-sm  cursor-pointer"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="block font-medium">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                className="border w-full p-2 rounded mt-2"
                placeholder="Enter company summary"
                disabled={loading}
              ></textarea>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block font-medium">Your Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border w-full p-2 rounded mt-2"
                placeholder="e.g. Software Engineer"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-800">Upload Resume (PDF)</label>
              <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg relative bg-gray-50 hover:border-blue-500 transition duration-200">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setPdf(file);
                  }}
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
                  <p className="mt-2 text-sm text-gray-600">Click or drag PDF to upload</p>
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
          className={`w-full px-6 py-2 rounded font-semibold text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating..." : "Generate Titles"}
        </button>
      </form>
    </div>
  );
}

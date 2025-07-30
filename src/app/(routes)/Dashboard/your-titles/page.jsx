"use client";

import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const YourTitles = () => {
  const [titles, setTitles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTitles();
  }, []);

  const fetchTitles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/titles");
      const data = await res.json();
      setTitles(data.articles || []);
    } catch (err) {
      console.error("Error fetching titles", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/titles/${id}`, {
        method: "DELETE",
      });
      fetchTitles();
    } catch (err) {
      console.error("Error deleting title", err);
    }
  };

  const handleEdit = (title) => {
    setEditingId(title.id);
    setEditedTitle(title.title);
  };

  const handleUpdate = async () => {
    try {
      await fetch(`/api/titles/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editedTitle }),
      });
      setEditingId(null);
      setEditedTitle("");
      fetchTitles();
    } catch (err) {
      console.error("Error updating title", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="py-10 text-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : titles.length > 0 ? (
              titles.map((title) => (
                <tr key={title.id} className="border-t border-gray-200">
                  <td className="px-6 py-4">
                    {editingId === title.id ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    ) : (
                      <span className="text-gray-800">{title.title}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 capitalize">{title.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === title.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdate}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-4 text-lg">
                        <button
                          onClick={() => handleEdit(title)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(title.id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <FiTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No articles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YourTitles;

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { getSession } from "next-auth/react";

export const EditProduct = ({ product, onClose }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [description, setDescription] = useState(product.description);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    if (!session || !session.user.isAdmin) {
      setError("You are not authorized to perform this action");
      return;
    }

    try {
      const res = await fetch(`/api/products/update/${product.id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        setSuccess("Product updated successfully!");
        onClose();
      } else {
        const errorData = await res.json();
        setError("Failed to update product: " + errorData.error);
      }
    } catch (error) {
      console.error("Failed to update product", error);
      setError("Failed to update product");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold">Edit Product</h3>
          </div>
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <Input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <Input
                    type="text"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-4 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <Input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Video
                  </label>
                  <Input
                    type="file"
                    onChange={(e) => setVideo(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded">
                  Update Product
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-red-500 text-white px-4 py-2 rounded ml-2">
                  Cancel
                </Button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

const CreateAddress = ({ setIsCreating }) => {
  const [formData, setFormData] = useState({
    street: "",
    postalCode: "",
    city: "",
    province: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const session = await getSession();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await fetch(`/api/address/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId: session.user.id }),
      });
      toast.success("Buat Alamat Berhasil")
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create address:", error);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
        <h1 className="text-3xl font-bold">Create Address</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <Label htmlFor="street">Street Address</Label>
        <Input
          name="street"
          placeholder="Street Address"
          value={formData.street}
          onChange={handleChange}
          className={errors.street ? "border-red-500" : ""}
        />
        {errors.street && (
          <p className="text-red-500 text-xs italic">{errors.street}</p>
        )}

        <Label htmlFor="postalCode">Postal Code</Label>
        <Input
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          className={errors.postalCode ? "border-red-500" : ""}
        />
        {errors.postalCode && (
          <p className="text-red-500 text-xs italic">{errors.postalCode}</p>
        )}

        <Label htmlFor="city">City</Label>
        <Input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className={errors.city ? "border-red-500" : ""}
        />
        {errors.city && (
          <p className="text-red-500 text-xs italic">{errors.city}</p>
        )}

        <Label htmlFor="province">Province</Label>
        <Input
          name="province"
          placeholder="Province"
          value={formData.province}
          onChange={handleChange}
          className={errors.province ? "border-red-500" : ""}
        />
        {errors.province && (
          <p className="text-red-500 text-xs italic">{errors.province}</p>
        )}

        <Label htmlFor="phone">Phone</Label>
        <Input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs italic">{errors.phone}</p>
        )}
        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white">
            Create
          </Button>
          <Button
            type="button"
            className="ml-2 bg-red-500 hover:bg-red-600 text-white"
            onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateAddress;

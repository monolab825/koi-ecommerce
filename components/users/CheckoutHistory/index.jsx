import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { formatRupiah } from "@/utils/currency";
import { Button } from "@/components/ui/Button";

const CheckoutHistory = () => {
  const [checkouts, setCheckouts] = useState([]);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        return;
      }

      const fetchCheckouts = async () => {
        const response = await fetch(`/api/checkout/userId/${session.user.id}`);
        const data = await response.json();
        console.log("Checkouts:", data.checkouts);
        setCheckouts(data.checkouts);
      };

      fetchCheckouts();
    });
  }, []);

  const handleDeleteCheckout = async (checkoutId) => {
    const response = await fetch(`/api/checkout/delete/${checkoutId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setCheckouts((prevCheckouts) =>
        prevCheckouts.filter((checkout) => checkout.id !== checkoutId)
      );
    }

    const data = await response.json();
    console.log("Checkout deleted:", data);
  };

  if (!checkouts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col p-4 space-y-4">
      {checkouts.length > 0 ? (
        checkouts.map((checkout) => (
          <div
            key={checkout.id}
            className="flex flex-col md:flex-row justify-between border-b-2 border-gray-300 p-4 rounded-lg shadow-md bg-white space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col md:flex-row md:w-2/3 space-y-2 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <Image
                  src={checkout.cart.create[0].product.image}
                  alt={checkout.cart.create[0].product.name}
                  width={100}
                  height={100}
                  style={{
                    objectFit: "contain",
                    height: "100%",
                    width: "auto",
                    marginInline: "auto",
                    animation: "ease-in",
                    marginBottom: "10px",
                  }}
                />
              </div>
              <div className="flex flex-col md:w-2/3 space-y-2">
                <div>
                  <p className="text-gray-700 font-semibold">Shipping Info:</p>
                  <p className="text-gray-500">
                    {checkout.shipping
                      ? `${checkout.shipping.city}, ${checkout.shipping.region}, Fee: ${formatRupiah(checkout.shipping.fee)}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Address:</p>
                  <p className="text-gray-500">
                    {checkout.address
                      ? `${checkout.address.street}, ${checkout.address.city}, ${checkout.address.province}, ${checkout.address.postalCode}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Items:</p>
                  <div className="flex flex-col space-y-2">
                    {checkout.cart.create.map((item) => (
                      <div key={item.id} className="flex flex-col space-y-2">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-gray-500">
                          Price: {formatRupiah(item.product.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end justify-center w-full md:w-1/3 space-y-2 md:space-y-0">
              <div className="flex flex-col items-center md:items-end">
                <p className="text-gray-700 font-semibold">Status:</p>
                <p className="text-gray-900">{checkout.status}</p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <p className="text-gray-700 font-semibold">Total Checkout:</p>
                <p className="text-gray-900">{formatRupiah(checkout.total)}</p>
              </div>
              <div className="flex flex-col items-center md:items-end space-y-2 mt-8">
                <Button
                  onClick={() => handleDeleteCheckout(checkout.id)}
                  className="bg-red-500 hover:bg-red-600 text-white">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No checkouts found.</p>
      )}
    </div>
  );
};

export default CheckoutHistory;

import React, { useEffect, useState } from "react";
import { API } from "../utils/API";
import { toast } from "react-toastify";
import AddToCartButton from "./AddToCartButton";
import ProductCard from "./ProductCard";

function CategoryWiseProducts() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getData() {
        try {
            const response = await API.GENERAL.products_grouped_by_category();
            if (response.success) {
                setData(response.data.data);
            } else {
                toast.error(response.error);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if (loading) {
        return <p className="text-center py-6">Loading...</p>;
    }

    return (
        <div className="space-y-12 mt-10">
            {data.map((item) => (
                <div key={item.category._id}>
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={item.category.icon}
                            alt={item.category.name}
                            className="w-8 h-8 object-contain"
                        />
                        <h2 className="text-2xl font-semibold">
                            {item.category.name}
                        </h2>
                    </div>

                    {/* Products */}
                    {item.products.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                            No products available
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {item.products.map((product, index) => (
                                <ProductCard product={product} key={product._id} />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default CategoryWiseProducts;

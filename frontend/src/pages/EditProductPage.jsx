import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router";
import { getProductById, updateProduct } from "../lib/api";
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { ArrowLeftIcon, SaveIcon, ShoppingBagIcon, ImageIcon } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const [form, setForm] = useState({ title: "", description: "", imageUrl: "" });

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  // Pre-fill form when product loads
  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product]);

  const { mutate, isPending, isError: isMutateError, error } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate(`/product/${id}`);
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    mutate({ id, ...form });
  };

  // Loading
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-base-200 rounded w-1/3" />
        <div className="h-12 bg-base-200 rounded" />
        <div className="h-32 bg-base-200 rounded" />
        <div className="h-12 bg-base-200 rounded" />
      </div>
    );
  }

  // Error / not found
  if (isError || !product) {
    return (
      <div className="text-center py-24">
        <ShoppingBagIcon className="size-16 text-base-content/20 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <Link to="/" className="btn btn-primary mt-4">Back to Home</Link>
      </div>
    );
  }

  // Ownership guard
  if (product.userId !== userId) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold mb-2">Forbidden</h1>
        <p className="text-base-content/50 mb-4">You don't have permission to edit this product.</p>
        <Link to={`/product/${id}`} className="btn btn-primary">View Product</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to={`/product/${id}`} className="btn btn-ghost btn-sm gap-2 mb-6">
        <ArrowLeftIcon className="size-4" /> Back to Product
      </Link>

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-2 flex items-center gap-2">
            <SaveIcon className="size-6 text-primary" />
            Edit Product
          </h1>
          <p className="text-base-content/50 text-sm mb-6">Update your product details.</p>

          {isMutateError && (
            <div className="alert alert-error mb-4">
              <span>{error?.response?.data?.error || "Failed to update product."}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Product Name <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
                maxLength={100}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/40">{form.title.length}/100</span>
              </label>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description <span className="text-error">*</span></span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-32 resize-none"
                required
                maxLength={1000}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/40">{form.description.length}/1000</span>
              </label>
            </div>

            {/* Image URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1">
                  <ImageIcon className="size-4" /> Image URL <span className="text-base-content/40 text-xs">(optional)</span>
                </span>
              </label>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.png"
                className="input input-bordered w-full"
              />
            </div>

            {/* Image Preview */}
            {form.imageUrl && (
              <div className="rounded-xl overflow-hidden h-40 bg-base-300">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}

            <div className="card-actions justify-end pt-2">
              <Link to={`/product/${id}`} className="btn btn-ghost">Cancel</Link>
              <button
                type="submit"
                disabled={isPending || !form.title.trim() || !form.description.trim()}
                className="btn btn-primary gap-2"
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <SaveIcon className="size-4" />
                )}
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

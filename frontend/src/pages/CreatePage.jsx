import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import { createProduct } from "../lib/api";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useState } from "react";
import { ArrowLeftIcon, PlusIcon, ImageIcon, ShoppingBagIcon } from "lucide-react";

export default function CreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate(`/product/${newProduct.id}`);
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    mutate(form);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="btn btn-ghost btn-sm gap-2 mb-6">
        <ArrowLeftIcon className="size-4" /> Back
      </Link>

      <SignedOut>
        <div className="text-center py-24">
          <ShoppingBagIcon className="size-16 text-base-content/20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in to share a product</h1>
          <p className="text-base-content/50 mb-6">You need to be signed in to create a product listing.</p>
          <SignInButton mode="modal">
            <button className="btn btn-primary">Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h1 className="card-title text-2xl mb-2 flex items-center gap-2">
              <PlusIcon className="size-6 text-primary" />
              Share a Product
            </h1>
            <p className="text-base-content/50 text-sm mb-6">
              Tell the community about something awesome you've found or built.
            </p>

            {isError && (
              <div className="alert alert-error mb-4">
                <span>{error?.response?.data?.error || "Failed to create product. Please try again."}</span>
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
                  placeholder="e.g. Notion, Linear, Figma..."
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
                  placeholder="What does it do? Why is it awesome? Share details..."
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
                <Link to="/" className="btn btn-ghost">Cancel</Link>
                <button
                  type="submit"
                  disabled={isPending || !form.title.trim() || !form.description.trim()}
                  className="btn btn-primary gap-2"
                >
                  {isPending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <PlusIcon className="size-4" />
                  )}
                  {isPending ? "Publishing..." : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

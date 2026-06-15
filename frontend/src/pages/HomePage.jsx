import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../lib/api";
import { Link } from "react-router";
import { ShoppingBagIcon, PlusIcon, ArrowRightIcon, MessageCircleIcon, CalendarIcon, UserIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="card bg-base-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      <figure className="relative overflow-hidden h-48">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/600x400/1d232a/a6adba?text=${encodeURIComponent(product.title)}`;
            }}
          />
        ) : (
          <div className="w-full h-full bg-base-300 flex items-center justify-center">
            <ShoppingBagIcon className="size-16 text-base-content/20" />
          </div>
        )}
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-base-content line-clamp-1 group-hover:text-primary transition-colors">
          {product.title}
        </h2>
        <p className="text-base-content/60 text-sm line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-base-300">
          <div className="flex items-center gap-2">
            {product.users?.imageUrl ? (
              <img
                src={product.users.imageUrl}
                alt={product.users.name}
                className="size-6 rounded-full"
              />
            ) : (
              <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="size-3 text-primary" />
              </div>
            )}
            <span className="text-xs text-base-content/50 truncate max-w-[100px]">
              {product.users?.name || "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-base-content/40">
            <span className="flex items-center gap-1">
              <MessageCircleIcon className="size-3" />
              {product.comments?.length ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {new Date(product.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="btn btn-sm btn-ghost w-full gap-1 group-hover:btn-primary transition-all">
          View Details <ArrowRightIcon className="size-3" />
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="card bg-base-200 shadow-md animate-pulse">
      <div className="h-48 bg-base-300 rounded-t-2xl" />
      <div className="card-body p-4 gap-3">
        <div className="h-5 bg-base-300 rounded w-3/4" />
        <div className="h-4 bg-base-300 rounded w-full" />
        <div className="h-4 bg-base-300 rounded w-2/3" />
        <div className="h-8 bg-base-300 rounded mt-2" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { isSignedIn } = useAuth();

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-12 mb-8">
        <div className="inline-flex items-center gap-2 badge badge-primary badge-lg mb-4">
          <ShoppingBagIcon className="size-4" />
          Discover Amazing Products
        </div>
        <h1 className="text-4xl font-bold mb-3">
          Welcome to{" "}
          <span className="text-primary">Cartify</span>
        </h1>
        <p className="text-base-content/60 text-lg max-w-xl mx-auto mb-6">
          Discover, share and discuss the best products. Built by the community, for the community.
        </p>
        {isSignedIn && (
          <Link to="/create" className="btn btn-primary gap-2">
            <PlusIcon className="size-4" />
            Share a Product
          </Link>
        )}
      </div>

      {/* Error State */}
      {isError && (
        <div className="alert alert-error max-w-lg mx-auto mb-8">
          <span>Failed to load products: {error?.message || "Unknown error"}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && products?.length === 0 && (
        <div className="text-center py-24">
          <ShoppingBagIcon className="size-16 text-base-content/20 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No products yet</h2>
          <p className="text-base-content/50 mb-6">Be the first to share something!</p>
          {isSignedIn && (
            <Link to="/create" className="btn btn-primary gap-2">
              <PlusIcon className="size-4" /> Share a Product
            </Link>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !isError && products?.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              All Products{" "}
              <span className="badge badge-neutral ml-2">{products.length}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

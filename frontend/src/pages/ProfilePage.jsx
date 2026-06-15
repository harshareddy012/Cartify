import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { getMyProducts, deleteProduct } from "../lib/api";
import { useUser } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import {
  ShoppingBagIcon,
  PlusIcon,
  Trash2Icon,
  PencilIcon,
  CalendarIcon,
  PackageIcon,
} from "lucide-react";

function MyProductCard({ product, onDelete, isDeleting }) {
  return (
    <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200">
      <figure className="h-36 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x200/1d232a/a6adba?text=${encodeURIComponent(product.title)}`;
            }}
          />
        ) : (
          <div className="w-full h-full bg-base-300 flex items-center justify-center">
            <ShoppingBagIcon className="size-10 text-base-content/20" />
          </div>
        )}
      </figure>

      <div className="card-body p-4">
        <h3 className="font-semibold line-clamp-1">{product.title}</h3>
        <p className="text-sm text-base-content/50 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-1 text-xs text-base-content/40 mt-1">
          <CalendarIcon className="size-3" />
          {new Date(product.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </div>

        <div className="card-actions justify-end mt-2 gap-2">
          <Link to={`/product/${product.id}`} className="btn btn-ghost btn-xs">
            View
          </Link>
          <Link to={`/edit/${product.id}`} className="btn btn-outline btn-xs gap-1">
            <PencilIcon className="size-3" /> Edit
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            disabled={isDeleting}
            className="btn btn-error btn-xs gap-1"
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Trash2Icon className="size-3" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: myProducts, isLoading } = useQuery({
    queryKey: ["myProducts"],
    queryFn: getMyProducts,
  });

  const { mutate: remove, isPending: isDeleting, variables: deletingId } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  if (!user) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold">Please sign in to view your profile.</h1>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="card bg-base-200 shadow-md mb-8">
        <div className="card-body">
          <div className="flex items-center gap-5">
            <UserButton
              appearance={{
                elements: { avatarBox: "size-16" },
              }}
            />
            <div>
              <h1 className="text-2xl font-bold">{user.fullName || user.firstName}</h1>
              <p className="text-base-content/50 text-sm">
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="badge badge-primary badge-sm gap-1">
                  <PackageIcon className="size-3" />
                  {myProducts?.length ?? 0} product{myProducts?.length !== 1 ? "s" : ""}
                </div>
                <div className="badge badge-ghost badge-sm">
                  Member since {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short", year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Products Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <PackageIcon className="size-5 text-primary" />
          My Products
        </h2>
        <Link to="/create" className="btn btn-primary btn-sm gap-2">
          <PlusIcon className="size-4" /> New Product
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card bg-base-200 animate-pulse">
              <div className="h-36 bg-base-300 rounded-t-2xl" />
              <div className="card-body p-4 gap-3">
                <div className="h-5 bg-base-300 rounded w-3/4" />
                <div className="h-4 bg-base-300 rounded w-full" />
                <div className="h-8 bg-base-300 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && myProducts?.length === 0 && (
        <div className="text-center py-16 bg-base-200 rounded-2xl">
          <PackageIcon className="size-14 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products yet</h3>
          <p className="text-base-content/50 mb-6">Share something with the community!</p>
          <Link to="/create" className="btn btn-primary gap-2">
            <PlusIcon className="size-4" /> Share a Product
          </Link>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && myProducts?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map((product) => (
            <MyProductCard
              key={product.id}
              product={product}
              onDelete={remove}
              isDeleting={isDeleting && deletingId === product.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

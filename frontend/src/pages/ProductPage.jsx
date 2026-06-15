import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router";
import { getProductById, createComment, deleteComment, deleteProduct } from "../lib/api";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import {
  ArrowLeftIcon,
  Trash2Icon,
  PencilIcon,
  SendIcon,
  MessageCircleIcon,
  CalendarIcon,
  UserIcon,
  ShoppingBagIcon,
} from "lucide-react";

function CommentItem({ comment, currentUserId, onDelete }) {
  return (
    <div className="flex gap-3 py-4 border-b border-base-300 last:border-0">
      {comment.user?.imageUrl ? (
        <img
          src={comment.user.imageUrl}
          alt={comment.user.name}
          className="size-9 rounded-full flex-shrink-0 object-cover"
        />
      ) : (
        <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <UserIcon className="size-4 text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm">{comment.user?.name || "Anonymous"}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-base-content/40">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </span>
            {currentUserId === comment.userId && (
              <button
                onClick={() => onDelete(comment.id)}
                className="btn btn-ghost btn-xs text-error hover:bg-error/10"
              >
                <Trash2Icon className="size-3" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-base-content/70 mt-1">{comment.content}</p>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId, isSignedIn } = useAuth();
  const [commentText, setCommentText] = useState("");

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const { mutate: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      setCommentText("");
    },
  });

  const { mutate: removeComment } = useMutation({
    mutationFn: (commentId) => deleteComment({ commentId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", id] }),
  });

  const { mutate: removeProduct, isPending: isDeletingProduct } = useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/");
    },
  });

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment({ productId: id, content: commentText.trim() });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-6">
        <div className="h-64 bg-base-200 rounded-2xl" />
        <div className="h-8 bg-base-200 rounded w-2/3" />
        <div className="h-4 bg-base-200 rounded w-full" />
        <div className="h-4 bg-base-200 rounded w-3/4" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-24">
        <ShoppingBagIcon className="size-16 text-base-content/20 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-base-content/50 mb-6">This product doesn't exist or was deleted.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const isOwner = userId === product.userId;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <Link to="/" className="btn btn-ghost btn-sm gap-2 mb-6">
        <ArrowLeftIcon className="size-4" /> Back to Products
      </Link>

      {/* Product Image */}
      {product.imageUrl ? (
        <figure className="rounded-2xl overflow-hidden mb-6 h-64 md:h-80 bg-base-200">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/800x400/1d232a/a6adba?text=${encodeURIComponent(product.title)}`;
            }}
          />
        </figure>
      ) : (
        <div className="rounded-2xl h-64 bg-base-200 flex items-center justify-center mb-6">
          <ShoppingBagIcon className="size-20 text-base-content/20" />
        </div>
      )}

      {/* Product Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        {isOwner && (
          <div className="flex gap-2 flex-shrink-0">
            <Link to={`/edit/${product.id}`} className="btn btn-sm btn-outline gap-1">
              <PencilIcon className="size-3" /> Edit
            </Link>
            <button
              onClick={() => removeProduct()}
              disabled={isDeletingProduct}
              className="btn btn-sm btn-error gap-1"
            >
              {isDeletingProduct ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2Icon className="size-3" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-base-content/50 mb-6">
        <div className="flex items-center gap-2">
          {product.users?.imageUrl ? (
            <img src={product.users.imageUrl} alt={product.users.name} className="size-6 rounded-full" />
          ) : (
            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
              <UserIcon className="size-3 text-primary" />
            </div>
          )}
          <span>{product.users?.name || "Unknown"}</span>
        </div>
        <span className="flex items-center gap-1">
          <CalendarIcon className="size-3" />
          {new Date(product.createdAt).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircleIcon className="size-3" />
          {product.comments?.length ?? 0} comments
        </span>
      </div>

      {/* Description */}
      <div className="prose max-w-none mb-8">
        <p className="text-base-content/70 leading-relaxed whitespace-pre-wrap">{product.description}</p>
      </div>

      <div className="divider" />

      {/* Comments Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <MessageCircleIcon className="size-5 text-primary" />
          Comments ({product.comments?.length ?? 0})
        </h2>

        {/* Add Comment */}
        {isSignedIn ? (
          <form onSubmit={handleSubmitComment} className="flex gap-3 mb-6">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="input input-bordered flex-1"
              disabled={isAddingComment}
            />
            <button
              type="submit"
              disabled={isAddingComment || !commentText.trim()}
              className="btn btn-primary gap-2"
            >
              {isAddingComment ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <SendIcon className="size-4" />
              )}
              Send
            </button>
          </form>
        ) : (
          <div className="alert alert-info mb-6">
            <span>Sign in to leave a comment.</span>
          </div>
        )}

        {/* Comments List */}
        {product.comments?.length === 0 ? (
          <div className="text-center py-10 text-base-content/40">
            <MessageCircleIcon className="size-10 mx-auto mb-2 opacity-30" />
            <p>No comments yet. Be the first!</p>
          </div>
        ) : (
          <div className="bg-base-200 rounded-2xl px-4">
            {product.comments?.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={userId}
                onDelete={removeComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

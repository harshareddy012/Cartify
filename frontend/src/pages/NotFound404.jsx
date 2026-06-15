import { Link } from "react-router";
import { HomeIcon, ShoppingBagIcon } from "lucide-react";

export default function NotFound404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-8xl font-black text-primary/20 mb-4 select-none">404</div>
      <ShoppingBagIcon className="size-16 text-base-content/20 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-base-content/50 mb-8 max-w-sm">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary gap-2">
        <HomeIcon className="size-4" />
        Back to Home
      </Link>
    </div>
  );
}

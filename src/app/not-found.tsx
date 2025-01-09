import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="space-y-4 text-center">
        <h1 className="text-7xl font-bold text-white">404</h1>
        <h2 className="text-2xl font-semibold text-zinc-400">Page Not Found</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-zinc-800 hover:bg-zinc-700 text-white mt-4">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

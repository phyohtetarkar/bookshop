import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col space-y-4 justify-center items-center mt-8">
      <h1 className="text-4xl text-gray-800 whitespace-nowrap">
        Page not found
      </h1>
      <Link to="/" className="text-blue-600 underline font-medium">
        Return to home
      </Link>
    </div>
  );
}

export default NotFound;

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 gap-5">
      <div className="text-left max-w-2xl bg-zinc-200 p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Authentication System
        </h1>

        <p className="text-xl text-slate-700 mb-12">
          A secure and efficient authentication system using JSON Web Tokens
          (JWT) for access and refresh tokens.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-left">
          <Link to="/signup" className="bg-zinc-800 text-white px-6 py-3 rounded-full hover:bg-zinc-900 transition">
            Get Started
          </Link>
        </div>

        <p className="text-slate-600 mt-12 text-sm">
          Production-ready authentication with JWT tokens and secure session
          management.
        </p>
      </div>
    </div>
  );
};

export default Home;

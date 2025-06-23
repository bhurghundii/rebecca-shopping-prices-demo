"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error message from callback
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "missing_code":
          setError("Authorization code was missing from the response.");
          break;
        case "token_exchange":
          setError("Failed to exchange the authorization code for tokens.");
          break;
        case "missing_id_token":
          setError("No ID token was returned from Auth0.");
          break;
        case "invalid_token":
          setError("The ID token was invalid or could not be parsed.");
          break;
        case "server_error":
          setError("An unexpected server error occurred.");
          break;
        default:
          setError(`Authentication error: ${errorParam}`);
      }
    }
  }, [searchParams]);

  const handleSignIn = () => {
    setLoading(true);

    // Auth0 Universal Login parameters
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
    // Using a hardcoded redirect URI to match exactly what's in Auth0 dashboard
    const redirectUri = "http://localhost:3000/api/auth/callback";

    // Construct Auth0 login URL
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId || "",
      redirect_uri: redirectUri,
      scope: "openid profile email",
      state: btoa(Math.random().toString()),
    });

    // Redirect to Auth0 login page
    window.location.href = `https://${domain}/authorize?${params}`;
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign In to Shopping App</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded text-lg"
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? "Redirecting..." : "Sign in with Auth0"}
      </button>
      <p className="mt-4 text-gray-500">
        You will be redirected to Auth0 for secure authentication
      </p>
    </main>
  );
}

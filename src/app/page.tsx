"use client";
import { baseURL } from "@/src/constants/constants";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");

    const response = await fetch(baseURL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
      credentials: "include",
    });

    if (response.ok) {
      router.push("/home");
    } else {
      // Handle errors
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "1rem",
      }}
    >
      <h1
        className=""
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        Dog Finder
      </h1>
      <p
        className=""
        style={{
          fontSize: "1rem",
          color: "#555",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        Please enter your name and email to login
      </p>
      <input
        type="name"
        name="name"
        placeholder="Name"
        required
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "100%",
          maxWidth: "300px",
        }}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "100%",
          maxWidth: "300px",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          color: "#fff",
          backgroundColor: "#007BFF",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </form>
  );
}

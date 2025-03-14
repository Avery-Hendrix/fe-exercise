'use client'
import { baseURL } from "@/src/components/constants";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter()
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
 
    const response = await fetch(baseURL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
      credentials: "include"
    })
 
    if (response.ok) {
      router.push('/home')
    } else {
      // Handle errors
    }
  }
 
  return (
    <form onSubmit={handleSubmit} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <input type="name" name="name" placeholder="Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <button type="submit">Login</button>
    </form>
  )
}

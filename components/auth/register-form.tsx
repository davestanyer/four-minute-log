"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log("[Register] Starting registration process...")

    try {
      if (!name || !email || !password) {
        console.log("[Register] Missing required fields")
        toast.error("Please fill in all fields")
        setLoading(false)
        return
      }

      if (password.length < 6) {
        console.log("[Register] Password too short")
        toast.error("Password must be at least 6 characters long")
        setLoading(false)
        return
      }

      console.log("[Register] Attempting sign up for email:", email)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: name,
          }
        }
      })

      if (signUpError) {
        console.error("[Register] SignUp Error:", signUpError)
        toast.error(signUpError.message || "Failed to create account")
        return
      }

      if (!data.user) {
        console.error("[Register] No user data returned")
        toast.error("Failed to create account")
        return
      }

      console.log("[Register] User created successfully:", data.user.id)
      console.log("[Register] Creating user profile...")

      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          name,
          email,
          role: 'user'
        }])

      if (profileError) {
        console.error("[Register] Profile Error:", profileError)
        toast.error("Failed to create user profile")
        
        console.log("[Register] Cleaning up auth user after profile creation failure")
        await supabase.auth.signOut()
        return
      }

      console.log("[Register] Registration successful")
      toast.success("Registration successful! Please check your email to confirm your account.")
      router.push("/auth/login")
    } catch (error) {
      console.error("[Register] Unexpected error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to create an account</CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
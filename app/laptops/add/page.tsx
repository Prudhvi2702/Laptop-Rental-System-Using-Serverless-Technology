"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AddLaptopPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    price_per_day: "",
  })

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
      toast({
        title: "Authentication required",
        description: "Please login to add laptops",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [router, toast])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price_per_day" ? (value === "" ? "" : Number(value)) : value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form data
    if (!formData.brand || !formData.model || !formData.price_per_day) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("accessToken")
      console.log("Submitting laptop data:", formData)

      // Call the API to add a new laptop
      const response = await fetch("https://uijoj390ad.execute-api.us-east-1.amazonaws.com/prod/laptops/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brand: formData.brand,
          model: formData.model,
          price_per_day: Number(formData.price_per_day),
        }),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to add laptop")
      }

      // Store the laptop_id in localStorage for potential updates
      if (data && data.laptop_id) {
        // Store in an array of laptop IDs
        const existingIds = JSON.parse(localStorage.getItem("laptopIds") || "[]")
        existingIds.push({
          id: data.laptop_id,
          brand: formData.brand,
          model: formData.model,
        })
        localStorage.setItem("laptopIds", JSON.stringify(existingIds))
        console.log("Laptop ID stored:", data.laptop_id)
      }

      // Show success notification
      toast({
        title: "Laptop added successfully!",
        description: `${formData.brand} ${formData.model} has been added to the inventory.`,
      })

      // Reset form after successful submission
      setFormData({
        brand: "",
        model: "",
        price_per_day: "",
      })

      // Redirect to laptops page after a short delay to show the toast
      setTimeout(() => {
        router.push("/laptops")
      }, 2000)
    } catch (error) {
      console.error("Error adding laptop:", error)
      toast({
        title: "Error adding laptop",
        description: error.message,
        variant: "destructive",
      })

      // If unauthorized, redirect to login
      if (error.message.includes("unauthorized") || error.message.includes("Unauthorized")) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("idToken")
        localStorage.removeItem("refreshToken")
        router.push("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-md px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold tracking-tight">Add New Laptop</h1>
            <p className="text-muted-foreground">Add a new laptop to the rental inventory</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Laptop Details</CardTitle>
                  <CardDescription>Enter the details of the new laptop</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      name="brand"
                      placeholder="e.g., Dell, Apple, Lenovo"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      name="model"
                      placeholder="e.g., XPS 15, MacBook Pro"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_per_day">Price Per Day (₹) *</Label>
                    <Input
                      id="price_per_day"
                      name="price_per_day"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 25.00"
                      value={formData.price_per_day}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Laptop...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Add Laptop
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

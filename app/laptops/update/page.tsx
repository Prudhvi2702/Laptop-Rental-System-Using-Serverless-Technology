"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Save, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function UpdateLaptopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [laptops, setLaptops] = useState([])
  const [selectedLaptopId, setSelectedLaptopId] = useState("")
  const [formData, setFormData] = useState({
    laptop_id: "",
    brand: "",
    model: "",
    price_per_day: "",
    available: true,
  })

  // Check authentication status and fetch laptops on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsLoggedIn(true)
      fetchLaptops(token)

      // Check if laptop_id is provided in URL params
      const laptopId = searchParams.get("id")
      if (laptopId) {
        setSelectedLaptopId(laptopId)
      }
    } else {
      setIsLoggedIn(false)
      setIsFetching(false)
      toast({
        title: "Authentication required",
        description: "Please login to update laptops",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [router, toast, searchParams])

  // Fetch available laptops
  const fetchLaptops = async (token) => {
    try {
      setIsFetching(true)
      console.log("Fetching laptops...")

      const response = await fetch("https://uijoj390ad.execute-api.us-east-1.amazonaws.com/prod/laptops/available", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch laptops")
      }

      if (data && data.laptops) {
        setLaptops(data.laptops)
        console.log("Laptops fetched:", data.laptops)

        // Store laptop IDs in localStorage for update functionality
        const laptopIds = data.laptops.map((laptop) => ({
          id: laptop.laptop_id,
          brand: laptop.brand,
          model: laptop.model,
        }))
        localStorage.setItem("laptopIds", JSON.stringify(laptopIds))

        // Check if laptop_id is provided in URL params
        const laptopId = searchParams.get("id")
        if (laptopId) {
          const selectedLaptop = data.laptops.find((l) => l.laptop_id === laptopId)
          if (selectedLaptop) {
            setSelectedLaptopId(laptopId)
            setFormData({
              laptop_id: selectedLaptop.laptop_id,
              brand: selectedLaptop.brand || "",
              model: selectedLaptop.model || "",
              price_per_day: selectedLaptop.price_per_day?.toString() || "",
              available: selectedLaptop.available !== false, // Default to true if not specified
            })
            console.log("Selected laptop:", selectedLaptop)
          }
        }
      } else {
        setLaptops([])
      }
    } catch (error) {
      console.error("Error fetching laptops:", error)
      toast({
        title: "Error fetching laptops",
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
      setIsFetching(false)
    }
  }

  // Handle laptop selection
  const selectLaptop = (laptopId) => {
    const laptop = laptops.find((l) => l.laptop_id === laptopId)
    if (laptop) {
      setSelectedLaptopId(laptopId)
      setFormData({
        laptop_id: laptop.laptop_id,
        brand: laptop.brand || "",
        model: laptop.model || "",
        price_per_day: laptop.price_per_day?.toString() || "",
        available: laptop.available !== false, // Default to true if not specified
      })
      console.log("Selected laptop:", laptop)
    }
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price_per_day" ? (value === "" ? "" : value) : value,
    }))
  }

  // Handle availability status change
  const handleAvailableChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      available: value === "true",
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form data
    if (!formData.laptop_id) {
      toast({
        title: "Missing information",
        description: "Please select a laptop to update",
        variant: "destructive",
      })
      return
    }

    // Ensure at least one field to update
    if (!formData.brand && !formData.model && formData.price_per_day === "") {
      toast({
        title: "No changes",
        description: "Please modify at least one field to update",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("accessToken")
      console.log("Updating laptop data:", formData)

      // Prepare update data (only include fields with values)
      const updateData = {
        laptop_id: formData.laptop_id,
      }

      if (formData.brand) updateData.brand = formData.brand
      if (formData.model) updateData.model = formData.model
      if (formData.price_per_day !== "") updateData.price_per_day = Number(formData.price_per_day)
      updateData.available = formData.available

      console.log("Update data being sent:", updateData)

      // Call the API to update the laptop
      const response = await fetch("https://uijoj390ad.execute-api.us-east-1.amazonaws.com/prod/laptops/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to update laptop")
      }

      // Update the stored laptop info
      const updatedLaptops = laptops.map((laptop) => {
        if (laptop.laptop_id === formData.laptop_id) {
          return {
            ...laptop,
            brand: formData.brand || laptop.brand,
            model: formData.model || laptop.model,
            price_per_day: formData.price_per_day ? Number(formData.price_per_day) : laptop.price_per_day,
            available: formData.available,
          }
        }
        return laptop
      })

      setLaptops(updatedLaptops)

      // Update localStorage
      const laptopIds = updatedLaptops.map((laptop) => ({
        id: laptop.laptop_id,
        brand: laptop.brand,
        model: laptop.model,
      }))
      localStorage.setItem("laptopIds", JSON.stringify(laptopIds))

      // Show success notification
      toast({
        title: "Laptop updated successfully!",
        description: `The laptop has been updated.`,
      })

      // Redirect to laptops page after a short delay to show the toast
      setTimeout(() => {
        router.push("/laptops")
      }, 2000)
    } catch (error) {
      console.error("Error updating laptop:", error)
      toast({
        title: "Error updating laptop",
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
          <Button variant="ghost" className="mb-6" onClick={() => router.push("/laptops")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to laptops
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold tracking-tight">Update Laptop</h1>
            <p className="text-muted-foreground">Modify details of an existing laptop</p>
          </motion.div>

          {isFetching ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Laptop Details</CardTitle>
                    <CardDescription>Update the details of the selected laptop</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="laptop_select">Select Laptop *</Label>
                      <Select value={selectedLaptopId} onValueChange={selectLaptop}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a laptop to update" />
                        </SelectTrigger>
                        <SelectContent>
                          {laptops.map((laptop) => (
                            <SelectItem key={laptop.laptop_id} value={laptop.laptop_id}>
                              {laptop.brand} {laptop.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedLaptopId && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="brand">Brand</Label>
                          <Input
                            id="brand"
                            name="brand"
                            placeholder="e.g., Dell, Apple, Lenovo"
                            value={formData.brand}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Model</Label>
                          <Input
                            id="model"
                            name="model"
                            placeholder="e.g., XPS 15, MacBook Pro"
                            value={formData.model}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price_per_day">Price Per Day (₹)</Label>
                          <Input
                            id="price_per_day"
                            name="price_per_day"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="e.g., 25.00"
                            value={formData.price_per_day}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="available">Availability Status</Label>
                          <Select value={formData.available.toString()} onValueChange={handleAvailableChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select availability status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Available</SelectItem>
                              <SelectItem value="false">Not Available</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading || !selectedLaptopId}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating Laptop...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update Laptop
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

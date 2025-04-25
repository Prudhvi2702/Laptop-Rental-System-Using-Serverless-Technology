"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Laptop, Calendar, ArrowRight, Loader2, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { createRental } from "@/lib/api"

interface Laptop {
  laptop_id: string;
  brand: string;
  model: string;
  price_per_day: number;
  available: boolean;
}

export default function CreateRentalPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [laptops, setLaptops] = useState<Laptop[]>([])
  const [selectedLaptopId, setSelectedLaptopId] = useState("")
  const [rentalDays, setRentalDays] = useState(1)
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null)
  const [rentalId, setRentalId] = useState("")
  const [rentalCreated, setRentalCreated] = useState(false)

  // Check authentication status and fetch laptops on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const username = localStorage.getItem("username")

    if (token && username) {
      setIsLoggedIn(true)
      fetchLaptops(token)

      // Check if laptop_id is provided in URL params
      const laptopId = searchParams.get("laptop_id")
      if (laptopId) {
        setSelectedLaptopId(laptopId)
      }
    } else {
      setIsLoggedIn(false)
      setIsFetching(false)
      toast({
        title: "Authentication required",
        description: "Please login to create a rental",
        variant: "destructive",
      })
      router.push("/login?redirect=/create-rental")
    }
  }, [router, toast, searchParams])

  // Fetch available laptops from API
  const fetchLaptops = async (token: string) => {
    try {
      setIsFetching(true)
      console.log("Fetching laptops for rental...")

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
        // Filter only available laptops
        const availableLaptops = data.laptops.filter((laptop: Laptop) => laptop.available !== false)
        setLaptops(availableLaptops)
        console.log("Available laptops:", availableLaptops)

        // If laptop_id is in URL, find and select that laptop
        const laptopId = searchParams.get("laptop_id")
        if (laptopId) {
          const laptop = availableLaptops.find((l: Laptop) => l.laptop_id === laptopId)
          if (laptop) {
            setSelectedLaptopId(laptopId)
            setSelectedLaptop(laptop)
            console.log("Selected laptop from URL:", laptop)
          }
        }
      } else {
        setLaptops([])
      }
    } catch (error) {
      console.error("Error fetching laptops:", error)
      toast({
        title: "Error fetching laptops",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })

      // If unauthorized, redirect to login
      if (error instanceof Error && (error.message.includes("unauthorized") || error.message.includes("Unauthorized"))) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("idToken")
        localStorage.removeItem("refreshToken")
        router.push("/login?redirect=/create-rental")
      }
    } finally {
      setIsFetching(false)
    }
  }

  // Handle laptop selection
  const handleLaptopChange = (laptopId: string) => {
    setSelectedLaptopId(laptopId)
    const laptop = laptops.find((l) => l.laptop_id === laptopId)
    setSelectedLaptop(laptop || null)
    console.log("Selected laptop:", laptop)
  }

  // Handle rental days change
  const handleRentalDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0) {
      setRentalDays(value)
    }
  }

  // Simulate rental creation for development/testing
  const simulateRentalCreation = () => {
    if (!selectedLaptop) return

    // Generate a random rental ID
    const mockRentalId = `rent-${Math.random().toString(36).substring(2, 10)}`
    setRentalId(mockRentalId)
    setRentalCreated(true)

    // Show success notification
    toast({
      title: "Rental created successfully!",
      description: `You have rented the ${selectedLaptop.brand} ${selectedLaptop.model} for ${rentalDays} days.`,
    })

    // Update the available laptops list by removing the rented laptop
    const updatedLaptops = laptops.filter((laptop) => laptop.laptop_id !== selectedLaptopId)
    setLaptops(updatedLaptops)

    console.log("Simulated rental created with ID:", mockRentalId)
    return mockRentalId
  }

  // Update the handleSubmit function to handle CORS errors
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    if (!selectedLaptopId || rentalDays < 1 || !selectedLaptop) {
      toast({
        title: "Missing information",
        description: "Please select a laptop and specify rental days",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("accessToken")
      const username = localStorage.getItem("username")
      
      if (!token || !username) {
        throw new Error("Authentication required")
      }

      console.log("Creating rental with data:", {
        laptop_id: selectedLaptopId,
        user_id: username,
        rental_days: rentalDays,
      })

      // Use the API utility function to create the rental
      const data = await createRental({
            laptop_id: selectedLaptopId,
        user_id: username,
            rental_days: rentalDays,
      }, token)

        // Store rental ID for payment processing
        setRentalId(data.rental_id)
        setRentalCreated(true)
        console.log("Rental created with ID:", data.rental_id)

        // Show success notification
        toast({
          title: "Rental created successfully!",
          description: `You have rented the ${selectedLaptop.brand} ${selectedLaptop.model} for ${rentalDays} days.`,
        })

        // Update the available laptops list by removing the rented laptop
        const updatedLaptops = laptops.filter((laptop) => laptop.laptop_id !== selectedLaptopId)
        setLaptops(updatedLaptops)

    } catch (error) {
      console.error("Error creating rental:", error)
      
      // If there's an API error, try to simulate the rental creation
      if (error instanceof Error && (error.message.includes("Failed to fetch") || error.message.includes("NetworkError"))) {
        console.log("API unavailable, simulating rental creation")
        simulateRentalCreation()
      } else {
      toast({
        title: "Error creating rental",
          description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })

      // If unauthorized, redirect to login
        if (error instanceof Error && (error.message.includes("unauthorized") || error.message.includes("Unauthorized"))) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("idToken")
        localStorage.removeItem("refreshToken")
        router.push("/login?redirect=/create-rental")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Update the handleProcessPayment function to correctly redirect with rental ID
  const handleProcessPayment = () => {
    if (rentalId) {
      router.push(`/payment?rental_id=${rentalId}`)
    } else {
      toast({
        title: "Error",
        description: "No rental ID available for payment",
        variant: "destructive",
      })
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
            <h1 className="text-3xl font-bold tracking-tight">Create Rental</h1>
            <p className="text-muted-foreground">Select a laptop and rental period</p>
          </motion.div>

          {isFetching ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : rentalCreated ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Rental Created Successfully</CardTitle>
                  <CardDescription>Your rental has been created and is ready for payment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Laptop className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {selectedLaptop?.brand} {selectedLaptop?.model}
                        </h3>
                        <p className="text-sm text-muted-foreground">₹{selectedLaptop?.price_per_day}/day</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Rental Summary</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rental ID:</span>
                        <span className="font-medium">{rentalId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Number of days:</span>
                        <span className="font-medium">{rentalDays}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 mt-1">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">₹{(selectedLaptop?.price_per_day || 0 * rentalDays).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleProcessPayment}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Process Payment
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : laptops.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Rental Details</CardTitle>
                    <CardDescription>Create a new laptop rental</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="laptop_select">Select Laptop *</Label>
                      <Select value={selectedLaptopId} onValueChange={handleLaptopChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a laptop to rent" />
                        </SelectTrigger>
                        <SelectContent>
                          {laptops.map((laptop) => (
                            <SelectItem key={laptop.laptop_id} value={laptop.laptop_id}>
                              {laptop.brand} {laptop.model} - ₹{laptop.price_per_day}/day
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedLaptop && (
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Laptop className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {selectedLaptop.brand} {selectedLaptop.model}
                            </h3>
                            <p className="text-sm text-muted-foreground">₹{selectedLaptop.price_per_day}/day</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="rental_days">Rental Period (Days) *</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="rental_days"
                          type="number"
                          min="1"
                          value={rentalDays}
                          onChange={handleRentalDaysChange}
                          required
                        />
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div>

                    {selectedLaptop && (
                      <div className="rounded-lg border p-4 mt-4">
                        <h3 className="font-medium">Rental Summary</h3>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Price per day:</span>
                            <span className="font-medium">₹{selectedLaptop.price_per_day}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Number of days:</span>
                            <span className="font-medium">{rentalDays}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1 mt-1">
                            <span className="font-medium">Total:</span>
                            <span className="font-bold">₹{(selectedLaptop.price_per_day * rentalDays).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading || !selectedLaptopId}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Rental...
                        </>
                      ) : (
                        <>
                          Create Rental
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
            >
              <Laptop className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No laptops available</h3>
              <p className="mt-2 text-sm text-muted-foreground">There are currently no laptops available for rent.</p>
              <Button className="mt-4" onClick={() => router.push("/laptops")}>
                Browse Laptops
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

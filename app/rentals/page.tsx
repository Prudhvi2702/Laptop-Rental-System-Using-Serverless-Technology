"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Laptop, Calendar, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getAvailableLaptops } from "@/lib/api"

/**
 * RentalsPage component
 *
 * This page displays the user's rentals.
 * In a real application, this would fetch data from a dedicated rentals API endpoint.
 */
export default function RentalsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [rentals, setRentals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsLoggedIn(true)
      fetchRentals(token)
    } else {
      setIsLoggedIn(false)
      setIsLoading(false)
      toast({
        title: "Authentication required",
        description: "Please login to view your rentals",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [router, toast])

  // Update the fetchRentals function to properly fetch user rentals
  // In a real app, you would have a dedicated endpoint for this
  // For now, we'll create sample rentals based on available laptops
  const fetchRentals = async (token) => {
    try {
      setIsLoading(true)

      // In a real app, you would fetch the user's rentals from a dedicated API endpoint
      // For now, we'll create some sample rentals based on available laptops
      const laptopsData = await getAvailableLaptops(token)

      if (laptopsData && laptopsData.laptops && laptopsData.laptops.length > 0) {
        // Create sample rentals from the first 3 laptops
        const sampleRentals = laptopsData.laptops.slice(0, 3).map((laptop, index) => {
          const startDate = new Date()
          startDate.setDate(startDate.getDate() - (index === 1 ? 14 : 3)) // One rental started 14 days ago

          return {
            rental_id: `rent-${index + 1}`,
            laptop_id: laptop.laptop_id,
            brand: laptop.brand,
            model: laptop.model,
            rental_days: index === 1 ? 7 : 14, // Different rental periods
            rental_start: startDate.toISOString(),
            status: index === 1 ? "completed" : "active",
            price_per_day: laptop.price_per_day,
            payment_status: index === 0 ? "pending" : "completed",
          }
        })

        setRentals(sampleRentals)
      } else {
        setRentals([])
      }
    } catch (error) {
      toast({
        title: "Error fetching rentals",
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

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calculate end date based on start date and rental days
  const calculateEndDate = (startDate, days) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + days)
    return formatDate(date)
  }

  // Calculate days left in rental
  const calculateDaysLeft = (startDate, days) => {
    const start = new Date(startDate)
    const end = new Date(startDate)
    end.setDate(end.getDate() + days)
    const today = new Date()

    const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
    return daysLeft > 0 ? daysLeft : 0
  }

  // Filter rentals based on active tab
  const filteredRentals = rentals.filter((rental) => activeTab === "all" || rental.status === activeTab)

  if (!isLoggedIn) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Rentals</h1>
            <p className="text-muted-foreground">Manage your laptop rentals</p>
          </div>

          <Tabs defaultValue="active" onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredRentals.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredRentals.map((rental, index) => (
                    <motion.div
                      key={rental.rental_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge variant={rental.status === "active" ? "default" : "secondary"}>
                              {rental.status === "active" ? "Active" : "Completed"}
                            </Badge>
                            <span className="text-sm font-medium">₹{rental.price_per_day * rental.rental_days}</span>
                          </div>
                          <CardTitle className="line-clamp-1">
                            {rental.brand} {rental.model}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>Start: {formatDate(rental.rental_start)}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>End: {calculateEndDate(rental.rental_start, rental.rental_days)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>Duration: {rental.rental_days} days</span>
                            </div>
                            {rental.status === "active" && (
                              <div className="flex items-center">
                                {calculateDaysLeft(rental.rental_start, rental.rental_days) > 0 ? (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                    <span className="text-green-500">
                                      {calculateDaysLeft(rental.rental_start, rental.rental_days)} days left
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4 text-destructive" />
                                    <span className="text-destructive">Overdue</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push(`/rentals/${rental.rental_id}`)}
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <Laptop className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No rentals found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don&apos;t have any {activeTab !== "all" ? activeTab : ""} rentals yet.
                  </p>
                  <Button className="mt-4" onClick={() => router.push("/create-rental")}>
                    Create a Rental
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

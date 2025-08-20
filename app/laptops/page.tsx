"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Laptop, Search, Filter, Loader2, SlidersHorizontal, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function LaptopsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [laptops, setLaptops] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [sortBy, setSortBy] = useState("default")
  const [filterBrand, setFilterBrand] = useState("all")

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsLoggedIn(true)
      fetchLaptops(token)
    } else {
      setIsLoggedIn(false)
      setIsLoading(false)
      toast({
        title: "Authentication required",
        description: "Please login to view available laptops",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [router, toast])

  // Update the fetchLaptops function to properly handle laptop availability
  const fetchLaptops = async (token) => {
    try {
      setIsLoading(true)

      const response = await fetch("https://uijoj390ad.execute-api.us-east-1.amazonaws.com/prod/laptops/available", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch laptops")
      }

      const data = await response.json()

      if (data && data.laptops) {
        // Make sure to respect the 'available' property from the API
        setLaptops(data.laptops)

        // Store laptop IDs in localStorage for update functionality
        const laptopIds = data.laptops.map((laptop) => ({
          id: laptop.laptop_id,
          brand: laptop.brand,
          model: laptop.model,
          available: laptop.available !== false, // Default to true if not specified
        }))
        localStorage.setItem("laptopIds", JSON.stringify(laptopIds))
      } else {
        setLaptops([])
      }
    } catch (error) {
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
      setIsLoading(false)
    }
  }

  // Get unique brands for filtering
  const brands = ["all", ...new Set(laptops.map((laptop) => laptop.brand))]

  // Filter and sort laptops
  const filteredAndSortedLaptops = laptops
    .filter(
      (laptop) =>
        (filterBrand === "all" || laptop.brand === filterBrand) &&
        (laptop.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          laptop.model.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price_per_day - b.price_per_day
      if (sortBy === "price-desc") return b.price_per_day - a.price_per_day
      if (sortBy === "brand") return a.brand.localeCompare(b.brand)
      return 0 // default
    })

  const handleRentClick = (laptop) => {
    router.push(`/create-rental?laptop_id=${laptop.laptop_id}`)
  }

  const handleRefresh = () => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      fetchLaptops(token)
      toast({
        title: "Refreshed",
        description: "Laptop list has been refreshed",
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
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Available Laptops</h1>
              <p className="text-muted-foreground">Browse our selection of high-quality laptops for rent</p>
            </div>
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="relative flex-1 md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search laptops..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem className="font-medium">Filter by Brand</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {brands.map((brand) => (
                    <DropdownMenuItem
                      key={brand}
                      onClick={() => setFilterBrand(brand)}
                      className={filterBrand === brand ? "bg-muted" : ""}
                    >
                      {brand === "all" ? "All Brands" : brand}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="sr-only">Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem className="font-medium">Sort by</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSortBy("default")}
                    className={sortBy === "default" ? "bg-muted" : ""}
                  >
                    Default
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("price-asc")}
                    className={sortBy === "price-asc" ? "bg-muted" : ""}
                  >
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("price-desc")}
                    className={sortBy === "price-desc" ? "bg-muted" : ""}
                  >
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("brand")} className={sortBy === "brand" ? "bg-muted" : ""}>
                    Brand
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAndSortedLaptops.length > 0 ? (
            <AnimatePresence>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAndSortedLaptops.map((laptop, index) => (
                  <motion.div
                    key={laptop.laptop_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group"
                  >
                    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="p-0">
                        <div className="aspect-video overflow-hidden bg-muted">
                          <div className="flex h-full items-center justify-center bg-muted group-hover:bg-muted/80 transition-colors">
                            <Laptop className="h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 flex-grow">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="mb-2">
                            {laptop.brand}
                          </Badge>
                          <span className="text-lg font-bold text-primary">₹{laptop.price_per_day}/day</span>
                        </div>
                        <CardTitle className="line-clamp-1">{laptop.model}</CardTitle>
                        <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          High-performance laptop suitable for work, gaming, and creative tasks.
                        </div>
                        {laptop.available === false && (
                          <Badge variant="destructive" className="mt-2">
                            Not Available
                          </Badge>
                        )}
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <Button
                          className="w-full group-hover:bg-primary/90 transition-colors"
                          onClick={() => handleRentClick(laptop)}
                          disabled={laptop.available === false}
                        >
                          {laptop.available === false ? "Not Available" : "Rent Now"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
            >
              <Laptop className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No laptops found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We couldn&apos;t find any laptops matching your search.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setFilterBrand("all")
                  setSortBy("default")
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

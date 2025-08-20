"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Laptop, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import { useToast } from "@/hooks/use-toast"

/**
 * HomePage component
 *
 * This is the main landing page of the application.
 * It includes quick access cards for laptop management and rental creation.
 */
export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  // Handle "Get Started" button click
  const handleGetStarted = () => {
    if (isLoggedIn) {
      // If logged in, redirect to create rental page
      router.push("/create-rental")
    } else {
      // If not logged in, show message and redirect to login
      toast({
        title: "Authentication Required",
        description: "Please login to create a rental",
      })
      router.push("/login?redirect=/create-rental")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection onGetStarted={handleGetStarted} />

        {isLoggedIn && (
          <section className="py-12 bg-muted/50">
            <div className="container px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
              >
                <h2 className="text-3xl font-bold tracking-tight">Quick Actions</h2>
                <p className="mt-2 text-muted-foreground">Manage laptops and create rentals</p>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Add Laptop</CardTitle>
                      <CardDescription>Add a new laptop to the inventory</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-20 items-center justify-center rounded-md bg-primary/10">
                        <Plus className="h-10 w-10 text-primary" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => router.push("/laptops/add")}>
                        Add Laptop
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Update Laptop</CardTitle>
                      <CardDescription>Modify existing laptop details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-20 items-center justify-center rounded-md bg-primary/10">
                        <Edit className="h-10 w-10 text-primary" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => router.push("/laptops/update")}>
                        Update Laptop
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Create Rental</CardTitle>
                      <CardDescription>Rent a laptop for a specific period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-20 items-center justify-center rounded-md bg-primary/10">
                        <Laptop className="h-10 w-10 text-primary" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => router.push("/create-rental")}>
                        Create Rental
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}

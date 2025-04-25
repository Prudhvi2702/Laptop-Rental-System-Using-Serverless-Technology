"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Calendar, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [joinDate, setJoinDate] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("accessToken")
    const email = localStorage.getItem("username")

    if (token && email) {
      setIsLoggedIn(true)
      setUserEmail(email)

      // Set a mock join date (in a real app, this would come from the API)
      const date = new Date()
      date.setMonth(date.getMonth() - 2) // Mock joined 2 months ago
      setJoinDate(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )

      setIsLoading(false)
    } else {
      setIsLoggedIn(false)
      setIsLoading(false)
      toast({
        title: "Authentication required",
        description: "Please login to view your profile",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [router, toast])

  if (!isLoggedIn && !isLoading) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">View and manage your account information</p>
          </div>

          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <Avatar className="mx-auto h-24 w-24">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback className="text-2xl">{userEmail.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4">{userEmail.split("@")[0]}</CardTitle>
                    <CardDescription>LaptopRent Member</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-sm">{userEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-sm">Joined on {joinDate}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Your personal account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                      <span className="text-sm font-medium">Email:</span>
                      <span>{userEmail}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                      <span className="text-sm font-medium">Username:</span>
                      <span>{userEmail.split("@")[0]}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                      <span className="text-sm font-medium">Member since:</span>
                      <span>{joinDate}</span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                        Active
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rental Statistics</CardTitle>
                    <CardDescription>Your rental activity summary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border p-3">
                        <div className="text-sm text-muted-foreground">Total Rentals</div>
                        <div className="text-2xl font-bold">3</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-sm text-muted-foreground">Active Rentals</div>
                        <div className="text-2xl font-bold">2</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-sm text-muted-foreground">Completed</div>
                        <div className="text-2xl font-bold">1</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => router.push("/rentals")}>
                      View Rental History
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

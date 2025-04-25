"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Laptop, Shield, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import LaptopModel from "./LaptopModel"

/**
 * HeroSection component
 *
 * This component displays the hero section on the home page with a call-to-action button.
 * It handles the "Get Started" action based on user authentication status.
 */
interface HeroSectionProps {
  onGetStarted?: () => void
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  // Handle the "Get Started" button click
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted()
      return
    }

    if (isLoggedIn) {
      // If logged in, redirect to create rental page
      router.push("/create-rental")
    } else {
      // If not logged in, redirect to login page with redirect parameter
      router.push("/login?redirect=/create-rental")
    }
  }

  return (
    <section className="relative overflow-hidden bg-background px-5 pt-[75px] pb-[40px] sm:px-10 sm:pt-[51px] sm:pb-8 lg:px-20 lg:pt-[85px] lg:pb-[50px] flex items-start min-h-[500px]">
      <div className="container mt-2">
        <div className="grid items-start gap-4 lg:grid-cols-[1fr_400px] lg:gap-8 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-start mt-6 space-y-3 pt-5">
            <div className="space-y-1">
              <motion.h1
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Premium Laptops <span className="text-primary">On Demand</span>
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Rent high-performance laptops for work, gaming, or creative projects. No long-term commitments, just the
                tech you need when you need it.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button onClick={handleGetStarted} size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push("/laptops")}>
                Browse Laptops
              </Button>
            </motion.div>

            <motion.div
              className="mt-4 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <Laptop className="h-5 w-5 text-primary" />
                <span className="text-sm">Premium Devices</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm">Flexible Rental Periods</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center justify-center w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-[700px] h-[700px] ml-2 sm:ml-4 lg:ml-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl" />
              <div className="relative z-10 h-full w-full flex items-center justify-center">
                <LaptopModel />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

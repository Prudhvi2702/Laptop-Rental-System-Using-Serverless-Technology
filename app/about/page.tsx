"use client"

import { motion } from "framer-motion"
import { Laptop, GraduationCap, School, User, Code } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About LaptopRent</h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Premium laptop rental service for professionals, gamers, and creatives
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 p-6">
                  <div className="flex h-full flex-col items-center justify-center">
                    <Laptop className="h-16 w-16 text-primary" />
                    <h2 className="mt-4 text-2xl font-bold">Our Mission</h2>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">
                    At LaptopRent, we believe that everyone should have access to high-quality technology without the
                    burden of ownership. Our mission is to provide premium laptop rentals with exceptional service,
                    making technology accessible to all.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Developer Information</CardTitle>
                  <CardDescription>The mind behind LaptopRent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg" alt="Developer" />
                      <AvatarFallback>PD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">Prudhvi Raj Devisetti</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Full Stack Developer</Badge>
                        <Badge variant="outline">UI/UX Designer</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <School className="h-5 w-5 text-primary" />
                      <span>KL University</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span>Computer Science</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <span>ID: 2200080004</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      <span>React, Next.js, AWS</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>About the Project</CardTitle>
                <CardDescription>LaptopRent - Premium Laptop Rental Service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  LaptopRent is a modern web application built with React and Next.js that allows users to rent
                  high-quality laptops for various purposes. The application provides a seamless experience for browsing
                  available laptops, creating rental agreements, and managing payments.
                </p>
                <p>
                  The backend is powered by AWS services, including API Gateway, Lambda functions, Cognito for
                  authentication, and DynamoDB for data storage. This serverless architecture ensures scalability,
                  reliability, and security.
                </p>
                <p>
                  The frontend is built with modern technologies such as React, Next.js, Tailwind CSS, and Framer Motion
                  for animations. The UI is designed to be responsive, accessible, and user-friendly.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border p-4 text-center">
                    <h3 className="font-semibold">Frontend</h3>
                    <p className="text-sm text-muted-foreground">React, Next.js, Tailwind CSS</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <h3 className="font-semibold">Backend</h3>
                    <p className="text-sm text-muted-foreground">AWS Lambda, API Gateway, DynamoDB</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <h3 className="font-semibold">Authentication</h3>
                    <p className="text-sm text-muted-foreground">AWS Cognito</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

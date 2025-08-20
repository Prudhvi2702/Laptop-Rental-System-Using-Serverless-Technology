"use client"

import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-gray dark:prose-invert max-w-none"
          >
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using LaptopRent, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h2>2. Rental Services</h2>
            <p>We provide laptop rental services for business and personal use. All rentals are subject to availability and our rental policies.</p>

            <h2>3. Payment Terms</h2>
            <p>All payments are processed securely through Razorpay. Payment is required in advance for all rentals.</p>

            <h2>4. Rental Duration</h2>
            <p>Rental periods are calculated from the date of pickup/delivery to the date of return. Early returns may be subject to our refund policy.</p>

            <h2>5. Equipment Care</h2>
            <p>Renters are responsible for the care and maintenance of rented equipment. Any damage beyond normal wear and tear may result in additional charges.</p>

            <h2>6. Return Policy</h2>
            <p>Equipment must be returned in the same condition as received. Late returns may incur additional charges.</p>

            <h2>7. Liability</h2>
            <p>LaptopRent is not liable for any data loss or damage to personal files during the rental period.</p>

            <h2>8. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of updated terms.</p>

            <h2>9. Contact Information</h2>
            <p>For questions about these terms, please contact our support team.</p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function RefundPage() {
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
              <RotateCcw className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Refund Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-gray dark:prose-invert max-w-none"
          >
            <h2>1. Refund Eligibility</h2>
            <p>Refunds are available for rentals that are cancelled before the scheduled pickup/delivery date, subject to our cancellation policy.</p>

            <h2>2. Cancellation Policy</h2>
            <p>Rentals can be cancelled up to 24 hours before the scheduled start time for a full refund. Cancellations within 24 hours may incur a 50% cancellation fee.</p>

            <h2>3. Early Returns</h2>
            <p>Early returns are subject to our early return policy. Partial refunds may be available for unused rental days.</p>

            <h2>4. Refund Processing</h2>
            <p>Refunds are processed through the original payment method within 5-7 business days. Processing times may vary depending on your bank or payment provider.</p>

            <h2>5. Non-Refundable Items</h2>
            <p>Processing fees, delivery charges, and insurance fees are non-refundable once the rental has commenced.</p>

            <h2>6. Equipment Issues</h2>
            <p>If equipment is found to be defective upon pickup, we will provide a replacement or full refund. Please report any issues immediately.</p>

            <h2>7. Damage Charges</h2>
            <p>Damage beyond normal wear and tear may result in additional charges. These charges are not eligible for refund.</p>

            <h2>8. How to Request a Refund</h2>
            <p>Contact our support team to request a refund. Please provide your rental ID and reason for the refund request.</p>

            <h2>9. Refund Timeline</h2>
            <p>Refund requests are reviewed within 24 hours. Approved refunds are processed within 5-7 business days.</p>

            <h2>10. Contact Information</h2>
            <p>For refund requests or questions about our refund policy, please contact our support team.</p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

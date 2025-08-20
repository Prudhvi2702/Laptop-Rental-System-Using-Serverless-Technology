"use client"

import { motion } from "framer-motion"
import { HelpCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function FAQPage() {
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
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">Find answers to common questions about our laptop rental service</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-2">How does laptop rental work?</h3>
              <p className="text-muted-foreground">Simply browse our available laptops, select your rental period, and complete the payment. We'll deliver the laptop to your specified location.</p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">We accept all major credit cards, debit cards, and digital wallets through our secure Razorpay payment gateway.</p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-2">Can I cancel my rental?</h3>
              <p className="text-muted-foreground">Yes, you can cancel your rental up to 24 hours before the scheduled start time for a full refund. Cancellations within 24 hours may incur a cancellation fee.</p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-2">What happens if the laptop gets damaged?</h3>
              <p className="text-muted-foreground">Normal wear and tear is expected. For damage beyond normal use, additional charges may apply. We recommend our insurance coverage for peace of mind.</p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-2">Do you offer technical support?</h3>
              <p className="text-muted-foreground">Yes, we provide basic technical support for all rented laptops. For complex issues, we can arrange for a replacement device.</p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-2">How long does delivery take?</h3>
              <p className="text-muted-foreground">Standard delivery takes 24-48 hours. Express delivery options are available for same-day or next-day delivery at an additional cost.</p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-2">Can I extend my rental period?</h3>
              <p className="text-muted-foreground">Yes, you can extend your rental period subject to availability. Contact our support team to arrange an extension.</p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-2">What's included with the rental?</h3>
              <p className="text-muted-foreground">Each rental includes the laptop, charger, and basic accessories. Additional peripherals can be added to your rental for an extra fee.</p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-2">How do I return the laptop?</h3>
              <p className="text-muted-foreground">We offer pickup service for returns. Simply schedule a pickup time and our team will collect the laptop from your location.</p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground">All laptops are thoroughly cleaned and reset between rentals. However, we recommend backing up your data and not storing sensitive information on rental devices.</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

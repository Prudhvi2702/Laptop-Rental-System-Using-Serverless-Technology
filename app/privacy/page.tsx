"use client"

import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-gray dark:prose-invert max-w-none"
          >
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a rental, or contact us for support.</p>

            <h2>2. Personal Information</h2>
            <p>This may include your name, email address, phone number, and payment information processed securely through Razorpay.</p>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>

            <h2>4. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy.</p>

            <h2>5. Payment Security</h2>
            <p>All payment information is processed securely through Razorpay. We do not store your complete payment details on our servers.</p>

            <h2>6. Data Protection</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction.</p>

            <h2>7. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to enhance your experience and analyze how our services are used.</p>

            <h2>8. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>

            <h2>9. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

            <h2>10. Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact our support team.</p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

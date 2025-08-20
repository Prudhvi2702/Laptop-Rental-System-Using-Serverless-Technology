"use client"

import { motion } from "framer-motion"
import { Cpu, Shield, Clock, CreditCard, Truck, HeadphonesIcon } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Cpu className="h-10 w-10 text-primary" />,
      title: "High-Performance Devices",
      description: "Access to the latest laptops with powerful specs for any task.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Fully Insured",
      description: "All rentals come with comprehensive insurance coverage.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Flexible Rental Periods",
      description: "Rent for as little as a day or as long as you need.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Secure Payments",
      description: "Your payment information is always protected.",
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: "Fast Delivery",
      description: "Quick delivery to your location, with setup assistance.",
    },
    {
      icon: <HeadphonesIcon className="h-10 w-10 text-primary" />,
      title: "24/7 Support",
      description: "Technical support available whenever you need it.",
    },
  ]

  return (
    <section className="bg-muted py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose <span className="text-primary">LaptopRent</span>
          </motion.h2>
          <motion.p
            className="mt-4 text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We provide the best laptop rental experience with premium service
          </motion.p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

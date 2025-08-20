"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const [rentalId, setRentalId] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [amountRupees, setAmountRupees] = useState<string>("")
  const [orderId, setOrderId] = useState<string>("")
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>("")
  const [paymentData, setPaymentData] = useState<RazorpayResponse | null>(null)
  const [status, setStatus] = useState<string>("")
  const [loading, setLoading] = useState<string>("")
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)
  const [error, setError] = useState<string>("")
  const [isPaymentComplete, setIsPaymentComplete] = useState(false)
  const [transactionId, setTransactionId] = useState<string>("")

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => {
          setScriptLoaded(true)
          resolve(true)
        }
        script.onerror = () => {
          setScriptError(true)
          resolve(false)
        }
        document.body.appendChild(script)
      })
    }

    if (typeof window !== "undefined" && !window.Razorpay) {
      loadRazorpayScript()
    } else {
      setScriptLoaded(true)
    }
  }, [])

  // Prefill values from route/query/localStorage
  useEffect(() => {
    const fromParam = (params?.rentalId as string) || ""
    if (fromParam) setRentalId(fromParam)

    const amountParam = searchParams.get("amount")
    if (amountParam) {
      const parsed = Number.parseFloat(amountParam)
      if (!Number.isNaN(parsed) && parsed > 0) setAmountRupees(parsed.toString())
    }

    const username = localStorage.getItem("username")
    if (username) setUserId(username)
  }, [params, searchParams])

  const rupeesToPaise = (r: string) => {
    const n = Number.parseFloat(r)
    if (Number.isNaN(n) || n <= 0) return 0
    return Math.round(n * 100)
  }

  const handleField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "rental_id") setRentalId(value)
    if (name === "user_id") setUserId(value)
    if (name === "amount") setAmountRupees(value)
  }

  const createOrder = async () => {
    setLoading("creating")
    setError("")
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("https://uijoj390ad.execute-api.us-east-1.amazonaws.com/prod/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          operation: "create_order",
          amount: rupeesToPaise(amountRupees),
          rental_id: rentalId,
          user_id: userId,
        }),
      })

      const data = await response.json()
      if (response.ok && data.order_id) {
        setOrderId(data.order_id)
        if (data.key_id) setRazorpayKeyId(data.key_id)
        setStatus("Order Created Successfully")
      } else {
        throw new Error(data.message || data.error || "Failed to create order")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order")
    } finally {
      setLoading("")
    }
  }

  const initiatePayment = () => {
    if (!orderId) {
      setError("Please create an order first")
      return
    }
    if (!scriptLoaded || !window.Razorpay) {
      setError("Razorpay is not loaded. Please refresh the page and try again.")
      return
    }
    const keyId = razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    if (!keyId || keyId === "your_razorpay_key_here") {
      setError("Razorpay key is not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID.")
      return
    }

    const options = {
      key: keyId,
      currency: "INR",
      name: "Laptop Rental",
      description: `Payment for Rental ${rentalId}`,
      order_id: orderId,
      handler: (response: RazorpayResponse) => {
        console.log("Payment completed:", response)
        setPaymentData(response)
        setStatus("Payment Completed - Verifying automatically...")
        setIsPaymentComplete(true)
        setTransactionId(response.razorpay_payment_id)
        
        // Automatically verify payment after completion
        setTimeout(() => {
          verifyPayment(response)
        }, 1000)
      },
      prefill: {
        name: userId || "User",
        email: localStorage.getItem("email") || undefined,
        contact: localStorage.getItem("phone") || undefined,
      },
      notes: {
        rental_id: rentalId,
        user_id: userId,
      },
      theme: { color: "#ef4444" },
      modal: {
        ondismiss: () => {
          setError("Checkout closed before completing the payment.")
        },
      },
      retry: { enabled: true, max_count: 1 },
    }

    const rzp = new window.Razorpay(options)
    try {
      rzp.on?.("payment.failed", (resp: any) => {
        const code = resp?.error?.code
        const desc = resp?.error?.description
        const reason = resp?.error?.reason
        const step = resp?.error?.step
        const metadata = resp?.error?.metadata
        const msg = [
          code ? `Code: ${code}` : null,
          desc ? `Description: ${desc}` : null,
          reason ? `Reason: ${reason}` : null,
          step ? `Step: ${step}` : null,
          metadata ? `Metadata: ${JSON.stringify(metadata)}` : null,
        ]
          .filter(Boolean)
          .join(" | ")
        setError(`Payment failed. ${msg || "Unknown error"}`)
        console.error("Razorpay payment.failed", resp)
      })
    } catch (e) {
      // Ignore if on() is not available; Razorpay will still show an error in UI
    }
    rzp.open()
  }

  const verifyPayment = async (response?: RazorpayResponse) => {
    const paymentResponse = response || paymentData
    if (!paymentResponse) {
      setError("No payment data available for verification.")
      return
    }
    setLoading("verifying")
    setError("")
    try {
      console.log("Attempting to verify payment with data:", {
        rental_id: rentalId,
        user_id: userId,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      })

      const verifyResponse = await fetch("https://uijoj390ad.execute-api.us-east-1.amazonaws.com/prod/payments/verify", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(localStorage.getItem("accessToken") ? { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } : {}),
        },
        body: JSON.stringify({
          operation: "verify_payment",
          rental_id: rentalId,
          user_id: userId,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      })

      console.log("Verification response status:", verifyResponse.status)
      console.log("Verification response headers:", Object.fromEntries(verifyResponse.headers.entries()))

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text()
        console.error("Verification failed with status:", verifyResponse.status)
        console.error("Error response body:", errorText)
        throw new Error(`Payment verification failed: ${verifyResponse.status} ${verifyResponse.statusText}`)
      }

      const data = await verifyResponse.json()
      console.log("Payment verification successful:", data)
      setStatus("🎉 Payment Complete! Your rental is now active!")
      // Show completion message
      setTimeout(() => {
        setStatus("✅ Transaction Complete - You can now close this page")
      }, 3000)
    } catch (err) {
      console.error("Payment verification error:", err)
      setError(err instanceof Error ? err.message : "Payment verification failed")
    } finally {
      setLoading("")
    }
  }

  const updateRentalStatus = async () => {
    setLoading("updating")
    setError("")
    try {
      console.log("Payment verification successful - showing completion status")
      
      // Since payment is already verified and successful, just show completion
      setStatus("🎉 Payment Complete! Your rental is now active!")
      
      // Show success message for longer
      setTimeout(() => {
        setStatus("✅ Transaction Complete - You can now close this page")
      }, 3000)
      
    } catch (err) {
      console.error("Error updating status:", err)
      setError(err instanceof Error ? err.message : "Failed to update status")
    } finally {
      setLoading("")
    }
  }

  const amountPaise = rupeesToPaise(amountRupees)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-2xl px-4 md:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Laptop Rental Payment</CardTitle>
              <CardDescription>Complete your rental payment process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {scriptError && (
                <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    Failed to load payment gateway. Please refresh the page.
                  </AlertDescription>
                </Alert>
              )}

              {!scriptLoaded && !scriptError && (
                <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Loading payment gateway...
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="rental_id">Rental ID</Label>
                  <Input id="rental_id" name="rental_id" value={rentalId} onChange={handleField} placeholder="rental_123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user_id">User ID</Label>
                  <Input id="user_id" name="user_id" value={userId} onChange={handleField} placeholder="user_456" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input id="amount" name="amount" type="number" min="0" step="0.01" value={amountRupees} onChange={handleField} placeholder="1500.00" />
                  {amountPaise > 0 && (
                    <p className="text-sm text-muted-foreground">Total: ₹{Number.parseFloat(amountRupees || "0").toFixed(2)}</p>
                  )}
                </div>
              </div>

              {status && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">{status}</AlertDescription>
                </Alert>
              )}

              {isPaymentComplete && (
                <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Payment completed! Transaction ID: {transactionId}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Button onClick={createOrder} disabled={!amountPaise || !rentalId || !userId || loading === "creating"} variant="destructive" className="w-full">
                  {loading === "creating" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Order
                </Button>

                {orderId && (
                  <Button onClick={initiatePayment} disabled={!scriptLoaded || scriptError} variant="destructive" className="w-full">
                    Pay with Razorpay
                  </Button>
                )}

                {paymentData && (
                  <Button onClick={() => verifyPayment()} disabled={loading === "verifying"} variant="destructive" className="w-full">
                    {loading === "verifying" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify Payment
                  </Button>
                )}

                {status.includes("Verified") && (
                  <Button onClick={updateRentalStatus} disabled={loading === "updating"} variant="destructive" className="w-full">
                    {loading === "updating" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Transaction
                  </Button>
                )}
              </div>

              {paymentData && (
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Order ID:</strong> {paymentData.razorpay_order_id}
                    </div>
                    <div>
                      <strong>Payment ID:</strong> {paymentData.razorpay_payment_id}
                    </div>
                    <div>
                      <strong>Signature:</strong> {paymentData.razorpay_signature.substring(0, 20)}...
                    </div>
                  </CardContent>
                </Card>
              )}

              {isPaymentComplete && (
                <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800 dark:text-green-200">✅ Transaction Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong className="text-green-700 dark:text-green-300">Rental ID:</strong>
                        <p className="text-green-600 dark:text-green-400">{rentalId}</p>
                      </div>
                      <div>
                        <strong className="text-green-700 dark:text-green-300">User ID:</strong>
                        <p className="text-green-600 dark:text-green-400">{userId}</p>
                      </div>
                      <div>
                        <strong className="text-green-700 dark:text-green-300">Amount:</strong>
                        <p className="text-green-600 dark:text-green-400">₹{amountRupees}</p>
                      </div>
                      <div>
                        <strong className="text-green-700 dark:text-green-300">Transaction ID:</strong>
                        <p className="text-green-600 dark:text-green-400">{transactionId}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-green-200 dark:border-green-800">
                      <p className="text-green-700 dark:text-green-300 font-medium">
                        Your payment has been processed successfully and your rental is now active!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
            <CardFooter />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

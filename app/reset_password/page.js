'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const uid = params.get('uid')
  const token = params.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)  // Track submission state
  const [showPassword, setShowPassword] = useState(false)  // Track password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // Confirm password visibility

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match!")
      return
    }

    setIsSubmitting(true)  // Start submitting

    const formData = new FormData()
    formData.append('uid', uid)
    formData.append('token', token)
    formData.append('new_password', newPassword)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/update-password/`, {
      method: 'POST',
      body: formData,
    })

    const result = await res.text()
    setMessage(result)

    if (res.ok) {
      // Redirect to login page after successful password reset
      setTimeout(() => {
        window.location.href = '/login'  // Use window.location.href for redirection
      }, 2000) // Wait for 2 seconds before redirecting
    } else {
      setIsSubmitting(false)  // Stop submitting if an error occurs
    }
  }

  if (!uid || !token) return <p className="text-center text-red-600">Invalid link</p>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 text-black">
      <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
              <span
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${showPassword ? 'text-blue-500' : 'text-black'}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ fontSize: '1.5rem' }}
              >
                👁
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
              <span
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${showConfirmPassword ? 'text-blue-500' : 'text-black'}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ fontSize: '1.5rem' }}
              >
                👁
              </span>
            </div>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className={`w-full p-3 rounded-lg transition duration-200 ${isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              disabled={isSubmitting}
            >
              Reset Password
            </button>
          </div>
          
          {message && <p className="text-center text-red-600">{message}</p>}
        </form>
      </div>
    </div>
  )
}

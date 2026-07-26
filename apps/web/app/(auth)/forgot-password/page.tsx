'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import '~/components/auth/auth.css'
import { Logo } from '~/components/ui/Logo'

import {
  useForgotPasswordRequest,
  useForgotPasswordVerify,
  useResetPassword
} from '~/hooks/api/auth'

type Step = 'email' | 'otp' | 'password'

export default function ForgotPasswordPage() {
  const router = useRouter()
  
  const { forgotPasswordRequestAsync } = useForgotPasswordRequest()
  const { forgotPasswordVerifyAsync } = useForgotPasswordVerify()
  const { resetPasswordAsync } = useResetPassword()
  
  const [step, setStep] = useState<Step>('email')
  const [userId, setUserId] = useState<string>('')
  
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showPassword, setShowPassword] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })

    if (formRef.current) {
      gsap.from(formRef.current.children, {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      })
    }
  }, [step]) // Re-run animation when step changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email.includes('@')) {
      setErrors({ email: 'Please enter a valid email address.' })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await forgotPasswordRequestAsync({ email: formData.email })
      setUserId(res.id)
      setStep('otp')
      setErrors({})
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to request password reset.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit OTP.' })
      return
    }

    setIsSubmitting(true)
    try {
      await forgotPasswordVerifyAsync({ userId, otp: formData.otp })
      setStep('password')
      setErrors({})
    } catch (err: any) {
      setErrors({ form: err?.message || 'Invalid or expired OTP.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters long.' })
      return
    }

    setIsSubmitting(true)
    try {
      await resetPasswordAsync({ userId, otp: formData.otp, newPassword: formData.password })
      
      gsap.to(cardRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          router.push('/login')
        }
      })
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to reset password.' })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-stars" aria-hidden="true" />
      <div className="auth-noise" aria-hidden="true" />

      <nav className="auth-topbar">
        <div className="auth-topbar-logo">
          <Logo iconSize={36} textSize={20} />
        </div>
        <div className="auth-topbar-right">
          <span className="auth-topbar-hint">Remember your password?</span>
          <Link href="/login" className="auth-topbar-btn">Log in</Link>
        </div>
      </nav>

      <main className="auth-main">
        <div className="auth-content-wrapper">
          <div className="auth-card" ref={cardRef}>
            
            {step === 'email' && (
              <>
                <div className="card-header">
                  <h1 className="card-heading">Forgot Password</h1>
                  <p className="card-subtext">Enter your email address to receive a verification code.</p>
                </div>
                <form ref={formRef} onSubmit={handleEmailSubmit} noValidate>
                  <div className="field-group">
                    <label className="field-label" htmlFor="email">Email address</label>
                    <div className="field-input-wrap">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`field-input ${errors.email ? 'error' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="field-error">{errors.email}</p>}
                  </div>

                  {errors.form && <p className="field-error" style={{ marginBottom: '10px' }}>{errors.form}</p>}

                  <button type="submit" className={`submit-btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                    <span className="btn-text">Send Code</span>
                  </button>
                </form>
              </>
            )}

            {step === 'otp' && (
              <>
                <div className="card-header">
                  <h1 className="card-heading">Check your email</h1>
                  <p className="card-subtext">We sent a 6-digit code to {formData.email}.</p>
                </div>
                <form ref={formRef} onSubmit={handleOtpSubmit} noValidate>
                  <div className="field-group">
                    <label className="field-label" htmlFor="otp">Verification Code</label>
                    <div className="field-input-wrap">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        maxLength={6}
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="123456"
                        className={`field-input ${errors.otp ? 'error' : ''}`}
                        style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }}
                      />
                    </div>
                    {errors.otp && <p className="field-error">{errors.otp}</p>}
                  </div>

                  {errors.form && <p className="field-error" style={{ marginBottom: '10px' }}>{errors.form}</p>}

                  <button type="submit" className={`submit-btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                    <span className="btn-text">Verify Code</span>
                  </button>
                </form>
              </>
            )}

            {step === 'password' && (
              <>
                <div className="card-header">
                  <h1 className="card-heading">Set new password</h1>
                  <p className="card-subtext">Please choose a strong password.</p>
                </div>
                <form ref={formRef} onSubmit={handlePasswordSubmit} noValidate>
                  <div className="field-group">
                    <label className="field-label" htmlFor="password">New Password</label>
                    <div className="field-input-wrap">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        className={`field-input ${errors.password ? 'error' : ''}`}
                        style={{ paddingRight: '44px' }}
                      />
                      <button
                        type="button"
                        className="eye-toggle"
                        onClick={() => setShowPassword(p => !p)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="field-error">{errors.password}</p>}
                  </div>

                  {errors.form && <p className="field-error" style={{ marginBottom: '10px' }}>{errors.form}</p>}

                  <button type="submit" className={`submit-btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                    <span className="btn-text">Reset Password</span>
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useSignup } from '~/hooks/api/auth'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import '~/components/auth/auth.css'

export default function SignUpPage() {
  const { createUserWithEmailAndPasswordAsync } = useSignup()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}
    if (formData.fullName.length < 2) newErrors.fullName = 'Name must be at least 2 characters.'
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email address.'
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.'
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createUserWithEmailAndPasswordAsync({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      } as any)

      gsap.to(cardRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          window.location.href = `/verify-email?userId=${result?.id || ''}`
        }
      })
    } catch (err: any) {
      setErrors({ form: err?.message || 'An error occurred during sign up.' })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-stars" aria-hidden="true" />
      <div className="auth-noise" aria-hidden="true" />

      <nav className="auth-topbar">
        <div className="auth-topbar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>Kotonoha</span>
        </div>
        <div className="auth-topbar-right">
          <span className="auth-topbar-hint">Already have an account?</span>
          <Link href="/login" className="auth-topbar-btn">Log in</Link>
        </div>
      </nav>

      <main className="auth-main">
        <div className="auth-content-wrapper">
          <div className="auth-card" ref={cardRef}>
            <div className="card-header">
              <h1 className="card-heading">Create your account</h1>
              <p className="card-subtext">Start building meaningful forms today.</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label className="field-label" htmlFor="fullName">Full name</label>
                <div className="field-input-wrap">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`field-input ${errors.fullName ? 'error' : ''}`}
                  />
                </div>
                {errors.fullName && <p className="field-error">{errors.fullName}</p>}
              </div>

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

              <div className="field-group">
                <label className="field-label" htmlFor="password">Password</label>
                <div className="field-input-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
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

              <div className="field-group">
                <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
                <div className="field-input-wrap">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`field-input ${errors.confirmPassword ? 'error' : ''}`}
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowConfirmPassword(p => !p)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
              </div>

              {errors.form && <p className="field-error" style={{ marginBottom: '10px' }}>{errors.form}</p>}

              <button
                type="submit"
                className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                <span className="btn-text">Create account</span>
              </button>

              <div className="card-footer">
                Already have an account? <Link href="/login">Sign in</Link>
              </div>
            </form>
          </div>
          <div className="auth-terms">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </main>
    </div>
  )
}

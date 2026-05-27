'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Lock } from 'lucide-react'
import { useVerifyOTP, useResendOTP } from '~/hooks/api/auth'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import '~/components/auth/auth.css'

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') || ''

  const { verifyOtpAsync } = useVerifyOTP()
  const { resendOtpAsync } = useResendOTP()

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const [seconds, setSeconds] = useState(59)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const otpRowRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    
    if (otpRowRef.current) {
      gsap.from(otpRowRef.current.children, {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.2
      })
    }
  }, [])

  useEffect(() => {
    if (seconds <= 0) { 
      setCanResend(true)
      return 
    }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/, '')
    const next = [...digits]
    next[index] = val
    setDigits(next)
    setErrorMsg('')
    if (val && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...digits]
    pasted.split('').forEach((char, i) => { next[i] = char })
    setDigits(next)
    setErrorMsg('')
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    const otp = digits.join('')
    if (otp.length < 6) {
      setErrorMsg('Please enter all 6 digits.')
      return
    }

    if (!userId) {
      setErrorMsg('User ID is missing. Please sign up again.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      await verifyOtpAsync({ userId, otp })
      setSuccess(true)
      
      setTimeout(() => {
        gsap.to(cardRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            router.push('/login')
          }
        })
      }, 600)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err?.message || 'Invalid code.')
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!canResend || !userId) return
    setIsResending(true)
    try {
      await resendOtpAsync({ userId })
      setSeconds(59)
      setCanResend(false)
      setErrorMsg('')
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err?.message || 'Failed to resend code.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="auth-card" ref={cardRef}>
      <div className="card-header" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          {success ? <CheckCircle2 size={24} color="var(--success)" /> : <Lock size={24} color="var(--red)" />}
        </div>
        <h1 className="card-heading">Check your email</h1>
        <p className="card-subtext">
          We sent a 6-digit code to you.<br />
          Enter it below to verify your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="otp-row" ref={otpRowRef}>
          {[0,1,2,3,4,5].map(i => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digits[i]}
              onChange={e => handleChange(e, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className={`otp-digit ${digits[i] ? 'filled' : ''} ${errorMsg ? 'error' : ''} ${success ? 'success' : ''}`}
            />
          ))}
        </div>

        {errorMsg && <p className="field-error" style={{ textAlign: 'center', marginBottom: '16px' }}>{errorMsg}</p>}

        <button
          type="submit"
          className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting || success}
          style={success ? { background: 'var(--success)' } : {}}
        >
          <span className="btn-text">{success ? 'Verified!' : 'Verify code'}</span>
        </button>

        <div className="resend-row">
          <span style={{ marginRight: '6px' }}>Didn't receive the code?</span>
          {canResend ? (
            <button 
              type="button" 
              onClick={handleResend} 
              className={`resend-link ${isResending ? 'disabled' : ''}`}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              {isResending ? 'Sending...' : 'Resend'}
            </button>
          ) : (
            <span className="resend-countdown">Resend in 0:{seconds.toString().padStart(2, '0')}</span>
          )}
        </div>

        <div className="card-footer" style={{ marginTop: '32px' }}>
          <Link href="/sign-up">← Back to sign up</Link>
        </div>
      </form>
    </div>
  )
}

export default function VerifyOTPPage() {
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
      </nav>

      <main className="auth-main">
        <div className="auth-content-wrapper">
          <Suspense fallback={<div className="auth-card"><div className="card-header"><h1 className="card-heading" style={{textAlign: 'center'}}>Loading...</h1></div></div>}>
            <VerifyOTPContent />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

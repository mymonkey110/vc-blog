'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full py-6 text-center text-sm font-ui text-secondary-text border-t border-border">
      <div className="max-w-4xl mx-auto px-4">
        <p className="mb-2">
          Copyright © 2014 - {currentYear} ♥ Michael Jiang
        </p>
        <p>
          Powered by Next.js & Vercel
        </p>
      </div>
    </footer>
  )
}
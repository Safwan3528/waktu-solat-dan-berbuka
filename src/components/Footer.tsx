'use client'

export default function Footer() {
  return (
    <footer className="text-center py-6 text-blue-100/80 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          Developed by{' '}
          <a 
            href="https://github.com/safwan3528" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium hover:text-white transition-colors"
          >
            Safwan Rahimi
          </a>
        </p>
      </div>
    </footer>
  )
} 
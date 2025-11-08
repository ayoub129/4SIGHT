"use client"

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/10 py-16 px-4 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-12">
          {/* Left side - Branding */}
          <div>
            <h3 className="text-3xl font-black tracking-tight mb-4">4SIGHT</h3>
            <p className="text-muted-foreground font-light text-base leading-relaxed">
              A cinematic journey by Ace Strider exploring the boundaries between perception and reality. Where every
              frame holds a secret.
            </p>
          </div>

          {/* Middle - Key info */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold tracking-widest mb-2 uppercase opacity-75">Author</h4>
              <p className="text-lg font-light">Ace D. Strider</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-widest mb-2 uppercase opacity-75">Format</h4>
              <p className="text-lg font-light">Ebook or Paper Book</p>
            </div>
          </div>

          {/* Right side - Follow Us */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest mb-4 uppercase opacity-75">Follow Us</h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/omarmhammouda"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg font-light hover:text-red-600 transition-colors cursor-pointer"
              >
                @omarmhammouda
              </a>
              <a
                href="https://instagram.com/fore4sight"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg font-light hover:text-red-600 transition-colors cursor-pointer"
              >
                @fore4sight
              </a>
              <a
                href="https://instagram.com/ace.d.strider"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg font-light hover:text-red-600 transition-colors cursor-pointer"
              >
                @ace.d.strider
              </a>
            </div>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="border-t border-foreground/10 pt-8">
          <p className="text-center text-xs text-muted-foreground font-light tracking-widest">
            © 2025 ACE STRIDER. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}

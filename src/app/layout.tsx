// src/app/layout.tsx
import './globals.css';

export default function BaseLayout({ children }: { children: React.ReactNode}) {

    return (

        <html lang="en">
            <body>
                <header className="p-6 border-b border-petal">
                    This is the main site header {/* Site Header Component Goes Here */}
                </header>
                <main>
                    {children} {/* Where the Current Page Will Go */}
                </main>
            </body>
        </html>

    )

}
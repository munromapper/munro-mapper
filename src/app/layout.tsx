// src/app/layout.tsx
import './globals.css';

export default function BaseLayout({ children }: { children: React.ReactNode}) {

    return (

        <html lang="en">
            <body>
                <header className="p-6 border-b border-petal">
                    This is the main site header
                </header>
                <main>
                    {children}
                </main>
            </body>
        </html>

    )

}
// src/components/Header.tsx

export function Header() {
  return (
    <header className="p-6 border-b text-slate border-petal flex items-center justify-between" role="banner" aria-label="Site Header">
      <div className="text-xxxl">
        Munro Mapper
      </div>
      {/* Future: Add navigation or user menu here */}
    </header>
  );
}
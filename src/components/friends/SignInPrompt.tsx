// src/components/friends/SignInPrompt.tsx
// This component contains some simple content promting the user to sign in to add and manage friends

export default function SignInPrompt() {
  return (
    <div className="absolute inset-0 p-6">
      <div className="h-full flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="font-heading-font-family text-4xl">Please log in</p>
        <p className="text-l text-moss">You need to be logged in to a valid account to view and manage your friends.</p>
      </div>
    </div>
  );
}
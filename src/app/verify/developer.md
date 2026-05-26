How It Works

Receives searchParams as a Promise (new Next.js App Router behavior in v15+).
Awaits the promise to safely access search parameters.
Defaults phone to an empty string if not present.
Renders the VerifyForm client component with the initial phone value.   
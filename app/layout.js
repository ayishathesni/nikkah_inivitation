import './globals.css';

export const metadata = {
  title: 'Nikkah Invitation — Ayisha Thesni & Jasel Fasil',
  description: 'We joyfully invite you to our Nikkah ceremony.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Great+Vibes&family=Lato:wght@300;400&display=swap" rel="stylesheet" />

        {/* Tabler icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

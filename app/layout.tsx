export const metadata = {
  title: "Agentic Outreach",
  description: "Automated lead outreach with email + voice follow-up"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, Arial, sans-serif', color: '#0f172a', background: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}

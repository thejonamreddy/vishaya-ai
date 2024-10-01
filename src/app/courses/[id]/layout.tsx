export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Course Details</h1>
      {children}
    </div>
  );
}
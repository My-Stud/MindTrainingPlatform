export const metadata = {
  title: "GAG Admin Hub - Mind Training Portal",
  description: "MySQL Game & Question Bank Management Console",
};

export default function AdminLayout({ children }) {
  return (
    <div className="w-full min-h-screen bg-[#141211] text-slate-100 flex flex-col">
      {children}
    </div>
  );
}

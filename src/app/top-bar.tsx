import { ModeToggle } from "@/components/theme-toggle";

export function TopBar() {
  return (
    <div className="dark:bg-gray-800 bg-zinc-100 p-4 flex justify-between">
      <h1 className="text-xl font-bold">Financial Viewer</h1>
      <ModeToggle />
    </div>
  );
}

import { TopBar } from "./top-bar";
import SetupDataTable from "./financial-table/setup-table";

export default function Home() {
  return (
    <>
      <TopBar />

      <div className="max-w-screen-xl mx-auto p-4">
        <SetupDataTable />
      </div>
    </>
  );
}

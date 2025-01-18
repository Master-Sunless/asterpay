import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your decentralized subscription dashboard
          </p>
        </main>
      </div>
    </div>
  );
};

export default Index;
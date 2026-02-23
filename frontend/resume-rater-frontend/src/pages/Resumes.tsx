import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import ResumesTable from "../components/ResumesTable";



const Resumes = () => {
    const { user } = useUser();

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden main-gradient font-display">
            <Navbar user={user} />
            <main className="flex-1 px-6 lg:px-20 py-10">
              <div className="mx-auto max-w-7xl flex flex-col gap-6">
                <ResumesTable isHome={false} />
              </div>
            </main>
        </div>
    );

}

export default Resumes;
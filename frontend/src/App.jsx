import {Show, SignInButton, SignOutButton, useAuth} from '@clerk/react';
// import {useQuery} from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import ProductPage from './pages/ProductPage';
import EditProductPage from './pages/EditProductPage';
import CreatePage from './pages/CreatePage';
import HomePage from './pages/HomePage';
import ProfilePage from "./pages/ProfilePage";
import {Routes, Route, Navigate} from 'react-router';
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";

export default function App(){
  const {isClerkLoaded, isSignedIn} = useAuthReq();
  useUserSync()
// const {data, isError, isLoading, refetch} = useQuery({queryKey: ['myData'], queryFn: () => fetchData()});


  if(!isClerkLoaded) return null;
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={isSignedIn?<ProfilePage />:<Navigate to={"/"} />} />
          <Route path="/create" element={isSignedIn?<CreatePage />: <Navigate to={"/"} /> } />
          <Route path="/edit/:id" element={isSignedIn? <EditProductPage />: <Navigate to="/" />} />

        </Routes>
      </main>
    </div>


    // <div className="">
    //   <h1 className="text-red-500">HELLO WORLD</h1>
    //   <button className="btn btn-primary">Click me</button>
    //   <SignedOut>
    //     <SignInButton mode="modal"/>
    //   </SignedOut>
    //   <SignedOut>
    //     <SignoutButton />
    //   </SignedOut>
    // </div>
  )
};
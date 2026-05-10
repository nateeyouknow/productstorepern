import {Show, SignInButton, SignOutButton, useAuth} from '@clerk/react';
// import {useQuery} from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import ProductPage from './pages/ProductPage';
import EditProductPage from './pages/EditProductPage';
import CreatePage from './pages/CreatePage';
import HomePage from './pages/HomePage';
import ProfilePage from "./pages/ProfilePage";
import {Routes, Route} from 'react-router';

export default function App(){
// const {data, isError, isLoading, refetch} = useQuery({queryKey: ['myData'], queryFn: () => fetchData()});

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditProductPage />} />
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
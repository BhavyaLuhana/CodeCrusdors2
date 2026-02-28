import { Routes, Route } from "react-router-dom";
import { SignIn, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Home />
    </>
  );
}

export default App;
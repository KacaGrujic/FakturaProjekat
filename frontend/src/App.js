import "./App.css";
import MenuBar from "./Components/MenuBar";
import KupacPage from "./Components/KupacPage";
import AddKupac from "./Components/AddKupac";
import EditKupac from "./Components/EditKupac";
import FakturaPage from "./Components/FakturaPage";
import AddFaktura from "./Components/AddFaktura";
import EditFaktura from "./Components/EditFaktura";
import ZaposleniPage from "./Components/ZaposleniPage";
import AddZaposleni from "./Components/AddZaposleni";
import EditZaposleni from "./Components/EditZaposleni";


import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter className="App">
      <Routes>
        <Route
          path="/faktura"
          element={
            <>
              {/* <MenuBar isHome={0} isShop={1} /> */}
              {<FakturaPage />}
            </>
          }
        />
        <Route path="/kupac" element={<KupacPage />} />
        <Route path="/kupac/add" element={<AddKupac />} />
        <Route path="/kupac/edit/:id" element={<EditKupac />} />

        <Route path="/zaposleni" element={<ZaposleniPage />} />
        <Route path="/zaposleni/add" element={<AddZaposleni />} />
        <Route path="/zaposleni/edit/:id" element={<EditZaposleni />} />

        <Route path="/faktura/add" element={<AddFaktura />} />
        <Route path="/faktura/edit/:fakturaId" element={<EditFaktura />} />






        <Route path="/" element={<MenuBar isHome={1} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

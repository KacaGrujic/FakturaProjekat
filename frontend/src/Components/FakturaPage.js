import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FakturaPage.css";
import { jsPDF } from "jspdf";

function fetchFakturaData() {
  return fetch("http://127.0.0.1:8000/api/faktura") 
    .then((response) => response.json())
    .catch((error) => {
      console.error("Greska ", error);
    });
}

function fetchStavkeFaktureData(fakturaId) {
  return fetch(`http://127.0.0.1:8000/api/faktura/${fakturaId}/stavkefakture`) 
    .then((response) => response.json())
    .catch((error) => {
      console.error("Greska ", error);
    });
}

function calculateIznos(fakturaData) {
  if (!Array.isArray(fakturaData)) {
    return [];
  }

  return fakturaData.map((faktura) => {
    const updatedStavkeFakture = faktura.stavke.map((stavka) => {
      const kolicina = stavka.kolicina;
      const cena = parseFloat(stavka.proizvod.cena);
      const iznos = (kolicina * cena).toFixed(2);
      return { ...stavka, iznos };
    });

    const totalIznos = updatedStavkeFakture.reduce(
      (total, stavka) => total + parseFloat(stavka.iznos),
      0
    ).toFixed(2);

    return { ...faktura, stavke: updatedStavkeFakture, total: totalIznos };
  });
}

function FakturaPage() {
  const [fakturaData, setFakturaData] = useState([]);
  const [selectedFakturaId, setSelectedFakturaId] = useState(null);
  const [stavkeFaktureData, setStavkeFaktureData] = useState([]);
  const [showStavkeFakture, setShowStavkeFakture] = useState(false);

  useEffect(() => {
    fetchFakturaData().then((data) => {
      setFakturaData(data);
    });
  }, []);

  useEffect(() => {
    if (selectedFakturaId !== null) {
      fetchStavkeFaktureData(selectedFakturaId).then((data) => {
        setStavkeFaktureData(data);
        console.log(data);
      });
    }
  }, [selectedFakturaId]);

  const handleFakturaSelect = (fakturaId) => {
    setSelectedFakturaId(fakturaId);
    setShowStavkeFakture(true);
  };

  const handleHideStavkeFakture = () => {
    setShowStavkeFakture(false);
  };
   
  function deleteFaktura(id) {
    return fetch(`http://127.0.0.1:8000/api/faktura/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error deleting Faktura: ", error);
      });
  }

  const handleDelete = (fakturaId) => {
    const confirmed = window.confirm("Da li ste sigurni da zelite da obrisete fakturu i njene stavke?");
    if (confirmed) {
    deleteFaktura(fakturaId).then(() => {
      setFakturaData((prevData) => prevData.filter((faktura) => faktura.id !== fakturaId));
    });
  }
  };

//Generisanje PDF-a

function handleGeneratePDF(faktura, stavkeFaktureData) {
  console.log("Stavke Fakture Data:", stavkeFaktureData); 

  const doc = new jsPDF();

  const pdfIconData = "https://t3.ftcdn.net/jpg/05/60/17/66/360_F_560176615_cUua21qgzxDiLiiyiVGYjUnLSGnVLIi6.jpg";

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  doc.setTextColor(255, 0, 0);

  doc.setTextColor(255, 0, 0);
  doc.text(`Faktura ID: ${faktura.id}`, 15, 15);
  
  
  doc.setTextColor(0, 0, 0);
  doc.rect(0, 70, 300, 0);
  doc.text(`Datum: ${faktura.datum}`, 10, 25);
  doc.text(`Napomena: ${faktura.napomena}`, 10, 35);
  doc.text(`Total: ${faktura.total}`, 10, 45);
  doc.text(`Kupac: ${faktura.kupac?.ime} ${faktura.kupac?.prezime}`, 10, 55);
  doc.text(`Zaposleni: ${faktura.zaposleni?.ime} ${faktura.zaposleni?.prezime}`, 10, 65);

  let yPosition = 75;
  stavkeFaktureData.forEach((stavkeFaktureData) => {
    console.log(stavkeFaktureData); 
  
    doc.text(`Proizvod: ${stavkeFaktureData.proizvod.naziv_proizvoda}`, 10, yPosition);
    doc.text(`Kolicina: ${stavkeFaktureData.kolicina}`, 10, yPosition + 10);
    doc.text(`Iznos: ${stavkeFaktureData.iznos}`, 10, yPosition + 20);
    yPosition += 30;
  });

  doc.setTextColor(0, 0, 0); 

  const bottomYPosition = doc.internal.pageSize.height - 10;
  doc.setTextColor(0, 0, 0); 
  doc.text("Hvala na kupovini!", 15, bottomYPosition - 20);
  doc.addImage(pdfIconData, "PNG", 10, bottomYPosition - 15, 20, 20);

  doc.save(`faktura_${faktura.id}.pdf`);
}

  
  return (
    <div>
    <header className="header-container">
      <Link to="/" className="home-link">
        <img src="https://cdn-icons-png.flaticon.com/256/1139/1139991.png" alt="Home" className="home-icon" />
        
      </Link>
      <h1>Faktura Page</h1>
    </header>
       {/* <Link to="/faktura/add" className="button">
         Add Faktura
      </Link> */}

      <div  className="faktura-page-container">
        
        <div className="addFaktura">
        <h3>Podaci o fakturama</h3>
        
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Datum</th>
              <th>Napomena</th>
              <th>Total</th>
              <th>Kupac</th>
              <th>Zaposleni</th>
              <th>Actions</th>
              <th>Stavke Fakture</th>
              <th>Generisi PDF</th>
            </tr>
          </thead>
          <tbody>
            {fakturaData.map((faktura) => (
              <tr key={faktura.id}>
                <td>{faktura.id}</td>
                <td>{faktura.datum}</td>
                <td>{faktura.napomena}</td>
                <td>{faktura.total}</td>
                <td>
                  {faktura.kupac?.ime} {faktura.kupac?.prezime}
                </td>
                <td>
                  {faktura.zaposleni?.ime} {faktura.zaposleni?.prezime}
                </td>
                <td>
             <div className="action-icons-container">
          <Link to={`/faktura/edit/${faktura.id}`} className="edit-link">
            <img src="https://cdn-icons-png.flaticon.com/512/3597/3597075.png" alt="Edit" className="edit-icon" />
          </Link>
        <button onClick={() => handleDelete(faktura.id)} className="delete-link">
            <img src="https://png.pngtree.com/png-vector/20220926/ourmid/pngtree-delete-button-3d-icon-png-image_6217492.png" alt="Delete" className="delete-icon" />
           </button>
            </div>
                </td>
                <td>
                  <button onClick={() => handleFakturaSelect(faktura.id)}>
                    Stavke Fakture
                  </button>
                </td>
                 <td>
              <button onClick={() => handleGeneratePDF(faktura, stavkeFaktureData)}>
              <img src="https://png.pngtree.com/png-vector/20221207/ourmid/pngtree-pdf-download-vector-icon-png-image_6514761.png" alt="PDF" className="pdf-icon" />
              </button>
            </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="btnAddFaktura">
        <Link to="/faktura/add" className="buttonAdd">
            Dodaj fakturu
        </Link>
        </div>
      </div>
      {showStavkeFakture && (
  <div>
    <div className="naslovSF">
    <h3>Stavke Fakture</h3>
      </div>
    <table className="stavke-fakture-table">
      <thead>
        <tr>
          <th>Proizvod</th>
          <th>Kolicina</th>
          <th>Iznos</th>
        </tr>
      </thead>
      <tbody>
        {stavkeFaktureData.map((stavkeFaktura) => (
          <tr key={stavkeFaktura.stavkefaktureid}>
            <td>{stavkeFaktura.proizvod.naziv_proizvoda}</td>
            <td>{stavkeFaktura.kolicina}</td>
            <td>{stavkeFaktura.iznos}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <button className="hideSF" onClick={handleHideStavkeFakture} >Sakrij stavke fakture</button>
  </div>
)}
 
    </div>
    
  );
}

export default FakturaPage;
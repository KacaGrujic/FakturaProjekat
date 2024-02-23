import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./KupacPage.css";

function fetchZaposleniData() {
  return fetch("http://127.0.0.1:8000/api/zaposleni")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error: ", error);
      
    });
}

function deleteZaposleni(id) {
  return fetch(`http://127.0.0.1:8000/api/zaposleni/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json()
    )
    .catch((error) => {
      console.error("Error: ", error);
    });
}

function ZaposleniPage() {
  const [zaposleniData, setZaposleniData] = useState([]);
  const { id } = useParams(); 

  useEffect(() => {
    fetchZaposleniData().then((data) => {
      setZaposleniData(data);
    });
  }, []);

    const handleDelete = (zaposleniId) => {
    const confirmed = window.confirm("Da li ste sigurni da zelite da obrisete zaposlenog?");
    if (confirmed) {
    deleteZaposleni(zaposleniId).then(() => {
      setZaposleniData((prevData) => prevData.filter((zaposleni) => zaposleni.id !== zaposleniId));
      window.location.reload();
    });
  }

  };


  

  return (
    <div>
<header className="header-container">
  <Link to="/" className="home-link">
    <img src="https://cdn.iconscout.com/icon/free/png-256/free-house-home-building-infrastructure-real-estate-resident-emoj-symbol-1-30743.png" alt="Home" className="home-icon" />
    
  </Link>
  <h1>Zaposleni Page</h1>
</header>



<div className="kupac-data-container">
  <h3>Podaci o zaposlenima</h3>
  <table>
    <thead>
      <tr>
      <th>ID</th>
        <th>Ime</th>
        <th>Prezime</th>
        <th>Email</th>
        <th>Adresa</th>
        <th>Broj telefona</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {zaposleniData.map((zaposleni) => (
        <tr key={zaposleni.zaposleniid}>
          <td>{zaposleni.zaposleniid}</td>

          <td>{zaposleni.ime}</td>
          <td>{zaposleni.prezime}</td>
          <td>{zaposleni.email}</td>
          <td>{zaposleni.adresa}</td>
          <td>{zaposleni.brojtelefona}</td>
          <td>


            <Link to={`/zaposleni/edit/${zaposleni.zaposleniid}`} className="edit-link">
              
       <img src="https://cdn-icons-png.flaticon.com/512/3597/3597075.png" alt="Edit" className="edit-icon" />
              
              </Link> 

              <button onClick={() => handleDelete(zaposleni.zaposleniid)} className="delete-link">
                    <img src="https://cdn-icons-png.flaticon.com/512/1345/1345874.png" alt="Delete" className="delete-icon" />
                  </button>
         

          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


<div> 

</div>


<div className="add-kupac-link">

  <Link to="/zaposleni/add">
<img src="https://cdn.icon-icons.com/icons2/217/PNG/512/male-user-add_25347.png" alt="Add" className="add-icon" />
    
    Dodaj zaposlenog</Link>

</div>






    </div>
  );
}

export default ZaposleniPage;

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./KupacPage.css";

function fetchKupacData() {
  return fetch("http://127.0.0.1:8000/api/kupac")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching Kupac data: ", error);
      
    });
}

function deleteKupac(id) {
  return fetch(`http://127.0.0.1:8000/api/kupac/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json()
    )
    .catch((error) => {
      console.error("Error deleting Kupac: ", error);
    });
}

function KupacPage() {
  const [kupacData, setKupacData] = useState([]);
  const { id } = useParams(); 

  useEffect(() => {
    fetchKupacData().then((data) => {
      setKupacData(data);
    });
  }, []);

    const handleDelete = (kupacId) => {
    const confirmed = window.confirm("Da li ste sigurni da zelite da obrisete kupca?");
    if (confirmed) {
    deleteKupac(kupacId).then(() => {
      setKupacData((prevData) => prevData.filter((kupac) => kupac.id !== kupacId));
      window.location.reload();
    });
  }

  };


  

  return (
    <div>
<header className="header-container">
  <Link to="/" className="home-link">
    <img src="https://cdn-icons-png.flaticon.com/256/1139/1139991.png" alt="Home" className="home-icon" />
    
  </Link>
  <h1>Kupac Page</h1>
</header>



<div className="kupac-data-container">
  <h3>Podaci o kupcima</h3>
  <table>
    <thead>
      <tr>
      <th>ID</th>
        <th>Ime</th>
        <th>Prezime</th>
        <th>Adresa</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {kupacData.map((kupac) => (
        <tr key={kupac.kupacid}>
          <td>{kupac.kupacid}</td>

          <td>{kupac.ime}</td>
          <td>{kupac.prezime}</td>
          <td>{kupac.adresa}</td>
          <td>


            <Link to={`/kupac/edit/${kupac.kupacid}`} className="edit-link">
              
       <img src="https://cdn-icons-png.flaticon.com/512/3597/3597075.png" alt="Edit" className="edit-icon" />
              
              </Link> 

              <button onClick={() => handleDelete(kupac.kupacid)} className="delete-link">
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

  <Link to="/kupac/add">
<img src="https://cdn.icon-icons.com/icons2/217/PNG/512/male-user-add_25347.png" alt="Add" className="add-icon" />
    
    Dodaj kupca</Link>

</div>






    </div>
  );
}

export default KupacPage;

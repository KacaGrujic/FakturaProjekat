import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AddFaktura.css";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";

function AddFaktura() {
  const [formData, setFormData] = useState({
    datum: "",
    napomena: "",
    kupacid: "",
    zaposleniid: "",
  });

  const [stavkeFakture, setStavkeFakture] = useState([]);
  const [selectedProizvodId, setSelectedProizvodId] = useState("");
  const [kolicina, setKolicina] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFakturaForm, setShowFakturaForm] = useState(true);
  const [idStavke, setIdStavke] = useState(1); //poslednji ID stavke fakture iz baze


  useEffect(() => {
    fetchProizvodData().then((data) => {
      setProizvodOptions(data);
      console.log(data);
    });

    fetchLastUsedStavkeId().then((lastId) => {
      setIdStavke(lastId + 1);
    });
  }, []); //postavi odmah idStavke na poslednji iz baze + 1

  function fetchKupacData() {
    return fetch("http://127.0.0.1:8000/api/kupac")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error Kupac data: ", error);
      });
  }

  function fetchZaposleniData() {
    return fetch("http://127.0.0.1:8000/api/zaposleni")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error Zaposleni data: ", error);
      });
  }

  function fetchProizvodData() {
    return fetch("http://127.0.0.1:8000/api/proizvod")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error Proizvod data: ", error);
      });
  }


  
  async function fetchLastUsedStavkeId() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/stavkefakture/last-id");
      if (response.ok) {
        const data = await response.json();
        console.log("LAST : ", data.last_stavkefaktureid);
        if (data && data.last_stavkefaktureid !== undefined) {
        
          return data.last_stavkefaktureid;
          
        } else {
          console.error("Invalid response data:", data);
          return 0; 
        }
      } else {
        console.error("Error");
        return 0; 
      }
    } catch (error) {
      console.error("Error: ", error);
      return 0; 
    }
  }


  const handleProizvodSelect = (e) => {
    const selectedOption = e.target.value;
    console.log("Selected Proizvod ID:", selectedOption);
    setSelectedProizvodId(selectedOption);
  };

  
  const handleAddProizvodToStavke = () => {
    if (selectedProizvodId) {
      const selectedProizvod = proizvodOptions.find(
        (proizvod) => proizvod.proizvodid === parseInt(selectedProizvodId)
      );
      console.log("Selected Proizvod:", selectedProizvod);
      if (selectedProizvod) {
        fetchLastUsedStavkeId().then((lastId) => {
          const newStavkaId = lastId + 1; 
          setIdStavke(newStavkaId);
          console.log("ID stavke :  ", newStavkaId);
          const iznos = (parseFloat(selectedProizvod.cena) * kolicina).toFixed(2);
          const newStavka = {
            stavkefaktureid: idStavke,
            proizvodid: selectedProizvodId,
            naziv_proizvoda: selectedProizvod.naziv_proizvoda,
            kolicina,
            iznos,
          };
          setIdStavke(idStavke+1);
          setTotal((prevTotal) => prevTotal + parseFloat(iznos));
          setStavkeFakture((prevStavke) => [...prevStavke, newStavka]);
          setSelectedProizvodId("");
          setKolicina(1);
  
          console.log(newStavkaId);
          console.log(newStavka.proizvodid);
        });
      } else {
        console.log("not called");
      }
    }
  };
  

  const handleDeleteProizvod = (stavkaId, iznos) => {
    const updatedStavkeFakture = stavkeFakture.filter(
      (stavka) => stavka.stavkefaktureid !== stavkaId
    );
  
    setTotal((prevTotal) => prevTotal - parseFloat(iznos));
    setStavkeFakture(updatedStavkeFakture);
  };
  

  const handleKolicinaChange = (e) => {
    console.log("Kolicina changed:", e.target.value);
    const inputValue = parseInt(e.target.value);
    if (!isNaN(inputValue)) {
      setKolicina(inputValue);
    }
  };

  const [kupacOptions, setKupacOptions] = useState([]);
  const [zaposleniOptions, setZaposleniOptions] = useState([]);

  useEffect(() => {
    fetchKupacData().then((data) => {
      setKupacOptions(data);
    });

    fetchZaposleniData().then((data) => {
      setZaposleniOptions(data);
    });
  }, []);

  const [proizvodOptions, setProizvodOptions] = useState([]);
  useEffect(() => {
    fetchProizvodData().then((data) => {
      setProizvodOptions(data);
      console.log(data);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formatDatum = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.datum || !formData.kupacid || !formData.zaposleniid || stavkeFakture.length === 0) {
      alert("Faktura mora imati barem jedan proizvod. Molimo Vas dodajte.");
      console.error("Neuspela  validacija.");
      return;
    }
    const fakturaData = {
      datum: formatDatum(new Date(formData.datum)),
      napomena: formData.napomena,
      total: total,
      kupacid: formData.kupacid,
      zaposleniid: formData.zaposleniid,
      stavke: stavkeFakture,
    };

    fetch("http://127.0.0.1:8000/api/faktura", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fakturaData),
    })

      .then((response) => {
        if (response.status === 429) {
          throw new Error("Too Many Requests");
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Faktura sacuvana:", data.message);
        alert("Faktura je sacuvana");
        setFormData({
          datum: "",
          napomena: "",
          total: 0.00,
          kupacid: "",
          zaposleniid: "",
        });
        setStavkeFakture([]);
        setTotal(0); 
      })
      .catch((error) => {
        console.error("Greska prilikom cuvanja fakture:", error);
        console.log(formData.datum);
      });
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/faktura");
  };

  return (
    <div>

    <div className="topIcons">
      <h1>Dodaj fakturu</h1>
    </div>
    <div className="container">
    

      <form onSubmit={handleSubmit}>
        {showFakturaForm && (
          <>
            <div>
              <label htmlFor="datum">Datum:</label>
              <input
                type="date"
                id="datum"
                name="datum"
                value={formData.datum}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="napomena">Napomena:</label>
              <textarea
                id="napomena"
                name="napomena"
                value={formData.napomena}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="kupacid">Kupac:</label>
              <select
                id="kupacid"
                name="kupacid"
                value={formData.kupacid}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Kupac</option>
                {kupacOptions.map((kupac) => (
                  <option key={kupac.kupacid} value={kupac.kupacid}>
                    {kupac.ime} {kupac.prezime}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="zaposleniid">Zaposleni:</label>
              <select
                id="zaposleniid"
                name="zaposleniid"
                value={formData.zaposleniid}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Zaposleni</option>
                {zaposleniOptions.map((zaposleni) => (
                  <option key={zaposleni.zaposleniid} value={zaposleni.zaposleniid}>
                    {zaposleni.ime} {zaposleni.prezime}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label htmlFor="proizvod">Proizvod:</label>
          <select
            id="proizvod"
            name="proizvod"
            value={selectedProizvodId}
            onChange={handleProizvodSelect}
          >
            <option value="">Odaberite proizvod</option>
            {proizvodOptions.map((proizvod) => (
              <option key={proizvod.proizvodid} value={proizvod.proizvodid}>
                {proizvod.naziv_proizvoda}
              </option>
            ))}
          </select>
          <input
            type="number"
            id="kolicina"
            name="kolicina"
            value={kolicina}
            onChange={handleKolicinaChange}
          />
          <div className="total">
            <label>Total:</label>
            <span>{total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleAddProizvodToStavke}
            type="button"
            disabled={!selectedProizvodId}
          >
            Dodaj
          </button>

        </div>

        <div>
          <button type="submit">Dodaj fakturu</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>

      <div className="selected-proizvods-container">
        <h3>Proizvodi:</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Naziv Proizvoda</th>
              <th>Kolicina</th>
              <th>Iznos</th>
              <th>Obrisi</th>
            </tr>
          </thead>
          <tbody>
          {stavkeFakture.map((stavka, index) => (
  <tr key={index}>
    <td>{stavka.stavkefaktureid}</td>
    <td>{stavka.naziv_proizvoda}</td>
    <td>{stavka.kolicina}</td>
    <td>{stavka.iznos}</td>
    <td>
      <button
        onClick={() => handleDeleteProizvod(stavka.stavkefaktureid, stavka.iznos)}
        
      >
        Delete
      </button>
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default AddFaktura;

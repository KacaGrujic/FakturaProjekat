import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; 
import { add, format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import "./EditFaktura.css";

function EditFaktura() {
    const { fakturaId } = useParams();
    //console.log("fakturaId:", fakturaId);
    
    const [fakturaData, setFakturaData] = useState({
      datum: "",
      napomena: "",
      total:0.00,
      kupacid: "",
      zaposleniid: "",
      
    });


    const [deletedStavke, setDeletedStavke] = useState([]);

    const [napomena, setNapomena] = useState("");
    const [kupacid, setKupacid] = useState("");
    const [zaposleniid, setZaposleniid] = useState("");
    const [stavkeFakture, setStavkeFakture] = useState([]);
    const [total, setTotal] = useState(0);
    const [proizvodData, setProizvodData] = useState({});
    const [selectedProizvodId, setSelectedProizvodId] = useState("");
    const [proizvodOptions, setProizvodOptions] = useState([]);
    const [kolicina, setKolicina] = useState(1);
    const [idStavke, setIdStavke] = useState(1); 

    const [editingStavkaId, setEditingStavkaId] = useState(null);
    const [editedProizvodId, setEditedProizvodId] = useState("");
    const [editedKolicina, setEditedKolicina] = useState(1);
    const [fakturaCopy, setFakturaCopy] = useState(null);
    const [originalKolicina, setOriginalKolicina] = useState(1);

    const fakturaIdAsInt = parseInt(fakturaId);

    const [addedStavke, setAddedStavke] = useState([]);
    const [editedStavke, setEditedStavke] = useState([]);


    const [kupacOptions, setKupacOptions] = useState([]); 
    const [zaposleniOptions, setZaposleniOptions] = useState([]); 

  useEffect(() => {
    fetchFakturaForEditing();
    fetchKupacData();
    fetchZaposleniData();
    fetchStavkeFaktureData(); 
  }, [fakturaId]);
  

  async function fetchLastUsedStavkeId() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/stavkefakture/last-id");
      if (response.ok) {
        const data = await response.json();
        //je l sigurno poslednji
        console.log("LAST : ", data.last_stavkefaktureid);
        if (data && data.last_stavkefaktureid !== undefined) {
          return data.last_stavkefaktureid;
          
        } else {
          console.error("Nevalidan id stavke:", data);
          return 0;
        }
      } else {
        console.error("Nije moguce vratiti id stavke");
        return 0; 
      }
    } catch (error) {
      console.error("Error: ", error);
      return 0; 
    }
  }
  
  useEffect(() => {
 
    fetchLastUsedStavkeId().then((lastId) => {
    setIdStavke(lastId + 1); // Odmah inkrement
    });
  
  }, []);


  useEffect(() => {
    fetchProizvodData().then((data) => {
      setProizvodOptions(data);
      // console.log(">>>>>>>>>>",proizvodData);
    });
  }, []);

  
  const handleProizvodSelect = (e) => {
    const selectedOption = e.target.value;
    // console.log("Selected Proizvod ID:", selectedOption);
    setSelectedProizvodId(selectedOption);
  };


  const handleProizvodEditSelect = (e) => {
    const selectedOptionP = e.target.value;
    // console.log("Selected Proizvod ID:", selectedOptionP);
    setEditedProizvodId(selectedOptionP);
  };


  const handleAddProizvodToStavke = () => {
    if (selectedProizvodId) {
      const selectedProizvod = proizvodOptions.find(
        (proizvod) => proizvod.proizvodid === parseInt(selectedProizvodId)
      );
  
      if (selectedProizvod) {
        const iznos = parseFloat((parseFloat(selectedProizvod.cena) * kolicina).toFixed(2));
        const newStavka = {
          stavkefaktureid: idStavke,
          naziv_proizvoda: selectedProizvod.naziv_proizvoda,
          kolicina,
          iznos,
          proizvodid: parseInt(selectedProizvod.proizvodid),
          fakturaid: fakturaIdAsInt
        };
  
        const existingStavkaIndex = addedStavke.findIndex(
          (stavka) => stavka.stavkefaktureid === newStavka.stavkefaktureid
        );
  
        if (existingStavkaIndex !== -1) {
          setAddedStavke((prevAddedStavke) => [
            ...prevAddedStavke.slice(0, existingStavkaIndex),
            newStavka,
            ...prevAddedStavke.slice(existingStavkaIndex + 1),
          ]);
        } else {
          setAddedStavke((prevAddedStavke) => [
            ...prevAddedStavke,
            newStavka,
          ]);
        }
  
        setTotal((prevTotal) => parseFloat((prevTotal + iznos).toFixed(2)));
        setStavkeFakture((prevStavkeFakture) => [
          ...prevStavkeFakture,
          newStavka,
        ]);
  
        
        setAddedStavke((updatedAddedStavke) => {
          // console.log(updatedAddedStavke);
          return updatedAddedStavke;
        });
  
        setSelectedProizvodId("");
        setKolicina(1);
        setIdStavke(idStavke + 1);
      }
    }
  };
    
  


  const handleKolicinaChange = (e) => {
    // console.log("Kolicina changed:", e.target.value);
    const inputValue = parseInt(e.target.value);
    if (!isNaN(inputValue)) {
      setKolicina(inputValue);
    }
  };


  const handleEditKolicinaChange = (e) => {
    const newKolicina = parseInt(e.target.value);
    if (!isNaN(newKolicina)) {
      setEditedKolicina(newKolicina); // Odmah update kolicine
    }
  };

  function fetchAllProizvodData() {
    return fetch("http://127.0.0.1:8000/api/proizvod")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error: ", error);
      });
  }
  
  useEffect(() => {
    fetchAllProizvodData().then((data) => {
      setProizvodOptions(data);
      // console.log(data);
    });
  }, []);



  const fetchProizvodData = async (proizvodId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/proizvod/${proizvodId}`);
      if (response.ok) {
        const data = await response.json();
        setProizvodData(data);
        return data; // ceo objekat
      } else {
        console.error("Error Proizvod data");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  
  
  const fetchStavkeFaktureData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/faktura/${fakturaId}/stavkefakture`);
      if (response.ok) {
        const data = await response.json();
        // console.log("Stavke Fakture Data:", data);
        
        const stavkeWithProizvodData = await Promise.all(data.map(async (stavka) => {
          const proizvodData = await fetchProizvodData(stavka.proizvodid);
          // console.log(stavka.proizvodid);
          // console.log("Proizvod Data:", proizvodData);
          const nazivProizvoda = proizvodData.data.naziv_proizvoda; 
            return {
            ...stavka,
            naziv_proizvoda: nazivProizvoda,
            
          };
        }));
  
        setStavkeFakture(stavkeWithProizvodData);
      } else {
        console.error("Error stavke fakture data");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  

  const fetchFakturaForEditing = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/faktura/${fakturaId}`);
      if (response.ok) {
        const data = await response.json();
        // console.log("Total type:", typeof data.total); //string?
        const stringtot = data.total;
        const tot = parseFloat(stringtot);
  
        setFakturaData(data);
        setFakturaCopy(data);
        setNapomena(data.napomena);
        setKupacid(data.kupacid);
        setZaposleniid(data.zaposleniid);
        setTotal(tot);
        // console.log(tot);
      } else {
        console.error("Error faktura data");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

 const fetchKupacData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/kupac");
      if (response.ok) {
        const data = await response.json();
        setKupacOptions(data); 
      } else {
        console.error("Error Kupac data");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };


  const fetchZaposleniData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/zaposleni");
      if (response.ok) {
        const data = await response.json();
        setZaposleniOptions(data); 
      } else {
        console.error("Error Zaposleni data");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFakturaData({
      ...fakturaData,
      [name]: value,
    });
  };



  const handleDeleteStavka = (stavkaId, iznos) => {
    const updatedStavkeFakture = stavkeFakture.filter(
      (stavka) => stavka.stavkefaktureid !== stavkaId
    );
  
    //postavi obrisane stavke u state
    setDeletedStavke((prevDeletedStavke) => [
      ...prevDeletedStavke,
      { stavkefaktureid: stavkaId, iznos },
    ]);
  
    setTotal((prevTotal) => prevTotal - parseFloat(iznos));
    setStavkeFakture(updatedStavkeFakture);

  };


  //Incijalizacija da bi se vratio na pocetnu str
  let navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fakturaData.datum || !fakturaData.kupacid || !fakturaData.zaposleniid || stavkeFakture.length === 0) {
      alert("Faktura mora imati barem jedan proizvod. Molimo Vas dodajte.");
      console.error("Neuspela  validacija.");
      return;
    }

    const updatedFakturaData = {
      datum: fakturaData.datum,
      napomena: fakturaData.napomena,
      total: parseFloat(total),
      kupacid: fakturaData.kupacid,
      zaposleniid: fakturaData.zaposleniid,
      
    };
  
    // const updatedStavkeFaktureData = stavkeFakture.map((stavka) => ({
    //   stavkefaktureid: stavka.stavkefaktureid,
    //   proizvodid: stavka.proizvodid,
    //   kolicina: stavka.kolicina,
    //   iznos: calculateIznos(stavka.proizvodid, stavka.kolicina), // Calculate iznos
    //   // Add other fields for the StavkeFakture update
    // }));
  

    //Request body mora da ima sve podatke odvojene (Faktura zasebno (BEZ stavki))
    //posebno added, deleted i edited (u backendu if)

    const requestBody = {
      faktura: updatedFakturaData,
      addedFakture: addedStavke,
      deletedStavkeFakture: deletedStavke,
      editedStavkeFakture: editedStavke,
    };
    

    //provera stavki
    // console.log(updatedFakturaData);
    // console.log("added",addedStavke);
    // console.log("deleted",deletedStavke);
    // console.log("edited",editedStavke);
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/faktura/${fakturaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        
        console.log("success");
        navigate("/faktura");

      } else {
        console.error("Greska prilikom edita", response);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
    
  useEffect(() => {
    // console.log(originalKolicina); // pocetna kol
    // console.log(editedKolicina); // edit
  }, [originalKolicina, editedKolicina]);
  
  
  const [isEditing, setIsEditing] = useState(false);

  
  const handleCancelEdit = () => {
    setEditedProizvodId("");
  setOriginalKolicina(originalKolicina);
    // Reset state values
    setEditingStavkaId(null);
    setEditedKolicina(originalKolicina);
  
    setIsEditing(false);
  };
  
  const calculateIznos = (proizvodId, kolicina) => {
    const selectedProizvod = proizvodOptions.find(
      (proizvod) => proizvod.proizvodid === parseInt(proizvodId)
    );
  
    if (selectedProizvod) {
      const iznos = (parseFloat(selectedProizvod.cena) * kolicina).toFixed(2);
      return iznos;
    }
  
    return "0.00"; //Default ako nije odabrano
  };

  const handleSaveEdit = () => {
    const editedStavkaIndex = stavkeFakture.findIndex(
      (stavka) => stavka.stavkefaktureid === editingStavkaId
    );
  
    if (editedStavkaIndex !== -1) {
      const updatedStavka = {
        ...stavkeFakture[editedStavkaIndex],
        proizvodid: editedProizvodId,
        kolicina: parseFloat(editedKolicina),
        iznos: parseFloat(calculateIznos(editedProizvodId, editedKolicina)), // Recalculate iznos
      };
  
      
      fetchProizvodData(updatedStavka.proizvodid)
        .then((proizvodData) => {
          //proveri naziv jer je nested
          const nazivProizvoda = proizvodData.data.naziv_proizvoda; 
  
          updatedStavka.naziv_proizvoda = nazivProizvoda;
  
          const updatedStavkeFakture = [...stavkeFakture];
          updatedStavkeFakture[editedStavkaIndex] = updatedStavka;
          setStavkeFakture(updatedStavkeFakture);
  
          // Novi total recalculate
          const newTotal = updatedStavkeFakture.reduce(
            (accumulator, stavka) => accumulator + parseFloat(stavka.iznos),
            0
          );
          const editedStavka = {
            stavkefaktureid: editingStavkaId,
            proizvodid: editedProizvodId,
            kolicina: editedKolicina,
            iznos: parseFloat(calculateIznos(editedProizvodId, editedKolicina)),
            fakturaid: parseInt(fakturaId)
          };
          setEditedStavke((prevEditedStavke) => [...prevEditedStavke, editedStavka]);
          
          setTotal(newTotal);

          // console.log(editedStavka);
          // console.log(typeof(editedProizvodId));

          // Vrati na pocetni state
          setEditingStavkaId(null);
          setEditedProizvodId("");
          setEditedKolicina(1); 
          setIsEditing(false);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    }
  };
  
  
  const handleEditStavka = (stavka) => {
    setEditedProizvodId(stavka.proizvodid);
    setOriginalKolicina(stavka.kolicina);
    
    setEditingStavkaId(stavka.stavkefaktureid);
    setEditedKolicina(stavka.kolicina);
    //Da znamo da je edit state
    setIsEditing(true);
  };

  const handleCancel = () => {
    navigate("/faktura");
  };


  return (
    <div>


<div className="topIcons">
      <h1>Izmeni fakturu</h1>
    </div>

    <div className="container">
      

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="datum">Datum:</label>
          <input
            type="date"
            id="datum"
            name="datum"
            value={fakturaData.datum}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="napomena">Napomena:</label>
          <textarea
            id="napomena"
            name="napomena"
            value={fakturaData.napomena}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="kupacid">Kupac:</label>
          <select
            id="kupacid"
            name="kupacid"
            value={fakturaData.kupacid}
            onChange={handleInputChange}
            required
          >
            <option value="">Odaberite kupca</option>
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
            value={fakturaData.zaposleniid}
            onChange={handleInputChange}
            required
          >
            <option value="">Odaberite zaposlenog</option>
            {zaposleniOptions.map((zaposleni) => (
              <option key={zaposleni.zaposleniid} value={zaposleni.zaposleniid}>
                {zaposleni.ime} {zaposleni.prezime}
              </option>
            ))}
          </select>
        </div>
        <div>


        {proizvodOptions.length > 0 ? (
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
</div>
) : (
  //Ucitavanje
  <div>Ucitavanje proizvoda...</div>
)}


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

          <button type="submit" >Sacuvaj promene</button >
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>

      <div className="selected-proizvods-container">
  <h3>Stavke Fakture:</h3>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Naziv Proizvoda</th>
        <th>Kolicina</th>
        <th>Iznos</th>
        <th>Obrisi</th>
        <th>Izmeni</th>
      </tr>
    </thead>
    <tbody>
    {stavkeFakture.map((stavka, index) => (
  <tr key={index}>
    <td>{stavka.stavkefaktureid}</td>
    <td>{stavka.naziv_proizvoda}</td>
    <td>{stavka.kolicina}</td>
    <td>{parseFloat(stavka.iznos).toFixed(2)}</td>
    <td>
      <button
        onClick={() => handleDeleteStavka(stavka.stavkefaktureid, stavka.iznos)}
      >
        Delete
      </button>
    </td>
    <td>
      {editingStavkaId !== stavka.stavkefaktureid ? (
        <button
          onClick={() => handleEditStavka(stavka)}
        >
          Edit
        </button>
      ) : (
        <>
          <div>
            {proizvodOptions.length > 0 ? (
              <div>
                <label htmlFor="proizvod">Proizvod:</label>
                <select
                  id="proizvodedit"
                  name="proizvodedit"
                  value={editedProizvodId}
                  onChange={handleProizvodEditSelect}
                >
                  <option value="">Odaberite proizvod</option>
                  {proizvodOptions.map((proizvod) => (
                    <option key={proizvod.proizvodid} value={proizvod.proizvodid}>
                      {proizvod.naziv_proizvoda}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>Ucitavanje proizvoda...</div>
            )}

            <input
              type="number"
              id="kolicinaedit"
              name="kolicinaedit"
              value={editedKolicina}
              onChange={handleEditKolicinaChange}
            />

            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
            <button type="button" onClick={handleSaveEdit}>
              Sacuvaj
            </button>
          </div>
        </>
      )}
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

export default EditFaktura;

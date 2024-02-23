import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DeleteKupac() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    deleteKupac();
  }, []);

  const deleteKupac = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/kupac/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Kupac obrisan!");
        navigate("/kupac"); 
      } else {
        console.error("Greska prilikom brisanja.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Obrisi Kupca</h2>
      <p>Deleting Kupac with ID: {id}</p>
    </div>
  );
}

export default DeleteKupac;

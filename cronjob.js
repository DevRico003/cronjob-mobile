// Verwenden von ES6-Import anstelle von require
import fetch from 'node-fetch';

// Die URL, an die der GET-Request gesendet wird
const url = 'https://www.carcenter-erding.de/api/mobile';

// Die Funktion, die den GET-Request ausführt
const fetchData = async () => {
  try {
    // Senden des GET-Requests
    const response = await fetch(url);
    
    // Überprüfen, ob der Request erfolgreich war
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parsen der Antwort als JSON
    const data = await response.json();

    // Ausgeben der Daten
    console.log(data);
  } catch (error) {
    // Ausgeben eines Fehlers, falls einer auftritt
    console.error('Error fetching data:', error.message);
  }
};

// Aufrufen der Funktion
fetchData();

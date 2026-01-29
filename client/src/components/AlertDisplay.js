import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';


function AlertDisplay({isUpdating, showAlert}) {

  const [show, setShow] = useState(true);

  useEffect(() => {
    let timeout;
    if (showAlert) {
      timeout = setTimeout(() => {
        // Zavřít alert po uplynutí časovače
        setShow(false);
      }, 5000); // 5000 ms = 5 sekund
    }

    // Vrácení funkce pro zrušení časovače
    return () => clearTimeout(timeout);
  }, [showAlert]);

  // Pokud showAlert není true, nezobrazujeme nic
  if (!showAlert || !show) {
    return null;
  }

    return (
      <Alert variant="success" dismissible className="fixed-top">
        <p>
        Your itinerary has been {isUpdating ? 'updated' : 'created'} successfully.
        </p>
      </Alert>
    );
  }

export default AlertDisplay;